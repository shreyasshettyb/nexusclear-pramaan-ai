import React, { useEffect, useState } from 'react';
import { Gauge, ShieldCheck, ShieldAlert, AlertTriangle, ArrowUpRight, Activity } from 'lucide-react';
import type { CLSBreakdown } from '../../types';

export interface CLSGaugeProps {
  score: number; // 0 - 900
  breakdown: CLSBreakdown | null;
  previousScore?: number;
}

export const CLSGauge: React.FC<CLSGaugeProps> = ({
  score,
  breakdown,
  previousScore = 410,
}) => {
  const [animatedScore, setAnimatedScore] = useState<number>(0);

  // Animate the score counter smoothly from 0 (or previousScore) to current score
  useEffect(() => {
    let startTimestamp: number | null = null;
    const duration = 1200; // ms
    const initial = animatedScore === 0 ? 0 : previousScore;
    const target = Math.min(900, Math.max(0, score));

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // Ease out cubic
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(initial + (target - initial) * easeProgress);
      setAnimatedScore(current);

      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };

    const animId = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(animId);
  }, [score, previousScore]);

  // Determine color scheme based on score using Google Material colors
  const getScoreTheme = (val: number) => {
    if (val < 200) {
      return {
        stroke: '#f28b82', // Google red
        glow: 'rgba(242, 139, 130, 0.3)',
        text: 'text-[#f28b82]',
        badgeBg: 'bg-[#f28b82]/10 text-[#f28b82] border-[#f28b82]/30',
        verdict: 'High-Probability Mule',
        verdictColor: 'text-[#f28b82]',
        statusIcon: ShieldAlert,
      };
    }
    if (val < 400) {
      return {
        stroke: '#f28b82', // Google red
        glow: 'rgba(242, 139, 130, 0.25)',
        text: 'text-[#f28b82]',
        badgeBg: 'bg-[#f28b82]/10 text-[#f28b82] border-[#f28b82]/30',
        verdict: 'High Risk Pass-Through',
        verdictColor: 'text-[#f28b82]',
        statusIcon: AlertTriangle,
      };
    }
    if (val < 600) {
      return {
        stroke: '#fdd663', // Google yellow
        glow: 'rgba(253, 214, 99, 0.25)',
        text: 'text-[#fdd663]',
        badgeBg: 'bg-[#fdd663]/10 text-[#fdd663] border-[#fdd663]/30',
        verdict: 'Under In-Depth Review',
        verdictColor: 'text-[#fdd663]',
        statusIcon: AlertTriangle,
      };
    }
    if (val < 750) {
      return {
        stroke: '#81c995', // Google green
        glow: 'rgba(129, 201, 149, 0.25)',
        text: 'text-[#81c995]',
        badgeBg: 'bg-[#81c995]/10 text-[#81c995] border-[#81c995]/30',
        verdict: 'Probable Bona Fide Merchant',
        verdictColor: 'text-[#81c995]',
        statusIcon: ShieldCheck,
      };
    }
    return {
      stroke: '#81c995', // Google green
      glow: 'rgba(129, 201, 149, 0.3)',
      text: 'text-[#81c995]',
      badgeBg: 'bg-[#81c995]/10 text-[#81c995] border-[#81c995]/30',
      verdict: 'Verified Commercial Merchant',
      verdictColor: 'text-[#81c995]',
      statusIcon: ShieldCheck,
    };
  };

  const theme = getScoreTheme(animatedScore);
  const StatusIcon = theme.statusIcon;

  // Circle geometry for SVG gauges
  const radius = 58;
  const strokeWidth = 9;
  const circumference = 2 * Math.PI * radius; // ~364.42

  // Right gauge animated offset (proportional to 900)
  const scoreRatio = Math.min(1, Math.max(0, animatedScore / 900));
  const strokeDashoffset = circumference * (1 - scoreRatio);

  // Left gauge: static legacy CIBIL (e.g. 380/900 or blind)
  const legacyScore = 380;
  const legacyOffset = circumference * (1 - legacyScore / 900);

  // Pillar scores
  const graphScore = breakdown?.graphVelocityScore ?? 0;
  const geminiScore = breakdown?.geminiMultimodalScore ?? 0;
  const physicalScore = breakdown?.physicalLivelihoodScore ?? 0;

  return (
    <div className="rounded-2xl bg-[#1d2024] border border-[#2d3036] p-5 sm:p-6 shadow-sm relative overflow-hidden flex flex-col gap-5">
      {/* Background ambient radial highlight */}
      <div
        className="absolute -top-16 -left-16 w-48 h-48 rounded-full blur-3xl pointer-events-none transition-colors duration-700 opacity-40"
        style={{ backgroundColor: theme.glow }}
      />

      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-[#2d3036] pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-[#131314] border border-[#2d3036] text-[#81c995]">
            <Gauge className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              Commercial Legitimacy Score (CLS)
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-[#131314] text-[#c4c7c5] border border-[#2d3036]">
                0 - 900 Scale
              </span>
            </h3>
            <p className="text-xs text-[#8e918f]">
              Dual-model comparison: Legacy static bureau vs. Live multimodal AI
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-xs font-mono text-[#8e918f] bg-[#131314] px-2.5 py-1 rounded-full border border-[#2d3036]">
          <Activity className="h-3.5 w-3.5 text-[#81c995] animate-pulse" />
          <span>Real-time Inference</span>
        </div>
      </div>

      {/* TWO SIDE-BY-SIDE CIRCULAR GAUGES */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center justify-center pt-2">
        
        {/* Left Gauge: Legacy Bureau (CIBIL / Experian) */}
        <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-[#131314] border border-[#2d3036] text-center relative group">
          <span className="text-xs font-medium text-[#8e918f] uppercase tracking-wider mb-2">
            Legacy Credit Bureau (CIBIL)
          </span>

          <div className="relative w-36 h-36 flex items-center justify-center my-1">
            <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 140 140">
              {/* Background Ring */}
              <circle
                cx="70"
                cy="70"
                r={radius}
                className="stroke-[#2d3036]"
                strokeWidth={strokeWidth}
                fill="none"
              />
              {/* Static Muted Arc */}
              <circle
                cx="70"
                cy="70"
                r={radius}
                stroke="#5f6368"
                strokeWidth={strokeWidth}
                strokeDasharray={circumference}
                strokeDashoffset={legacyOffset}
                strokeLinecap="round"
                fill="none"
                opacity="0.5"
              />
            </svg>

            {/* Inner Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold font-mono text-[#8e918f]">
                {legacyScore}
              </span>
              <span className="text-[10px] text-[#5f6368] font-mono">out of 900</span>
            </div>
          </div>

          <div className="mt-2 flex flex-col items-center gap-1">
            <span className="text-xs font-medium text-[#f28b82] flex items-center gap-1">
              <AlertTriangle className="h-3 w-3" /> Blind to UPI Multi-Hop Holds
            </span>
            <span className="text-[10px] text-[#8e918f] max-w-[200px]">
              T+30 bureau lag • No real-time graph dwell physics • Unaware of cyber liens
            </span>
          </div>
        </div>

        {/* Right Gauge: NexusClear Live CLS */}
        <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-[#131314] border border-[#2d3036] shadow-sm text-center relative overflow-hidden group">
          {/* Subtle glow highlight */}
          <div
            className="absolute inset-0 opacity-10 pointer-events-none transition-all duration-500"
            style={{
              background: `radial-gradient(circle at center, ${theme.stroke} 0%, transparent 70%)`,
            }}
          />

          <div className="flex items-center gap-1.5 mb-2">
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              NexusClear Live CLS
            </span>
            <span className="h-2 w-2 rounded-full animate-ping" style={{ backgroundColor: theme.stroke }} />
          </div>

          <div className="relative w-36 h-36 flex items-center justify-center my-1">
            <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 140 140">
              {/* Background Ring */}
              <circle
                cx="70"
                cy="70"
                r={radius}
                className="stroke-[#2d3036]"
                strokeWidth={strokeWidth}
                fill="none"
              />
              {/* Animated Live Arc */}
              <circle
                cx="70"
                cy="70"
                r={radius}
                stroke={theme.stroke}
                strokeWidth={strokeWidth}
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="none"
                style={{
                  transition: 'stroke-dashoffset 0.8s cubic-bezier(0.16, 1, 0.3, 1), stroke 0.5s ease',
                  filter: `drop-shadow(0 0 6px ${theme.glow})`,
                }}
              />
            </svg>

            {/* Center Animated Score */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-3xl font-bold font-mono tracking-tight ${theme.verdictColor}`}>
                {animatedScore}
              </span>
              <span className="text-[10px] text-[#8e918f] font-mono">out of 900</span>
            </div>
          </div>

          {/* Risk Level Badge */}
          <div className="mt-2 flex flex-col items-center gap-1">
            <div className={`px-3 py-1 rounded-full border text-xs font-medium flex items-center gap-1.5 ${theme.badgeBg}`}>
              <StatusIcon className="h-3.5 w-3.5" />
              <span>{theme.verdict}</span>
            </div>
            <span className="text-[10px] text-[#8e918f]">
              Instant multimodal telemetry • Graph velocity score
            </span>
          </div>
        </div>

      </div>

      {/* 3-COLUMN BREAKDOWN BARS */}
      <div className="pt-2 border-t border-[#2d3036] flex flex-col gap-2.5">
        <div className="flex items-center justify-between text-xs text-[#8e918f]">
          <span className="font-semibold uppercase tracking-wider text-[11px] text-[#c4c7c5]">
            CLS Analytical Pillars Breakdown
          </span>
          <span className="text-[11px] font-mono text-[#8e918f]">
            Total Composite: {graphScore + geminiScore + physicalScore}/900
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          
          {/* Pillar 1: Graph Velocity (0-300) */}
          <div className="rounded-xl bg-[#131314] border border-[#2d3036] p-3 flex flex-col justify-between gap-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-[#c4c7c5]">Graph Velocity</span>
              <span className="text-xs font-mono font-bold text-[#8ab4f8]">
                {graphScore}<span className="text-[#8e918f] text-[10px]">/300</span>
              </span>
            </div>
            {/* Progress bar */}
            <div className="w-full bg-[#2d3036] rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-[#8ab4f8] h-full rounded-full transition-all duration-700"
                style={{ width: `${Math.min(100, Math.max(0, (graphScore / 300) * 100))}%` }}
              />
            </div>
            <span className="text-[10px] text-[#8e918f] truncate" title={String(breakdown?.details?.fanInDiversity ?? 'Topology fan-in')}>
              {String(breakdown?.details?.fanInDiversity ?? 'Dwell time & topology')}
            </span>
          </div>

          {/* Pillar 2: Gemini Multimodal (0-350) */}
          <div className="rounded-xl bg-[#131314] border border-[#2d3036] p-3 flex flex-col justify-between gap-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-[#c4c7c5]">Gemini Multimodal</span>
              <span className="text-xs font-mono font-bold text-[#81c995]">
                {geminiScore}<span className="text-[#8e918f] text-[10px]">/350</span>
              </span>
            </div>
            {/* Progress bar */}
            <div className="w-full bg-[#2d3036] rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-[#81c995] h-full rounded-full transition-all duration-700"
                style={{ width: `${Math.min(100, Math.max(0, (geminiScore / 350) * 100))}%` }}
              />
            </div>
            <span className="text-[10px] text-[#8e918f] truncate" title={String(breakdown?.details?.inventoryConsistency ?? 'Receipt OCR & voice audit')}>
              {String(breakdown?.details?.inventoryConsistency ?? 'Receipt OCR & voice audit')}
            </span>
          </div>

          {/* Pillar 3: Physical Livelihood (0-250) */}
          <div className="rounded-xl bg-[#131314] border border-[#2d3036] p-3 flex flex-col justify-between gap-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-[#c4c7c5]">Physical Livelihood</span>
              <span className="text-xs font-mono font-bold text-[#fdd663]">
                {physicalScore}<span className="text-[#8e918f] text-[10px]">/250</span>
              </span>
            </div>
            {/* Progress bar */}
            <div className="w-full bg-[#2d3036] rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-[#fdd663] h-full rounded-full transition-all duration-700"
                style={{ width: `${Math.min(100, Math.max(0, (physicalScore / 250) * 100))}%` }}
              />
            </div>
            <span className="text-[10px] text-[#8e918f] truncate" title={String(breakdown?.details?.holdingDuration ?? 'Operational duration')}>
              {String(breakdown?.details?.holdingDuration ?? 'Operating history')}
            </span>
          </div>

        </div>
      </div>

      {/* RECOMMENDATION BADGE AT BOTTOM */}
      <div className="pt-2 border-t border-[#2d3036] flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xs text-[#8e918f] uppercase font-mono">Nodal Officer Recommendation:</span>
          <span className={`text-xs font-mono font-medium px-3 py-1 rounded-full border ${theme.badgeBg}`}>
            {score >= 500 ? 'APPROVE ADMINISTRATIVE SAFE HARBOR (UNFREEZE)' : 'ESCALATE / PERMANENT DEBIT FREEZE'}
          </span>
        </div>
        <div className="flex items-center gap-1 text-[11px] text-[#8e918f] hover:text-white cursor-pointer">
          <span>Review Audit Matrix</span>
          <ArrowUpRight className="h-3.5 w-3.5" />
        </div>
      </div>
    </div>
  );
};

export default CLSGauge;
