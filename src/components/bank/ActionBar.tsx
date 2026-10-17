import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  AlertTriangle,
  Download,
  UserCheck,
  RefreshCw,
  FileCheck2,
  FileWarning,
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
  const { approveCase, rejectCase, adjudicationStatus, resetResults } = useAppContext();

  const score = clsResult?.totalScore ?? (transaction?.id === 'TXN-UPI-2026-MULE' ? 125 : 410);
  const isApproveRecommended = score >= 500;
  const isLowScoreMule = score < 500;

  // Generates and downloads an official Statutory Audit Certificate
  const downloadCertificate = () => {
    const caseId = transaction?.regulatoryReference || `NCRP-2026-${Math.floor(100000 + Math.random() * 900000)}`;
    const dateStr = new Date().toUTCString();
    const merchant = transaction?.merchantName || 'Verified Merchant';
    const amountStr = transaction ? `${transaction.currency} ${transaction.amount.toLocaleString()}` : 'N/A';
    const jurisdictionName = jurisdictionConfig?.name || 'India (UPI / NPCI)';
    const regBody = jurisdictionConfig?.regulatoryBody || 'Reserve Bank of India (RBI)';
    const framework = jurisdictionConfig?.framework || 'KYC Directions Sept 2026 Draft';
    const isOverride = isLowScoreMule;

    const certHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>NexusClear Statutory Clearance Certificate - ${caseId}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1f1f1f; background: #ffffff; margin: 0; padding: 40px; }
    .cert-box { border: 2px solid ${isOverride ? '#b06000' : '#1e8e3e'}; border-radius: 12px; padding: 35px; }
    .header { text-align: center; border-bottom: 2px solid #e0e0e0; padding-bottom: 20px; margin-bottom: 25px; }
    .logo { font-size: 24px; font-weight: 700; color: ${isOverride ? '#b06000' : '#1e8e3e'}; margin: 0; }
    .banner { background: ${isOverride ? '#fef7e0' : '#e6f4ea'}; border: 1px solid ${isOverride ? '#fdd663' : '#ceead6'}; padding: 15px; text-align: center; margin: 20px 0; border-radius: 8px; }
    .meta-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 25px 0; font-size: 14px; }
    .meta-card { background: #f8f9fa; padding: 12px; border-radius: 6px; border-left: 4px solid ${isOverride ? '#f9ab00' : '#1e8e3e'}; }
    .meta-card strong { display: block; color: #5f6368; font-size: 11px; text-transform: uppercase; margin-bottom: 4px; }
    .override-box { background: #fef7e0; border: 1px solid #f9ab00; padding: 15px; border-radius: 8px; margin: 20px 0; font-size: 13px; line-height: 1.6; }
  </style>
</head>
<body>
  <div class="cert-box">
    <div class="header">
      <div class="logo">STATUTORY COMPLIANCE CLEARANCE CERTIFICATE</div>
      <div style="font-size: 13px; color: #5f6368; margin-top: 5px;">${regBody} &bull; ${framework}</div>
    </div>
    <div class="banner">
      <h2 style="margin: 0; font-size: 17px; color: ${isOverride ? '#944b00' : '#137333'};">
        ${isOverride ? 'HUMAN DISCRETIONARY CLEARANCE (OFFICER OVERRIDE)' : 'STATUTORY SAFE-HARBOR DEBIT LIEN CLEARANCE'}
      </h2>
      <p style="margin: 5px 0 0; font-size: 13px; color: #5f6368;">Docket: ${caseId} &bull; Timestamp: ${dateStr}</p>
    </div>

    ${
      isOverride
        ? `<div class="override-box">
             <strong>OFFICER OVERRIDE MEMORANDUM:</strong><br>
             The AI score was ${score}/900 with potential anomalies. The Compliance Officer exercised statutory discretion under RBI September 2026 Mandate to unblock merchant funds based on direct verification.
           </div>`
        : ''
    }

    <div class="meta-grid">
      <div class="meta-card">
        <strong>Beneficiary Merchant</strong>
        ${merchant}
      </div>
      <div class="meta-card">
        <strong>Unblocked Amount</strong>
        ${amountStr}
      </div>
      <div class="meta-card">
        <strong>Clearing Rail</strong>
        ${jurisdictionName}
      </div>
      <div class="meta-card">
        <strong>Commercial Legitimacy Score</strong>
        <span style="font-weight: bold; color: ${isOverride ? '#b06000' : '#137333'};">${score} / 900</span>
      </div>
    </div>

    <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; font-size: 12px; color: #5f6368; text-align: center;">
      NexusClear (Pramaan-AI) &bull; Authenticated by Compliance Nodal Officer
    </div>
  </div>
</body>
</html>`;

    const blob = new Blob([certHtml], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Clearance_Certificate_${transaction?.id || 'CASE'}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadEscalationDossier = () => {
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
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #1f1f1f; margin: 40px; }
    .box { border: 2px solid #d93025; padding: 30px; border-radius: 10px; }
    .header { text-align: center; border-bottom: 2px solid #d93025; padding-bottom: 15px; }
    .alert { background: #fce8e6; border: 1px solid #fad2cf; padding: 15px; margin: 20px 0; border-radius: 6px; }
  </style>
</head>
<body>
  <div class="box">
    <div class="header">
      <h2 style="color: #c5221f; margin: 0;">FORMAL CYBER-CRIME SUSPICIOUS TRANSACTION REPORT (STR)</h2>
      <p style="color: #5f6368; margin: 5px 0;">National Cyber Crime Reporting Portal (NCRP 1930 / SPF ASC)</p>
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
  };

  const handleApprove = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#81c995', '#8ab4f8', '#fdd663'],
      });
    } catch (e) {
      // ignore
    }

    const note = isLowScoreMule
      ? 'Officer Discretionary Override: Merchant evidence manually verified by Compliance Officer.'
      : 'Statutory safe-harbor approval granted via evidence verification.';
    approveCase(note);
    onApprove();
  };

  const handleReject = () => {
    const note = 'Case escalated to NCRP Cyber Crime Cell (1930) due to pass-through velocity anomalies.';
    rejectCase(note);
    onReject();
  };

  const handleReset = () => {
    resetResults();
  };

  return (
    <div className="rounded-3xl bg-[#1e1f20] border border-[#333538] p-5 sm:p-6 shadow-sm flex flex-col gap-4 text-[#e3e3e3]">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#2d2f31]">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1b3a5b] text-[#8ab4f8]">
            <UserCheck className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">
              Compliance Officer Adjudication
            </h3>
            <p className="text-[11px] text-[#9aa0a6]">
              Human-in-the-Loop decision • Discretionary legal authority
            </p>
          </div>
        </div>

        {/* Fact Badge */}
        <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-[#131314] text-[#9aa0a6] border border-[#2d2f31]">
          AI Score: {score}/900
        </span>
      </div>

      {/* Human In The Loop Principle Notice */}
      <p className="text-xs text-[#9aa0a6] leading-relaxed">
        The system provides evidentiary facts. Final adjudication is strictly human-driven. As Compliance Nodal Officer, you make the binding determination under RBI / MAS statutory regulations.
      </p>

      {/* TWO ACTION BUTTONS (Clean, Clear, Always Available) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
        
        {/* BUTTON 1: Approve / Force Accept */}
        <button
          type="button"
          onClick={handleApprove}
          disabled={isProcessing}
          className={`flex flex-col p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
            adjudicationStatus === 'approved'
              ? 'bg-[#133924] border-[#81c995] text-white shadow-xs'
              : 'bg-[#131314] hover:bg-[#1e1f20] border-[#81c995]/50 hover:border-[#81c995] text-white'
          }`}
        >
          <div className="flex items-center justify-between w-full mb-1">
            <span className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#81c995]">
              <CheckCircle2 className="h-4 w-4" />
              {isLowScoreMule ? 'Force Approve (Override)' : 'Approve & Lift Hold'}
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#81c995]/20 text-[#81c995] font-medium">
              {isLowScoreMule ? 'Officer Discretion' : 'Safe Harbor'}
            </span>
          </div>
          <p className="text-[11px] text-[#9aa0a6] mt-0.5 leading-normal">
            {isLowScoreMule
              ? 'Exercise officer discretion to accept merchant explanation and unconditionally unblock funds.'
              : 'Commercial legitimacy verified. Immediately lift temporary debit hold.'}
          </p>
        </button>

        {/* BUTTON 2: Reject & Escalate */}
        <button
          type="button"
          onClick={handleReject}
          disabled={isProcessing}
          className={`flex flex-col p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
            adjudicationStatus === 'rejected'
              ? 'bg-[#3c1618] border-[#f28b82] text-white shadow-xs'
              : 'bg-[#131314] hover:bg-[#1e1f20] border-[#f28b82]/50 hover:border-[#f28b82] text-white'
          }`}
        >
          <div className="flex items-center justify-between w-full mb-1">
            <span className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#f28b82]">
              <AlertTriangle className="h-4 w-4" />
              Reject &amp; Escalate
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#f28b82]/20 text-[#f28b82] font-medium">
              Cyber Cell
            </span>
          </div>
          <p className="text-[11px] text-[#9aa0a6] mt-0.5 leading-normal">
            Confirm velocity anomaly or mismatched evidence. Forward docket to State Cyber Crime Cell (NCRP 1930).
          </p>
        </button>

      </div>

      {/* Decision Status Bar & Download Actions */}
      {adjudicationStatus === 'approved' && (
        <div className="p-3 rounded-2xl bg-[#133924] border border-[#81c995]/50 flex items-center justify-between text-xs text-[#c4eed0] flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-[#81c995] shrink-0" />
            <span>Debit hold lifted. Account unblocked and safe-harbor protected.</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={downloadCertificate}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#81c995] text-[#003919] font-semibold text-xs hover:bg-[#a8dab5] cursor-pointer"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Certificate</span>
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="p-1 rounded-full text-[#9aa0a6] hover:text-white cursor-pointer"
              title="Reset decision"
            >
              <RefreshCw className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}

      {adjudicationStatus === 'rejected' && (
        <div className="p-3 rounded-2xl bg-[#3c1618] border border-[#f28b82]/50 flex items-center justify-between text-xs text-[#fce8e6] flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-[#f28b82] shrink-0" />
            <span>Case escalated to State Cyber Crime Cell (NCRP 1930).</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={downloadEscalationDossier}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f28b82] text-[#3c1618] font-semibold text-xs hover:bg-[#ffb4ab] cursor-pointer"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Dossier</span>
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="p-1 rounded-full text-[#9aa0a6] hover:text-white cursor-pointer"
              title="Reset decision"
            >
              <RefreshCw className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default ActionBar;
