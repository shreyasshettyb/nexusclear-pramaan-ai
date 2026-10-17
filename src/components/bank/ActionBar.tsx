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
  UserCheck,
  X,
  FileText,
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
  
  // Override Modal state for human-driven force accept
  const [showOverrideModal, setShowOverrideModal] = useState<boolean>(false);
  const [overrideReason, setOverrideReason] = useState<string>(
    'In-person branch verification conducted and merchant physical affidavit on file.'
  );

  const score = clsResult?.totalScore ?? (transaction?.id === 'TXN-UPI-2026-MULE' ? 125 : 410);
  const isApproveRecommended = score >= 500;
  
  // Both actions are ALWAYS enabled for human-driven discretion when a case is loaded
  const isApproveDisabled = isProcessing || !transaction;
  const isRejectDisabled = isProcessing || !transaction;

  // Generates and downloads an enterprise-grade HTML/PDF-ready Statutory Audit Certificate
  const generateCertificateHtml = (customOverrideReason?: string) => {
    const caseId = transaction?.regulatoryReference || `NCRP-2026-${Math.floor(100000 + Math.random() * 900000)}`;
    const dateStr = new Date().toUTCString();
    const merchant = transaction?.merchantName || 'Verified Merchant';
    const amountStr = transaction ? `${transaction.currency} ${transaction.amount.toLocaleString()}` : 'N/A';
    const jurisdictionName = jurisdictionConfig?.name || 'India (UPI / NPCI)';
    const regBody = jurisdictionConfig?.regulatoryBody || 'Reserve Bank of India (RBI)';
    const framework = jurisdictionConfig?.framework || 'KYC Directions Sept 2026 Draft';
    const isOverride = Boolean(customOverrideReason) || score < 500;

    const certHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>NexusClear Statutory Audit Certificate - ${caseId}</title>
  <style>
    @page { size: A4; margin: 20mm; }
    body {
      font-family: 'Roboto', 'Helvetica Neue', Arial, sans-serif;
      color: #1f1f1f;
      background: #ffffff;
      margin: 0;
      padding: 30px;
      line-height: 1.5;
    }
    .cert-border {
      border: 2px solid ${isOverride ? '#b06000' : '#0d652d'};
      border-radius: 8px;
      padding: 30px;
      position: relative;
    }
    .header {
      text-align: center;
      border-bottom: 2px solid #e0e0e0;
      padding-bottom: 15px;
      margin-bottom: 20px;
    }
    .logo {
      font-size: 22px;
      font-weight: 700;
      color: ${isOverride ? '#b06000' : '#0d652d'};
      letter-spacing: 1px;
      margin: 0;
    }
    .title-banner {
      background: ${isOverride ? '#fef7e0' : '#e6f4ea'};
      border: 1px solid ${isOverride ? '#fdd663' : '#ceead6'};
      padding: 12px;
      text-align: center;
      margin: 15px 0;
      border-radius: 6px;
    }
    .meta-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      margin-bottom: 20px;
      font-size: 13px;
    }
    .meta-item {
      background: #f8f9fa;
      padding: 10px;
      border-radius: 4px;
      border-left: 3px solid ${isOverride ? '#f9ab00' : '#1e8e3e'};
    }
    .meta-item strong {
      display: block;
      color: #5f6368;
      font-size: 11px;
      text-transform: uppercase;
    }
    .override-box {
      background: #fef7e0;
      border: 1px solid #f9ab00;
      padding: 14px;
      border-radius: 6px;
      margin: 15px 0;
      font-size: 13px;
    }
  </style>
</head>
<body>
  <div class="cert-border">
    <div class="header">
      <div class="logo">STATUTORY COMPLIANCE CLEARANCE CERTIFICATE</div>
      <div style="font-size: 12px; color: #5f6368; margin-top: 4px;">
        ${regBody} &bull; ${framework}
      </div>
    </div>
    <div class="title-banner">
      <h2 style="margin: 0; font-size: 16px; color: ${isOverride ? '#944b00' : '#137333'};">
        ${isOverride ? 'HUMAN-IN-THE-LOOP DISCRETIONARY CLEARANCE (OFFICER OVERRIDE)' : 'STATUTORY SAFE-HARBOR DEBIT LIEN CLEARANCE'}
      </h2>
      <p style="margin: 4px 0 0; font-size: 12px; color: #5f6368;">Docket: ${caseId} &bull; Date: ${dateStr}</p>
    </div>

    ${
      isOverride
        ? `<div class="override-box">
             <strong>OFFICER DISCRETIONARY OVERRIDE RECORD:</strong><br>
             The AI system flagged potential anomalies (Score: ${score}/900). Under RBI September 2026 Directive &amp; Banker Discretionary Authority, the Compliance Nodal Officer has reviewed external physical facts and human evidence: <em>"${customOverrideReason || overrideReason}"</em>. Temporary hold unconditionally lifted.
           </div>`
        : ''
    }

    <div class="meta-grid">
      <div class="meta-item">
        <strong>Beneficiary Merchant:</strong>
        ${merchant}
      </div>
      <div class="meta-item">
        <strong>Unblocked Amount:</strong>
        ${amountStr}
      </div>
      <div class="meta-item">
        <strong>Jurisdiction / Clearing Rail:</strong>
        ${jurisdictionName}
      </div>
      <div class="meta-item">
        <strong>Commercial Legitimacy Score (CLS):</strong>
        <span style="font-weight: bold; color: ${isOverride ? '#b06000' : '#137333'};">${score} / 900</span>
      </div>
    </div>

    <div style="margin-top: 25px; padding-top: 15px; border-top: 1px solid #e0e0e0; font-size: 11px; color: #5f6368; text-align: center;">
      Authenticated by Nodal Compliance Officer (Officer ID: AUD-RBI-7729) &bull; Generated by NexusClear (Pramaan-AI)
    </div>
  </div>
</body>
</html>`;

    const blob = new Blob([certHtml], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `NexusClear_Clearance_Certificate_${transaction?.id || 'TXN-CASE'}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    const printWindow = window.open(url, '_blank');
    if (printWindow) printWindow.focus();

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 8000);
  };

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
    body { font-family: 'Roboto', Arial, sans-serif; color: #1f1f1f; margin: 30px; }
    .box { border: 2px solid #d93025; padding: 25px; border-radius: 8px; }
    .header { text-align: center; border-bottom: 2px solid #d93025; padding-bottom: 10px; }
    .alert { background: #fce8e6; border: 1px solid #fad2cf; padding: 12px; margin: 15px 0; border-radius: 6px; }
  </style>
</head>
<body>
  <div class="box">
    <div class="header">
      <h2 style="color: #c5221f; margin: 0;">FORMAL CYBER-CRIME SUSPICIOUS TRANSACTION REPORT (STR)</h2>
      <p style="color: #5f6368; margin: 4px 0;">National Cyber Crime Reporting Portal (NCRP 1930 / SPF ASC)</p>
    </div>
    <div class="alert">
      <strong>MULE ESCALATION CASE:</strong> ${caseId} &bull; Time: ${dateStr}<br>
      Suspect: ${merchant} &bull; Amount: ${amountStr} &bull; CLS Score: ${score}/900
    </div>
    <p>Finding: Rapid pass-through forwarding velocity detected. Transaction failed multimodal proof-of-sale coherence. Account referred for permanent freeze and asset forfeiture.</p>
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

  const handleApproveClick = () => {
    if (isApproveDisabled) return;

    // If score is low (< 500, like 48k mule), prompt the human officer for discretionary override rationale
    if (!isApproveRecommended) {
      setShowOverrideModal(true);
      return;
    }

    // High score normal safe-harbor approval
    executeApprove();
  };

  const executeApprove = (overrideNote?: string) => {
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#81c995', '#8ab4f8', '#fdd663'],
      });
    } catch (e) {
      // Confetti fallback
    }

    setLastAction('approved');
    approveCase(overrideNote || 'Statutory safe-harbor approval granted.');
    onApprove();
    generateCertificateHtml(overrideNote);
    setShowOverrideModal(false);
  };

  const handleReject = () => {
    if (isRejectDisabled) return;
    setLastAction('rejected');
    rejectCase('Suspected money mule pass-through velocity flagged. Case referred to NCRP Cyber Crime Cell.');
    onReject();
    generateEscalationDossierHtml();
  };

  return (
    <div className="rounded-2xl bg-[#1d2024] border border-[#2d3036] p-4 sm:p-5 flex flex-col gap-3.5">
      
      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-[#2d3036] pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-full bg-[#004a77] text-[#8ab4f8]">
            <UserCheck className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">
              Compliance Officer Adjudication Console
            </h3>
            <p className="text-[11px] text-[#9aa0a6]">
              Human-in-the-Loop decision engine &bull; Statutory officer discretion
            </p>
          </div>
        </div>

        {/* AI Recommendation Badge */}
        <div className="flex items-center gap-1.5">
          <span className="text-[10.5px] text-[#9aa0a6] hidden sm:inline">AI Advice:</span>
          <span
            className={`text-[11px] font-medium px-2.5 py-0.5 rounded-full border ${
              isApproveRecommended
                ? 'bg-[#00522b]/40 text-[#81c995] border-[#81c995]/40'
                : 'bg-[#8c1d18]/40 text-[#f28b82] border-[#f28b82]/40'
            }`}
          >
            {isApproveRecommended ? '● Recommend Approval' : '● Recommend Rejection'}
          </span>
        </div>
      </div>

      {/* Human In The Loop Notice */}
      <div className="text-[11px] text-[#9aa0a6] bg-[#191c20] p-2.5 rounded-xl border border-[#2d3036] flex items-center justify-between gap-2">
        <span>
          <strong>Human Governance:</strong> AI score ({score}/900) serves as evidentiary advisory. As Nodal Officer, you possess final discretionary authority to unfreeze or escalate.
        </span>
      </div>

      {/* TWO PRIMARY ACTION BUTTONS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-0.5">
        
        {/* BUTTON 1: Approve / Force Accept */}
        <button
          onClick={handleApproveClick}
          disabled={isApproveDisabled}
          className={`flex flex-col items-start justify-between p-3.5 rounded-2xl border transition-all text-left cursor-pointer ${
            isApproveRecommended
              ? 'bg-[#00522b] hover:bg-[#006032] border-[#81c995] text-white shadow-sm'
              : 'bg-[#272a2f] hover:bg-[#32353a] border-[#fdd663] text-[#e2e2e9]'
          }`}
        >
          <div className="flex items-center justify-between w-full mb-1">
            <span className="flex items-center gap-1.5 text-xs font-semibold">
              <CheckCircle className={`h-4 w-4 ${isApproveRecommended ? 'text-[#81c995]' : 'text-[#fdd663]'}`} />
              {isApproveRecommended ? 'Approve & Lift Hold' : 'Force Accept Proof (Override)'}
            </span>
            <span
              className={`text-[9.5px] px-2 py-0.5 rounded-full font-medium ${
                isApproveRecommended
                  ? 'bg-[#81c995] text-[#003919]'
                  : 'bg-[#fdd663] text-[#423100]'
              }`}
            >
              {isApproveRecommended ? 'Safe Harbor' : 'Officer Override'}
            </span>
          </div>
          <p className="text-[10.5px] text-[#c4c6d0]">
            {isApproveRecommended
              ? 'Meets commercial legitimacy threshold (CLS ≥ 500). Unblock funds.'
              : 'Exercise human discretion to accept merchant evidence despite AI anomaly.'}
          </p>
        </button>

        {/* BUTTON 2: Reject & Escalate */}
        <button
          onClick={handleReject}
          disabled={isRejectDisabled}
          className={`flex flex-col items-start justify-between p-3.5 rounded-2xl border transition-all text-left cursor-pointer ${
            !isApproveRecommended
              ? 'bg-[#8c1d18] hover:bg-[#a5241f] border-[#f28b82] text-white shadow-sm'
              : 'bg-[#272a2f] hover:bg-[#32353a] border-[#3c4048] text-[#c4c6d0]'
          }`}
        >
          <div className="flex items-center justify-between w-full mb-1">
            <span className="flex items-center gap-1.5 text-xs font-semibold text-white">
              <AlertTriangle className="h-4 w-4 text-[#f28b82]" />
              Reject &amp; Escalate to Cyber Cell
            </span>
            <span className="text-[9.5px] px-2 py-0.5 rounded-full font-medium bg-[#f28b82] text-[#601410]">
              NCRP 1930
            </span>
          </div>
          <p className="text-[10.5px] text-[#c4c6d0]">
            Flag suspect mule pass-through velocity. Freeze permanently pending judicial warrant.
          </p>
        </button>

      </div>

      {/* Action Confirmation Banners */}
      {lastAction === 'approved' && (
        <div className="p-3 rounded-xl bg-[#00522b]/30 border border-[#81c995] flex items-center justify-between text-xs text-[#c4eed0] animate-slide-up">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-[#81c995] shrink-0" />
            <span>Debit hold lifted. Compliance Certificate docket archived.</span>
          </div>
          <button
            onClick={() => generateCertificateHtml(overrideReason)}
            className="flex items-center gap-1 text-[11px] font-medium text-[#81c995] hover:underline cursor-pointer"
          >
            <Download className="h-3 w-3" />
            Download Certificate
          </button>
        </div>
      )}

      {lastAction === 'rejected' && (
        <div className="p-3 rounded-xl bg-[#8c1d18]/30 border border-[#f28b82] flex items-center justify-between text-xs text-[#fce8e6] animate-slide-up">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-[#f28b82] shrink-0" />
            <span>Case escalated to NCRP 1930 / SPF Cyber Command.</span>
          </div>
          <button
            onClick={generateEscalationDossierHtml}
            className="flex items-center gap-1 text-[11px] font-medium text-[#f28b82] hover:underline cursor-pointer"
          >
            <Download className="h-3 w-3" />
            Download Dossier
          </button>
        </div>
      )}

      {/* Material 3 Override Modal for Human-Driven Force Accept */}
      {showOverrideModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4">
          <div className="relative max-w-md w-full bg-[#1d2024] border border-[#3c4048] rounded-3xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#2d3036] pb-3">
              <div className="flex items-center gap-2 text-[#fdd663]">
                <UserCheck className="h-5 w-5" />
                <h3 className="text-sm font-semibold text-white">
                  Officer Discretionary Override
                </h3>
              </div>
              <button
                onClick={() => setShowOverrideModal(false)}
                className="p-1 rounded-full hover:bg-[#272a2f] text-[#9aa0a6] cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="text-xs text-[#c4c6d0] leading-relaxed">
              The Gemini AI score is <strong className="text-[#f28b82]">{score}/900</strong>. Under statutory banking directions, you have the final human authority to override AI risk flags and force-accept the merchant's commercial evidence.
            </p>

            <div className="space-y-1.5">
              <label className="text-[11px] font-medium text-[#9aa0a6]">
                Select Override Justification:
              </label>
              <div className="space-y-1.5">
                {[
                  'In-person branch verification conducted and merchant physical affidavit on file.',
                  'Direct physical wholesale invoice verified with counterparty supplier.',
                  'Judicial order / Police Cyber Cell clearance memorandum received.',
                  'One-time micro-merchant exception approved by Chief Compliance Officer.',
                ].map((reasonOption) => (
                  <button
                    key={reasonOption}
                    type="button"
                    onClick={() => setOverrideReason(reasonOption)}
                    className={`w-full text-left p-2 rounded-xl text-[11px] border transition-all cursor-pointer ${
                      overrideReason === reasonOption
                        ? 'bg-[#004a77] text-[#d1e4ff] border-[#8ab4f8]'
                        : 'bg-[#191c20] text-[#9aa0a6] border-[#2d3036] hover:bg-[#272a2f]'
                    }`}
                  >
                    {reasonOption}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-[#2d3036]">
              <button
                type="button"
                onClick={() => setShowOverrideModal(false)}
                className="px-3.5 py-1.5 rounded-full text-xs font-medium text-[#9aa0a6] hover:bg-[#272a2f] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => executeApprove(overrideReason)}
                className="px-4 py-1.5 rounded-full text-xs font-semibold bg-[#81c995] text-[#003919] hover:bg-[#a8dab5] cursor-pointer"
              >
                Confirm Force Unblock
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ActionBar;
