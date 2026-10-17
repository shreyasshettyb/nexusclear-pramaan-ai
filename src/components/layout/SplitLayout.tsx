import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Smartphone, Monitor, GripVertical } from 'lucide-react';

export interface SplitLayoutProps {
  leftPanel: React.ReactNode;
  rightPanel: React.ReactNode;
  defaultSplit?: number;
}

export const SplitLayout: React.FC<SplitLayoutProps> = ({
  leftPanel,
  rightPanel,
  defaultSplit = 42,
}) => {
  const [splitRatio, setSplitRatio] = useState<number>(defaultSplit);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [mobileTab, setMobileTab] = useState<'merchant' | 'bank'>('merchant');

  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleTouchStart = useCallback(() => {
    setIsDragging(true);
  }, []);

  useEffect(() => {
    const handleMove = (clientX: number) => {
      if (!isDragging || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const newWidth = clientX - rect.left;
      const percentage = (newWidth / rect.width) * 100;
      const clamped = Math.min(60, Math.max(30, percentage));
      setSplitRatio(clamped);
    };

    const handleMouseMove = (e: MouseEvent) => handleMove(e.clientX);
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) handleMove(e.touches[0].clientX);
    };

    const handleStopDragging = () => {
      if (isDragging) setIsDragging(false);
    };

    if (isDragging) {
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleStopDragging);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('touchend', handleStopDragging);
    } else {
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }

    return () => {
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleStopDragging);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleStopDragging);
    };
  }, [isDragging]);

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] w-full overflow-hidden bg-[#111318]">
      
      {/* Mobile Tab Pill Controls (< md) */}
      <div className="flex md:hidden items-center justify-center p-2 bg-[#191c20] border-b border-[#2d3036] shrink-0">
        <div className="flex w-full max-w-xs rounded-full bg-[#111318] p-1 border border-[#2d3036]">
          <button
            onClick={() => setMobileTab('merchant')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
              mobileTab === 'merchant'
                ? 'bg-[#004a77] text-[#d1e4ff] font-semibold'
                : 'text-[#c4c6d0]'
            }`}
          >
            <Smartphone className="h-3.5 w-3.5" />
            <span>Merchant</span>
          </button>
          <button
            onClick={() => setMobileTab('bank')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
              mobileTab === 'bank'
                ? 'bg-[#004a77] text-[#d1e4ff] font-semibold'
                : 'text-[#c4c6d0]'
            }`}
          >
            <Monitor className="h-3.5 w-3.5" />
            <span>Bank Console</span>
          </button>
        </div>
      </div>

      {/* Split-Screen Workspace */}
      <div
        ref={containerRef}
        className="relative flex-1 flex flex-col md:flex-row w-full h-full overflow-hidden p-3 gap-0"
      >
        {/* Left Panel: Merchant Phone View */}
        <div
          style={{ width: `${splitRatio}%` }}
          className={`h-full overflow-y-auto custom-scrollbar transition-[width] duration-75 flex flex-col items-center justify-start pr-0 md:pr-1 ${
            mobileTab === 'merchant' ? 'flex w-full md:w-auto' : 'hidden md:flex'
          }`}
        >
          {leftPanel}
        </div>

        {/* Minimalist Material Resizer Handle */}
        <div
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          className={`hidden md:flex relative w-3 items-center justify-center cursor-col-resize group z-30 select-none shrink-0 ${
            isDragging ? 'opacity-100' : 'opacity-60 hover:opacity-100'
          }`}
          title="Drag to resize panels"
        >
          <div
            className={`h-full w-[1px] transition-colors ${
              isDragging ? 'bg-[#8ab4f8]' : 'bg-[#2d3036] group-hover:bg-[#8ab4f8]'
            }`}
          />
          <div
            className={`absolute flex h-7 w-4 items-center justify-center rounded-full border shadow transition-all ${
              isDragging
                ? 'bg-[#8ab4f8] border-[#a8c7fa] text-[#003258]'
                : 'bg-[#1e2025] border-[#3c4048] text-[#9aa0a6] group-hover:text-white'
            }`}
          >
            <GripVertical className="h-3 w-3" />
          </div>
        </div>

        {/* Right Panel: Bank Console View */}
        <div
          style={{ width: `${100 - splitRatio}%` }}
          className={`h-full overflow-hidden transition-[width] duration-75 flex flex-col pl-0 md:pl-1 ${
            mobileTab === 'bank' ? 'flex w-full md:w-auto' : 'hidden md:flex'
          }`}
        >
          <div className="w-full h-full rounded-2xl bg-[#191c20] border border-[#2d3036] overflow-y-auto flex flex-col p-2 sm:p-4 custom-scrollbar">
            {rightPanel}
          </div>
        </div>

      </div>
    </div>
  );
};

export default SplitLayout;
