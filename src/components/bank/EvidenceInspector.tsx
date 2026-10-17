import React, { useState } from 'react';
import {
  FileSearch,
  CheckCircle2,
  XCircle,
  Copy,
  Check,
  Building,
  Volume2,
  FileText,
  AlertTriangle,
  ZoomIn,
  X,
} from 'lucide-react';
import type { FrozenTransaction, GeminiAuditResult, MerchantEvidence } from '../../types';
import { formatCurrency } from '../../data/jurisdictions';

export interface EvidenceInspectorProps {
  transaction: FrozenTransaction;
  geminiResult: GeminiAuditResult | null;
  evidence: MerchantEvidence | null;
}

export const EvidenceInspector: React.FC<EvidenceInspectorProps> = ({
  transaction,
  geminiResult,
  evidence,
}) => {
  const [copiedId, setCopiedId] = useState<boolean>(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const copyTxnId = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const amountMatch = geminiResult?.amount_match_boolean ?? false;
  const aiScore = geminiResult?.ai_evidence_score ?? 0;
  const hasDiscrepancies = (geminiResult?.discrepancy_flags?.length ?? 0) > 0;

  return (
    <div className="rounded-3xl bg-[#1e1f20] border border-[#333538] p-4 sm:p-6 shadow-sm flex flex-col gap-4 text-[#e3e3e3]">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#2d2f31] flex-wrap gap-2">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1b3a5b] text-[#8ab4f8]">
            <FileSearch className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">
              Multimodal Evidence Audit
            </h3>
            <p className="text-[11px] text-[#9aa0a6]">
              Gemini 2.5 Flash Vision &amp; Speech Forensics
            </p>
          </div>
        </div>

        {/* AI Score Chip */}
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#131314] border border-[#2d2f31]">
          <span className="text-[11px] text-[#9aa0a6]">AI Evidence Score:</span>
          <span className={`text-xs font-mono font-bold ${aiScore >= 200 ? 'text-[#81c995]' : 'text-[#f28b82]'}`}>
            {aiScore} <span className="text-[10px] text-[#5f6368]">/ 350</span>
          </span>
        </div>
      </div>

      {/* 2-Column Facts Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        
        {/* Left: Flagged Ledger Record */}
        <div className="rounded-2xl bg-[#131314] p-4 flex flex-col gap-2.5">
          <span className="text-xs font-semibold text-white flex items-center gap-1.5 pb-2 border-b border-[#28292a]">
            <Building className="h-3.5 w-3.5 text-[#8ab4f8]" />
            Flagged Ledger Record
          </span>

          <div className="space-y-1.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-[#9aa0a6]">Amount:</span>
              <span className="font-mono font-bold text-white">
                {formatCurrency(transaction.amount, transaction.jurisdiction)}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[#9aa0a6]">Merchant:</span>
              <span className="text-white truncate max-w-[150px]" title={transaction.merchantName}>
                {transaction.merchantName}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[#9aa0a6]">Category:</span>
              <span className="text-[#c4c6d0] text-[11px] truncate max-w-[150px]">
                {transaction.merchantCategory}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[#9aa0a6]">Txn ID:</span>
              <div className="flex items-center gap-1 font-mono text-[11px] text-[#9aa0a6]">
                <span className="truncate max-w-[120px]">{transaction.id}</span>
                <button
                  type="button"
                  onClick={() => copyTxnId(transaction.id)}
                  className="hover:text-white cursor-pointer"
                >
                  {copiedId ? <Check className="h-3 w-3 text-[#81c995]" /> : <Copy className="h-3 w-3" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Gemini AI Verification Facts */}
        <div className="rounded-2xl bg-[#131314] p-4 flex flex-col gap-2.5">
          <span className="text-xs font-semibold text-white flex items-center gap-1.5 pb-2 border-b border-[#28292a]">
            <FileText className="h-3.5 w-3.5 text-[#81c995]" />
            Gemini Extracted Facts
          </span>

          <div className="space-y-1.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-[#9aa0a6]">Receipt Amount:</span>
              <div className="flex items-center gap-1.5 font-mono">
                {geminiResult?.extracted_receipt_amount !== undefined ? (
                  <>
                    <span className="font-bold text-white">
                      {formatCurrency(geminiResult.extracted_receipt_amount, transaction.jurisdiction)}
                    </span>
                    {amountMatch ? (
                      <span title="Amount Matches"><CheckCircle2 className="h-3.5 w-3.5 text-[#81c995]" /></span>
                    ) : (
                      <span title="Amount Mismatch"><XCircle className="h-3.5 w-3.5 text-[#f28b82]" /></span>
                    )}
                  </>
                ) : (
                  <span className="text-[#5f6368]">Pending scan</span>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[#9aa0a6]">Receipt Time:</span>
              <span className="text-white text-[11px] font-mono">
                {geminiResult?.extracted_receipt_time || 'Pending scan'}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[#9aa0a6]">Visual Match:</span>
              <span className="text-white text-[11px]">
                {amountMatch ? '✓ Verified Commercial Slip' : '✗ Discrepancy Found'}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[#9aa0a6]">Coherence:</span>
              <span className={`text-[11px] font-medium ${amountMatch ? 'text-[#81c995]' : 'text-[#f28b82]'}`}>
                {amountMatch ? 'Legitimate POS Sale' : 'Suspicious / Mismatch'}
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* Vernacular Speech Interpretation */}
      <div className="rounded-2xl bg-[#131314] p-3.5 flex flex-col gap-1.5 text-xs">
        <div className="flex items-center justify-between text-[#9aa0a6]">
          <span className="flex items-center gap-1.5 font-medium text-white">
            <Volume2 className="h-3.5 w-3.5 text-[#8ab4f8]" />
            Merchant Verbal Statement (Translated by Gemini)
          </span>
          <span className="text-[10px] text-[#8ab4f8]">Audio NLP</span>
        </div>
        <p className="text-white text-xs leading-relaxed italic bg-[#1e1f20] p-2.5 rounded-xl border border-[#2d2f31]">
          "{geminiResult?.vernacular_translation || evidence?.voiceStatement || 'Statement awaiting submission.'}"
        </p>
      </div>

      {/* Discrepancies if any */}
      {hasDiscrepancies && (
        <div className="rounded-2xl bg-[#3c1618] p-3 border border-[#f28b82]/40 text-xs text-[#fce8e6] flex flex-col gap-1">
          <span className="font-semibold flex items-center gap-1.5 text-[#f28b82]">
            <AlertTriangle className="h-3.5 w-3.5" />
            AI Evidentiary Flags
          </span>
          <ul className="list-disc list-inside space-y-0.5 text-[11px] text-[#fce8e6]">
            {geminiResult?.discrepancy_flags?.map((flag, idx) => (
              <li key={idx}>{flag}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Photo Previews */}
      <div className="flex items-center gap-3 pt-1">
        <span className="text-xs text-[#9aa0a6]">Submitted Proof:</span>
        <div className="flex items-center gap-2">
          {evidence?.receiptImage && (
            <button
              type="button"
              onClick={() => setPreviewImage(evidence.receiptImage)}
              className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#131314] border border-[#2d2f31] text-[11px] text-white hover:border-[#8ab4f8] cursor-pointer"
            >
              <FileText className="h-3 w-3 text-[#8ab4f8]" />
              <span>View Bill</span>
            </button>
          )}
          {evidence?.shopPhoto && (
            <button
              type="button"
              onClick={() => setPreviewImage(evidence.shopPhoto)}
              className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#131314] border border-[#2d2f31] text-[11px] text-white hover:border-[#8ab4f8] cursor-pointer"
            >
              <Building className="h-3 w-3 text-[#8ab4f8]" />
              <span>View Shop</span>
            </button>
          )}
        </div>
      </div>

      {/* Image Modal */}
      {previewImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="relative max-w-md w-full bg-[#1e1f20] border border-[#333538] rounded-3xl p-4 shadow-2xl flex flex-col items-center">
            <button
              type="button"
              onClick={() => setPreviewImage(null)}
              className="absolute top-3 right-3 p-1 rounded-full bg-[#28292a] text-[#9aa0a6] hover:text-white cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
            <img
              src={previewImage}
              alt="Evidence document"
              className="max-h-[75vh] w-auto object-contain rounded-2xl bg-white mt-4"
            />
          </div>
        </div>
      )}

    </div>
  );
};

export default EvidenceInspector;
