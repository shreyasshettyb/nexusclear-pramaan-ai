import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Smartphone, Monitor, GripVertical } from 'lucide-react';

export interface SplitLayoutProps {
  leftPanel: React.ReactNode;
  rightPanel: React.ReactNode;
  defaultSplit?: number; // default percentage for left panel (e.g. 45)
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

  // Mouse / Touch Dragging Logic
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
      // Clamp between 30% and 65% for ideal layout balance
      const clamped = Math.min(65, Math.max(30, percentage));
      setSplitRatio(clamped);
    };

    const handleMouseMove = (e: MouseEvent) => {
      handleMove(e.clientX);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        handleMove(e.touches[0].clientX);
      }
    };

    const handleStopDragging = () => {
      if (isDragging) {
        setIsDragging(false);
      }
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
    <div className="flex flex-col h-[calc(100vh-4rem)] w-full overflow-hidden bg-background">
      
      {/* ========================================== */}
      {/* MOBILE TAB CONTROLS (< md)                 */}
      {/* ========================================== */}
      <div className="flex md:hidden items-center justify-center p-2.5 bg-slate-900 border-b border-slate-800 shrink-0">
        <div className="flex w-full max-w-sm rounded-xl bg-slate-950 p-1 border border-slate-800">
          <button
            onClick={() => setMobileTab('merchant')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              mobileTab === 'merchant'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Smartphone className="h-4 w-4" />
            <span>Merchant App</span>
          </button>
          <button
            onClick={() => setMobileTab('bank')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              mobileTab === 'bank'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Monitor className="h-4 w-4" />
            <span>Bank Console</span>
          </button>
        </div>
      </div>

      {/* ========================================== */}
      {/* DESKTOP & TABLET SPLIT SCREEN CONTAINER    */}
      {/* ========================================== */}
      <div
        ref={containerRef}
        className="relative flex-1 flex flex-col md:flex-row w-full h-full overflow-hidden p-2 sm:p-3 md:p-4 gap-0"
      >
        
        {/* ========================================== */}
        {/* LEFT PANEL: Merchant Mobile Chasis         */}
        {/* ========================================== */}
        <div
          style={{ width: `${splitRatio}%` }}
          className={`h-full overflow-y-auto custom-scrollbar transition-[width] duration-75 flex flex-col items-center justify-start py-1 px-1 sm:px-2 ${
            // On mobile, show only when active
            mobileTab === 'merchant' ? 'flex w-full md:w-auto' : 'hidden md:flex'
          }`}
        >
          {leftPanel}
        </div>

        {/* ========================================== */}
        {/* DRAGGABLE DIVIDER (Desktop only)           */}
        {/* ========================================== */}
        <div
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          className={`hidden md:flex relative w-4 items-center justify-center cursor-col-resize group z-30 select-none shrink-0 ${
            isDragging ? 'opacity-100' : 'opacity-70 hover:opacity-100'
          }`}
          title="Drag to resize panels"
        >
          {/* Subtle vertical guideline */}
          <div
            className={`h-full w-[2px] transition-colors duration-150 ${
              isDragging ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-slate-800 group-hover:bg-slate-600'
            }`}
          />

          {/* Grab handle badge */}
          <div
            className={`absolute flex h-9 w-5 items-center justify-center rounded-md border shadow-md transition-all ${
              isDragging
                ? 'bg-emerald-500 border-emerald-400 text-slate-950 scale-110'
                : 'bg-slate-800 border-slate-700 text-slate-400 group-hover:bg-slate-700 group-hover:text-slate-200'
            }`}
          >
            <GripVertical className="h-3.5 w-3.5" />
          </div>
        </div>

        {/* ========================================== */}
        {/* RIGHT PANEL: Bank Investigation Console    */}
        {/* ========================================== */}
        <div
          style={{ width: `${100 - splitRatio}%` }}
          className={`h-full overflow-hidden transition-[width] duration-75 flex flex-col ${
            // On mobile, show only when active
            mobileTab === 'bank' ? 'flex w-full md:w-auto' : 'hidden md:flex'
          }`}
        >
          <div className="w-full h-full rounded-2xl bg-[#090e1a]/95 border border-slate-800/90 shadow-2xl overflow-y-auto flex flex-col p-1 sm:p-3 relative custom-scrollbar">
            {rightPanel}
          </div>
        </div>

      </div>
    </div>
  );
};

export default SplitLayout;
