import React from 'react';
import type { DemoScenario } from '../../types';
import { formatCurrency } from '../../data/jurisdictions';
import { CheckCircle2, AlertOctagon } from 'lucide-react';

export interface ScenarioCardsProps {
  scenarios: DemoScenario[];
  activeScenarioId: string | null;
  onSelect: (id: string) => void;
  className?: string;
}

/**
 * Returns emoji icon and simplified label for the scenario
 */
function getScenarioMeta(scenario: DemoScenario): {
  emoji: string;
  shortTitle: string;
  subtitle: string;
  isInnocent: boolean;
} {
  if (scenario.id === 'ramesh-medicals') {
    return {
      emoji: '🏥',
      shortTitle: 'Ramesh Medicals',
      subtitle: 'Medical Store Hold',
      isInnocent: true,
    };
  }
  if (scenario.id === 'uncle-tan-chicken-rice') {
    return {
      emoji: '🍗',
      shortTitle: 'Uncle Tan Chicken Rice',
      subtitle: 'Hawker Hold',
      isInnocent: true,
    };
  }
  if (scenario.id === 'rajesh-trading') {
    return {
      emoji: '🚩',
      shortTitle: 'Rajesh Trading',
      subtitle: 'Mule Detection',
      isInnocent: false,
    };
  }

  // Fallback
  const isInnocent = scenario.expectedCLS.recommendation === 'lift_hold';
  return {
    emoji: isInnocent ? '🏪' : '⚠️',
    shortTitle: scenario.name.split('(')[0].trim(),
    subtitle: `${scenario.transaction.currency} ${scenario.transaction.amount}`,
    isInnocent,
  };
}

export const ScenarioCards: React.FC<ScenarioCardsProps> = ({
  scenarios,
  activeScenarioId,
  onSelect,
  className = '',
}) => {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-3 gap-2.5 ${className}`}>
      {scenarios.map((scenario) => {
        const isActive = activeScenarioId === scenario.id;
        const meta = getScenarioMeta(scenario);
        const formattedAmount = formatCurrency(
          scenario.transaction.amount,
          scenario.transaction.jurisdiction
        );

        return (
          <button
            key={scenario.id}
            type="button"
            onClick={() => onSelect(scenario.id)}
            className={`group relative flex flex-col justify-between rounded-xl p-3 text-left transition-all duration-200 cursor-pointer hover:scale-[1.02] active:scale-[0.99] ${
              isActive
                ? 'border-2 border-emerald-500 bg-gradient-to-b from-emerald-950/40 via-slate-900/90 to-slate-950 shadow-lg shadow-emerald-950/40 ring-1 ring-emerald-500/50'
                : 'border border-slate-800 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-900/90 shadow-md'
            }`}
          >
            {/* Top Row: Emoji & Status Badge */}
            <div className="flex items-start justify-between gap-1 w-full">
              <span className="text-2xl select-none" role="img" aria-label={meta.shortTitle}>
                {meta.emoji}
              </span>

              {/* Status Badge: Innocent (Green) vs Mule (Red) */}
              {meta.isInnocent ? (
                <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-400">
                  <CheckCircle2 className="h-2.5 w-2.5" />
                  Innocent
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 rounded-full border border-rose-500/30 bg-rose-500/10 px-2 py-0.5 text-[10px] font-semibold text-rose-400">
                  <AlertOctagon className="h-2.5 w-2.5" />
                  Mule
                </span>
              )}
            </div>

            {/* Middle: Title & Subtitle */}
            <div className="mt-2 w-full">
              <h4
                className={`text-xs font-bold truncate transition-colors ${
                  isActive ? 'text-emerald-300' : 'text-slate-200 group-hover:text-white'
                }`}
              >
                {meta.shortTitle}
              </h4>
              <p className="text-[11px] text-slate-400 truncate mt-0.5">{meta.subtitle}</p>
            </div>

            {/* Bottom Row: Formatted Amount and Layer */}
            <div className="mt-2.5 flex items-baseline justify-between border-t border-white/5 pt-2 w-full">
              <span className="font-mono text-xs font-bold text-white tracking-tight">
                {formattedAmount}
              </span>
              <span className="text-[9.5px] font-mono text-slate-400 uppercase">
                L{scenario.transaction.layerNumber} Hold
              </span>
            </div>

            {/* Active Indicator Bar on Bottom */}
            {isActive && (
              <span className="absolute -bottom-[2px] left-3 right-3 h-[2px] rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
            )}
          </button>
        );
      })}
    </div>
  );
};

export default ScenarioCards;
