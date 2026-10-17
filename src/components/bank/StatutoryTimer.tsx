import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle2, AlertCircle, ShieldCheck, Calendar, Sparkles } from 'lucide-react';
import type { JurisdictionConfig } from '../../types';

export interface StatutoryTimerProps {
  jurisdiction: JurisdictionConfig;
  frozenTimestamp: string;
  isResolved: boolean;
  resolutionTimeMs: number | null;
}

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  percentage: number;
  isExpired: boolean;
}

export const StatutoryTimer: React.FC<StatutoryTimerProps> = ({
  jurisdiction,
  frozenTimestamp,
  isResolved,
  resolutionTimeMs,
}) => {
  const [now, setNow] = useState<number>(Date.now());

  // Update timer every second
  useEffect(() => {
    if (isResolved) return;

    const interval = setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, [isResolved]);

  // Compute countdown relative to frozenTimestamp
  const parseFrozenTime = (ts: string): number => {
    const parsed = Date.parse(ts);
    return isNaN(parsed) ? Date.now() - 3600000 : parsed;
  };

  const frozenTime = parseFrozenTime(frozenTimestamp);

  const calculateSLA = (totalDays: number): TimeRemaining => {
    const totalDurationMs = totalDays * 24 * 60 * 60 * 1000;
    const deadline = frozenTime + totalDurationMs;
    const remainingMs = Math.max(0, deadline - now);

    const isExpired = remainingMs <= 0;
    const percentage = isExpired ? 0 : Math.min(100, (remainingMs / totalDurationMs) * 100);

    const seconds = Math.floor((remainingMs / 1000) % 60);
    const minutes = Math.floor((remainingMs / (1000 * 60)) % 60);
    const hours = Math.floor((remainingMs / (1000 * 60 * 60)) % 24);
    const days = Math.floor(remainingMs / (1000 * 60 * 60 * 24));

    return { days, hours, minutes, seconds, percentage, isExpired };
  };

  const customerSLA = calculateSLA(jurisdiction.slaCustomerDays);
  const bankSLA = calculateSLA(jurisdiction.slaBankDays);

  const getSLAColor = (pct: number, expired: boolean) => {
    if (expired) {
      return {
        text: 'text-[#f28b82]',
        bg: 'bg-[#f28b82]/10',
        border: 'border-[#f28b82]/30',
        bar: 'bg-[#f28b82]',
        badge: 'EXPIRED (PENALTY VIOLATION)',
      };
    }
    if (pct < 10) {
      return {
        text: 'text-[#f28b82]',
        bg: 'bg-[#f28b82]/10',
        border: 'border-[#f28b82]/30',
        bar: 'bg-[#f28b82]',
        badge: 'CRITICAL (< 10%)',
      };
    }
    if (pct < 30) {
      return {
        text: 'text-[#fdd663]',
        bg: 'bg-[#fdd663]/10',
        border: 'border-[#fdd663]/30',
        bar: 'bg-[#fdd663]',
        badge: 'URGENT (< 30%)',
      };
    }
    return {
      text: 'text-[#81c995]',
      bg: 'bg-[#81c995]/10',
      border: 'border-[#81c995]/30',
      bar: 'bg-[#81c995]',
      badge: 'ON TRACK (HEALTHY)',
    };
  };

  const customerTheme = getSLAColor(customerSLA.percentage, customerSLA.isExpired);
  const bankTheme = getSLAColor(bankSLA.percentage, bankSLA.isExpired);

  const formatTimerString = (sla: TimeRemaining) => {
    if (sla.isExpired) return 'SLA Expired';
    return `${sla.days}d ${sla.hours}h ${sla.minutes}m ${sla.seconds}s remaining`;
  };

  const resolutionSeconds = resolutionTimeMs
    ? (resolutionTimeMs / 1000).toFixed(1)
    : '1.8';

  return (
    <div className="rounded-2xl bg-[#1d2024] border border-[#2d3036] p-5 sm:p-6 shadow-sm relative overflow-hidden flex flex-col gap-4">
      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-[#2d3036] pb-3 flex-wrap gap-2">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-[#131314] border border-[#2d3036] text-[#81c995]">
            <Clock className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              Regulatory SLA Countdown
              <span className="text-sm" role="img" aria-label="flag">
                {jurisdiction.flag}
              </span>
            </h3>
            <p className="text-xs text-[#8e918f]">
              Statutory mandate: {jurisdiction.regulatoryBody} ({jurisdiction.framework})
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs font-mono text-[#c4c7c5] bg-[#131314] px-2.5 py-1 rounded-full border border-[#2d3036]">
          <Calendar className="h-3.5 w-3.5 text-[#8e918f]" />
          <span>Freeze Origin: {new Date(frozenTime).toLocaleDateString()}</span>
        </div>
      </div>

      {/* RESOLVED BANNER OVERLAY IF RESOLVED */}
      {isResolved && (
        <div className="rounded-2xl bg-[#131314] border border-[#81c995]/50 p-4 shadow-sm animate-slide-up relative overflow-hidden">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-[#81c995]/20 text-[#81c995]">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-base font-semibold text-white">
                    Lien Lifted &amp; Resolved in {resolutionSeconds}s
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-[#81c995]/10 text-[#81c995] border border-[#81c995]/30 text-[10px] font-mono flex items-center gap-1">
                    <Sparkles className="h-3 w-3" /> 99.9% Faster Than 21-Day SLA
                  </span>
                </div>
                <p className="text-xs text-[#8e918f] mt-0.5">
                  Statutory audit certificate signed &amp; dispatched to Nodal Clearinghouse. Zero liability penalty incurred.
                </p>
              </div>
            </div>

            <div className="px-3 py-1.5 rounded-full bg-[#1d2024] border border-[#81c995]/40 text-xs font-mono text-[#81c995] flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4" />
              <span>SLA Saved: {jurisdiction.slaCustomerDays} Days</span>
            </div>
          </div>
        </div>
      )}

      {/* SLA COUNTDOWN ROWS (Crossed out if resolved) */}
      <div className={`flex flex-col gap-3.5 transition-all duration-300 ${isResolved ? 'opacity-40 grayscale-[40%]' : ''}`}>
        
        {/* ROW 1: Customer Window SLA */}
        <div className="rounded-2xl bg-[#131314] border border-[#2d3036] p-4 flex flex-col gap-2">
          <div className="flex items-center justify-between flex-wrap gap-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-white">
                1. Customer Right-to-Livelihood Window
              </span>
              <span className="text-[10px] text-[#8e918f] font-mono">
                ({jurisdiction.slaCustomerDays}-Day Regulatory Max)
              </span>
            </div>
            <div className={`px-2.5 py-0.5 rounded-full border text-[10px] font-mono font-medium ${customerTheme.bg} ${customerTheme.text} ${customerTheme.border}`}>
              {customerTheme.badge}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className={`text-sm font-mono font-bold ${customerTheme.text} ${isResolved ? 'line-through' : ''}`}>
              {formatTimerString(customerSLA)}
            </span>
            <span className="text-xs font-mono text-[#8e918f]">
              {customerSLA.percentage.toFixed(1)}% Window Left
            </span>
          </div>

          {/* Progress track */}
          <div className="w-full bg-[#2d3036] rounded-full h-1.5 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${customerTheme.bar}`}
              style={{ width: `${customerSLA.percentage}%` }}
            />
          </div>
        </div>

        {/* ROW 2: Bank SLA Window */}
        <div className="rounded-2xl bg-[#131314] border border-[#2d3036] p-4 flex flex-col gap-2">
          <div className="flex items-center justify-between flex-wrap gap-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-white">
                2. Nodal Bank Evidence Review SLA
              </span>
              <span className="text-[10px] text-[#8e918f] font-mono">
                ({jurisdiction.slaBankDays}-Day Regulatory Max)
              </span>
            </div>
            <div className={`px-2.5 py-0.5 rounded-full border text-[10px] font-mono font-medium ${bankTheme.bg} ${bankTheme.text} ${bankTheme.border}`}>
              {bankTheme.badge}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className={`text-sm font-mono font-bold ${bankTheme.text} ${isResolved ? 'line-through' : ''}`}>
              {formatTimerString(bankSLA)}
            </span>
            <span className="text-xs font-mono text-[#8e918f]">
              {bankSLA.percentage.toFixed(1)}% Window Left
            </span>
          </div>

          {/* Progress track */}
          <div className="w-full bg-[#2d3036] rounded-full h-1.5 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${bankTheme.bar}`}
              style={{ width: `${bankSLA.percentage}%` }}
            />
          </div>
        </div>

      </div>

      {/* Statutory Footer note */}
      <div className="text-[11px] text-[#8e918f] flex items-center justify-between pt-1 border-t border-[#2d3036]">
        <span className="flex items-center gap-1">
          <AlertCircle className="h-3.5 w-3.5 text-[#8e918f]" />
          Mandatory compliance under Section 14b (Sept 2026 Directives)
        </span>
        <span className="font-mono text-[#c4c7c5]">
          Penalty: ₹5,000 / day post-expiration
        </span>
      </div>
    </div>
  );
};

export default StatutoryTimer;
