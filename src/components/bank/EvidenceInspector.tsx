import React, { useState } from 'react';
import {
  FileSearch,
  CheckCircle,
  XCircle,
  Eye,
  Languages,
  AlertTriangle,
  ShieldCheck,
  Copy,
  Check,
  Volume2,
  FileText,
  Building,
  Calendar,
  Layers,
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
  const [previewImage, setPreviewImage] = useState<{ url: string; title: string } | null>(null);

  const copyTxnId = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  // Compute amount difference and percentage
  const txnAmount = transaction.amount;
  const extractedAmount = geminiResult?.extracted_receipt_amount ?? null;
  const amountMatch = geminiResult?.amount_match_boolean ?? false;

  const getAmountDiffDetails = () => {
    if (extractedAmount === null) return { diffText: 'No receipt amount extracted', isExact: false };
    const diff = extractedAmount - txnAmount;
    if (Math.abs(diff) < 0.01) {
      return { diffText: '0.00% Variance (Exact Match)', isExact: true, isNegative: false };
    }
    const percentDiff = ((diff / txnAmount) * 100).toFixed(1);
    return {
      diffText: `${diff > 0 ? '+' : ''}${percentDiff}% Variance (${diff > 0 ? '+' : ''}${diff.toLocaleString()} ${transaction.currency})`,
      isExact: false,
      isNegative: diff < 0,
    };
  };

  const amountDiff = getAmountDiffDetails();

  // Score color theme (0-350)
  const aiScore = geminiResult?.ai_evidence_score ?? 0;
  const scorePct = Math.min(100, Math.max(0, (aiScore / 350) * 100));

  const getScoreColor = (score: number) => {
    if (score >= 300) return { bar: 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]', text: 'text-emerald-400' };
    if (score >= 180) return { bar: 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]', text: 'text-amber-400' };
    return { bar: 'bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]', text: 'text-rose-400' };
  };

  const scoreTheme = getScoreColor(aiScore);

  return (
    <div className="rounded-2xl bg-[#1d2024] border border-[#2d3036] p-5 sm:p-6 shadow-sm relative overflow-hidden flex flex-col gap-5">
      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-[#2d3036] pb-3 flex-wrap gap-2">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-[#131314] border border-[#2d3036] text-[#8ab4f8]">
            <FileSearch className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              Multimodal Evidence Audit
              <span className="text-xs font-mono font-medium px-2.5 py-0.5 rounded-full bg-[#131314] text-[#81c995] border border-[#81c995]/30">
                Gemini 2.5 Flash Vision &amp; Audio
              </span>
            </h3>
            <p className="text-xs text-[#8e918f]">
              Cross-reconciliation of raw ledger transaction vs. merchant cryptographic proof
            </p>
          </div>
        </div>

        {/* AI Evidence Score Bar in Header */}
        <div className="flex items-center gap-3 bg-[#131314] px-3 py-1.5 rounded-full border border-[#2d3036]">
          <div className="text-right">
            <span className="text-[10px] text-[#8e918f] uppercase block font-mono">AI Evidence Score</span>
            <span className={`text-xs font-mono font-bold ${scoreTheme.text}`}>
              {aiScore} <span className="text-[#8e918f] text-[10px]">/ 350</span>
            </span>
          </div>
          <div className="w-16 bg-[#2d3036] rounded-full h-1.5 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ${scoreTheme.bar}`}
              style={{ width: `${scorePct}%` }}
            />
          </div>
        </div>
      </div>

      {/* SIDE-BY-SIDE COMPARISON LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        
        {/* ========================================================= */}
        {/* LEFT COLUMN: Flagged Transaction Metadata                 */}
        {/* ========================================================= */}
        <div className="rounded-2xl bg-[#131314] border border-[#2d3036] p-4 flex flex-col gap-3">
          <div className="flex items-center justify-between border-b border-[#2d3036] pb-2">
            <span className="text-xs font-medium text-white uppercase tracking-wider flex items-center gap-1.5">
              <Building className="h-4 w-4 text-[#8ab4f8]" />
              Flagged Transaction Metadata
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#f28b82]/10 text-[#f28b82] border border-[#f28b82]/30 uppercase font-medium">
              Frozen Lien
            </span>
          </div>

          <div className="space-y-2.5 text-xs">
            {/* Transaction ID */}
            <div className="flex items-center justify-between bg-[#1d2024] p-2.5 rounded-xl border border-[#2d3036]">
              <span className="text-[#8e918f]">Transaction ID:</span>
              <div className="flex items-center gap-1.5 font-mono text-white">
                <span>{transaction.id}</span>
                <button
                  onClick={() => copyTxnId(transaction.id)}
                  className="p-1 hover:bg-[#2d3036] rounded-full text-[#8e918f] hover:text-white cursor-pointer transition-colors"
                  title="Copy Transaction ID"
                >
                  {copiedId ? <Check className="h-3 w-3 text-[#81c995]" /> : <Copy className="h-3 w-3" />}
                </button>
              </div>
            </div>

            {/* Frozen Amount */}
            <div className="flex items-center justify-between bg-[#1d2024] p-2.5 rounded-xl border border-[#2d3036]">
              <span className="text-[#8e918f]">Lien Hold Amount:</span>
              <span className="font-mono text-sm font-bold text-[#f28b82]">
                {formatCurrency(transaction.amount, transaction.jurisdiction)}
              </span>
            </div>

            {/* Timestamp */}
            <div className="flex items-center justify-between bg-[#1d2024] p-2.5 rounded-xl border border-[#2d3036]">
              <span className="text-[#8e918f] flex items-center gap-1">
                <Calendar className="h-3 w-3 text-[#8e918f]" /> Timestamp:
              </span>
              <span className="font-mono text-[#c4c7c5] text-[11px]">
                {new Date(transaction.timestamp).toLocaleString()}
              </span>
            </div>

            {/* Merchant Info */}
            <div className="flex items-center justify-between bg-[#1d2024] p-2.5 rounded-xl border border-[#2d3036]">
              <span className="text-[#8e918f]">Merchant Entity:</span>
              <span className="font-medium text-white truncate max-w-[170px]" title={transaction.merchantName}>
                {transaction.merchantName}
              </span>
            </div>

            {/* Merchant Category */}
            <div className="flex items-center justify-between bg-[#1d2024] p-2.5 rounded-xl border border-[#2d3036]">
              <span className="text-[#8e918f]">Registered MCC:</span>
              <span className="text-[#c4c7c5] font-mono text-[11px]">
                {transaction.merchantCategory}
              </span>
            </div>

            {/* Hop Layer */}
            <div className="flex items-center justify-between bg-[#1d2024] p-2.5 rounded-xl border border-[#2d3036]">
              <span className="text-[#8e918f] flex items-center gap-1">
                <Layers className="h-3 w-3 text-[#8e918f]" /> Hop Chain Layer:
              </span>
              <span className="font-mono px-2 py-0.5 rounded-full bg-[#131314] text-[#8ab4f8] font-medium text-[11px] border border-[#2d3036]">
                Layer {transaction.layerNumber} (Terminal Retail POS)
              </span>
            </div>

            {/* Regulatory Reference */}
            <div className="flex items-center justify-between bg-[#1d2024] p-2.5 rounded-xl border border-[#2d3036]">
              <span className="text-[#8e918f]">Regulatory Ref:</span>
              <span className="font-mono text-[11px] text-[#fdd663] truncate max-w-[170px]" title={transaction.regulatoryReference}>
                {transaction.regulatoryReference}
              </span>
            </div>
          </div>

          {/* Frozen Reason Box */}
          <div className="mt-1 p-3 rounded-xl bg-[#2d1b1b] border border-[#f28b82]/30 text-[11px] text-[#f28b82]">
            <span className="font-semibold block text-white mb-0.5 font-mono">
              Statutory Lien Order Trigger:
            </span>
            {transaction.frozenReason}
          </div>
        </div>

        {/* ========================================================= */}
        {/* RIGHT COLUMN: Gemini Extracted Evidence                   */}
        {/* ========================================================= */}
        <div className="rounded-2xl bg-[#131314] border border-[#2d3036] p-4 flex flex-col gap-3">
          <div className="flex items-center justify-between border-b border-[#2d3036] pb-2">
            <span className="text-xs font-medium text-white uppercase tracking-wider flex items-center gap-1.5">
              <Eye className="h-4 w-4 text-[#81c995]" />
              Gemini Extracted Evidence
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#81c995]/10 text-[#81c995] border border-[#81c995]/30 font-medium">
              Vision &amp; NLP Parsed
            </span>
          </div>

          <div className="space-y-2.5 text-xs">
            {/* Amount Match with Match/Mismatch Indicator */}
            <div className="flex items-center justify-between bg-[#1d2024] p-2.5 rounded-xl border border-[#2d3036]">
              <span className="text-[#8e918f]">Extracted Receipt Total:</span>
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-bold text-white">
                  {extractedAmount !== null
                    ? formatCurrency(extractedAmount, transaction.jurisdiction)
                    : 'N/A'}
                </span>
                {amountMatch ? (
                  <span className="flex items-center gap-1 text-[11px] font-mono text-[#81c995] font-medium bg-[#81c995]/10 px-2 py-0.5 rounded-full border border-[#81c995]/30">
                    <CheckCircle className="h-3.5 w-3.5" />
                    MATCH
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-[11px] font-mono text-[#f28b82] font-medium bg-[#f28b82]/10 px-2 py-0.5 rounded-full border border-[#f28b82]/30">
                    <XCircle className="h-3.5 w-3.5" />
                    MISMATCH
                  </span>
                )}
              </div>
            </div>

            {/* Amount Comparison Variance */}
            <div className="flex items-center justify-between bg-[#1d2024] p-2.5 rounded-xl border border-[#2d3036] text-[11px]">
              <span className="text-[#8e918f]">Amount Variance Delta:</span>
              <span
                className={`font-mono font-medium ${
                  amountDiff.isExact ? 'text-[#81c995]' : 'text-[#f28b82]'
                }`}
              >
                {amountDiff.diffText}
              </span>
            </div>

            {/* Extracted Receipt Time */}
            <div className="flex items-center justify-between bg-[#1d2024] p-2.5 rounded-xl border border-[#2d3036]">
              <span className="text-[#8e918f]">Extracted POS Time:</span>
              <div className="flex items-center gap-1.5">
                <span className="font-mono text-[#c4c7c5] text-[11px]">
                  {geminiResult?.extracted_receipt_time
                    ? new Date(geminiResult.extracted_receipt_time).toLocaleString()
                    : 'Unspecified in Receipt'}
                </span>
                {geminiResult?.extracted_receipt_time ? (
                  <CheckCircle className="h-3.5 w-3.5 text-[#81c995]" />
                ) : (
                  <AlertTriangle className="h-3.5 w-3.5 text-[#fdd663]" />
                )}
              </div>
            </div>

            {/* Vernacular Audio / Statement Translation */}
            <div className="bg-[#1d2024] p-3 rounded-xl border border-[#2d3036]">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[#8e918f] flex items-center gap-1 font-medium text-[11px]">
                  <Languages className="h-3.5 w-3.5 text-[#8ab4f8]" />
                  Vernacular Voice Statement (Translated):
                </span>
                <span className="text-[10px] font-mono text-[#8e918f] flex items-center gap-1">
                  <Volume2 className="h-3 w-3" /> Audio NLP
                </span>
              </div>
              <p className="text-[11px] text-[#c4c7c5] italic leading-relaxed bg-[#131314] p-2.5 rounded-lg border border-[#2d3036]">
                &ldquo;{geminiResult?.vernacular_translation || evidence?.voiceStatement || 'No verbal testimony attached.'}&rdquo;
              </p>
            </div>

            {/* Visual Authenticity Notes */}
            <div className="bg-[#1d2024] p-3 rounded-xl border border-[#2d3036]">
              <span className="text-[#8e918f] block font-medium text-[11px] mb-1">
                Visual Forensics &amp; Tax Invoice Verification:
              </span>
              <p className="text-[11px] text-[#c4c7c5] leading-relaxed bg-[#131314] p-2.5 rounded-lg border border-[#2d3036]">
                {geminiResult?.visual_authenticity_notes || 'Pending image receipt OCR and font analysis.'}
              </p>
            </div>

            {/* Discrepancy Flags */}
            {geminiResult?.discrepancy_flags && geminiResult.discrepancy_flags.length > 0 ? (
              <div className="p-3 rounded-xl bg-[#2d1b1b] border border-[#f28b82]/30 space-y-1.5">
                <span className="text-xs font-medium text-[#f28b82] flex items-center gap-1">
                  <AlertTriangle className="h-3.5 w-3.5 text-[#f28b82]" />
                  Critical Discrepancies Flagged ({geminiResult.discrepancy_flags.length})
                </span>
                <div className="space-y-1 pt-1">
                  {geminiResult.discrepancy_flags.map((flag, idx) => (
                    <div
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-[#3d2323] border border-[#f28b82]/30 text-[10px] font-mono text-[#f28b82]"
                    >
                      • {flag}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-2.5 rounded-xl bg-[#1d2024] border border-[#81c995]/30 flex items-center gap-2 text-xs text-[#81c995]">
                <ShieldCheck className="h-4 w-4 text-[#81c995]" />
                <span>Zero forensic discrepancies detected across receipt and testimony</span>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* REGULATORY COMPLIANCE MEMO BLOCK */}
      {geminiResult?.regulatory_compliance_memo && (
        <div className="rounded-2xl bg-[#131314] border border-[#2d3036] p-4 shadow-sm relative overflow-hidden">
          <div className="flex items-center gap-2 mb-2 pb-2 border-b border-[#2d3036]">
            <FileText className="h-4 w-4 text-[#fdd663]" />
            <span className="text-xs font-semibold text-white uppercase tracking-wider font-mono">
              Statutory Safe-Harbor Memorandum (Automated Legal Counsel Analysis)
            </span>
          </div>
          <p className="text-xs text-[#c4c7c5] leading-relaxed font-sans">
            {geminiResult.regulatory_compliance_memo}
          </p>
        </div>
      )}

      {/* EVIDENCE ATTACHMENT THUMBNAILS (Clickable for full inspect) */}
      {evidence && (evidence.receiptImage || evidence.shopPhoto) && (
        <div className="pt-2 border-t border-[#2d3036] flex items-center gap-3 flex-wrap">
          <span className="text-xs text-[#8e918f] font-mono">Cryptographic Attachments:</span>
          {evidence.receiptImage && (
            <button
              onClick={() => setPreviewImage({ url: evidence.receiptImage, title: 'Proof-of-Sale Tax Invoice' })}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#131314] border border-[#2d3036] hover:border-[#81c995]/60 text-xs text-[#c4c7c5] hover:text-[#81c995] transition-colors cursor-pointer"
            >
              <Eye className="h-3.5 w-3.5 text-[#81c995]" />
              <span>Inspect Tax Invoice</span>
            </button>
          )}
          {evidence.shopPhoto && (
            <button
              onClick={() => setPreviewImage({ url: evidence.shopPhoto!, title: 'Storefront & POS Geotag Verification' })}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#131314] border border-[#2d3036] hover:border-[#8ab4f8]/60 text-xs text-[#c4c7c5] hover:text-[#8ab4f8] transition-colors cursor-pointer"
            >
              <Eye className="h-3.5 w-3.5 text-[#8ab4f8]" />
              <span>Inspect Storefront &amp; POS</span>
            </button>
          )}
        </div>
      )}

      {/* Lightbox / Modal for Evidence Preview */}
      {previewImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in"
          onClick={() => setPreviewImage(null)}
        >
          <div
            className="rounded-2xl bg-slate-900 border border-slate-700 p-5 max-w-xl w-full shadow-2xl flex flex-col gap-3 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h4 className="text-sm font-bold text-slate-100">{previewImage.title}</h4>
              <button
                onClick={() => setPreviewImage(null)}
                className="text-xs text-slate-400 hover:text-slate-200 px-2.5 py-1 rounded bg-slate-800 cursor-pointer"
              >
                Close (ESC)
              </button>
            </div>
            <div className="max-h-[70vh] overflow-auto flex items-center justify-center p-2 bg-slate-950 rounded-xl border border-slate-800">
              <img
                src={previewImage.url}
                alt={previewImage.title}
                className="max-h-[60vh] object-contain rounded-lg"
              />
            </div>
            <p className="text-[11px] text-slate-400 text-center font-mono">
              Cryptographically verified payload signed with SHA-256 merchant key
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default EvidenceInspector;
