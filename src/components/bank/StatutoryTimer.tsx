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
        text: 'text-rose-400',
        bg: 'bg-rose-500/20',
        border: 'border-rose-500/40',
        bar: 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)]',
        badge: 'EXPIRED (PENALTY VIOLATION)',
      };
    }
    if (pct < 10) {
      return {
        text: 'text-rose-400',
        bg: 'bg-rose-500/20',
        border: 'border-rose-500/40',
        bar: 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)]',
        badge: 'CRITICAL (< 10%)',
      };
    }
    if (pct < 30) {
      return {
        text: 'text-amber-400',
        bg: 'bg-amber-500/20',
        border: 'border-amber-500/40',
        bar: 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.6)]',
        badge: 'URGENT (< 30%)',
      };
    }
    return {
      text: 'text-emerald-400',
      bg: 'bg-emerald-500/20',
      border: 'border-emerald-500/40',
      bar: 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]',
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
    <div className="rounded-xl bg-slate-900/80 border border-slate-700/50 p-5 sm:p-6 shadow-xl backdrop-blur-md relative overflow-hidden flex flex-col gap-4">
      {/* Background ambient glow */}
      <div className="absolute -bottom-16 -right-16 w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 flex-wrap gap-2">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <Clock className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-100 flex items-center gap-2">
              Regulatory SLA Countdown
              <span className="text-sm" role="img" aria-label="flag">
                {jurisdiction.flag}
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Statutory mandate: {jurisdiction.regulatoryBody} ({jurisdiction.framework})
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs font-mono text-slate-300 bg-slate-950 px-2.5 py-1 rounded-md border border-slate-800">
          <Calendar className="h-3.5 w-3.5 text-slate-400" />
          <span>Freeze Origin: {new Date(frozenTime).toLocaleDateString()}</span>
        </div>
      </div>

      {/* RESOLVED BANNER OVERLAY IF RESOLVED */}
      {isResolved && (
        <div className="rounded-xl bg-gradient-to-r from-emerald-950/90 via-emerald-900/60 to-slate-950 border border-emerald-500/60 p-4 shadow-[0_0_25px_rgba(16,185,129,0.3)] animate-slide-up relative overflow-hidden">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 animate-bounce">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-base font-bold text-emerald-300">
                    Lien Lifted &amp; Resolved in {resolutionSeconds}s
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-mono flex items-center gap-1">
                    <Sparkles className="h-3 w-3" /> 99.9% Faster Than 21-Day SLA
                  </span>
                </div>
                <p className="text-xs text-emerald-400/80">
                  Statutory audit certificate signed &amp; dispatched to Nodal Clearinghouse. Zero liability penalty incurred.
                </p>
              </div>
            </div>

            <div className="px-3 py-1.5 rounded-lg bg-emerald-950/80 border border-emerald-500/40 text-xs font-mono text-emerald-300 flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4" />
              <span>SLA Saved: {jurisdiction.slaCustomerDays} Days</span>
            </div>
          </div>
        </div>
      )}

      {/* SLA COUNTDOWN ROWS (Crossed out if resolved) */}
      <div className={`flex flex-col gap-3.5 transition-all duration-300 ${isResolved ? 'opacity-40 grayscale-[40%]' : ''}`}>
        
        {/* ROW 1: Customer Window SLA */}
        <div className="rounded-lg bg-slate-950/70 border border-slate-800 p-3.5 flex flex-col gap-2">
          <div className="flex items-center justify-between flex-wrap gap-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-200">
                1. Customer Right-to-Livelihood Window
              </span>
              <span className="text-[10px] text-slate-500 font-mono">
                ({jurisdiction.slaCustomerDays}-Day Regulatory Max)
              </span>
            </div>
            <div className={`px-2 py-0.5 rounded border text-[10px] font-mono font-semibold ${customerTheme.bg} ${customerTheme.text} ${customerTheme.border}`}>
              {customerTheme.badge}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className={`text-sm font-mono font-bold ${customerTheme.text} ${isResolved ? 'line-through' : ''}`}>
              {formatTimerString(customerSLA)}
            </span>
            <span className="text-xs font-mono text-slate-400">
              {customerSLA.percentage.toFixed(1)}% Window Left
            </span>
          </div>

          {/* Progress track */}
          <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${customerTheme.bar}`}
              style={{ width: `${customerSLA.percentage}%` }}
            />
          </div>
        </div>

        {/* ROW 2: Bank SLA Window */}
        <div className="rounded-lg bg-slate-950/70 border border-slate-800 p-3.5 flex flex-col gap-2">
          <div className="flex items-center justify-between flex-wrap gap-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-200">
                2. Nodal Bank Evidence Review SLA
              </span>
              <span className="text-[10px] text-slate-500 font-mono">
                ({jurisdiction.slaBankDays}-Day Regulatory Max)
              </span>
            </div>
            <div className={`px-2 py-0.5 rounded border text-[10px] font-mono font-semibold ${bankTheme.bg} ${bankTheme.text} ${bankTheme.border}`}>
              {bankTheme.badge}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className={`text-sm font-mono font-bold ${bankTheme.text} ${isResolved ? 'line-through' : ''}`}>
              {formatTimerString(bankSLA)}
            </span>
            <span className="text-xs font-mono text-slate-400">
              {bankSLA.percentage.toFixed(1)}% Window Left
            </span>
          </div>

          {/* Progress track */}
          <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${bankTheme.bar}`}
              style={{ width: `${bankSLA.percentage}%` }}
            />
          </div>
        </div>

      </div>

      {/* Statutory Footer note */}
      <div className="text-[11px] text-slate-500 flex items-center justify-between pt-1 border-t border-slate-800">
        <span className="flex items-center gap-1">
          <AlertCircle className="h-3.5 w-3.5 text-slate-500" />
          Mandatory compliance under Section 14b (Sept 2026 Directives)
        </span>
        <span className="font-mono text-slate-400">
          Penalty: ₹5,000 / day post-expiration
        </span>
      </div>
    </div>
  );
};

export default StatutoryTimer;
