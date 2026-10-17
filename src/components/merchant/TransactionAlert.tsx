import React from 'react';
import {
  AlertTriangle,
  Clock,
  ShieldAlert,
  FileCheck2,
  Layers,
  ArrowRight,
  Landmark,
} from 'lucide-react';
import type { FrozenTransaction, JurisdictionConfig } from '../../types';
import { formatCurrency } from '../../data/jurisdictions';

export interface TransactionAlertProps {
  transaction: FrozenTransaction;
  jurisdiction: JurisdictionConfig;
  className?: string;
}

/**
 * Calculates a friendly "time since" string from an ISO timestamp.
 */
function getTimeSince(timestamp: string): string {
  try {
    const diffMs = Date.now() - new Date(timestamp).getTime();
    if (isNaN(diffMs)) return 'Recently frozen';

    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) {
      return `${diffDays}d ${diffHours % 24}h ago`;
    }
    if (diffHours > 0) {
      return `${diffHours}h ago`;
    }
    const diffMins = Math.floor(diffMs / (1000 * 60));
    return `${Math.max(1, diffMins)}m ago`;
  } catch {
    return 'Active lien';
  }
}

export const TransactionAlert: React.FC<TransactionAlertProps> = ({
  transaction,
  jurisdiction,
  className = '',
}) => {
  const formattedAmount = formatCurrency(transaction.amount, transaction.jurisdiction);
  const timeSince = getTimeSince(transaction.timestamp);
  const formattedTime = new Date(transaction.timestamp).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
  const formattedDate = new Date(transaction.timestamp).toLocaleDateString([], {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div
      className={`relative overflow-hidden rounded-xl border border-rose-500/50 bg-gradient-to-br from-rose-950/40 via-slate-900/90 to-black p-4 shadow-xl shadow-rose-950/20 backdrop-blur-md transition-all duration-300 hover:border-rose-500/70 ${className}`}
    >
      {/* Background ambient crimson glow */}
      <div className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-rose-600/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-rose-500/10 blur-2xl" />

      {/* Header Row: Warning Icon, Title, and Hop Chain Layer Badge */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          {/* Animated Pulsing Warning Icon */}
          <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-rose-500/20 border border-rose-500/40 text-rose-400">
            <span className="absolute -inset-0.5 rounded-lg bg-rose-500/30 animate-ping opacity-75" />
            <AlertTriangle className="relative h-5 w-5 text-rose-400 animate-pulse" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-rose-400">
                Lien Hold Active
              </span>
              <span className="inline-flex items-center rounded-full bg-rose-500/20 px-2 py-0.5 text-[10px] font-medium text-rose-300 border border-rose-500/30">
                FROZEN
              </span>
            </div>
            <h3 className="text-sm font-bold text-white tracking-tight">
              Cyber Police Inflow Hold
            </h3>
          </div>
        </div>

        {/* Hop Chain Layer Mini Badge: 'Layer-3 → You' */}
        <div className="flex items-center gap-1.5 rounded-md border border-rose-500/30 bg-rose-950/50 px-2.5 py-1 text-xs font-medium text-rose-200">
          <Layers className="h-3.5 w-3.5 text-rose-400" />
          <span>Layer-{transaction.layerNumber}</span>
          <ArrowRight className="h-3 w-3 text-rose-400" />
          <span className="font-semibold text-rose-300">You</span>
        </div>
      </div>

      {/* Main Frozen Amount Display */}
      <div className="mt-3.5 flex items-baseline justify-between rounded-lg bg-black/40 border border-white/5 p-3">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-wider text-slate-400">
            Frozen Inflow Amount
          </p>
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span className="text-2xl font-black tracking-tight text-white font-mono">
              {formattedAmount}
            </span>
            <span className="text-xs font-semibold text-rose-400 font-mono">
              ({transaction.currency})
            </span>
          </div>
        </div>

        <div className="text-right">
          <div className="flex items-center justify-end gap-1 text-[11px] font-medium text-slate-400">
            <Clock className="h-3 w-3 text-rose-400" />
            <span>{timeSince}</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-0.5">
            {formattedDate} • {formattedTime}
          </p>
        </div>
      </div>

      {/* Freeze Reason Alert Box */}
      <div className="mt-3 rounded-lg border border-rose-500/20 bg-rose-950/30 p-2.5 text-xs text-rose-200/90 leading-relaxed">
        <p className="font-medium flex items-center gap-1.5 text-rose-300 mb-0.5">
          <ShieldAlert className="h-3.5 w-3.5 text-rose-400 shrink-0" />
          <span>Notice of Automated Lien:</span>
        </p>
        <p className="text-slate-300 text-[11.5px] pl-5">
          {transaction.frozenReason}
        </p>
      </div>

      {/* Footer Metadata Grid: Transaction ID, Regulatory Ref, SLA Days */}
      <div className="mt-3 grid grid-cols-2 gap-2 text-[11px] border-t border-white/5 pt-2.5 text-slate-400">
        <div className="truncate">
          <span className="text-slate-500 block text-[10px] uppercase tracking-wider">
            Transaction ID
          </span>
          <span className="font-mono text-slate-200 font-medium">
            {transaction.id}
          </span>
        </div>

        <div className="truncate text-right">
          <span className="text-slate-500 block text-[10px] uppercase tracking-wider flex items-center justify-end gap-1">
            <Landmark className="h-2.5 w-2.5 text-slate-400" />
            Regulatory Ref
          </span>
          <span
            className="font-mono text-slate-200 font-medium truncate block"
            title={transaction.regulatoryReference}
          >
            {transaction.regulatoryReference}
          </span>
        </div>
      </div>

      {/* Regulatory Framework SLA Badge */}
      <div className="mt-2.5 flex items-center justify-between text-[10.5px] rounded-md bg-white/[0.03] px-2.5 py-1.5 border border-white/5">
        <div className="flex items-center gap-1.5 text-slate-300">
          <FileCheck2 className="h-3 w-3 text-emerald-400" />
          <span className="truncate">{jurisdiction.regulatoryBody}</span>
        </div>
        <span className="text-amber-400/90 font-mono font-medium">
          SLA: {jurisdiction.slaCustomerDays}d safe harbor
        </span>
      </div>
    </div>
  );
};

export default TransactionAlert;
