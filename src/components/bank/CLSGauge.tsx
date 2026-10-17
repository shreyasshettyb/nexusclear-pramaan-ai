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

  // Determine color scheme based on score
  const getScoreTheme = (val: number) => {
    if (val < 200) {
      return {
        stroke: '#ef4444', // crimson
        glow: 'rgba(239, 68, 68, 0.45)',
        text: 'text-rose-400',
        badgeBg: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
        verdict: 'High-Probability Mule',
        verdictColor: 'text-rose-400',
        statusIcon: ShieldAlert,
      };
    }
    if (val < 400) {
      return {
        stroke: '#f87171', // red
        glow: 'rgba(248, 113, 113, 0.4)',
        text: 'text-red-400',
        badgeBg: 'bg-red-500/20 text-red-300 border-red-500/40',
        verdict: 'High Risk Pass-Through',
        verdictColor: 'text-red-400',
        statusIcon: AlertTriangle,
      };
    }
    if (val < 600) {
      return {
        stroke: '#f59e0b', // amber
        glow: 'rgba(245, 158, 11, 0.4)',
        text: 'text-amber-400',
        badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
        verdict: 'Under In-Depth Review',
        verdictColor: 'text-amber-400',
        statusIcon: AlertTriangle,
      };
    }
    if (val < 750) {
      return {
        stroke: '#84cc16', // yellow-green
        glow: 'rgba(132, 204, 22, 0.4)',
        text: 'text-lime-400',
        badgeBg: 'bg-lime-500/20 text-lime-300 border-lime-500/40',
        verdict: 'Probable Bona Fide Merchant',
        verdictColor: 'text-lime-400',
        statusIcon: ShieldCheck,
      };
    }
    return {
      stroke: '#10b981', // emerald
      glow: 'rgba(16, 185, 129, 0.45)',
      text: 'text-emerald-400',
      badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      verdict: 'Verified Commercial Merchant',
      verdictColor: 'text-emerald-400',
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
    <div className="rounded-xl bg-slate-900/80 border border-slate-700/50 p-5 sm:p-6 shadow-xl backdrop-blur-md relative overflow-hidden flex flex-col gap-5">
      {/* Background ambient radial highlight */}
      <div
        className="absolute -top-16 -left-16 w-48 h-48 rounded-full blur-3xl pointer-events-none transition-colors duration-700"
        style={{ backgroundColor: theme.glow }}
      />

      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <Gauge className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-100 flex items-center gap-2">
              Commercial Legitimacy Score (CLS)
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                0 - 900 Scale
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Dual-model comparison: Legacy static bureau vs. Live multimodal AI
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400 bg-slate-950 px-2.5 py-1 rounded-md border border-slate-800">
          <Activity className="h-3.5 w-3.5 text-emerald-400 animate-pulse" />
          <span>Real-time Inference</span>
        </div>
      </div>

      {/* TWO SIDE-BY-SIDE CIRCULAR GAUGES */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center justify-center pt-2">
        
        {/* Left Gauge: Legacy Bureau (CIBIL / Experian) */}
        <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 text-center relative group">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Legacy Credit Bureau (CIBIL)
          </span>

          <div className="relative w-36 h-36 flex items-center justify-center my-1">
            <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 140 140">
              {/* Background Ring */}
              <circle
                cx="70"
                cy="70"
                r={radius}
                className="stroke-slate-800"
                strokeWidth={strokeWidth}
                fill="none"
              />
              {/* Static Muted Arc */}
              <circle
                cx="70"
                cy="70"
                r={radius}
                stroke="#64748b"
                strokeWidth={strokeWidth}
                strokeDasharray={circumference}
                strokeDashoffset={legacyOffset}
                strokeLinecap="round"
                fill="none"
                opacity="0.4"
              />
            </svg>

            {/* Inner Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-black font-mono text-slate-400">
                {legacyScore}
              </span>
              <span className="text-[10px] text-slate-500 font-mono">out of 900</span>
            </div>
          </div>

          <div className="mt-2 flex flex-col items-center gap-1">
            <span className="text-xs font-medium text-rose-400/90 flex items-center gap-1">
              <AlertTriangle className="h-3 w-3" /> Blind to UPI Multi-Hop Holds
            </span>
            <span className="text-[10px] text-slate-500 max-w-[200px]">
              T+30 bureau lag • No real-time graph dwell physics • Unaware of cyber liens
            </span>
          </div>
        </div>

        {/* Right Gauge: NexusClear Live CLS */}
        <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-slate-950/90 border border-slate-800 shadow-lg text-center relative overflow-hidden group">
          {/* Subtle glow highlight */}
          <div
            className="absolute inset-0 opacity-15 pointer-events-none transition-all duration-500"
            style={{
              background: `radial-gradient(circle at center, ${theme.stroke} 0%, transparent 70%)`,
            }}
          />

          <div className="flex items-center gap-1.5 mb-2">
            <span className="text-xs font-bold text-slate-100 uppercase tracking-wider">
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
                className="stroke-slate-800/80"
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
                  filter: `drop-shadow(0 0 8px ${theme.glow})`,
                }}
              />
            </svg>

            {/* Center Animated Score */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-3xl font-black font-mono tracking-tight ${theme.verdictColor}`}>
                {animatedScore}
              </span>
              <span className="text-[10px] text-slate-400 font-mono">out of 900</span>
            </div>
          </div>

          {/* Risk Level Badge */}
          <div className="mt-2 flex flex-col items-center gap-1">
            <div className={`px-2.5 py-0.5 rounded-full border text-xs font-semibold flex items-center gap-1.5 ${theme.badgeBg}`}>
              <StatusIcon className="h-3.5 w-3.5" />
              <span>{theme.verdict}</span>
            </div>
            <span className="text-[10px] text-slate-400">
              Instant multimodal telemetry • Graph velocity score
            </span>
          </div>
        </div>

      </div>

      {/* 3-COLUMN BREAKDOWN BARS */}
      <div className="pt-2 border-t border-slate-800 flex flex-col gap-2.5">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="font-semibold uppercase tracking-wider text-[11px] text-slate-300">
            CLS Analytical Pillars Breakdown
          </span>
          <span className="text-[11px] font-mono text-slate-500">
            Total Composite: {graphScore + geminiScore + physicalScore}/900
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          
          {/* Pillar 1: Graph Velocity (0-300) */}
          <div className="rounded-lg bg-slate-950/60 border border-slate-800/80 p-3 flex flex-col justify-between gap-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300">Graph Velocity</span>
              <span className="text-xs font-mono font-bold text-sky-400">
                {graphScore}<span className="text-slate-500 text-[10px]">/300</span>
              </span>
            </div>
            {/* Progress bar */}
            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
              <div
                className="bg-sky-500 h-full rounded-full transition-all duration-700 shadow-[0_0_8px_rgba(56,189,248,0.5)]"
                style={{ width: `${Math.min(100, Math.max(0, (graphScore / 300) * 100))}%` }}
              />
            </div>
            <span className="text-[10px] text-slate-400 truncate" title={String(breakdown?.details?.fanInDiversity ?? 'Topology fan-in')}>
              {String(breakdown?.details?.fanInDiversity ?? 'Dwell time & topology')}
            </span>
          </div>

          {/* Pillar 2: Gemini Multimodal (0-350) */}
          <div className="rounded-lg bg-slate-950/60 border border-slate-800/80 p-3 flex flex-col justify-between gap-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300">Gemini Multimodal</span>
              <span className="text-xs font-mono font-bold text-emerald-400">
                {geminiScore}<span className="text-slate-500 text-[10px]">/350</span>
              </span>
            </div>
            {/* Progress bar */}
            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-700 shadow-[0_0_8px_rgba(16,185,129,0.5)]"
                style={{ width: `${Math.min(100, Math.max(0, (geminiScore / 350) * 100))}%` }}
              />
            </div>
            <span className="text-[10px] text-slate-400 truncate" title={String(breakdown?.details?.inventoryConsistency ?? 'Receipt OCR & voice audit')}>
              {String(breakdown?.details?.inventoryConsistency ?? 'Receipt OCR & voice audit')}
            </span>
          </div>

          {/* Pillar 3: Physical Livelihood (0-250) */}
          <div className="rounded-lg bg-slate-950/60 border border-slate-800/80 p-3 flex flex-col justify-between gap-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300">Physical Livelihood</span>
              <span className="text-xs font-mono font-bold text-amber-400">
                {physicalScore}<span className="text-slate-500 text-[10px]">/250</span>
              </span>
            </div>
            {/* Progress bar */}
            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
              <div
                className="bg-amber-500 h-full rounded-full transition-all duration-700 shadow-[0_0_8px_rgba(245,158,11,0.5)]"
                style={{ width: `${Math.min(100, Math.max(0, (physicalScore / 250) * 100))}%` }}
              />
            </div>
            <span className="text-[10px] text-slate-400 truncate" title={String(breakdown?.details?.holdingDuration ?? 'Operational duration')}>
              {String(breakdown?.details?.holdingDuration ?? 'Operating history')}
            </span>
          </div>

        </div>
      </div>

      {/* RECOMMENDATION BADGE AT BOTTOM */}
      <div className="pt-2 border-t border-slate-800 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 uppercase font-mono">Nodal Officer Recommendation:</span>
          <span className={`text-xs font-mono font-bold px-2.5 py-1 rounded-md border ${theme.badgeBg}`}>
            {score >= 500 ? 'APPROVE ADMINISTRATIVE SAFE HARBOR (UNFREEZE)' : 'ESCALATE / PERMANENT DEBIT FREEZE'}
          </span>
        </div>
        <div className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-200 cursor-pointer">
          <span>Review Audit Matrix</span>
          <ArrowUpRight className="h-3.5 w-3.5" />
        </div>
      </div>
    </div>
  );
};

export default CLSGauge;
