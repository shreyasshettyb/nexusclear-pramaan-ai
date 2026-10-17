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
    <div className="flex flex-col h-[calc(100vh-3.5rem)] w-full overflow-hidden bg-[#131314]">
      {/* Mobile Segmented Switcher (< md) */}
      <div className="flex md:hidden items-center justify-center p-2 bg-[#1e1f20] border-b border-[#2d2f31] shrink-0">
        <div className="flex w-full max-w-xs rounded-full bg-[#131314] p-1 border border-[#333538]">
          <button
            type="button"
            onClick={() => setMobileTab('merchant')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
              mobileTab === 'merchant'
                ? 'bg-[#8ab4f8] text-[#002b4f] font-semibold'
                : 'text-[#9aa0a6]'
            }`}
          >
            <Smartphone className="h-3.5 w-3.5" />
            <span>Merchant</span>
          </button>
          <button
            type="button"
            onClick={() => setMobileTab('bank')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
              mobileTab === 'bank'
                ? 'bg-[#8ab4f8] text-[#002b4f] font-semibold'
                : 'text-[#9aa0a6]'
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
        {/* Left Panel: Merchant App */}
        <div
          style={{ width: `${splitRatio}%` }}
          className={`h-full overflow-y-auto custom-scrollbar flex flex-col items-center justify-start pr-0 md:pr-2 ${
            mobileTab === 'merchant' ? 'flex w-full md:w-auto' : 'hidden md:flex'
          }`}
        >
          {leftPanel}
        </div>

        {/* Minimalist Resizer Handle */}
        <div
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          className={`hidden md:flex relative w-2.5 items-center justify-center cursor-col-resize group z-30 select-none shrink-0 ${
            isDragging ? 'opacity-100' : 'opacity-40 hover:opacity-100'
          }`}
          title="Drag to resize panels"
        >
          <div
            className={`h-full w-[1px] transition-colors ${
              isDragging ? 'bg-[#8ab4f8]' : 'bg-[#333538] group-hover:bg-[#8ab4f8]'
            }`}
          />
          <div
            className={`absolute flex h-5 w-3 items-center justify-center rounded-full border border-[#333538] bg-[#1e1f20] text-[#9aa0a6] group-hover:text-white transition-all`}
          >
            <GripVertical className="h-2 w-2" />
          </div>
        </div>

        {/* Right Panel: Bank Console */}
        <div
          style={{ width: `${100 - splitRatio}%` }}
          className={`h-full overflow-y-auto custom-scrollbar flex flex-col pl-0 md:pl-2 ${
            mobileTab === 'bank' ? 'flex w-full md:w-auto' : 'hidden md:flex'
          }`}
        >
          {rightPanel}
        </div>
      </div>
    </div>
  );
};

export default SplitLayout;
