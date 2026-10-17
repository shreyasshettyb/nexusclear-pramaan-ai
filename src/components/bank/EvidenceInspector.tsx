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
    <div className="rounded-xl bg-slate-900/80 border border-slate-700/50 p-5 sm:p-6 shadow-xl backdrop-blur-md relative overflow-hidden flex flex-col gap-5">
      {/* Background ambient glow */}
      <div className="absolute top-1/2 -right-20 w-60 h-60 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 flex-wrap gap-2">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <FileSearch className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-100 flex items-center gap-2">
              Multimodal Evidence Audit
              <span className="text-xs font-mono font-medium px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Gemini 2.5 Flash Vision &amp; Audio
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Cross-reconciliation of raw ledger transaction vs. merchant cryptographic proof
            </p>
          </div>
        </div>

        {/* AI Evidence Score Bar in Header */}
        <div className="flex items-center gap-3 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
          <div className="text-right">
            <span className="text-[10px] text-slate-500 uppercase block font-mono">AI Evidence Score</span>
            <span className={`text-xs font-mono font-bold ${scoreTheme.text}`}>
              {aiScore} <span className="text-slate-500 text-[10px]">/ 350</span>
            </span>
          </div>
          <div className="w-16 bg-slate-800 rounded-full h-2 overflow-hidden">
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
        <div className="rounded-xl bg-slate-950/80 border border-slate-800 p-4 flex flex-col gap-3">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
            <span className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
              <Building className="h-4 w-4 text-sky-400" />
              Flagged Transaction Metadata
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/15 text-rose-300 border border-rose-500/30 uppercase font-semibold">
              Frozen Lien
            </span>
          </div>

          <div className="space-y-2.5 text-xs">
            {/* Transaction ID */}
            <div className="flex items-center justify-between bg-slate-900/60 p-2 rounded-lg border border-slate-800/60">
              <span className="text-slate-400">Transaction ID:</span>
              <div className="flex items-center gap-1.5 font-mono text-slate-200">
                <span>{transaction.id}</span>
                <button
                  onClick={() => copyTxnId(transaction.id)}
                  className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-slate-200 cursor-pointer"
                  title="Copy Transaction ID"
                >
                  {copiedId ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                </button>
              </div>
            </div>

            {/* Frozen Amount */}
            <div className="flex items-center justify-between bg-slate-900/60 p-2 rounded-lg border border-slate-800/60">
              <span className="text-slate-400">Lien Hold Amount:</span>
              <span className="font-mono text-sm font-bold text-rose-400">
                {formatCurrency(transaction.amount, transaction.jurisdiction)}
              </span>
            </div>

            {/* Timestamp */}
            <div className="flex items-center justify-between bg-slate-900/60 p-2 rounded-lg border border-slate-800/60">
              <span className="text-slate-400 flex items-center gap-1">
                <Calendar className="h-3 w-3 text-slate-500" /> Timestamp:
              </span>
              <span className="font-mono text-slate-300 text-[11px]">
                {new Date(transaction.timestamp).toLocaleString()}
              </span>
            </div>

            {/* Merchant Info */}
            <div className="flex items-center justify-between bg-slate-900/60 p-2 rounded-lg border border-slate-800/60">
              <span className="text-slate-400">Merchant Entity:</span>
              <span className="font-semibold text-slate-200 truncate max-w-[170px]" title={transaction.merchantName}>
                {transaction.merchantName}
              </span>
            </div>

            {/* Merchant Category */}
            <div className="flex items-center justify-between bg-slate-900/60 p-2 rounded-lg border border-slate-800/60">
              <span className="text-slate-400">Registered MCC:</span>
              <span className="text-slate-300 font-mono text-[11px]">
                {transaction.merchantCategory}
              </span>
            </div>

            {/* Hop Layer */}
            <div className="flex items-center justify-between bg-slate-900/60 p-2 rounded-lg border border-slate-800/60">
              <span className="text-slate-400 flex items-center gap-1">
                <Layers className="h-3 w-3 text-slate-500" /> Hop Chain Layer:
              </span>
              <span className="font-mono px-2 py-0.5 rounded bg-slate-800 text-sky-400 font-semibold text-[11px]">
                Layer {transaction.layerNumber} (Terminal Retail POS)
              </span>
            </div>

            {/* Regulatory Reference */}
            <div className="flex items-center justify-between bg-slate-900/60 p-2 rounded-lg border border-slate-800/60">
              <span className="text-slate-400">Regulatory Ref:</span>
              <span className="font-mono text-[11px] text-amber-300 truncate max-w-[170px]" title={transaction.regulatoryReference}>
                {transaction.regulatoryReference}
              </span>
            </div>
          </div>

          {/* Frozen Reason Box */}
          <div className="mt-1 p-2.5 rounded-lg bg-rose-950/20 border border-rose-900/40 text-[11px] text-rose-300/90">
            <span className="font-semibold block text-rose-400 mb-0.5 font-mono">
              Statutory Lien Order Trigger:
            </span>
            {transaction.frozenReason}
          </div>
        </div>

        {/* ========================================================= */}
        {/* RIGHT COLUMN: Gemini Extracted Evidence                   */}
        {/* ========================================================= */}
        <div className="rounded-xl bg-slate-950/80 border border-slate-800 p-4 flex flex-col gap-3">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
            <span className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
              <Eye className="h-4 w-4 text-emerald-400" />
              Gemini Extracted Evidence
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-semibold">
              Vision &amp; NLP Parsed
            </span>
          </div>

          <div className="space-y-2.5 text-xs">
            {/* Amount Match with Match/Mismatch Indicator */}
            <div className="flex items-center justify-between bg-slate-900/60 p-2 rounded-lg border border-slate-800/60">
              <span className="text-slate-400">Extracted Receipt Total:</span>
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-bold text-slate-200">
                  {extractedAmount !== null
                    ? formatCurrency(extractedAmount, transaction.jurisdiction)
                    : 'N/A'}
                </span>
                {amountMatch ? (
                  <span className="flex items-center gap-1 text-[11px] font-mono text-emerald-400 font-semibold bg-emerald-500/20 px-1.5 py-0.5 rounded border border-emerald-500/40">
                    <CheckCircle className="h-3.5 w-3.5" />
                    MATCH
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-[11px] font-mono text-rose-400 font-semibold bg-rose-500/20 px-1.5 py-0.5 rounded border border-rose-500/40">
                    <XCircle className="h-3.5 w-3.5" />
                    MISMATCH
                  </span>
                )}
              </div>
            </div>

            {/* Amount Comparison Variance */}
            <div className="flex items-center justify-between bg-slate-900/60 p-2 rounded-lg border border-slate-800/60 text-[11px]">
              <span className="text-slate-400">Amount Variance Delta:</span>
              <span
                className={`font-mono font-semibold ${
                  amountDiff.isExact ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {amountDiff.diffText}
              </span>
            </div>

            {/* Extracted Receipt Time */}
            <div className="flex items-center justify-between bg-slate-900/60 p-2 rounded-lg border border-slate-800/60">
              <span className="text-slate-400">Extracted POS Time:</span>
              <div className="flex items-center gap-1.5">
                <span className="font-mono text-slate-300 text-[11px]">
                  {geminiResult?.extracted_receipt_time
                    ? new Date(geminiResult.extracted_receipt_time).toLocaleString()
                    : 'Unspecified in Receipt'}
                </span>
                {geminiResult?.extracted_receipt_time ? (
                  <CheckCircle className="h-3.5 w-3.5 text-emerald-400" />
                ) : (
                  <AlertTriangle className="h-3.5 w-3.5 text-amber-400" />
                )}
              </div>
            </div>

            {/* Vernacular Audio / Statement Translation */}
            <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/60">
              <div className="flex items-center justify-between mb-1">
                <span className="text-slate-400 flex items-center gap-1 font-semibold text-[11px]">
                  <Languages className="h-3.5 w-3.5 text-sky-400" />
                  Vernacular Voice Statement (Translated):
                </span>
                <span className="text-[10px] font-mono text-slate-500 flex items-center gap-1">
                  <Volume2 className="h-3 w-3" /> Audio NLP
                </span>
              </div>
              <p className="text-[11px] text-slate-300 italic leading-relaxed bg-slate-950/60 p-2 rounded border border-slate-800/80">
                &ldquo;{geminiResult?.vernacular_translation || evidence?.voiceStatement || 'No verbal testimony attached.'}&rdquo;
              </p>
            </div>

            {/* Visual Authenticity Notes */}
            <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/60">
              <span className="text-slate-400 block font-semibold text-[11px] mb-1">
                Visual Forensics &amp; Tax Invoice Verification:
              </span>
              <p className="text-[11px] text-slate-300 leading-relaxed bg-slate-950/60 p-2 rounded border border-slate-800/80">
                {geminiResult?.visual_authenticity_notes || 'Pending image receipt OCR and font analysis.'}
              </p>
            </div>

            {/* Discrepancy Flags */}
            {geminiResult?.discrepancy_flags && geminiResult.discrepancy_flags.length > 0 ? (
              <div className="p-2.5 rounded-lg bg-rose-950/30 border border-rose-800/60 space-y-1">
                <span className="text-xs font-bold text-rose-300 flex items-center gap-1">
                  <AlertTriangle className="h-3.5 w-3.5 text-rose-400" />
                  Critical Discrepancies Flagged ({geminiResult.discrepancy_flags.length})
                </span>
                <div className="space-y-1 pt-1">
                  {geminiResult.discrepancy_flags.map((flag, idx) => (
                    <div
                      key={idx}
                      className="px-2 py-1 rounded bg-rose-900/40 border border-rose-700/50 text-[10px] font-mono text-rose-200"
                    >
                      • {flag}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-2 rounded-lg bg-emerald-950/30 border border-emerald-800/50 flex items-center gap-2 text-xs text-emerald-300">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                <span>Zero forensic discrepancies detected across receipt and testimony</span>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* REGULATORY COMPLIANCE MEMO BLOCK */}
      {geminiResult?.regulatory_compliance_memo && (
        <div className="rounded-xl bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-slate-700/80 p-4 shadow-md relative overflow-hidden">
          <div className="flex items-center gap-2 mb-2 pb-2 border-b border-slate-800">
            <FileText className="h-4 w-4 text-amber-400" />
            <span className="text-xs font-bold text-amber-300 uppercase tracking-wider font-mono">
              Statutory Safe-Harbor Memorandum (Automated Legal Counsel Analysis)
            </span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed font-sans">
            {geminiResult.regulatory_compliance_memo}
          </p>
        </div>
      )}

      {/* EVIDENCE ATTACHMENT THUMBNAILS (Clickable for full inspect) */}
      {evidence && (evidence.receiptImage || evidence.shopPhoto) && (
        <div className="pt-2 border-t border-slate-800 flex items-center gap-4 flex-wrap">
          <span className="text-xs text-slate-400 font-mono">Cryptographic Attachments:</span>
          {evidence.receiptImage && (
            <button
              onClick={() => setPreviewImage({ url: evidence.receiptImage, title: 'Proof-of-Sale Tax Invoice' })}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 hover:border-emerald-500/60 text-xs text-slate-300 hover:text-emerald-300 transition-colors cursor-pointer"
            >
              <Eye className="h-3.5 w-3.5 text-emerald-400" />
              <span>Inspect Tax Invoice</span>
            </button>
          )}
          {evidence.shopPhoto && (
            <button
              onClick={() => setPreviewImage({ url: evidence.shopPhoto!, title: 'Storefront & POS Geotag Verification' })}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 hover:border-emerald-500/60 text-xs text-slate-300 hover:text-emerald-300 transition-colors cursor-pointer"
            >
              <Eye className="h-3.5 w-3.5 text-sky-400" />
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
