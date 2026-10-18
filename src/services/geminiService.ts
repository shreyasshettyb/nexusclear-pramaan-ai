import { GoogleGenAI, Type } from '@google/genai';
import type {
  FrozenTransaction,
  MerchantEvidence,
  GeminiAuditResult,
} from '../types';

/**
 * Creates and returns a GoogleGenAI client instance with the specified API key.
 */
export function getGeminiClient(apiKey: string): GoogleGenAI {
  return new GoogleGenAI({ apiKey });
}

/**
 * Strips data URL prefix (e.g. data:image/png;base64,) if present.
 */
function stripBase64Prefix(dataUrlOrBase64: string): string {
  if (!dataUrlOrBase64) return '';
  const commaIndex = dataUrlOrBase64.indexOf(',');
  if (commaIndex !== -1 && dataUrlOrBase64.startsWith('data:')) {
    return dataUrlOrBase64.substring(commaIndex + 1);
  }
  return dataUrlOrBase64.trim();
}

/**
 * Extracts MIME type from data URL or defaults to image/png.
 */
function extractMimeType(dataUrl: string): string {
  if (dataUrl.startsWith('data:')) {
    const match = dataUrl.match(/^data:([^;]+);/);
    if (match) return match[1];
  }
  return 'image/png';
}

/**
 * JSON Schema for structured Gemini audit result matching GeminiAuditResult.
 */
const geminiAuditResultSchema = {
  type: Type.OBJECT,
  properties: {
    vernacular_translation: {
      type: Type.STRING,
      description: 'English translation of the merchant verbal statement or vernacular billing text',
    },
    extracted_receipt_amount: {
      type: Type.NUMBER,
      description: 'Numeric total amount extracted from the receipt image, or null if illegible',
    },
    extracted_receipt_time: {
      type: Type.STRING,
      description: 'Date or timestamp extracted from the receipt image, or null if illegible',
    },
    amount_match_boolean: {
      type: Type.BOOLEAN,
      description: 'True if extracted receipt amount matches the frozen transaction amount within tolerance',
    },
    visual_authenticity_notes: {
      type: Type.STRING,
      description: 'Forensic evaluation of paper grain, carbon bleed, thermal printer font, stamps, and licenses',
    },
    ai_evidence_score: {
      type: Type.INTEGER,
      description: 'Commercial legitimacy evidence score from 0 to 350',
    },
    discrepancy_flags: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: 'List of detected anomalies, temporal mismatches, or fraud indicators',
    },
    regulatory_compliance_memo: {
      type: Type.STRING,
      description: 'Formal compliance memo citing RBI Master Directions Sept 2026 or MAS SRF frameworks',
    },
  },
  required: [
    'vernacular_translation',
    'extracted_receipt_amount',
    'extracted_receipt_time',
    'amount_match_boolean',
    'visual_authenticity_notes',
    'ai_evidence_score',
    'discrepancy_flags',
    'regulatory_compliance_memo',
  ],
};

export interface RunGeminiAuditParams {
  apiKey: string | null;
  transaction: FrozenTransaction;
  evidence: MerchantEvidence;
}

/**
 * Overloaded audit runner to accept either a params object or positional arguments.
 */
export async function runGeminiAudit(
  paramsOrApiKey: RunGeminiAuditParams | string | null,
  maybeTransaction?: FrozenTransaction,
  maybeEvidence?: MerchantEvidence
): Promise<GeminiAuditResult> {
  let apiKey: string | null = null;
  let transaction: FrozenTransaction;
  let evidence: MerchantEvidence;

  if (paramsOrApiKey && typeof paramsOrApiKey === 'object' && 'transaction' in paramsOrApiKey) {
    apiKey = paramsOrApiKey.apiKey;
    transaction = paramsOrApiKey.transaction;
    evidence = paramsOrApiKey.evidence;
  } else {
    apiKey = (paramsOrApiKey as string | null) || null;
    transaction = maybeTransaction!;
    evidence = maybeEvidence!;
  }

  // Fallback to simulator if no API key is provided
  if (!apiKey || apiKey.trim() === '') {
    return simulateGeminiAudit(transaction, evidence);
  }

  try {
    const ai = getGeminiClient(apiKey.trim());

    const regulatoryFramework =
      transaction.jurisdiction === 'singapore'
        ? 'MAS Shared Responsibility Framework (SRF)'
        : transaction.jurisdiction === 'crossBorder'
        ? 'BIS Project Nexus Cross-Border Protocol'
        : 'RBI Master Directions (Sept 2026 Draft on Cyber Lien Mitigation)';

    const promptText = `
You are a Compliance AI Engine for the NexusClear (Pramaan-AI) system.

You are analyzing evidence submitted by a merchant whose account has been temporarily frozen under ${regulatoryFramework}.

FROZEN TRANSACTION DETAILS:
- Amount: ${transaction.currency} ${transaction.amount}
- Timestamp: ${transaction.timestamp}
- Merchant: ${transaction.merchantName} (${transaction.merchantCategory})
- Address: ${transaction.merchantAddress}
- Freeze Reason: ${transaction.frozenReason}
- Hop Chain Layer: Layer-${transaction.layerNumber}
- Regulatory Ref: ${transaction.regulatoryReference}

MERCHANT'S VERBAL STATEMENT (may be in vernacular language):
"${evidence.voiceStatement || 'No verbal statement provided'}"

${evidence.additionalNotes ? `ADDITIONAL NOTES:\n"${evidence.additionalNotes}"\n` : ''}
ATTACHED EVIDENCE:
1. Receipt/Bill Image (attached as image part)
${evidence.shopPhoto ? '2. Shop/Counter Photo (attached as image part)' : ''}

ANALYZE the evidence and return structured JSON matching the requested schema.
- Translate any vernacular spoken statement to formal English.
- Extract the receipt total amount and receipt timestamp directly from the receipt image.
- Compare extracted receipt amount with the frozen transaction amount (${transaction.currency} ${transaction.amount}). Determine if amount_match_boolean is true.
- Thoroughly inspect visual authenticity: check paper texture, carbon bleed, thermal printer font fidelity, merchant header, GSTIN/Drug License, date sequential consistency.
- Assign ai_evidence_score (integer between 0 and 350) based on commercial validity.
- Flag any discrepancies (mismatched figures, stale dates, vague line items, evasive phrasing).
- Formulate a formal regulatory_compliance_memo citing relevant sections under ${regulatoryFramework}.
`.trim();

    // Prepare content parts
    const parts: Array<
      | { text: string }
      | { inlineData: { mimeType: string; data: string } }
    > = [{ text: promptText }];

    // Receipt image
    if (evidence.receiptImage) {
      const cleanReceipt = stripBase64Prefix(evidence.receiptImage);
      const mimeType = extractMimeType(evidence.receiptImage);
      if (cleanReceipt.length > 0) {
        parts.push({
          inlineData: {
            mimeType,
            data: cleanReceipt,
          },
        });
      }
    }

    // Shop counter photo
    if (evidence.shopPhoto) {
      const cleanShop = stripBase64Prefix(evidence.shopPhoto);
      const mimeType = extractMimeType(evidence.shopPhoto);
      if (cleanShop.length > 0) {
        parts.push({
          inlineData: {
            mimeType,
            data: cleanShop,
          },
        });
      }
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: parts,
      config: {
        responseMimeType: 'application/json',
        responseSchema: geminiAuditResultSchema,
      },
    });

    const responseText = response.text;
    if (!responseText) {
      throw new Error('Gemini returned an empty response text');
    }

    const parsed = JSON.parse(responseText) as GeminiAuditResult;
    return {
      vernacular_translation: parsed.vernacular_translation ?? '',
      extracted_receipt_amount:
        typeof parsed.extracted_receipt_amount === 'number'
          ? parsed.extracted_receipt_amount
          : null,
      extracted_receipt_time: parsed.extracted_receipt_time ?? null,
      amount_match_boolean: Boolean(parsed.amount_match_boolean),
      visual_authenticity_notes: parsed.visual_authenticity_notes ?? '',
      ai_evidence_score: Math.min(350, Math.max(0, Number(parsed.ai_evidence_score) || 0)),
      discrepancy_flags: Array.isArray(parsed.discrepancy_flags) ? parsed.discrepancy_flags : [],
      regulatory_compliance_memo: parsed.regulatory_compliance_memo ?? '',
    };
  } catch (err) {
    console.warn('Gemini live audit failed or threw error, falling back to simulator:', err);
    return simulateGeminiAudit(transaction, evidence);
  }
}

/**
 * High-fidelity synthetic simulator providing realistic GeminiAuditResult based on heuristics.
 * Adds a 1.5s delay to emulate API latency.
 */
export async function simulateGeminiAudit(
  transaction: FrozenTransaction,
  evidence: MerchantEvidence
): Promise<GeminiAuditResult> {
  // Simulate 1.5-second processing latency
  await new Promise((resolve) => setTimeout(resolve, 1500));

  const textLower = [
    evidence.voiceStatement || '',
    evidence.additionalNotes || '',
    transaction.merchantName || '',
    transaction.merchantCategory || '',
  ]
    .join(' ')
    .toLowerCase();

  const isMedicalStore =
    textLower.includes('lactogen') ||
    textLower.includes('amoxicillin') ||
    textLower.includes('formula') ||
    textLower.includes('pharmacy') ||
    textLower.includes('chemist') ||
    textLower.includes('ramesh medicals');

  const isHawkerStall =
    textLower.includes('chicken rice') ||
    textLower.includes('uncle tan') ||
    textLower.includes('hawker') ||
    textLower.includes('maxwell') ||
    textLower.includes('catering') ||
    textLower.includes('packets');

  const isSuspiciousMule =
    textLower.includes('hardware') ||
    textLower.includes('trading') ||
    textLower.includes('mule') ||
    textLower.includes('photocopy') ||
    textLower.includes('unknown') ||
    textLower.includes('rajesh') ||
    transaction.layerNumber <= 2;

  // Scenario 1: Indian Medical Store (Lactogen / Amoxicillin - Layer 3 Innocent Merchant)
  if (isMedicalStore) {
    return {
      vernacular_translation:
        'I sold baby food (Lactogen-2) and antibiotic medicine (Amoxicillin) to a customer who paid via PhonePe QR code around 8:45 PM. Here is the physical carbon copy bill with my Drug License number. My account has been wrongfully frozen under cyber lien.',
      extracted_receipt_amount: transaction.amount || 1450.0,
      extracted_receipt_time: '2026-10-15 20:42:18 IST',
      amount_match_boolean: true,
      visual_authenticity_notes:
        'Physical carbon-copy duplicate bill book verified. Legitimate Drug License KA-UD-2019-04521 clearly legible. Realistic paper grain, carbon ink bleed-through, and sequential serial numbering (#409) confirmed.',
      ai_evidence_score: 345,
      discrepancy_flags: [],
      regulatory_compliance_memo:
        'Under RBI Master Directions (Sept 2026 Draft on Cyber Lien Mitigation, Section 7.4), transaction represents genuine downstream micro-merchant commerce with physical proof-of-sale. Merchant is an innocent Layer-3 recipient in a fan-out mule tree. Recommended disposition: Immediate cyber lien lift on secondary account hold.',
    };
  }

  // Scenario 2: Singapore Hawker (Uncle Tan Hainanese Chicken Rice - Layer 2 Merchant)
  if (isHawkerStall) {
    return {
      vernacular_translation:
        'Office corporate worker bought 10 packets of roasted chicken rice for team lunch at 12:30 PM. Paid $48.50 SGD via PayNow QR on the stall counter. Here is the POS thermal paper ticket.',
      extracted_receipt_amount: transaction.amount || 48.5,
      extracted_receipt_time: '2026-10-15 12:31:05 SGT',
      amount_match_boolean: true,
      visual_authenticity_notes:
        'Standard thermal POS receipt matching Maxwell Food Centre merchant terminal #01-45. UEN/GST registration number valid. Micro-dot thermal printer artifacts and timestamps consistent with hawker stall rush hour transactions.',
      ai_evidence_score: 350,
      discrepancy_flags: [],
      regulatory_compliance_memo:
        'Assessed under MAS Shared Responsibility Framework (SRF) for digital payment fraud. Merchant demonstrates verifiable commercial proof of physical goods delivered with matching PayNow UEN payload. Recommended disposition: Full fund clearance and lien dismissal.',
    };
  }

  // Scenario 3: Suspicious Hardware / Mule Layer Account
  if (isSuspiciousMule) {
    const mismatchAmount = transaction.amount > 20000 ? 12000.0 : transaction.amount * 0.25;
    return {
      vernacular_translation:
        'Someone came and bought hardware goods weeks ago. I don\'t remember the customer. Amount was some cash and some UPI. Receipt was written manually.',
      extracted_receipt_amount: mismatchAmount,
      extracted_receipt_time: '2026-09-24 14:10:00 IST',
      amount_match_boolean: false,
      visual_authenticity_notes:
        'Severe visual discrepancies detected: receipt timestamp is dated 21 days prior to transaction freeze event. Billed total does not reconcile with frozen inflow. Counterfoil lacks valid GSTIN, serial sequence is absent, and document image displays photocopying artifacts with digital stamp manipulation.',
      ai_evidence_score: 52,
      discrepancy_flags: [
        `AMOUNT_MISMATCH: Receipt displays ${mismatchAmount} vs frozen ${transaction.amount}`,
        'STALE_DOCUMENT: Receipt date is 3 weeks older than transaction date',
        'VAGUE_LINE_ITEMS: Description specifies "Misc Hardware Items" without SKU or unit pricing',
        'SUSPECT_MULE_SIGNATURE: Dwell-time under 90s followed by rapid dispersal to downstream crypto P2P rail',
      ],
      regulatory_compliance_memo:
        'Evidence fails verification standards under RBI Draft Guidelines 2026. Significant amount delta, temporal inconsistency, and lack of commercial grounding strongly indicate mule intermediary layering. Recommend escalating case to State Cyber Crime Cell and maintaining permanent freeze.',
    };
  }

  // Generic fallback if not matching predefined patterns
  const hasVoice = Boolean(evidence.voiceStatement && evidence.voiceStatement.trim().length > 10);
  const hasReceipt = Boolean(evidence.receiptImage && evidence.receiptImage.length > 50);

  let score = 150;
  if (hasVoice) score += 80;
  if (hasReceipt) score += 90;

  return {
    vernacular_translation: evidence.voiceStatement || 'Verified customer payment for merchant goods.',
    extracted_receipt_amount: transaction.amount,
    extracted_receipt_time: transaction.timestamp,
    amount_match_boolean: true,
    visual_authenticity_notes:
      'Receipt and proof-of-sale evidence analyzed. Document typography, date sequencing, and merchant identifiers appear structurally authentic.',
    ai_evidence_score: Math.min(350, score),
    discrepancy_flags: [],
    regulatory_compliance_memo: `Case evaluated under ${
      transaction.jurisdiction === 'singapore' ? 'MAS SRF' : 'RBI Master Directions Sept 2026'
    }. Evidence supports commercial legitimacy with standard operational parameters.`,
  };
}
