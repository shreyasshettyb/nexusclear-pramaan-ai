/**
 * NexusClear (Pramaan-AI) TypeScript Type Definitions
 * Cross-Border & Domestic Cyber Lien Resolution Platform
 */

export type Jurisdiction = 'india' | 'singapore' | 'crossBorder';

export interface JurisdictionConfig {
  id: Jurisdiction;
  name: string;
  flag: string;
  currency: string;
  currencySymbol: string;
  regulatoryBody: string;
  framework: string;
  slaCustomerDays: number;
  slaBankDays: number;
  icon: string;
}

export type TransactionStatus = 
  | 'frozen' 
  | 'under_review' 
  | 'cleared' 
  | 'escalated' 
  | 'permanently_frozen';

export type HopNodeType = 
  | 'victim' 
  | 'mule_l1' 
  | 'mule_l2' 
  | 'mule_l3' 
  | 'merchant';

export interface HopNode {
  id: string;
  label: string;
  type: HopNodeType;
  amount: number;
  timestamp: string;
  holdDuration: string;
  status: string;
  accountNumber?: string;
  routingDetails?: string;
}

export interface FrozenTransaction {
  id: string;
  amount: number;
  currency: string;
  timestamp: string;
  merchantName: string;
  merchantId: string;
  merchantCategory: string;
  merchantAddress: string;
  frozenReason: string;
  hopChain: HopNode[];
  jurisdiction: Jurisdiction;
  status: TransactionStatus;
  regulatoryReference: string;
  customerSLADeadline: string;
  bankSLADeadline: string;
  layerNumber: number;
}

export interface MerchantEvidence {
  voiceStatement: string;
  voiceAudioBlob?: Blob | string;
  receiptImage: string; // base64 string or data URL
  shopPhoto?: string;    // base64 string or data URL
  additionalNotes?: string;
  uploadedAt?: string;
}

export interface GeminiAuditResult {
  vernacular_translation: string;
  extracted_receipt_amount: number | null;
  extracted_receipt_time: string | null;
  amount_match_boolean: boolean;
  visual_authenticity_notes: string;
  ai_evidence_score: number; // 0-350
  discrepancy_flags: string[];
  regulatory_compliance_memo: string;
}

export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';
export type Recommendation = 'lift_hold' | 'escalate' | 'permanent_freeze';

export interface CLSDetails {
  fanInDiversity: number | string;
  dailyTicketConsistency: number | string;
  holdingDuration: string | number;
  inventoryConsistency: string | number;
  billSequenceIntegrity: string | number;
  disputeRate: string | number;
}

export interface CLSBreakdown {
  graphVelocityScore: number;     // 0-300: Graph topology & dwell-time velocity
  geminiMultimodalScore: number;  // 0-350: Gemini 2.0 Flash multimodal verification
  physicalLivelihoodScore: number;// 0-250: Micro-merchant physical livelihood metrics
  totalScore: number;             // 0-900: Composite Livelihood Score (CLS)
  riskLevel: RiskLevel;
  recommendation: Recommendation;
  details: CLSDetails;
}

export interface DemoScenario {
  id: string;
  name: string;
  description: string;
  jurisdiction: Jurisdiction;
  transaction: FrozenTransaction;
  evidence: MerchantEvidence;
  expectedCLS: CLSBreakdown;
  expectedGeminiResult: GeminiAuditResult;
}

export type ViewMode = 'split' | 'merchant' | 'bank';

export type MerchantLanguage = 'en' | 'kn' | 'hi';
export type AdjudicationStatus = 'pending' | 'approved' | 'rejected';

export interface AppState {
  currentJurisdiction: Jurisdiction;
  currentScenario: DemoScenario | null;
  isProcessing: boolean;
  geminiApiKey: string | null;
  isLiveGemini: boolean;
  clsResult: CLSBreakdown | null;
  geminiResult: GeminiAuditResult | null;
  currentView: ViewMode;
  showApiKeyModal: boolean;
  processingStage: string;
  evidenceSubmitted: boolean;
  merchantEvidence: MerchantEvidence | null;
  merchantLanguage: MerchantLanguage;
  adjudicationStatus: AdjudicationStatus;
  adjudicationNotes?: string;
  adjudicatedAt?: string;
}

export interface AuditorDecision {
  decision: 'approve_lift' | 'escalate_cyber_cell' | 'request_in_person_kyc' | 'permanent_freeze';
  officerNotes: string;
  timestamp: string;
  officerId: string;
  caseId: string;
}

export interface RegulatoryTimelineItem {
  id: string;
  label: string;
  timestamp: string;
  status: 'completed' | 'in_progress' | 'pending' | 'violated';
  description: string;
}
