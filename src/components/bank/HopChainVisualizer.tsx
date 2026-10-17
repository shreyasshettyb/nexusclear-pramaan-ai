import React, { useState } from 'react';
import { User, Skull, Store, ArrowRight, AlertTriangle, ShieldCheck, Clock, Layers, Info } from 'lucide-react';
import type { HopNode } from '../../types';

export interface HopChainVisualizerProps {
  hopChain: HopNode[];
  currentMerchant?: string;
}

export const HopChainVisualizer: React.FC<HopChainVisualizerProps> = ({
  hopChain,
  currentMerchant,
}) => {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);

  const selectedNode = hopChain.find((n) => n.id === selectedNodeId) || null;

  // Node styling and iconography based on node type and status
  const getNodeConfig = (node: HopNode, isTargetMerchant: boolean) => {
    switch (node.type) {
      case 'victim':
        return {
          icon: User,
          bgClass: 'bg-rose-950/80',
          borderClass: 'border-rose-500/70',
          textClass: 'text-rose-300',
          badgeClass: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
          glowClass: 'shadow-[0_0_15px_rgba(244,63,94,0.35)]',
          typeName: 'Reporting Victim',
          indicatorColor: '#f43f5e',
        };
      case 'mule_l1':
        return {
          icon: Skull,
          bgClass: 'bg-orange-950/80',
          borderClass: 'border-orange-500/70',
          textClass: 'text-orange-300',
          badgeClass: 'bg-orange-500/20 text-orange-300 border-orange-500/40',
          glowClass: 'shadow-[0_0_15px_rgba(249,115,22,0.35)]',
          typeName: 'Layer-1 Mule (Pass-Through)',
          indicatorColor: '#f97316',
        };
      case 'mule_l2':
        return {
          icon: AlertTriangle,
          bgClass: 'bg-amber-950/80',
          borderClass: 'border-amber-500/70',
          textClass: 'text-amber-300',
          badgeClass: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
          glowClass: 'shadow-[0_0_15px_rgba(245,158,11,0.35)]',
          typeName: 'Layer-2 Mule (Aggregator)',
          indicatorColor: '#f59e0b',
        };
      case 'mule_l3':
        return {
          icon: AlertTriangle,
          bgClass: 'bg-yellow-950/80',
          borderClass: 'border-yellow-500/70',
          textClass: 'text-yellow-300',
          badgeClass: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40',
          glowClass: 'shadow-[0_0_15px_rgba(234,179,8,0.35)]',
          typeName: 'Layer-3 Mule Sub-Node',
          indicatorColor: '#eab308',
        };
      case 'merchant':
      default: {
        const isCleared = node.status === 'cleared';
        return {
          icon: isCleared ? ShieldCheck : Store,
          bgClass: isCleared ? 'bg-emerald-950/80' : 'bg-amber-950/80',
          borderClass: isCleared
            ? 'border-emerald-500/80 ring-2 ring-emerald-500/40'
            : isTargetMerchant
            ? 'border-amber-500/80 ring-2 ring-amber-500/40'
            : 'border-slate-600',
          textClass: isCleared ? 'text-emerald-300' : 'text-amber-300',
          badgeClass: isCleared
            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
            : 'bg-amber-500/20 text-amber-300 border-amber-500/40',
          glowClass: isCleared
            ? 'shadow-[0_0_20px_rgba(16,185,129,0.45)]'
            : 'shadow-[0_0_20px_rgba(245,158,11,0.35)]',
          typeName: isCleared ? 'Verified Merchant (Safe Harbor)' : 'Target Terminal POS (Under Review)',
          indicatorColor: isCleared ? '#10b981' : '#f59e0b',
        };
      }
    }
  };

  const formatAmount = (num: number) => {
    return num.toLocaleString('en-US', {
      maximumFractionDigits: 2,
    });
  };

  return (
    <div className="rounded-xl bg-slate-900/80 border border-slate-700/50 p-5 sm:p-6 shadow-xl backdrop-blur-md relative overflow-hidden flex flex-col gap-4">
      {/* Background ambient glow */}
      <div className="absolute -top-24 -right-24 w-60 h-60 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <Layers className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-100 flex items-center gap-2">
              Transaction Hop-Chain Analysis
              <span className="text-xs font-mono font-medium px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                {hopChain.length} Hops Traced
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Interactive forensic graph tracing velocity &amp; multi-tier dispersal
            </p>
          </div>
        </div>

        {/* Legend indicator */}
        <div className="flex items-center gap-3 text-[11px] text-slate-400">
          <span className="inline-flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-rose-500" /> Victim
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-orange-500" /> Mule L1
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-amber-500" /> Mule L2
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-emerald-500" /> Merchant
          </span>
        </div>
      </div>

      {/* Graph Visualizer Canvas (Scrollable horizontally on smaller screens) */}
      <div className="relative w-full overflow-x-auto py-4 custom-scrollbar">
        <div className="min-w-[620px] flex items-center justify-between gap-1 sm:gap-2 px-2">
          {hopChain.map((node, index) => {
            const isLast = index === hopChain.length - 1;
            const isTargetMerchant =
              node.type === 'merchant' ||
              (currentMerchant ? node.label.toLowerCase().includes(currentMerchant.toLowerCase()) : false);
            const config = getNodeConfig(node, isTargetMerchant);
            const IconComponent = config.icon;
            const isHovered = hoveredNodeId === node.id;
            const isSelected = selectedNodeId === node.id;

            return (
              <React.Fragment key={node.id}>
                {/* Node Box */}
                <div
                  className="relative group flex-1 max-w-[210px] min-w-[145px]"
                  onMouseEnter={() => setHoveredNodeId(node.id)}
                  onMouseLeave={() => setHoveredNodeId(null)}
                  onClick={() => setSelectedNodeId(isSelected ? null : node.id)}
                >
                  <div
                    className={`cursor-pointer rounded-xl p-3.5 border transition-all duration-200 backdrop-blur-md relative ${config.bgClass} ${config.borderClass} ${
                      isSelected || isHovered ? `${config.glowClass} scale-[1.03] -translate-y-0.5` : 'hover:border-slate-500'
                    }`}
                  >
                    {/* Top status indicator strip */}
                    <div className="flex items-center justify-between gap-1 mb-2">
                      <span className={`text-[10px] font-mono uppercase px-1.5 py-0.5 rounded border font-semibold ${config.badgeClass}`}>
                        Hop #{index + 1}
                      </span>
                      <div className="flex items-center gap-1 text-[11px] font-mono text-slate-400">
                        <Clock className="h-3 w-3 text-slate-500" />
                        <span className="truncate max-w-[70px]" title={node.holdDuration}>
                          {node.holdDuration}
                        </span>
                      </div>
                    </div>

                    {/* Node Icon & Label */}
                    <div className="flex items-start gap-2 mb-2">
                      <div className={`p-1.5 rounded-lg border shrink-0 ${config.badgeClass}`}>
                        <IconComponent className="h-4 w-4" />
                      </div>
                      <div className="overflow-hidden">
                        <div className="text-xs font-semibold text-slate-200 truncate group-hover:text-white" title={node.label}>
                          {node.label}
                        </div>
                        <div className="text-[10px] text-slate-400 truncate">
                          {config.typeName}
                        </div>
                      </div>
                    </div>

                    {/* Financial Amount */}
                    <div className="pt-2 border-t border-slate-800/80 flex items-baseline justify-between">
                      <span className="text-[10px] text-slate-500 font-mono">Amount:</span>
                      <span className={`text-xs font-mono font-bold ${config.textClass}`}>
                        {formatAmount(node.amount)}
                      </span>
                    </div>

                    {/* Interactive Click hint */}
                    <div className="mt-1 text-[9px] text-slate-500 text-center flex items-center justify-center gap-0.5 opacity-60 group-hover:opacity-100 transition-opacity">
                      <Info className="h-2.5 w-2.5" />
                      <span>{isSelected ? 'Click to collapse' : 'Click to inspect'}</span>
                    </div>
                  </div>

                  {/* Micro Tooltip on Hover */}
                  {isHovered && !isSelected && (
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-40 w-64 p-3 rounded-lg bg-slate-950/95 border border-slate-700 shadow-2xl text-xs text-slate-200 pointer-events-none animate-fade-in backdrop-blur-md">
                      <div className="font-semibold text-slate-100 flex items-center justify-between border-b border-slate-800 pb-1.5 mb-1.5">
                        <span className="truncate">{node.label}</span>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-emerald-400">
                          {node.status}
                        </span>
                      </div>
                      {node.accountNumber && (
                        <div className="text-[11px] text-slate-400 font-mono mb-1">
                          Account: <span className="text-slate-300">{node.accountNumber}</span>
                        </div>
                      )}
                      <div className="text-[11px] text-slate-400 font-mono mb-1">
                        Dwell Time: <span className="text-slate-300 font-semibold">{node.holdDuration}</span>
                      </div>
                      {node.routingDetails && (
                        <div className="text-[11px] text-slate-400 italic line-clamp-3">
                          &ldquo;{node.routingDetails}&rdquo;
                        </div>
                      )}
                      {/* Arrow tip */}
                      <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800" />
                    </div>
                  )}
                </div>

                {/* Connecting Pipe / Arrow with animated dashes */}
                {!isLast && (
                  <div className="flex flex-col items-center justify-center px-1 shrink-0 relative">
                    {/* Animated SVG line connector */}
                    <svg width="40" height="24" className="overflow-visible">
                      {/* Base Line */}
                      <line
                        x1="2"
                        y1="12"
                        x2="32"
                        y2="12"
                        stroke="#334155"
                        strokeWidth="2"
                      />
                      {/* Flowing animated dash */}
                      <line
                        x1="2"
                        y1="12"
                        x2="32"
                        y2="12"
                        stroke="#10b981"
                        strokeWidth="2.5"
                        strokeDasharray="4 4"
                        className="animate-[dash_1s_linear_infinite]"
                      />
                    </svg>
                    <ArrowRight className="h-3.5 w-3.5 text-emerald-400 absolute right-0 translate-x-1" />
                    <span className="text-[9px] font-mono text-slate-500 mt-1">Dispersal</span>
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Expanded Node Inspector Drawer when clicked */}
      {selectedNode && (
        <div className="rounded-lg bg-slate-950/90 border border-slate-800 p-4 animate-slide-up flex flex-col gap-2">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                Detailed Node Telemetry
              </span>
              <h4 className="text-sm font-bold text-slate-100">{selectedNode.label}</h4>
            </div>
            <button
              onClick={() => setSelectedNodeId(null)}
              className="text-xs text-slate-400 hover:text-slate-200 px-2 py-0.5 rounded bg-slate-800/80 cursor-pointer"
            >
              Close
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1">
            <div className="rounded bg-slate-900/60 p-2.5 border border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase block font-mono">Account / Identifier</span>
              <span className="font-mono text-slate-200 font-semibold">{selectedNode.accountNumber || 'N/A (Masked)'}</span>
            </div>
            <div className="rounded bg-slate-900/60 p-2.5 border border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase block font-mono">Dwell Time / Velocity</span>
              <span className="font-mono text-amber-300 font-semibold">{selectedNode.holdDuration}</span>
            </div>
            <div className="rounded bg-slate-900/60 p-2.5 border border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase block font-mono">Lien Status</span>
              <span className="font-mono text-rose-300 uppercase font-semibold">{selectedNode.status}</span>
            </div>
          </div>

          {selectedNode.routingDetails && (
            <div className="mt-1 text-xs text-slate-300 bg-slate-900/40 rounded p-2.5 border border-slate-800/80">
              <span className="text-[10px] text-slate-500 uppercase block font-mono mb-0.5">Forensic Chain Log</span>
              {selectedNode.routingDetails}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default HopChainVisualizer;
