import React, { useState } from 'react';
import { User, Skull, Store, ArrowRight, AlertTriangle, ShieldCheck, Clock, Layers } from 'lucide-react';
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

  const selectedNode = hopChain.find((n) => n.id === selectedNodeId) || null;

  const getNodeConfig = (node: HopNode) => {
    switch (node.type) {
      case 'victim':
        return {
          icon: User,
          bgClass: 'bg-[#3c1618]',
          borderClass: 'border-[#f28b82]/40',
          textClass: 'text-[#f28b82]',
          badgeClass: 'bg-[#f28b82]/20 text-[#f28b82]',
          typeName: 'Reporting Victim',
        };
      case 'mule_l1':
        return {
          icon: Skull,
          bgClass: 'bg-[#3b2010]',
          borderClass: 'border-orange-500/40',
          textClass: 'text-orange-300',
          badgeClass: 'bg-orange-500/20 text-orange-300',
          typeName: 'Layer-1 Mule (Pass-Through)',
        };
      case 'mule_l2':
      case 'mule_l3':
        return {
          icon: AlertTriangle,
          bgClass: 'bg-[#3b2f0a]',
          borderClass: 'border-[#fdd663]/40',
          textClass: 'text-[#ffe082]',
          badgeClass: 'bg-[#fdd663]/20 text-[#ffe082]',
          typeName: `Layer-${node.type === 'mule_l2' ? '2' : '3'} Mule`,
        };
      case 'merchant':
      default: {
        const isCleared = node.status === 'cleared';
        const isRejected = node.status === 'escalated';
        return {
          icon: isCleared ? ShieldCheck : isRejected ? AlertTriangle : Store,
          bgClass: isCleared ? 'bg-[#133924]' : isRejected ? 'bg-[#3c1618]' : 'bg-[#1b3a5b]',
          borderClass: isCleared ? 'border-[#81c995]/50' : isRejected ? 'border-[#f28b82]/50' : 'border-[#8ab4f8]/50',
          textClass: isCleared ? 'text-[#81c995]' : isRejected ? 'text-[#f28b82]' : 'text-[#8ab4f8]',
          badgeClass: isCleared ? 'bg-[#81c995]/20 text-[#81c995]' : isRejected ? 'bg-[#f28b82]/20 text-[#f28b82]' : 'bg-[#8ab4f8]/20 text-[#8ab4f8]',
          typeName: isCleared ? 'Verified Merchant' : isRejected ? 'Suspended Account' : 'Terminal Retail POS',
        };
      }
    }
  };

  const formatAmount = (num: number) => {
    return num.toLocaleString('en-US', {
      maximumFractionDigits: 0,
    });
  };

  return (
    <div className="rounded-3xl bg-[#1e1f20] border border-[#333538] p-5 sm:p-6 shadow-sm flex flex-col gap-4 text-[#e3e3e3]">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#2d2f31] flex-wrap gap-2">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1b3a5b] text-[#8ab4f8]">
            <Layers className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">
              Transaction Hop-Chain Analysis
            </h3>
            <p className="text-[11px] text-[#9aa0a6]">
              Multi-tier payment flow &amp; dwell velocity tracking
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-[11px] text-[#9aa0a6]">
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-[#f28b82]" /> Victim
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-orange-400" /> Mule
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-[#81c995]" /> Merchant
          </span>
        </div>
      </div>

      {/* Horizontal Nodes Flow */}
      <div className="overflow-x-auto py-1 custom-scrollbar">
        <div className="flex items-center justify-between gap-2 min-w-[540px]">
          {hopChain.map((node, index) => {
            const isLast = index === hopChain.length - 1;
            const config = getNodeConfig(node);
            const Icon = config.icon;
            const isSelected = selectedNodeId === node.id;

            return (
              <React.Fragment key={node.id}>
                {/* Node Box */}
                <div
                  onClick={() => setSelectedNodeId(isSelected ? null : node.id)}
                  className={`flex-1 min-w-[120px] max-w-[190px] p-3 rounded-2xl border transition-all cursor-pointer ${
                    config.bgClass
                  } ${config.borderClass} ${isSelected ? 'ring-2 ring-white/50 scale-[1.02]' : 'hover:scale-[1.01]'}`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${config.badgeClass}`}>
                      Hop #{index + 1}
                    </span>
                    <span className="text-[10px] text-[#9aa0a6] flex items-center gap-0.5 font-mono">
                      <Clock className="h-2.5 w-2.5" />
                      {node.holdDuration}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 mb-1.5">
                    <Icon className={`h-4 w-4 ${config.textClass} shrink-0`} />
                    <span className="text-xs font-semibold text-white truncate" title={node.label}>
                      {node.label}
                    </span>
                  </div>

                  <div className="text-[11px] font-mono text-white/90">
                    ₹{formatAmount(node.amount)}
                  </div>

                  <div className="text-[10px] text-[#9aa0a6] mt-0.5 truncate">
                    {config.typeName}
                  </div>
                </div>

                {/* Arrow connector */}
                {!isLast && (
                  <div className="flex flex-col items-center justify-center px-0.5 text-[#5f6368] shrink-0">
                    <ArrowRight className="h-4 w-4 text-[#8ab4f8]" />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Selected Node Details Drawer */}
      {selectedNode && (
        <div className="p-3 rounded-2xl bg-[#131314] text-xs text-[#c4c6d0] flex items-center justify-between animate-slide-up">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-white">{selectedNode.label}</span>
            <span className="text-[#9aa0a6]">|</span>
            <span>Hold: {selectedNode.holdDuration}</span>
            <span className="text-[#9aa0a6]">|</span>
            <span className="font-mono text-white">Amount: ₹{formatAmount(selectedNode.amount)}</span>
          </div>
          <button
            type="button"
            onClick={() => setSelectedNodeId(null)}
            className="text-[11px] text-[#8ab4f8] hover:underline cursor-pointer"
          >
            Close
          </button>
        </div>
      )}

    </div>
  );
};

export default HopChainVisualizer;
