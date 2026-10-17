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
  } = useAppContext();

  const [isResolved, setIsResolved] = useState<boolean>(false);
  const [resolutionTimeMs, setResolutionTimeMs] = useState<number | null>(null);
  const [escalationNotice, setEscalationNotice] = useState<boolean>(false);

  const jurisdictionConfig = getJurisdiction(currentJurisdiction);

  // Reset resolution state if scenario changes
  useEffect(() => {
    setIsResolved(false);
    setResolutionTimeMs(null);
    setEscalationNotice(false);
  }, [currentScenario?.id]);

  const handleApprove = () => {
    setIsResolved(true);
    setResolutionTimeMs(1840);
    setEscalationNotice(false);
  };

  const handleReject = () => {
    setEscalationNotice(true);
  };

  const handleTriggerPipeline = () => {
    runAuditPipeline();
  };

  const hasResults = Boolean(clsResult && geminiResult);

  return (
    <div className="w-full min-h-full bg-slate-950 bg-grid-pattern text-slate-100 p-4 sm:p-6 lg:p-8 flex flex-col gap-6 relative selection:bg-emerald-500/30 selection:text-emerald-200">
      
      {/* ========================================================= */}
      {/* TOP SECTION: Header & Quick Stats Bar                     */}
      {/* ========================================================= */}
      <div className="flex flex-col gap-5">
        
        {/* Main Command Center Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500/20 via-emerald-600/10 to-transparent border border-emerald-500/30 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.15)] shrink-0">
              <Building2 className="h-7 w-7" />
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                  Compliance &amp; Nodal Officer Command Center
                </h1>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-700/80 text-xs font-mono text-slate-300 shadow-sm">
                  <span className="text-sm" role="img" aria-label="flag">
                    {jurisdictionConfig.flag}
                  </span>
                  <span>{jurisdictionConfig.name}</span>
                  <span className="text-slate-500">&bull;</span>
                  <span className="text-emerald-400 font-semibold">{jurisdictionConfig.framework}</span>
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Project NexusClear (Pramaan-AI) &bull; Cross-Border &amp; Domestic Automated Cyber Lien Adjudication
              </p>
            </div>
          </div>

          {/* Right Action / Status indicators */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/90 border border-slate-800 text-xs font-mono">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="text-slate-300">Live Nodal Gateway:</span>
              <span className="text-emerald-400 font-bold">ONLINE</span>
            </div>

            {/* Quick Audit trigger button if results not run yet */}
            {!hasResults && !isProcessing && (
              <button
                onClick={handleTriggerPipeline}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-xs transition-all shadow-[0_0_20px_rgba(16,185,129,0.35)] cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
              >
                <Play className="h-3.5 w-3.5 fill-white" />
                <span>Simulate Evidence Inflow</span>
              </button>
            )}

            {isProcessing && (
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs font-mono animate-pulse">
                <Loader2 className="h-3.5 w-3.5 animate-spin text-emerald-400" />
                <span>Auditing Pipeline...</span>
              </div>
            )}
          </div>
        </div>

        {/* Quick Stats Bar (4 Mini Stat Cards) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          
          {/* Card 1: Active Holds (Amber) */}
          <div className="rounded-xl bg-slate-900/70 border border-amber-500/30 p-3.5 sm:p-4 shadow-lg backdrop-blur-md relative overflow-hidden group hover:border-amber-500/50 transition-colors">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                Active Holds
              </span>
              <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <ShieldAlert className="h-4 w-4" />
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl sm:text-2xl font-black font-mono text-amber-400">
                14 Active
              </span>
              <span className="text-[11px] font-mono text-slate-500">
                (L1 - L4)
              </span>
            </div>
            <div className="text-[11px] text-amber-300/80 mt-1 flex items-center gap-1">
              <span>₹1.42 Cr total frozen float</span>
            </div>
          </div>

          {/* Card 2: Avg Resolution Time (Emerald) */}
          <div className="rounded-xl bg-slate-900/70 border border-emerald-500/30 p-3.5 sm:p-4 shadow-lg backdrop-blur-md relative overflow-hidden group hover:border-emerald-500/50 transition-colors">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                Avg Resolution Time
              </span>
              <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Clock className="h-4 w-4" />
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl sm:text-2xl font-black font-mono text-emerald-400">
                1.8s
              </span>
              <span className="text-[11px] font-mono text-emerald-500/80">
                vs 21d SLA
              </span>
            </div>
            <div className="text-[11px] text-emerald-300/80 mt-1 flex items-center gap-1">
              <Sparkles className="h-3 w-3 text-emerald-400" />
              <span>99.98% SLA time reduction</span>
            </div>
          </div>

          {/* Card 3: CLS Accuracy (Blue) */}
          <div className="rounded-xl bg-slate-900/70 border border-sky-500/30 p-3.5 sm:p-4 shadow-lg backdrop-blur-md relative overflow-hidden group hover:border-sky-500/50 transition-colors">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                CLS Accuracy
              </span>
              <span className="p-1.5 rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/20">
                <Zap className="h-4 w-4" />
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl sm:text-2xl font-black font-mono text-sky-400">
                99.4%
              </span>
              <span className="text-[11px] font-mono text-sky-400/60">
                Multi-Hop
              </span>
            </div>
            <div className="text-[11px] text-sky-300/80 mt-1">
              <span>Zero false-positive unfreezes</span>
            </div>
          </div>

          {/* Card 4: Auto-Cleared (Green) */}
          <div className="rounded-xl bg-slate-900/70 border border-teal-500/30 p-3.5 sm:p-4 shadow-lg backdrop-blur-md relative overflow-hidden group hover:border-teal-500/50 transition-colors">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                Auto-Cleared
              </span>
              <span className="p-1.5 rounded-lg bg-teal-500/10 text-teal-400 border border-teal-500/20">
                <FileCheck2 className="h-4 w-4" />
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl sm:text-2xl font-black font-mono text-teal-400">
                1,284
              </span>
              <span className="text-[11px] font-mono text-teal-400/60">
                Merchants
              </span>
            </div>
            <div className="text-[11px] text-teal-300/80 mt-1">
              <span>Protected under safe-harbor rule</span>
            </div>
          </div>

        </div>

      </div>

      {/* Escalation Warning Toast if Officer clicked Reject */}
      {escalationNotice && (
        <div className="rounded-xl bg-rose-950/80 border border-rose-500/60 p-4 shadow-xl text-rose-200 flex items-center justify-between gap-3 animate-slide-up">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-rose-400 shrink-0" />
            <div className="text-xs">
              <span className="font-bold block text-sm text-white">
                Case Escalated to State Cyber Crime Cell (NCRP 1930 / SPF ASC)
              </span>
              Formal Suspicious Transaction Report (STR) generated. Debit freeze converted to permanent pending judicial warrant.
            </div>
          </div>
          <button
            onClick={() => setEscalationNotice(false)}
            className="px-2.5 py-1 rounded bg-rose-900/80 hover:bg-rose-800 text-xs font-mono text-white cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Processing Progress Bar if running */}
      {isProcessing && (
        <div className="rounded-xl bg-slate-900/90 border border-emerald-500/40 p-4 shadow-xl flex flex-col gap-2 animate-slide-up">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-emerald-400 flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              {processingStage || 'Processing multimodal audit...'}
            </span>
            <span className="text-slate-400">Gemini 2.5 Flash Pipeline</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
            <div className="bg-emerald-500 h-full rounded-full w-3/4 animate-pulse" />
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MAIN VIEW: Results Loaded vs. Empty Standby State         */}
      {/* ========================================================= */}
      {!hasResults && !isProcessing ? (
        /* SOPHISTICATED RADAR PULSE EMPTY STATE */
        <div className="flex-1 rounded-2xl bg-slate-900/40 border border-slate-800/80 p-8 sm:p-12 flex flex-col items-center justify-center text-center relative overflow-hidden min-h-[460px]">
          
          {/* Animated Radar Pulse Rings */}
          <div className="relative flex items-center justify-center w-52 h-52 sm:w-64 sm:h-64 my-4">
            {/* Outer expanding pulse ring */}
            <div className="absolute inset-0 rounded-full border border-emerald-500/20 animate-ping [animation-duration:3s]" />
            {/* Middle pulse ring */}
            <div className="absolute inset-4 rounded-full border border-emerald-500/30 animate-pulse [animation-duration:2s]" />
            {/* Inner steady ring */}
            <div className="absolute inset-10 rounded-full border border-slate-700 bg-slate-950/80 flex items-center justify-center shadow-[0_0_40px_rgba(16,185,129,0.15)]" />
            
            {/* Rotating radar sweep line */}
            <div className="absolute inset-10 rounded-full overflow-hidden pointer-events-none">
              <div className="w-full h-full animate-spin [animation-duration:4s] origin-center bg-[conic-gradient(from_0deg,transparent_0_300deg,rgba(16,185,129,0.35)_360deg)] rounded-full" />
            </div>

            {/* Center icon */}
            <div className="relative z-10 p-4 rounded-full bg-emerald-500/10 border border-emerald-500/40 text-emerald-400 shadow-xl">
              <Radio className="h-10 w-10 animate-pulse" />
            </div>
          </div>

          <div className="max-w-md flex flex-col items-center gap-2 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-xs font-mono text-emerald-400">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Nodal Gateway Listening on Port 8443</span>
            </div>

            <h3 className="text-xl font-bold text-white mt-1">
              Awaiting Merchant Evidence Submission
            </h3>
            
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              When the affected merchant completes the 3-step proof-of-sale upload on the mobile portal, this command center will automatically intake the payload, dispatch to Gemini 2.5 Flash, and calculate the live CLS score.
            </p>

            <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={handleTriggerPipeline}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-all shadow-[0_0_20px_rgba(16,185,129,0.4)] cursor-pointer hover:scale-105 active:scale-95"
              >
                <Play className="h-4 w-4 fill-white" />
                <span>Simulate Evidence Inflow &amp; Audit</span>
              </button>
            </div>
          </div>

          {/* Bottom telemetry footer */}
          <div className="mt-8 text-xs font-mono text-slate-500 flex items-center gap-4 border-t border-slate-800/60 pt-4">
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
