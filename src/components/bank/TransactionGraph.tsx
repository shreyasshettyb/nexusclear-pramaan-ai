import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  Activity,
  AlertTriangle,
  ShieldCheck,
  BarChart3,
  Calendar,
} from 'lucide-react';

export interface TransactionGraphProps {
  merchantName: string;
  scenario: 'innocent_medical' | 'innocent_hawker' | 'mule' | string | null;
}

interface MonthlyData {
  month: string;
  volume: number;
  formattedVolume: string;
  txnCount: number;
  avgTicket: string;
  isSpike: boolean;
  status: string;
}

export const TransactionGraph: React.FC<TransactionGraphProps> = ({
  merchantName,
  scenario,
}) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    // Trigger smooth bar growth animation on mount or scenario change
    setMounted(false);
    const timer = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(timer);
  }, [scenario]);

  const isMule =
    scenario === 'mule' ||
    scenario === 'rajesh-trading' ||
    merchantName.toLowerCase().includes('rajesh') ||
    merchantName.toLowerCase().includes('trading');

  const isSingapore =
    scenario === 'innocent_hawker' ||
    scenario === 'uncle-tan-chicken-rice' ||
    merchantName.toLowerCase().includes('tan');

  // Synthetic 6-month historical dataset (May 2026 - Oct 2026)
  const getHistoricalData = (): MonthlyData[] => {
    if (isMule) {
      return [
        {
          month: 'May 2026',
          volume: 0,
          formattedVolume: '₹0',
          txnCount: 0,
          avgTicket: '₹0',
          isSpike: false,
          status: 'Dormant (Zero Activity)',
        },
        {
          month: 'Jun 2026',
          volume: 0,
          formattedVolume: '₹0',
          txnCount: 0,
          avgTicket: '₹0',
          isSpike: false,
          status: 'Dormant (Zero Activity)',
        },
        {
          month: 'Jul 2026',
          volume: 2500,
          formattedVolume: '₹2,500',
          txnCount: 1,
          avgTicket: '₹2,500',
          isSpike: false,
          status: 'Single Test Credit',
        },
        {
          month: 'Aug 2026',
          volume: 0,
          formattedVolume: '₹0',
          txnCount: 0,
          avgTicket: '₹0',
          isSpike: false,
          status: 'Dormant (Zero Activity)',
        },
        {
          month: 'Sep 2026',
          volume: 12000,
          formattedVolume: '₹12,000',
          txnCount: 1,
          avgTicket: '₹12,000',
          isSpike: false,
          status: 'Single Credit (Old chit)',
        },
        {
          month: 'Oct 2026',
          volume: 1845000,
          formattedVolume: '₹18,45,000',
          txnCount: 38,
          avgTicket: '₹48,550',
          isSpike: true,
          status: 'SUDDEN SPIKE & 98% DRAIN (Mule)',
        },
      ];
    }

    if (isSingapore) {
      return [
        {
          month: 'May 2026',
          volume: 24500,
          formattedVolume: 'S$24,500',
          txnCount: 3820,
          avgTicket: 'S$6.41',
          isSpike: false,
          status: 'Consistent Daily Hawker Sales',
        },
        {
          month: 'Jun 2026',
          volume: 26200,
          formattedVolume: 'S$26,200',
          txnCount: 4080,
          avgTicket: 'S$6.42',
          isSpike: false,
          status: 'School Holiday Peak Volume',
        },
        {
          month: 'Jul 2026',
          volume: 25800,
          formattedVolume: 'S$25,800',
          txnCount: 4010,
          avgTicket: 'S$6.43',
          isSpike: false,
          status: 'Consistent Lunchtime Volume',
        },
        {
          month: 'Aug 2026',
          volume: 27100,
          formattedVolume: 'S$27,100',
          txnCount: 4210,
          avgTicket: 'S$6.44',
          isSpike: false,
          status: 'National Day Festival Surge',
        },
        {
          month: 'Sep 2026',
          volume: 26500,
          formattedVolume: 'S$26,500',
          txnCount: 4120,
          avgTicket: 'S$6.43',
          isSpike: false,
          status: 'Normal Hawkers Peak Turnover',
        },
        {
          month: 'Oct 2026',
          volume: 25400,
          formattedVolume: 'S$25,400',
          txnCount: 3950,
          avgTicket: 'S$6.43',
          isSpike: false,
          status: 'Steady Baseline Livelihood',
        },
      ];
    }

    // Default: Innocent Indian Pharmacy (Ramesh Medicals)
    return [
      {
        month: 'May 2026',
        volume: 284000,
        formattedVolume: '₹2,84,000',
        txnCount: 780,
        avgTicket: '₹364',
        isSpike: false,
        status: 'Normal Pharmacy Turnover',
      },
      {
        month: 'Jun 2026',
        volume: 312000,
        formattedVolume: '₹3,12,000',
        txnCount: 840,
        avgTicket: '₹371',
        isSpike: false,
        status: 'Monsoon Flu Season Volume',
      },
      {
        month: 'Jul 2026',
        volume: 305000,
        formattedVolume: '₹3,05,000',
        txnCount: 815,
        avgTicket: '₹374',
        isSpike: false,
        status: 'Consistent Prescription Flow',
      },
      {
        month: 'Aug 2026',
        volume: 340000,
        formattedVolume: '₹3,40,000',
        txnCount: 895,
        avgTicket: '₹380',
        isSpike: false,
        status: 'Steady Daily Footfall (28-35/day)',
      },
      {
        month: 'Sep 2026',
        volume: 325000,
        formattedVolume: '₹3,25,000',
        txnCount: 860,
        avgTicket: '₹378',
        isSpike: false,
        status: 'Verified Marg POS Integration',
      },
      {
        month: 'Oct 2026',
        volume: 318000,
        formattedVolume: '₹3,18,000',
        txnCount: 825,
        avgTicket: '₹385',
        isSpike: false,
        status: 'Active Livelihood Baseline',
      },
    ];
  };

  const data = getHistoricalData();
  const maxVolume = Math.max(...data.map((d) => d.volume), 1);

  // SVG dimensions
  const svgWidth = 720;
  const svgHeight = 200;
  const paddingLeft = 55;
  const paddingRight = 20;
  const paddingTop = 25;
  const paddingBottom = 35;
  const chartWidth = svgWidth - paddingLeft - paddingRight;
  const chartHeight = svgHeight - paddingTop - paddingBottom;

  const barSlotWidth = chartWidth / data.length;
  const barWidth = Math.min(48, barSlotWidth * 0.55);

  // Generate trend line points
  const points = data.map((d, i) => {
    const x = paddingLeft + i * barSlotWidth + barSlotWidth / 2;
    const y = paddingTop + chartHeight - (d.volume / maxVolume) * chartHeight;
    return { x, y, data: d, index: i };
  });

  const pathD = points.reduce((acc, curr, idx) => {
    return idx === 0 ? `M ${curr.x} ${curr.y}` : `${acc} L ${curr.x} ${curr.y}`;
  }, '');

  return (
    <div className="rounded-3xl bg-[#1e1f20] border border-[#333538] p-5 sm:p-6 shadow-sm flex flex-col gap-4 text-[#e3e3e3]">
      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-[#2d2f31] pb-3 flex-wrap gap-2">
        <div className="flex items-center gap-2.5">
          <div
            className={`p-2 rounded-xl border ${
              isMule
                ? 'bg-[#f28b82]/10 border-[#f28b82]/30 text-[#f28b82]'
                : 'bg-[#81c995]/10 border-[#81c995]/30 text-[#81c995]'
            }`}
          >
            <BarChart3 className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              Transaction Pattern Analysis (6-Month Rolling)
              <span
                className={`text-xs font-mono font-medium px-2.5 py-0.5 rounded-full border ${
                  isMule
                    ? 'bg-[#f28b82]/10 text-[#f28b82] border-[#f28b82]/30'
                    : 'bg-[#81c995]/10 text-[#81c995] border-[#81c995]/30'
                }`}
              >
                {isMule ? 'High Variance / Mule Signature' : 'Gaussian Retail Curve (Natural)'}
              </span>
            </h3>
            <p className="text-xs text-[#8e918f]">
              Entity: <span className="font-medium text-white">{merchantName}</span> &bull; 180-Day Volumetric &amp; Velocity Dispersion
            </p>
          </div>
        </div>

        {/* Forensic Stability Indicators */}
        <div className="flex items-center gap-3 text-xs font-mono">
          <div className="flex items-center gap-1.5 bg-[#131314] px-3 py-1 rounded-full border border-[#2d3036]">
            <Activity className="h-3.5 w-3.5 text-[#8e918f]" />
            <span className="text-[#8e918f]">Velocity Index:</span>
            <span className={isMule ? 'text-[#f28b82] font-semibold' : 'text-[#81c995] font-semibold'}>
              {isMule ? '8.4% (Severe Spike)' : '97.2% (Stable)'}
            </span>
          </div>

          <div className="flex items-center gap-1.5 bg-[#131314] px-3 py-1 rounded-full border border-[#2d3036]">
            {isMule ? (
              <TrendingUp className="h-3.5 w-3.5 text-[#f28b82] animate-pulse" />
            ) : (
              <ShieldCheck className="h-3.5 w-3.5 text-[#81c995]" />
            )}
            <span className="text-[#8e918f]">Dormancy Risk:</span>
            <span className={isMule ? 'text-[#f28b82] font-semibold' : 'text-[#81c995] font-semibold'}>
              {isMule ? '90-Day Dormant' : 'Zero Dormancy'}
            </span>
          </div>
        </div>
      </div>

      {/* PURE SVG BAR & LINE CHART */}
      <div className="relative w-full overflow-x-auto custom-scrollbar">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-auto min-w-[620px] select-none"
        >
          {/* Subtle Grid Lines (Horizontal) */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
            const y = paddingTop + chartHeight * (1 - ratio);
            return (
              <g key={idx}>
                <line
                  x1={paddingLeft}
                  y1={y}
                  x2={svgWidth - paddingRight}
                  y2={y}
                  stroke="#1e293b"
                  strokeDasharray="3 3"
                  strokeWidth="1"
                />
                <text
                  x={paddingLeft - 8}
                  y={y + 3}
                  textAnchor="end"
                  fontSize="10"
                  fontFamily="monospace"
                  fill="#64748b"
                >
                  {ratio === 0 ? '0' : ratio === 1 ? 'MAX' : `${(ratio * 100).toFixed(0)}%`}
                </text>
              </g>
            );
          })}

          {/* SVG BARS */}
          {data.map((d, i) => {
            const x = paddingLeft + i * barSlotWidth + (barSlotWidth - barWidth) / 2;
            const fullHeight = (d.volume / maxVolume) * chartHeight;
            const currentHeight = mounted ? Math.max(3, fullHeight) : 0;
            const y = paddingTop + chartHeight - currentHeight;
            const isHovered = hoveredIdx === i;

            // Bar coloring: emerald for normal, crimson for spike
            const barFill = d.isSpike
              ? 'url(#roseGradient)'
              : 'url(#emeraldGradient)';
            const barBorder = d.isSpike ? '#f43f5e' : '#10b981';

            return (
              <g
                key={d.month}
                className="cursor-pointer transition-opacity"
                onMouseEnter={() => setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(null)}
              >
                {/* Background hover highlight strip */}
                <rect
                  x={paddingLeft + i * barSlotWidth}
                  y={paddingTop}
                  width={barSlotWidth}
                  height={chartHeight}
                  fill={isHovered ? 'rgba(255,255,255,0.03)' : 'transparent'}
                />

                {/* Animated Bar */}
                <rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={currentHeight}
                  rx="4"
                  fill={barFill}
                  stroke={isHovered ? '#ffffff' : barBorder}
                  strokeWidth={isHovered ? '2' : '1'}
                  opacity={hoveredIdx !== null && !isHovered ? 0.45 : 0.9}
                  style={{
                    transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                />

                {/* X-Axis Month Label */}
                <text
                  x={x + barWidth / 2}
                  y={svgHeight - 12}
                  textAnchor="middle"
                  fontSize="11"
                  fontFamily="monospace"
                  fill={isHovered ? '#f1f5f9' : '#94a3b8'}
                  fontWeight={isHovered ? 'bold' : 'normal'}
                >
                  {d.month.split(' ')[0]}
                </text>
              </g>
            );
          })}

          {/* SVG TREND LINE */}
          <path
            d={pathD}
            fill="none"
            stroke={isMule ? '#fb7185' : '#34d399'}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.85"
            style={{
              transition: 'all 0.6s ease',
            }}
          />

          {/* TREND DOTS */}
          {points.map((pt) => {
            const isHovered = hoveredIdx === pt.index;
            const dotColor = pt.data.isSpike ? '#f43f5e' : '#10b981';
            return (
              <circle
                key={pt.index}
                cx={pt.x}
                cy={pt.y}
                r={isHovered ? 6 : 4}
                fill={dotColor}
                stroke="#0f172a"
                strokeWidth="2"
                style={{
                  transition: 'all 0.2s ease',
                  filter: isHovered ? `drop-shadow(0 0 6px ${dotColor})` : 'none',
                }}
              />
            );
          })}

          {/* SVG GRADIENT DEFINITIONS */}
          <defs>
            <linearGradient id="emeraldGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#047857" stopOpacity="0.25" />
            </linearGradient>
            <linearGradient id="roseGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#881337" stopOpacity="0.3" />
            </linearGradient>
          </defs>
        </svg>

        {/* Hover Tooltip Overlay */}
        {hoveredIdx !== null && data[hoveredIdx] && (
          <div
            className="absolute z-20 p-3 rounded-lg bg-slate-950/95 border border-slate-700 shadow-2xl text-xs text-slate-200 pointer-events-none backdrop-blur-md animate-fade-in"
            style={{
              left: `${Math.min(
                80,
                Math.max(10, ((hoveredIdx + 0.5) / data.length) * 100)
              )}%`,
              top: '10px',
              transform: 'translateX(-50%)',
            }}
          >
            <div className="flex items-center justify-between gap-4 border-b border-slate-800 pb-1.5 mb-1.5">
              <span className="font-bold text-slate-100 flex items-center gap-1">
                <Calendar className="h-3 w-3 text-slate-400" />
                {data[hoveredIdx].month}
              </span>
              <span
                className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                  data[hoveredIdx].isSpike
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                }`}
              >
                {data[hoveredIdx].status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-x-4 gap-y-1 font-mono text-[11px]">
              <div>
                <span className="text-slate-400 block text-[10px]">Total Volume:</span>
                <span className="font-bold text-white text-xs">
                  {data[hoveredIdx].formattedVolume}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Txn Count:</span>
                <span className="text-slate-200">
                  {data[hoveredIdx].txnCount.toLocaleString()} txns
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Avg Ticket:</span>
                <span className="text-slate-200">{data[hoveredIdx].avgTicket}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Anomaly Score:</span>
                <span
                  className={
                    data[hoveredIdx].isSpike
                      ? 'text-rose-400 font-bold'
                      : 'text-emerald-400'
                  }
                >
                  {data[hoveredIdx].isSpike ? '98.4% (Severe)' : '0.0% (Clean)'}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Forensic interpretation footer banner */}
      <div className="pt-2 border-t border-[#2d3036] flex items-center justify-between flex-wrap gap-2 text-xs">
        <div className="flex items-center gap-2">
          {isMule ? (
            <span className="flex items-center gap-1.5 text-[#f28b82] font-medium font-mono">
              <AlertTriangle className="h-4 w-4" />
              ANOMALOUS PASS-THROUGH SPIKE: 90-day dormant shell activated for high-volume pass-through.
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-[#81c995] font-medium font-mono">
              <ShieldCheck className="h-4 w-4" />
              VERIFIED RETAIL DISTRIBUTION: Consistent monthly turnover across 750+ unique counterparties.
            </span>
          )}
        </div>
        <span className="text-[11px] font-mono text-[#8e918f]">
          Source: NPCI / MAS Clearinghouse Transaction Logs
        </span>
      </div>
    </div>
  );
};

export default TransactionGraph;
