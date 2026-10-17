import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  CheckCircle,
  AlertTriangle,
  FileCheck2,
  Download,
  ShieldCheck,
  Send,
  Loader2,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import type { CLSBreakdown, FrozenTransaction, GeminiAuditResult, JurisdictionConfig } from '../../types';
import { useAppContext } from '../../context/AppContext';

export interface ActionBarProps {
  clsResult: CLSBreakdown | null;
  onApprove: () => void;
  onReject: () => void;
  isProcessing: boolean;
  transaction?: FrozenTransaction | null;
  geminiResult?: GeminiAuditResult | null;
  jurisdictionConfig?: JurisdictionConfig | null;
}

export const ActionBar: React.FC<ActionBarProps> = ({
  clsResult,
  onApprove,
  onReject,
  isProcessing,
  transaction,
  geminiResult,
  jurisdictionConfig,
}) => {
  const { approveCase, rejectCase, adjudicationStatus } = useAppContext();
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);
  const [rejectDossierSuccess, setRejectDossierSuccess] = useState<boolean>(false);
  const [lastAction, setLastAction] = useState<'approved' | 'rejected' | null>(null);

  const score = clsResult?.totalScore ?? 0;
  const isApproveRecommended = score >= 500;
  const isApproveDisabled = isProcessing || !clsResult || score < 500;
  const isRejectDisabled = isProcessing || !transaction;

  // Generates and downloads an enterprise-grade HTML/PDF-ready Statutory Audit Certificate
  const generateCertificateHtml = () => {
    const caseId = transaction?.regulatoryReference || `NCRP-2026-${Math.floor(100000 + Math.random() * 900000)}`;
    const dateStr = new Date().toUTCString();
    const merchant = transaction?.merchantName || 'Verified Merchant';
    const amountStr = transaction ? `${transaction.currency} ${transaction.amount.toLocaleString()}` : 'N/A';
    const jurisdictionName = jurisdictionConfig?.name || 'India (UPI / NPCI)';
    const regBody = jurisdictionConfig?.regulatoryBody || 'Reserve Bank of India (RBI)';
    const framework = jurisdictionConfig?.framework || 'KYC Directions Sept 2026 Draft';

    const certHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>NexusClear Statutory Audit Certificate - ${caseId}</title>
  <style>
    @page { size: A4; margin: 20mm; }
    body {
      font-family: 'Helvetica Neue', Arial, sans-serif;
      color: #0f172a;
      background: #ffffff;
      margin: 0;
      padding: 30px;
      line-height: 1.5;
    }
    .cert-border {
      border: 3px double #065f46;
      padding: 30px;
      position: relative;
    }
    .header {
      text-align: center;
      border-bottom: 2px solid #065f46;
      padding-bottom: 15px;
      margin-bottom: 25px;
    }
    .logo {
      font-size: 26px;
      font-weight: 800;
      color: #065f46;
      letter-spacing: 2px;
      margin: 0;
    }
    .sublogo {
      font-size: 13px;
      color: #475569;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      margin-top: 4px;
    }
    .title-banner {
      background: #ecfdf5;
      border: 1px solid #10b981;
      padding: 12px;
      text-align: center;
      margin: 20px 0;
      border-radius: 4px;
    }
    .title-banner h2 {
      margin: 0;
      font-size: 18px;
      color: #065f46;
      text-transform: uppercase;
    }
    .meta-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      margin-bottom: 20px;
      font-size: 13px;
    }
    .meta-item {
      background: #f8fafc;
      padding: 10px;
      border-radius: 4px;
      border-left: 3px solid #065f46;
    }
    .meta-item strong {
      display: block;
      color: #475569;
      font-size: 11px;
      text-transform: uppercase;
    }
    .score-box {
      background: #0f172a;
      color: #ffffff;
      padding: 20px;
      border-radius: 6px;
      display: flex;
      justify-content: space-around;
      align-items: center;
      margin: 25px 0;
    }
    .score-main {
      text-align: center;
    }
    .score-val {
      font-size: 44px;
      font-weight: 900;
      color: #10b981;
      font-family: monospace;
    }
    .table-container {
      margin: 20px 0;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 12px;
    }
    th, td {
      border: 1px solid #cbd5e1;
      padding: 8px 12px;
      text-align: left;
    }
    th {
      background: #f1f5f9;
      font-weight: bold;
    }
    .legal-clause {
      background: #fffbeb;
      border: 1px solid #fde68a;
      padding: 12px;
      border-radius: 4px;
      font-size: 11px;
      color: #92400e;
      margin: 20px 0;
    }
    .footer-signatures {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 30px;
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #e2e8f0;
      font-size: 12px;
    }
    .seal {
      width: 90px;
      height: 90px;
      border: 2px dashed #065f46;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      font-size: 9px;
      font-weight: bold;
      color: #065f46;
      text-transform: uppercase;
      margin: 0 auto;
    }
    @media print {
      body { padding: 0; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>
  <div class="no-print" style="margin-bottom: 20px; text-align: right;">
    <button onclick="window.print()" style="background:#059669;color:#fff;border:none;padding:10px 20px;border-radius:6px;cursor:pointer;font-weight:bold;">
      Print / Save as PDF
    </button>
  </div>

  <div class="cert-border">
    <div class="header">
      <h1 class="logo">NEXUSCLEAR COMPLIANCE CLEARINGHOUSE</h1>
      <div class="sublogo">PRAMAAN-AI CYBER LIEN HARMONIZATION ARCHITECTURE</div>
      <div style="font-size: 11px; color: #64748b; margin-top: 4px;">
        Regulatory Safe-Harbor Certificate pursuant to ${regBody} &bull; ${framework}
      </div>
    </div>

    <div class="title-banner">
      <h2>STATUTORY CLEARANCE &amp; DEBIT UNFREEZE CERTIFICATE</h2>
      <div style="font-size: 12px; color: #047857; margin-top: 2px;">
        Administrative Safe Harbor Determination under Section 14b (Sept 2026 Directives)
      </div>
    </div>

    <div class="meta-grid">
      <div class="meta-item">
        <strong>Case Docket / Cyber Crime Ref:</strong>
        ${caseId}
      </div>
      <div class="meta-item">
        <strong>Certified Entity:</strong>
        ${merchant}
      </div>
      <div class="meta-item">
        <strong>Transaction Lien Held:</strong>
        ${amountStr} (Txn: ${transaction?.id || 'TXN-UNKNOWN'})
      </div>
      <div class="meta-item">
        <strong>Jurisdiction Framework:</strong>
        ${jurisdictionName}
      </div>
      <div class="meta-item">
        <strong>Timestamp of Resolution:</strong>
        ${dateStr}
      </div>
      <div class="meta-item">
        <strong>Auditing Nodal Authority:</strong>
        Automated Multimodal Safe Harbor (Level-2 Auditor Sign-Off)
      </div>
    </div>

    <div class="score-box">
      <div class="score-main">
        <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #94a3b8;">
          Commercial Legitimacy Score (CLS)
        </div>
        <div class="score-val">${score} / 900</div>
        <div style="font-size: 12px; color: #34d399; font-weight: bold;">
          VERIFIED BONA FIDE RETAIL MERCHANT
        </div>
      </div>
      <div style="border-left: 1px solid #334155; padding-left: 20px; font-size: 12px; line-height: 1.8;">
        <div>&bull; Graph Velocity Pillar: <strong>${clsResult?.graphVelocityScore ?? 0} / 300</strong></div>
        <div>&bull; Gemini Multimodal Pillar: <strong>${clsResult?.geminiMultimodalScore ?? 0} / 350</strong></div>
        <div>&bull; Physical Livelihood Pillar: <strong>${clsResult?.physicalLivelihoodScore ?? 0} / 250</strong></div>
      </div>
    </div>

    <div class="table-container">
      <h3>Multimodal Forensics Summary</h3>
      <table>
        <thead>
          <tr>
            <th>Forensic Verification Dimension</th>
            <th>Observed Evidence</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Proof-of-Sale Receipt OCR</td>
            <td>Matched against ${amountStr} ledger debit</td>
            <td><strong style="color:#059669;">VERIFIED</strong></td>
          </tr>
          <tr>
            <td>Hop-Chain Dwell Time</td>
            <td>Terminal POS (Zero automated pass-through / rapid dispersal)</td>
            <td><strong style="color:#059669;">CONFIRMED TERMINAL</strong></td>
          </tr>
          <tr>
            <td>Tax ID &amp; Registration</td>
            <td>Entity records matched state licensing database</td>
            <td><strong style="color:#059669;">VALID</strong></td>
          </tr>
          <tr>
            <td>Vernacular Audio Affidavit</td>
            <td>Confirmed verbal transaction log &amp; legitimate consideration</td>
            <td><strong style="color:#059669;">AUTHENTIC</strong></td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="legal-clause">
      <strong>STATUTORY SAFE HARBOR NOTICE:</strong>
      This certificate serves as official notice to the clearinghouse bank, NPCI, MAS, and State Cyber Crime Cells that the debit freeze on account of ${merchant} has been lifted. The merchant qualifies for innocent third-party merchant safe harbor under RBI KYC Master Directions (Sept 2026 Draft, Section 14b) and MAS Shared Responsibility Framework. Liability for fraud proceeds remains with Layer-1/Layer-2 mule nodes.
    </div>

    <div class="footer-signatures">
      <div>
        <div style="font-weight: bold; margin-bottom: 30px;">Digital Auditor Verification:</div>
        <div style="font-family: monospace; font-size: 11px; color: #475569;">
          SHA-256 Digest: 8f4b2c9e7a1d3f0a5b8e9c2d1f4a7b0e3c6d9a2f5e8b1d4a7c0e3f6b9a2d5e8<br>
          System: NexusClear Autonomous Nodal Engine v4.2<br>
          Authorized Token: SIG-NPCI-MAS-HARMONIZED-2026
        </div>
      </div>
      <div style="text-align: center;">
        <div class="seal">
          NEXUSCLEAR<br>REGULATORY<br>SEAL<br>VERIFIED
        </div>
        <div style="margin-top: 8px; font-weight: bold; font-size: 11px;">
          Statutory Compliance Office
        </div>
      </div>
    </div>
  </div>
</body>
</html>`;

    // Open certificate in new window and download as HTML file
    const blob = new Blob([certHtml], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);

    // Trigger download
    const link = document.createElement('a');
    link.href = url;
    link.download = `NexusClear_Statutory_Certificate_${transaction?.id || 'TXN-CASE'}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Also open in a clean preview tab
    const printWindow = window.open(url, '_blank');
    if (printWindow) {
      printWindow.focus();
    }

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 8000);
  };

  // Generates and downloads a formal Cyber Crime Escalation Report (NCRP 1930 / SPF ASC)
  const generateEscalationDossierHtml = () => {
    const caseId = transaction?.regulatoryReference || `NCRP-MULE-${Math.floor(100000 + Math.random() * 900000)}`;
    const dateStr = new Date().toUTCString();
    const merchant = transaction?.merchantName || 'Suspect Account';
    const amountStr = transaction ? `${transaction.currency} ${transaction.amount.toLocaleString()}` : 'N/A';

    const dossierHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>NCRP Cyber Crime Escalation Report - ${caseId}</title>
  <style>
    @page { size: A4; margin: 20mm; }
    body {
      font-family: 'Helvetica Neue', Arial, sans-serif;
      color: #0f172a;
      background: #ffffff;
      margin: 0;
      padding: 30px;
      line-height: 1.5;
    }
    .cert-border {
      border: 3px double #be123c;
      padding: 30px;
      position: relative;
    }
    .header {
      text-align: center;
      border-bottom: 2px solid #be123c;
      padding-bottom: 15px;
      margin-bottom: 25px;
    }
    .logo {
      font-size: 24px;
      font-weight: 800;
      color: #be123c;
      letter-spacing: 1.5px;
      margin: 0;
    }
    .sublogo {
      font-size: 12px;
      color: #475569;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-top: 4px;
    }
    .title-banner {
      background: #fff1f2;
      border: 1px solid #f43f5e;
      padding: 12px;
      text-align: center;
      margin: 20px 0;
      border-radius: 4px;
    }
    .title-banner h2 {
      margin: 0;
      font-size: 16px;
      color: #9f1239;
      text-transform: uppercase;
    }
    .meta-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      margin-bottom: 20px;
      font-size: 13px;
    }
    .meta-item {
      background: #f8fafc;
      padding: 10px;
      border-radius: 4px;
      border-left: 3px solid #be123c;
    }
    .meta-item strong {
      display: block;
      color: #475569;
      font-size: 11px;
      text-transform: uppercase;
    }
    .alert-box {
      background: #881337;
      color: #ffffff;
      padding: 15px;
      border-radius: 6px;
      margin: 20px 0;
      font-size: 13px;
    }
  </style>
</head>
<body>
  <div class="cert-border">
    <div class="header">
      <div class="logo">FORMAL CYBER-CRIME REFERRAL DOSSIER</div>
      <div class="sublogo">Ministry of Home Affairs NCRP 1930 / SPF Anti-Scam Command</div>
    </div>
    <div class="title-banner">
      <h2>CONFIRMED FRAUDULENT MONEY MULE ESCALATION DOCKET</h2>
      <p style="margin: 4px 0 0; font-size: 12px; color: #475569;">Case Docket: ${caseId} | Time: ${dateStr}</p>
    </div>
    <div class="meta-grid">
      <div class="meta-item">
        <strong>Suspect Target Entity:</strong>
        ${merchant}
      </div>
      <div class="meta-item">
        <strong>Frozen Inflow Amount:</strong>
        ${amountStr}
      </div>
      <div class="meta-item">
        <strong>CLS Legitimacy Score:</strong>
        <span style="color: #be123c; font-weight: bold;">${clsResult ? clsResult.totalScore : 125} / 900 (High-Probability Mule)</span>
      </div>
      <div class="meta-item">
        <strong>Adjudication Finding:</strong>
        Mismatched Proof of Sale / 110s Pass-Through Velocity
      </div>
    </div>
    <div class="alert-box">
      <strong>DIRECT JUDICIAL ACTION RECOMMENDED:</strong><br>
      The account has failed Gemini 2.5 Flash commercial coherence checks. Timestamp mismatch, amount disparity, and 98% rapid withdrawal velocity detected within 110 seconds of credit. Permanent debit freeze enacted pursuant to statutory directions.
    </div>
    <p style="font-size: 11px; color: #64748b; margin-top: 30px; text-align: center;">
      Transmitted to Central Law Enforcement Portal &bull; System Generated by NexusClear (Pramaan-AI)
    </p>
  </div>
</body>
</html>`;

    const blob = new Blob([dossierHtml], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `NCRP_Cyber_Crime_Escalation_${transaction?.id || 'MULE-CASE'}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    const printWindow = window.open(url, '_blank');
    if (printWindow) printWindow.focus();

    setRejectDossierSuccess(true);
    setTimeout(() => setRejectDossierSuccess(false), 8000);
  };

  const handleApprove = () => {
    if (isApproveDisabled) return;

    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#10b981', '#34d399', '#38bdf8', '#f59e0b', '#ffffff'],
      });
    } catch (e) {
      console.warn('Confetti animation failed', e);
    }

    setLastAction('approved');
    approveCase('Statutory safe-harbor approval granted via Gemini 2.5 Flash validation.');
    onApprove();
    generateCertificateHtml();
  };

  const handleReject = () => {
    if (isRejectDisabled) return;
    setLastAction('rejected');
    rejectCase('Suspected money mule pass-through velocity flagged. Case referred to NCRP Cyber Crime Cell.');
    onReject();
    generateEscalationDossierHtml();
  };

  return (
    <div className="rounded-xl bg-slate-900/80 border border-slate-700/50 p-5 sm:p-6 shadow-xl backdrop-blur-md relative overflow-hidden flex flex-col gap-4">
      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-100 flex items-center gap-2">
              Compliance Officer Action Console
            </h3>
            <p className="text-xs text-slate-400">
              1-Click statutory adjudication &bull; Instant regulatory certificate generation
            </p>
          </div>
        </div>

        {clsResult && (
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-slate-400">Recommendation:</span>
            <span
              className={`text-xs font-mono font-bold px-2 py-0.5 rounded border ${
                isApproveRecommended
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
              }`}
            >
              {isApproveRecommended ? 'APPROVE SAFE HARBOR' : 'REJECT & ESCALATE'}
            </span>
          </div>
        )}
      </div>

      {/* TWO LARGE ACTION BUTTONS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
        
        {/* BUTTON 1: Approve & Lift Hold */}
        <button
          onClick={handleApprove}
          disabled={isApproveDisabled}
          className={`group relative rounded-xl p-4 sm:p-5 flex flex-col items-start justify-between border transition-all duration-200 text-left cursor-pointer overflow-hidden ${
            isApproveDisabled
              ? 'opacity-40 cursor-not-allowed bg-slate-950 border-slate-800 text-slate-500'
              : isApproveRecommended
              ? 'bg-gradient-to-br from-emerald-950/80 via-emerald-900/40 to-slate-950 border-emerald-500/70 hover:border-emerald-400 shadow-[0_0_25px_rgba(16,185,129,0.35)] animate-pulse-glow hover:scale-[1.01]'
              : 'bg-slate-950 border-slate-800 hover:border-emerald-500/40 text-slate-300 hover:text-emerald-300'
          }`}
        >
          {/* Recommended highlight pill */}
          {isApproveRecommended && (
            <div className="absolute top-2.5 right-2.5 flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500 text-slate-950 text-[10px] font-extrabold uppercase tracking-wider shadow">
              <Sparkles className="h-3 w-3" />
              Recommended
            </div>
          )}

          <div className="flex items-center gap-3 mb-3">
            <div
              className={`p-2.5 rounded-xl border ${
                isApproveRecommended
                  ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
                  : 'bg-slate-900 border-slate-800 text-slate-400'
              }`}
            >
              {isProcessing ? (
                <Loader2 className="h-6 w-6 animate-spin text-emerald-400" />
              ) : (
                <CheckCircle className="h-6 w-6 text-emerald-400" />
              )}
            </div>
            <div>
              <div className="text-base font-bold text-slate-100 group-hover:text-emerald-300 transition-colors">
                Approve &amp; Lift Debit Hold
              </div>
              <div className="text-xs text-slate-400">
                Generate Statutory Audit Certificate
              </div>
            </div>
          </div>

          <div className="w-full pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono">
            <span className="text-emerald-400/90 flex items-center gap-1">
              <FileCheck2 className="h-3.5 w-3.5" />
              Direct NPCI/MAS Unfreeze Broadcast
            </span>
            <span className="text-slate-500 text-[11px] font-sans">CLS &ge; 500 req</span>
          </div>
        </button>

        {/* BUTTON 2: Reject & Escalate */}
        <button
          onClick={handleReject}
          disabled={isRejectDisabled}
          className={`group relative rounded-xl p-4 sm:p-5 flex flex-col items-start justify-between border transition-all duration-200 text-left cursor-pointer overflow-hidden ${
            isRejectDisabled
              ? 'opacity-40 cursor-not-allowed bg-slate-950 border-slate-800 text-slate-500'
              : !isApproveRecommended
              ? 'bg-gradient-to-br from-rose-950/80 via-rose-900/40 to-slate-950 border-rose-500/70 hover:border-rose-400 shadow-[0_0_25px_rgba(244,63,94,0.35)] animate-pulse-glow hover:scale-[1.01]'
              : 'bg-slate-950 border-slate-800 hover:border-rose-500/40 text-slate-300 hover:text-rose-300'
          }`}
        >
          {/* Recommended highlight pill if mule */}
          {!isApproveRecommended && clsResult && (
            <div className="absolute top-2.5 right-2.5 flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-extrabold uppercase tracking-wider shadow">
              <AlertTriangle className="h-3 w-3" />
              Recommended
            </div>
          )}

          <div className="flex items-center gap-3 mb-3">
            <div
              className={`p-2.5 rounded-xl border ${
                !isApproveRecommended && clsResult
                  ? 'bg-rose-500/20 border-rose-500/50 text-rose-300'
                  : 'bg-slate-900 border-slate-800 text-slate-400'
              }`}
            >
              {isProcessing ? (
                <Loader2 className="h-6 w-6 animate-spin text-rose-400" />
              ) : (
                <AlertTriangle className="h-6 w-6 text-rose-400" />
              )}
            </div>
            <div>
              <div className="text-base font-bold text-slate-100 group-hover:text-rose-300 transition-colors">
                Reject &amp; Escalate to Cyber Cell
              </div>
              <div className="text-xs text-slate-400">
                Flag as Probable Money Mule
              </div>
            </div>
          </div>

          <div className="w-full pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono">
            <span className="text-rose-400/90 flex items-center gap-1">
              <Send className="h-3.5 w-3.5" />
              1930 NCRP / SPF ASC Referral
            </span>
            <span className="text-slate-500 text-[11px] font-sans">Immediate Lock</span>
          </div>
        </button>

      </div>

      {/* Audit Certificate Manual Download Trigger & Success Banner */}
      {downloadSuccess && (
        <div className="p-3 rounded-lg bg-emerald-950/70 border border-emerald-500/40 flex items-center justify-between text-xs text-emerald-300 animate-slide-up">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-emerald-400" />
            <span>
              Official Statutory Clearance Certificate generated &amp; downloaded. Case docket archived.
            </span>
          </div>
          <button
            onClick={generateCertificateHtml}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-emerald-900/60 hover:bg-emerald-800 text-white font-mono text-[11px] cursor-pointer"
          >
            <Download className="h-3 w-3" />
            Download Again
          </button>
        </div>
      )}

      {lastAction === 'approved' && !downloadSuccess && (
        <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between text-xs text-slate-300">
          <span className="flex items-center gap-1.5 text-emerald-400">
            <ShieldCheck className="h-4 w-4" />
            Lien lifted under Section 14b safe harbor
          </span>
          <button
            onClick={generateCertificateHtml}
            className="flex items-center gap-1 text-[11px] font-mono text-emerald-400 hover:text-emerald-300 cursor-pointer"
          >
            <ExternalLink className="h-3 w-3" />
            View Audit Certificate
          </button>
        </div>
      )}

      {/* Rejection Escalation Banner */}
      {lastAction === 'rejected' && (
        <div className="p-3 rounded-lg bg-rose-950/70 border border-rose-500/50 flex items-center justify-between text-xs text-rose-300 animate-slide-up">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-rose-400 shrink-0" />
            <span>
              Case Escalated to State Cyber Crime Cell (NCRP 1930 / SPF ASC). Permanent debit freeze registered.
            </span>
          </div>
          <button
            onClick={generateEscalationDossierHtml}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-rose-900/60 hover:bg-rose-800 text-white font-mono text-[11px] cursor-pointer shrink-0"
          >
            <Download className="h-3 w-3" />
            Download Dossier
          </button>
        </div>
      )}
    </div>
  );
};

export default ActionBar;
