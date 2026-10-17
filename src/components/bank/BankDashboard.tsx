import React, { useState, useEffect } from 'react';
import {
  Building2,
  AlertTriangle,
  Play,
  Loader2,
  FileCheck2,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { getJurisdiction, formatCurrency } from '../../data/jurisdictions';
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

  const [activeTab, setActiveTab] = useState<'evidence' | 'forensics'>('evidence');
  const [isResolved, setIsResolved] = useState<boolean>(false);
  const [resolutionTimeMs, setResolutionTimeMs] = useState<number | null>(null);

  const jurisdictionConfig = getJurisdiction(currentJurisdiction);

  useEffect(() => {
    if (adjudicationStatus === 'approved') {
      setIsResolved(true);
      setResolutionTimeMs(1840);
    } else if (adjudicationStatus === 'rejected') {
      setIsResolved(true);
      setResolutionTimeMs(2100);
    } else {
      setIsResolved(false);
      setResolutionTimeMs(null);
    }
  }, [currentScenario?.id, adjudicationStatus]);

  const handleApprove = () => {
    setIsResolved(true);
    setResolutionTimeMs(1840);
  };

  const handleReject = () => {
    setIsResolved(true);
    setResolutionTimeMs(2100);
  };

  const handleTriggerPipeline = () => {
    runAuditPipeline();
  };

  const hasResults = Boolean(clsResult && geminiResult);

  return (
    <div className="w-full flex flex-col gap-4 text-[#e3e3e3]">
      
      {/* ========================================================= */}
      {/* 1. TOP COMMAND BAR: Case Identity & Status                */}
      {/* ========================================================= */}
      <div className="rounded-3xl bg-[#1e1f20] border border-[#333538] p-4 sm:p-6 shadow-sm flex flex-col gap-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1b3a5b] text-[#8ab4f8] shrink-0">
              <Building2 className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-sm sm:text-lg font-bold text-white tracking-tight truncate">
                  Bank Compliance Command Center
                </h1>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#131314] border border-[#2d2f31] text-[11px] font-medium text-[#9aa0a6]">
                  <span>{jurisdictionConfig.flag}</span>
                  <span className="hidden sm:inline">{jurisdictionConfig.name}</span>
                </span>
              </div>
              <p className="text-xs text-[#9aa0a6] truncate">
                {currentScenario ? `${currentScenario.name} • ${formatCurrency(currentScenario.transaction.amount, currentJurisdiction)} Hold` : 'Automated Cyber Lien Adjudication'}
              </p>
            </div>
          </div>

          {/* Right Status Badge & Actions */}
          <div className="flex items-center gap-2 flex-wrap">
            {adjudicationStatus === 'approved' ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#133924] text-[#81c995] border border-[#81c995]/40 text-xs font-semibold">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Hold Lifted (Safe Harbor)
              </span>
            ) : adjudicationStatus === 'rejected' ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#3c1618] text-[#f28b82] border border-[#f28b82]/40 text-xs font-semibold">
                <AlertTriangle className="h-3.5 w-3.5" />
                Escalated to Cyber Cell
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#3b2f0a] text-[#fdd663] border border-[#fdd663]/40 text-xs font-medium">
                <Clock className="h-3.5 w-3.5" />
                Under Compliance Review
              </span>
            )}

            {!hasResults && !isProcessing && (
              <button
                type="button"
                onClick={handleTriggerPipeline}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#8ab4f8] hover:bg-[#a8c7fa] text-[#002b4f] font-semibold text-xs transition-colors cursor-pointer shadow-xs"
              >
                <Play className="h-3 w-3 fill-[#002b4f]" />
                <span>Run Instant AI Audit</span>
              </button>
            )}

            {isProcessing && (
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1b3a5b] text-[#d3e3fd] text-xs font-medium">
                <Loader2 className="h-3.5 w-3.5 animate-spin text-[#8ab4f8]" />
                <span className="truncate max-w-[200px]">{processingStage || 'Auditing with Gemini 2.5...'}</span>
              </div>
            )}
          </div>
        </div>

        {/* 4 Metric Chips */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-[#2d2f31]">
          <div className="p-2.5 rounded-2xl bg-[#131314]">
            <span className="text-[11px] text-[#9aa0a6] block">Lien Hold Amount</span>
            <span className="text-sm font-bold font-mono text-white">
              {currentScenario ? formatCurrency(currentScenario.transaction.amount, currentJurisdiction) : '₹0'}
            </span>
          </div>

          <div className="p-2.5 rounded-2xl bg-[#131314]">
            <span className="text-[11px] text-[#9aa0a6] block">AI Commercial Score</span>
            <span className={`text-sm font-bold font-mono ${clsResult ? (clsResult.totalScore >= 500 ? 'text-[#81c995]' : 'text-[#f28b82]') : 'text-[#9aa0a6]'}`}>
              {clsResult ? `${clsResult.totalScore} / 900` : 'Pending Audit'}
            </span>
          </div>

          <div className="p-2.5 rounded-2xl bg-[#131314]">
            <span className="text-[11px] text-[#9aa0a6] block">Audit SLA Benchmark</span>
            <span className="text-sm font-bold font-mono text-[#81c995]">
              1.8s <span className="text-[10px] text-[#9aa0a6] font-normal">vs 20d SLA</span>
            </span>
          </div>

          <div className="p-2.5 rounded-2xl bg-[#131314]">
            <span className="text-[11px] text-[#9aa0a6] block">Statutory Mandate</span>
            <span className="text-xs font-medium text-white truncate block mt-0.5">
              {jurisdictionConfig.framework}
            </span>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 2. NAVIGATION TABS                                        */}
      {/* ========================================================= */}
      <div className="flex items-center justify-between gap-2 border-b border-[#2d2f31] pb-1">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setActiveTab('evidence')}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'evidence'
                ? 'bg-[#1e1f20] text-white border border-[#333538] shadow-xs'
                : 'text-[#9aa0a6] hover:text-white'
            }`}
          >
            <span className="hidden sm:inline">Adjudication &amp; Evidence Audit</span>
            <span className="sm:hidden">Adjudication</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('forensics')}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'forensics'
                ? 'bg-[#1e1f20] text-white border border-[#333538] shadow-xs'
                : 'text-[#9aa0a6] hover:text-white'
            }`}
          >
            <span className="hidden sm:inline">Hop-Chain Forensics &amp; SLA</span>
            <span className="sm:hidden">Forensics &amp; SLA</span>
          </button>
        </div>

        <span className="text-[11px] text-[#9aa0a6] hidden sm:inline">
          {activeTab === 'evidence' ? 'Evidentiary Review & Binding Determination' : 'Graph Topology & Statutory Timeline'}
        </span>
      </div>

      {/* ========================================================= */}
      {/* 3. MAIN TAB CONTENT                                       */}
      {/* ========================================================= */}
      {!hasResults && !isProcessing ? (
        /* Standby State */
        <div className="rounded-3xl bg-[#1e1f20] border border-[#333538] p-8 flex flex-col items-center justify-center text-center gap-3 min-h-[340px]">
          <div className="p-3.5 rounded-full bg-[#1b3a5b] text-[#8ab4f8] mb-1">
            <FileCheck2 className="h-7 w-7" />
          </div>
          <h3 className="text-base font-bold text-white">
            Awaiting Evidence Submission
          </h3>
          <p className="text-xs text-[#9aa0a6] max-w-md leading-relaxed">
            When evidence is submitted on the merchant mobile portal, Gemini 2.5 Flash will automatically analyze the bill OCR, verify the vernacular voice statement, and calculate the live CLS score.
          </p>
          <button
            type="button"
            onClick={handleTriggerPipeline}
            className="mt-1 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#8ab4f8] hover:bg-[#a8c7fa] text-[#002b4f] font-semibold text-xs transition-colors cursor-pointer shadow-sm"
          >
            <Play className="h-3.5 w-3.5 fill-[#002b4f]" />
            <span>Simulate Evidence Inflow &amp; Audit</span>
          </button>
        </div>
      ) : activeTab === 'evidence' ? (
        /* TAB 1: Adjudication & Evidence */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
          {/* Left Column: CLS Gauge + Officer Adjudication Console */}
          <div className="flex flex-col gap-4">
            <CLSGauge
              score={clsResult?.totalScore ?? 0}
              breakdown={clsResult}
              previousScore={currentScenario?.expectedCLS.totalScore ? 410 : 0}
            />

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

          {/* Right Column: Multimodal Evidence Inspector */}
          <div className="flex flex-col gap-4">
            {currentScenario && (
              <EvidenceInspector
                transaction={currentScenario.transaction}
                geminiResult={geminiResult}
                evidence={merchantEvidence || currentScenario.evidence}
              />
            )}
          </div>
        </div>
      ) : (
        /* TAB 2: Hop-Chain Forensics & SLA */
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <HopChainVisualizer
              hopChain={currentScenario?.transaction.hopChain || []}
              currentMerchant={currentScenario?.transaction.merchantName}
            />

            <StatutoryTimer
              jurisdiction={jurisdictionConfig}
              frozenTimestamp={currentScenario?.transaction.timestamp || new Date().toISOString()}
              isResolved={isResolved}
              resolutionTimeMs={resolutionTimeMs}
            />
          </div>

          <TransactionGraph
            merchantName={currentScenario?.transaction.merchantName || 'Target Merchant'}
            scenario={currentScenario?.id || null}
          />
        </div>
      )}

    </div>
  );
};

export default BankDashboard;
