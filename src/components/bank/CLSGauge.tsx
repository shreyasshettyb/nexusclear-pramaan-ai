import React, { useEffect, useState } from 'react';
import { Gauge, ShieldCheck, ShieldAlert, AlertTriangle, Activity } from 'lucide-react';
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

  useEffect(() => {
    let startTimestamp: number | null = null;
    const duration = 800;
    const initial = animatedScore === 0 ? 0 : previousScore;
    const target = Math.min(900, Math.max(0, score));

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
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

  const getScoreTheme = (val: number) => {
    if (val < 200) {
      return {
        color: '#f28b82',
        textColor: 'text-[#f28b82]',
        verdict: 'High-Probability Mule',
        icon: ShieldAlert,
      };
    }
    if (val < 500) {
      return {
        color: '#fdd663',
        textColor: 'text-[#ffe082]',
        verdict: 'Pass-Through Anomaly',
        icon: AlertTriangle,
      };
    }
    return {
      color: '#81c995',
      textColor: 'text-[#81c995]',
      verdict: 'Verified Commercial Merchant',
      icon: ShieldCheck,
    };
  };

  const theme = getScoreTheme(animatedScore);
  const StatusIcon = theme.icon;

  const radius = 46;
  const strokeWidth = 7;
  const circumference = 2 * Math.PI * radius;
  const scoreRatio = Math.min(1, Math.max(0, animatedScore / 900));
  const strokeDashoffset = circumference * (1 - scoreRatio);

  const graphScore = breakdown?.graphVelocityScore ?? (score < 500 ? 45 : 275);
  const geminiScore = breakdown?.geminiMultimodalScore ?? (score < 500 ? 35 : 345);
  const physicalScore = breakdown?.physicalLivelihoodScore ?? (score < 500 ? 45 : 245);

  return (
    <div className="rounded-3xl bg-[#1e1f20] border border-[#333538] p-4 sm:p-6 shadow-sm flex flex-col gap-4 text-[#e3e3e3]">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#2d2f31] flex-wrap gap-2">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1b3a5b] text-[#8ab4f8]">
            <Gauge className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">
              Commercial Legitimacy Score (CLS)
            </h3>
            <p className="text-[11px] text-[#9aa0a6]">
              Real-time multi-hop legitimacy index (0 - 900)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#131314] text-[11px] font-medium text-[#9aa0a6] border border-[#2d2f31]">
          <Activity className="h-3 w-3 text-[#81c995] animate-pulse" />
          <span>Real-Time</span>
        </div>
      </div>

      {/* Circular Gauge & Verdict */}
      <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-around gap-4 py-1">
        
        {/* SVG Gauge */}
        <div className="relative w-28 h-28 flex items-center justify-center shrink-0">
          <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 110 110">
            <circle
              cx="55"
              cy="55"
              r={radius}
              className="stroke-[#2d2f31]"
              strokeWidth={strokeWidth}
              fill="none"
            />
            <circle
              cx="55"
              cy="55"
              r={radius}
              stroke={theme.color}
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="none"
              className="transition-all duration-700 ease-out"
            />
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold font-mono tracking-tight text-white leading-none">
              {animatedScore}
            </span>
            <span className="text-[10px] text-[#9aa0a6] mt-0.5">/ 900</span>
          </div>
        </div>

        {/* Verdict Badge & Facts */}
        <div className="flex flex-col items-center sm:items-start text-center sm:text-left gap-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#131314] border border-[#2d2f31]">
            <StatusIcon className={`h-3.5 w-3.5 ${theme.textColor}`} />
            <span className={`text-xs font-semibold ${theme.textColor}`}>
              {theme.verdict}
            </span>
          </div>
          <p className="text-xs text-[#9aa0a6] max-w-xs leading-relaxed">
            {animatedScore >= 500
              ? 'Multi-hop transaction physics and receipt OCR confirm genuine retail sale.'
              : 'Pass-through velocity and receipt amount mismatch indicate elevated risk.'}
          </p>
        </div>

      </div>

      {/* 3 Pillar Breakdown Bars */}
      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#2d2f31] text-xs">
        {/* 1. Velocity */}
        <div className="flex flex-col gap-1 p-2 rounded-xl bg-[#131314]">
          <div className="flex items-center justify-between text-[11px] text-[#9aa0a6]">
            <span>Velocity</span>
            <span className="font-mono text-white">{graphScore}/300</span>
          </div>
          <div className="w-full bg-[#28292a] h-1.5 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${(graphScore / 300) * 100}%`,
                backgroundColor: graphScore > 150 ? '#81c995' : '#f28b82',
              }}
            />
          </div>
        </div>

        {/* 2. Multimodal */}
        <div className="flex flex-col gap-1 p-2 rounded-xl bg-[#131314]">
          <div className="flex items-center justify-between text-[11px] text-[#9aa0a6]">
            <span>Gemini AI</span>
            <span className="font-mono text-white">{geminiScore}/350</span>
          </div>
          <div className="w-full bg-[#28292a] h-1.5 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${(geminiScore / 350) * 100}%`,
                backgroundColor: geminiScore > 175 ? '#81c995' : '#f28b82',
              }}
            />
          </div>
        </div>

        {/* 3. Livelihood */}
        <div className="flex flex-col gap-1 p-2 rounded-xl bg-[#131314]">
          <div className="flex items-center justify-between text-[11px] text-[#9aa0a6]">
            <span>Livelihood</span>
            <span className="font-mono text-white">{physicalScore}/250</span>
          </div>
          <div className="w-full bg-[#28292a] h-1.5 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${(physicalScore / 250) * 100}%`,
                backgroundColor: physicalScore > 125 ? '#81c995' : '#f28b82',
              }}
            />
          </div>
        </div>
      </div>

    </div>
  );
};

export default CLSGauge;
