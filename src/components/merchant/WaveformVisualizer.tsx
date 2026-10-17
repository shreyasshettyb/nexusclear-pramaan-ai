import React, { useEffect, useState, useMemo } from 'react';

export interface WaveformVisualizerProps {
  waveformData?: number[];
  isActive?: boolean;
  style?: 'confident' | 'nervous' | 'normal';
  className?: string;
}

const BAR_COUNT = 32;

export const WaveformVisualizer: React.FC<WaveformVisualizerProps> = ({
  waveformData = [],
  isActive = false,
  style = 'normal',
  className = '',
}) => {
  // Phase counter for live animated pulsing when active
  const [pulsePhase, setPulsePhase] = useState<number>(0);

  // Generate baseline 32 points if no data provided
  const baseAmplitudes = useMemo(() => {
    if (waveformData && waveformData.length > 0) {
      // Resample incoming waveform to exactly 32 bars
      const result: number[] = [];
      const step = (waveformData.length - 1) / (BAR_COUNT - 1 || 1);
      for (let i = 0; i < BAR_COUNT; i++) {
        const index = Math.round(i * step);
        const val = waveformData[Math.min(index, waveformData.length - 1)] ?? 0.2;
        result.push(Math.min(1.0, Math.max(0.08, val)));
      }
      return result;
    }

    // Default static amplitudes based on style
    const defaultBars: number[] = [];
    for (let i = 0; i < BAR_COUNT; i++) {
      const p = i / BAR_COUNT;
      if (style === 'confident') {
        const h = 0.45 + 0.35 * Math.sin(p * Math.PI * 4) * Math.cos(p * Math.PI * 2);
        defaultBars.push(Math.min(0.95, Math.max(0.25, Math.abs(h))));
      } else if (style === 'nervous') {
        const isPause = i % 7 === 0 || i % 11 === 0;
        if (isPause) {
          defaultBars.push(0.1);
        } else {
          const h = 0.2 + ((i * 37) % 70) / 100;
          defaultBars.push(Math.min(0.9, Math.max(0.12, h)));
        }
      } else {
        // 'normal'
        const h = 0.25 + 0.5 * Math.sin(p * Math.PI) * Math.sin(p * Math.PI * 3);
        defaultBars.push(Math.min(0.85, Math.max(0.15, Math.abs(h))));
      }
    }
    return defaultBars;
  }, [waveformData, style]);

  // Animation frame loop when active to create dynamic pulsing
  useEffect(() => {
    if (!isActive) return;

    let animId: number;
    let startTime = performance.now();

    const animate = (time: number) => {
      const elapsed = (time - startTime) / 1000;
      setPulsePhase(elapsed * 4); // oscillation speed
      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, [isActive]);

  // Compute final bar heights (viewBox height is 60)
  const bars = useMemo(() => {
    const maxHeight = 50;
    const minHeight = 6;

    return baseAmplitudes.map((amp, index) => {
      let currentAmp = amp;
      if (isActive) {
        // Modulate with wave motion
        const wave = Math.sin(pulsePhase + index * 0.4);
        const modulation = 0.75 + 0.25 * wave;
        currentAmp = Math.min(1.0, Math.max(0.1, amp * modulation));
      }

      const barHeight = Math.max(minHeight, Math.round(currentAmp * maxHeight));
      const y = Math.round((60 - barHeight) / 2);

      return {
        height: barHeight,
        y,
        amp: currentAmp,
      };
    });
  }, [baseAmplitudes, isActive, pulsePhase]);

  return (
    <div className={`w-full overflow-hidden select-none ${className}`}>
      <svg
        viewBox="0 0 320 60"
        className="w-full h-[60px]"
        preserveAspectRatio="none"
        aria-label="Audio waveform visualization"
      >
        <defs>
          {/* Active emerald gradient */}
          <linearGradient id="activeEmeraldGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#34d399" />
            <stop offset="50%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>

          {/* Inactive slate gradient */}
          <linearGradient id="inactiveSlateGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#64748b" />
            <stop offset="100%" stopColor="#334155" />
          </linearGradient>

          {/* Glow filter for active bars */}
          <filter id="emeraldGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.5" result="glow" />
            <feComposite in="SourceGraphic" in2="glow" operator="over" />
          </filter>
        </defs>

        {bars.map((bar, i) => {
          const barWidth = 6;
          const spacing = 10;
          const x = i * spacing + 2;

          return (
            <rect
              key={i}
              x={x}
              y={bar.y}
              width={barWidth}
              height={bar.height}
              rx={3}
              ry={3}
              fill={isActive ? 'url(#activeEmeraldGrad)' : 'url(#inactiveSlateGrad)'}
              filter={isActive ? 'url(#emeraldGlow)' : undefined}
              className="transition-[height,y,fill] duration-150 ease-out"
              opacity={isActive ? 0.95 : 0.6}
            />
          );
        })}
      </svg>
    </div>
  );
};

export default WaveformVisualizer;
