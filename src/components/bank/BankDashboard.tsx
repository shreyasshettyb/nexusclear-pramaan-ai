import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  Zap,
  Radio,
  FileCheck2,
  Clock,
  Building2,
  AlertTriangle,
  Play,
  Loader2,
  Sparkles,
} from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { getJurisdiction } from '../../data/jurisdictions';
import HopChainVisualizer from './HopChainVisualizer';
import CLSGauge from './CLSGauge';
import StatutoryTimer from './StatutoryTimer';
import EvidenceInspector from './EvidenceInspector';
import ActionBar from './ActionBar';
import TransactionGraph from './TransactionGraph';

export const BankDashboard: React.FC = () => {
  const {
    currentScenario,
    clsResult,
    geminiResult,
    isProcessing,
    processingStage,
    currentJurisdiction,
    runAuditPipeline,
    merchantEvidence,
    adjudicationStatus,
    approveCase,
    rejectCase,
  } = useAppContext();

  const [isResolved, setIsResolved] = useState<boolean>(false);
  const [resolutionTimeMs, setResolutionTimeMs] = useState<number | null>(null);
  const [escalationNotice, setEscalationNotice] = useState<boolean>(false);

  const jurisdictionConfig = getJurisdiction(currentJurisdiction);

  // Sync resolution state when scenario or global adjudication status changes
  useEffect(() => {
    if (adjudicationStatus === 'approved') {
      setIsResolved(true);
      setResolutionTimeMs(1840);
      setEscalationNotice(false);
    } else if (adjudicationStatus === 'rejected') {
      setIsResolved(false);
      setEscalationNotice(true);
    } else {
      setIsResolved(false);
      setResolutionTimeMs(null);
      setEscalationNotice(false);
    }
  }, [currentScenario?.id, adjudicationStatus]);

  const handleApprove = () => {
    setIsResolved(true);
    setResolutionTimeMs(1840);
    setEscalationNotice(false);
    approveCase('Statutory safe-harbor approval granted via Gemini 2.5 Flash validation.');
  };

  const handleReject = () => {
    setEscalationNotice(true);
    rejectCase('Case escalated to State Cyber Crime Cell (NCRP 1930 / SPF ASC) due to pass-through velocity anomalies.');
  };

  const handleTriggerPipeline = () => {
    runAuditPipeline();
  };

  const hasResults = Boolean(clsResult && geminiResult);

  return (
    <div className="w-full min-h-full bg-[#131314] text-[#e3e3e3] p-4 sm:p-6 lg:p-8 flex flex-col gap-6 relative selection:bg-[#8ab4f8]/30 selection:text-[#c2e7ff]">
      
      {/* ========================================================= */}
      {/* TOP SECTION: Header & Quick Stats Bar                     */}
      {/* ========================================================= */}
      <div className="flex flex-col gap-5">
        
        {/* Main Command Center Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#2d3036] pb-5">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="p-3 rounded-2xl bg-[#1d2024] border border-[#2d3036] text-[#8ab4f8] shrink-0">
              <Building2 className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                  Compliance &amp; Nodal Officer Command Center
                </h1>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1d2024] border border-[#2d3036] text-xs font-medium text-[#c4c7c5]">
                  <span className="text-sm" role="img" aria-label="flag">
                    {jurisdictionConfig.flag}
                  </span>
                  <span>{jurisdictionConfig.name}</span>
                  <span className="text-[#8e918f]">&bull;</span>
                  <span className="text-[#81c995] font-semibold">{jurisdictionConfig.framework}</span>
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[#8e918f] mt-1">
                Project NexusClear (Pramaan-AI) &bull; Cross-Border &amp; Domestic Automated Cyber Lien Adjudication
              </p>
            </div>
          </div>

          {/* Right Action / Status indicators */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1d2024] border border-[#2d3036] text-xs">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#81c995] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#81c995]"></span>
              </span>
              <span className="text-[#8e918f]">Nodal Gateway:</span>
              <span className="text-[#81c995] font-semibold">ONLINE</span>
            </div>

            {/* Quick Audit trigger button if results not run yet */}
            {!hasResults && !isProcessing && (
              <button
                onClick={handleTriggerPipeline}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#8ab4f8] hover:bg-[#a8c7fa] text-[#041e49] font-medium text-xs transition-colors cursor-pointer shadow-sm"
              >
                <Play className="h-3.5 w-3.5 fill-[#041e49]" />
                <span>Simulate Evidence Inflow</span>
              </button>
            )}

            {isProcessing && (
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#1d2024] border border-[#8ab4f8]/50 text-[#8ab4f8] text-xs font-mono animate-pulse">
                <Loader2 className="h-3.5 w-3.5 animate-spin text-[#8ab4f8]" />
                <span>Auditing Pipeline...</span>
              </div>
            )}
          </div>
        </div>

        {/* Quick Stats Bar (4 Mini Stat Cards) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          
          {/* Card 1: Active Holds (Google Amber) */}
          <div className="rounded-2xl bg-[#1d2024] border border-[#2d3036] p-4 shadow-sm hover:border-[#fdd663]/40 transition-colors">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-medium text-[#8e918f] uppercase tracking-wider">
                Active Holds
              </span>
              <span className="p-1.5 rounded-full bg-[#fdd663]/10 text-[#fdd663]">
                <ShieldAlert className="h-4 w-4" />
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl sm:text-2xl font-bold font-mono text-[#fdd663]">
                {adjudicationStatus === 'approved' || adjudicationStatus === 'rejected' ? '13 Active' : '14 Active'}
              </span>
              <span className="text-[11px] font-mono text-[#8e918f]">
                (L1 - L4)
              </span>
            </div>
            <div className="text-[11px] text-[#c4c7c5] mt-1 flex items-center gap-1">
              <span>
                {adjudicationStatus === 'approved'
                  ? '₹1.40 Cr (-₹1,450 hold lifted)'
                  : adjudicationStatus === 'rejected'
                  ? '₹1.42 Cr (Permanent lien recorded)'
                  : '₹1.42 Cr total frozen float'}
              </span>
            </div>
          </div>

          {/* Card 2: Avg Resolution Time (Google Green) */}
          <div className="rounded-2xl bg-[#1d2024] border border-[#2d3036] p-4 shadow-sm hover:border-[#81c995]/40 transition-colors">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-medium text-[#8e918f] uppercase tracking-wider">
                Avg Resolution Time
              </span>
              <span className="p-1.5 rounded-full bg-[#81c995]/10 text-[#81c995]">
                <Clock className="h-4 w-4" />
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl sm:text-2xl font-bold font-mono text-[#81c995]">
                1.8s
              </span>
              <span className="text-[11px] font-mono text-[#81c995]/80">
                vs 21d SLA
              </span>
            </div>
            <div className="text-[11px] text-[#81c995] mt-1 flex items-center gap-1 font-medium">
              <Sparkles className="h-3 w-3" />
              <span>99.98% SLA time reduction</span>
            </div>
          </div>

          {/* Card 3: CLS Accuracy (Google Blue) */}
          <div className="rounded-2xl bg-[#1d2024] border border-[#2d3036] p-4 shadow-sm hover:border-[#8ab4f8]/40 transition-colors">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-medium text-[#8e918f] uppercase tracking-wider">
                CLS Accuracy
              </span>
              <span className="p-1.5 rounded-full bg-[#8ab4f8]/10 text-[#8ab4f8]">
                <Zap className="h-4 w-4" />
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl sm:text-2xl font-bold font-mono text-[#8ab4f8]">
                99.4%
              </span>
              <span className="text-[11px] font-mono text-[#8e918f]">
                Multi-Hop
              </span>
            </div>
            <div className="text-[11px] text-[#c4c7c5] mt-1">
              <span>Zero false-positive unfreezes</span>
            </div>
          </div>

          {/* Card 4: Auto-Cleared (Google Teal) */}
          <div className="rounded-2xl bg-[#1d2024] border border-[#2d3036] p-4 shadow-sm hover:border-[#78d9ec]/40 transition-colors">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-medium text-[#8e918f] uppercase tracking-wider">
                Auto-Cleared
              </span>
              <span className="p-1.5 rounded-full bg-[#78d9ec]/10 text-[#78d9ec]">
                <FileCheck2 className="h-4 w-4" />
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl sm:text-2xl font-bold font-mono text-[#78d9ec]">
                {adjudicationStatus === 'approved' ? '1,285' : '1,284'}
              </span>
              <span className="text-[11px] font-mono text-[#8e918f]">
                Merchants
              </span>
            </div>
            <div className="text-[11px] text-[#c4c7c5] mt-1">
              <span>
                {adjudicationStatus === 'approved'
                  ? '✅ 1 Merchant Cleared Just Now'
                  : 'Protected under safe-harbor rule'}
              </span>
            </div>
          </div>

        </div>

      </div>

      {/* Escalation Warning Toast if Officer clicked Reject */}
      {escalationNotice && (
        <div className="rounded-2xl bg-[#2d1b1b] border border-[#f28b82]/40 p-4 shadow-sm text-[#f28b82] flex items-center justify-between gap-3 animate-slide-up">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-[#f28b82] shrink-0" />
            <div className="text-xs">
              <span className="font-bold block text-sm text-white">
                Case Escalated to State Cyber Crime Cell (NCRP 1930 / SPF ASC)
              </span>
              Formal Suspicious Transaction Report (STR) generated. Debit freeze converted to permanent pending judicial warrant.
            </div>
          </div>
          <button
            onClick={() => setEscalationNotice(false)}
            className="px-3 py-1 rounded-full bg-[#3d2323] hover:bg-[#4d2d2d] text-xs font-medium text-white cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Processing Progress Bar if running */}
      {isProcessing && (
        <div className="rounded-2xl bg-[#1d2024] border border-[#8ab4f8]/40 p-4 shadow-sm flex flex-col gap-2 animate-slide-up">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-[#8ab4f8] flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              {processingStage || 'Processing multimodal audit...'}
            </span>
            <span className="text-[#8e918f]">Gemini 2.5 Flash Pipeline</span>
          </div>
          <div className="w-full bg-[#2d3036] rounded-full h-1.5 overflow-hidden">
            <div className="bg-[#8ab4f8] h-full rounded-full w-3/4 animate-pulse" />
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MAIN VIEW: Results Loaded vs. Empty Standby State         */}
      {/* ========================================================= */}
      {!hasResults && !isProcessing ? (
        /* SOPHISTICATED RADAR PULSE EMPTY STATE */
        <div className="flex-1 rounded-2xl bg-[#1d2024] border border-[#2d3036] p-8 sm:p-12 flex flex-col items-center justify-center text-center relative overflow-hidden min-h-[460px]">
          
          {/* Animated Radar Pulse Rings */}
          <div className="relative flex items-center justify-center w-52 h-52 sm:w-64 sm:h-64 my-4">
            {/* Outer expanding pulse ring */}
            <div className="absolute inset-0 rounded-full border border-[#81c995]/20 animate-ping [animation-duration:3s]" />
            {/* Middle pulse ring */}
            <div className="absolute inset-4 rounded-full border border-[#81c995]/30 animate-pulse [animation-duration:2s]" />
            {/* Inner steady ring */}
            <div className="absolute inset-10 rounded-full border border-[#2d3036] bg-[#131314] flex items-center justify-center" />
            
            {/* Rotating radar sweep line */}
            <div className="absolute inset-10 rounded-full overflow-hidden pointer-events-none">
              <div className="w-full h-full animate-spin [animation-duration:4s] origin-center bg-[conic-gradient(from_0deg,transparent_0_300deg,rgba(129,201,149,0.3)_360deg)] rounded-full" />
            </div>

            {/* Center icon */}
            <div className="relative z-10 p-4 rounded-full bg-[#81c995]/10 text-[#81c995]">
              <Radio className="h-10 w-10 animate-pulse" />
            </div>
          </div>

          <div className="max-w-md flex flex-col items-center gap-2 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#131314] border border-[#2d3036] text-xs font-mono text-[#81c995]">
              <span className="h-2 w-2 rounded-full bg-[#81c995] animate-ping" />
              <span>Nodal Gateway Listening on Port 8443</span>
            </div>

            <h3 className="text-xl font-bold text-white mt-1">
              Awaiting Merchant Evidence Submission
            </h3>
            
            <p className="text-xs sm:text-sm text-[#8e918f] leading-relaxed">
              When the affected merchant completes the proof-of-sale upload on the mobile portal, this command center will automatically intake the payload, dispatch to Gemini 2.5 Flash, and calculate the live CLS score.
            </p>

            <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={handleTriggerPipeline}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#8ab4f8] hover:bg-[#a8c7fa] text-[#041e49] font-medium text-xs transition-colors cursor-pointer shadow-sm hover:scale-105 active:scale-95"
              >
                <Play className="h-4 w-4 fill-[#041e49]" />
                <span>Simulate Evidence Inflow &amp; Audit</span>
              </button>
            </div>
          </div>

          {/* Bottom telemetry footer */}
          <div className="mt-8 text-xs font-mono text-[#8e918f] flex items-center gap-4 border-t border-[#2d3036] pt-4">
            <span>Rail: {jurisdictionConfig.regulatoryBody}</span>
            <span>&bull;</span>
            <span>Framework: {jurisdictionConfig.framework}</span>
            <span>&bull;</span>
            <span>Telemetry: AES-256 Webhook Active</span>
          </div>

        </div>
      ) : (
        /* MAIN GRID: 2 COLUMNS ON LARGE SCREENS */
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            
            {/* LEFT COLUMN: HopChainVisualizer, CLSGauge, StatutoryTimer */}
            <div className="flex flex-col gap-6">
              
              {/* 1. HopChainVisualizer (Stagger 1) */}
              <div className="animate-slide-up [animation-delay:100ms]">
                <HopChainVisualizer
                  hopChain={currentScenario?.transaction.hopChain || []}
                  currentMerchant={currentScenario?.transaction.merchantName}
                />
              </div>

              {/* 2. CLSGauge (Stagger 2) */}
              <div className="animate-slide-up [animation-delay:200ms]">
                <CLSGauge
                  score={clsResult?.totalScore ?? 0}
                  breakdown={clsResult}
                  previousScore={currentScenario?.expectedCLS.totalScore ? 410 : 0}
                />
              </div>

              {/* 3. StatutoryTimer (Stagger 3) */}
              <div className="animate-slide-up [animation-delay:300ms]">
                <StatutoryTimer
                  jurisdiction={jurisdictionConfig}
                  frozenTimestamp={currentScenario?.transaction.timestamp || new Date().toISOString()}
                  isResolved={isResolved}
                  resolutionTimeMs={resolutionTimeMs}
                />
              </div>

            </div>

            {/* RIGHT COLUMN: EvidenceInspector, ActionBar */}
            <div className="flex flex-col gap-6">
              
              {/* 1. EvidenceInspector (Stagger 4) */}
              {currentScenario && (
                <div className="animate-slide-up [animation-delay:400ms]">
                  <EvidenceInspector
                    transaction={currentScenario.transaction}
                    geminiResult={geminiResult}
                    evidence={merchantEvidence || currentScenario.evidence}
                  />
                </div>
              )}

              {/* 2. ActionBar (Stagger 5) */}
              <div className="animate-slide-up [animation-delay:500ms]">
                <ActionBar
                  clsResult={clsResult}
                  onApprove={handleApprove}
                  onReject={handleReject}
                  isProcessing={isProcessing}
                  transaction={currentScenario?.transaction}
                  geminiResult={geminiResult}
                  jurisdictionConfig={jurisdictionConfig}
                />
              </div>

            </div>

          </div>

          {/* BOTTOM (FULL WIDTH): TransactionGraph (Stagger 6) */}
          <div className="animate-slide-up [animation-delay:600ms]">
            <TransactionGraph
              merchantName={currentScenario?.transaction.merchantName || 'Target Merchant'}
              scenario={currentScenario?.id || null}
            />
          </div>

        </div>
      )}

    </div>
  );
};

export default BankDashboard;
