import React, { useState, useRef, useEffect } from 'react';
import {
  Shield,
  Columns,
  Smartphone,
  Monitor,
  Settings,
  ChevronDown,
  Check,
  Zap,
  Globe,
  SlidersHorizontal,
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { JURISDICTION_LIST, formatCurrency } from '../data/jurisdictions';
import { DEMO_SCENARIOS } from '../data/scenarios';
import type { Jurisdiction, ViewMode, DemoScenario } from '../types';

export const TopNavBar: React.FC = () => {
  const {
    currentJurisdiction,
    setJurisdiction,
    currentScenario,
    loadScenario,
    currentView,
    setView,
    isLiveGemini,
    toggleApiKeyModal,
  } = useAppContext();

  const [jurisdictionDropdownOpen, setJurisdictionDropdownOpen] = useState(false);
  const [scenarioDropdownOpen, setScenarioDropdownOpen] = useState(false);

  const jurisdictionRef = useRef<HTMLDivElement>(null);
  const scenarioRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        jurisdictionRef.current &&
        !jurisdictionRef.current.contains(e.target as Node)
      ) {
        setJurisdictionDropdownOpen(false);
      }
      if (
        scenarioRef.current &&
        !scenarioRef.current.contains(e.target as Node)
      ) {
        setScenarioDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectJurisdiction = (id: Jurisdiction) => {
    setJurisdiction(id);
    setJurisdictionDropdownOpen(false);
  };

  const handleSelectScenario = (scenario: DemoScenario) => {
    loadScenario(scenario);
    setScenarioDropdownOpen(false);
  };

  const activeJurisdictionConfig =
    JURISDICTION_LIST.find((j) => j.id === currentJurisdiction) ?? JURISDICTION_LIST[0];

  const viewTabs: { id: ViewMode; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'split', label: 'Split View', icon: Columns },
    { id: 'merchant', label: 'Merchant App', icon: Smartphone },
    { id: 'bank', label: 'Bank Console', icon: Monitor },
  ];

  return (
    <header className="sticky top-0 z-40 h-16 w-full bg-[#111318] border-b border-[#2d3036] px-4 sm:px-6">
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between gap-3">
        
        {/* ========================================== */}
        {/* LEFT: Google Cloud / NexusClear Logo       */}
        {/* ========================================== */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1e232d] border border-[#3c4048] text-[#8ab4f8]">
            <Shield className="h-4.5 w-4.5 text-[#8ab4f8]" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-bold text-base sm:text-lg tracking-tight text-white font-sans">
                Nexus<span className="text-[#8ab4f8]">Clear</span>
              </span>
              <span className="rounded-full bg-[#1e232d] px-2 py-0.5 text-[10px] font-medium text-[#8ab4f8] border border-[#3c4048]">
                Pramaan-AI
              </span>
            </div>
            <span className="text-[10.5px] text-[#9aa0a6] hidden md:block">
              Google Cloud AI Builder Cup 2026 &bull; Gemini 2.5 Flash
            </span>
          </div>
        </div>

        {/* ========================================== */}
        {/* CENTER: Material 3 Segmented Button       */}
        {/* ========================================== */}
        <div className="hidden sm:flex items-center rounded-full bg-[#191c20] p-1 border border-[#2d3036]">
          {viewTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentView === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setView(tab.id)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#004a77] text-[#d1e4ff] font-semibold shadow-sm'
                    : 'text-[#c4c6d0] hover:text-white hover:bg-[#272a2f]'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* ========================================== */}
        {/* RIGHT: Material 3 Dropdowns & Status Badge */}
        {/* ========================================== */}
        <div className="flex items-center gap-2">
          
          {/* Quick Scenario Selector Dropdown */}
          <div className="relative" ref={scenarioRef}>
            <button
              onClick={() => setScenarioDropdownOpen(!scenarioDropdownOpen)}
              className="flex items-center gap-1.5 rounded-full bg-[#191c20] hover:bg-[#272a2f] px-3 py-1.5 text-xs font-medium text-[#e2e2e9] border border-[#2d3036] transition-all cursor-pointer"
              title="Select Demo Case"
            >
              <SlidersHorizontal className="h-3.5 w-3.5 text-[#8ab4f8]" />
              <span className="max-w-[110px] truncate hidden md:inline">
                {currentScenario?.name.split(' ')[0] ?? 'Cases'}
              </span>
              <ChevronDown
                className={`h-3 w-3 text-[#9aa0a6] transition-transform duration-200 ${
                  scenarioDropdownOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {scenarioDropdownOpen && (
              <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-[#1d2024] border border-[#3c4048] shadow-2xl z-50 p-2 backdrop-blur-xl">
                <div className="px-3 py-1.5 border-b border-[#2d3036] text-[11px] font-medium text-[#9aa0a6]">
                  Select Preloaded Case
                </div>
                <div className="py-1 space-y-1">
                  {DEMO_SCENARIOS.map((scenario) => {
                    const isSelected = currentScenario?.id === scenario.id;
                    const isMule = scenario.id === 'rajesh-trading';
                    return (
                      <button
                        key={scenario.id}
                        onClick={() => handleSelectScenario(scenario)}
                        className={`w-full text-left p-2.5 rounded-xl text-xs transition-colors flex items-center justify-between cursor-pointer ${
                          isSelected
                            ? 'bg-[#004a77] text-[#d1e4ff]'
                            : 'hover:bg-[#272a2f] text-[#c4c6d0]'
                        }`}
                      >
                        <div className="truncate pr-2">
                          <div className="font-semibold text-white truncate flex items-center gap-1.5">
                            <span>{scenario.id === 'ramesh-medicals' ? '🏥' : scenario.id === 'uncle-tan-chicken-rice' ? '🍗' : '🚩'}</span>
                            <span>{scenario.name}</span>
                          </div>
                          <span className="text-[10.5px] text-[#9aa0a6] line-clamp-1">
                            {scenario.description}
                          </span>
                        </div>
                        <span
                          className={`shrink-0 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                            isMule
                              ? 'bg-rose-500/20 text-[#f28b82]'
                              : 'bg-emerald-500/20 text-[#81c995]'
                          }`}
                        >
                          {formatCurrency(scenario.transaction.amount, scenario.jurisdiction)}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Jurisdiction Selector Dropdown */}
          <div className="relative" ref={jurisdictionRef}>
            <button
              onClick={() => setJurisdictionDropdownOpen(!jurisdictionDropdownOpen)}
              className="flex items-center gap-1.5 rounded-full bg-[#191c20] hover:bg-[#272a2f] px-3 py-1.5 text-xs font-medium text-[#e2e2e9] border border-[#2d3036] transition-all cursor-pointer"
              title="Select Jurisdiction"
            >
              <span>{activeJurisdictionConfig.flag}</span>
              <span className="hidden lg:inline">
                {activeJurisdictionConfig.name.split(' ')[0]}
              </span>
              <ChevronDown
                className={`h-3 w-3 text-[#9aa0a6] transition-transform duration-200 ${
                  jurisdictionDropdownOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {jurisdictionDropdownOpen && (
              <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-[#1d2024] border border-[#3c4048] shadow-2xl z-50 p-2 backdrop-blur-xl">
                <div className="px-3 py-1.5 border-b border-[#2d3036] text-[11px] font-medium text-[#9aa0a6]">
                  Regulatory Rail
                </div>
                <div className="py-1 space-y-1">
                  {JURISDICTION_LIST.map((j) => {
                    const isSelected = currentJurisdiction === j.id;
                    return (
                      <button
                        key={j.id}
                        onClick={() => handleSelectJurisdiction(j.id)}
                        className={`w-full text-left p-2.5 rounded-xl text-xs transition-colors flex items-center justify-between cursor-pointer ${
                          isSelected
                            ? 'bg-[#004a77] text-[#d1e4ff]'
                            : 'hover:bg-[#272a2f] text-[#c4c6d0]'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-base">{j.flag}</span>
                          <div>
                            <div className="font-semibold text-white">{j.name}</div>
                            <div className="text-[10px] text-[#9aa0a6]">{j.framework}</div>
                          </div>
                        </div>
                        {isSelected && <Check className="h-4 w-4 text-[#8ab4f8]" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Gemini 2.5 Flash Status Badge */}
          <button
            onClick={() => toggleApiKeyModal(true)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all cursor-pointer ${
              isLiveGemini
                ? 'bg-[#00522b] text-[#c4eed0] border-[#81c995]'
                : 'bg-[#574500] text-[#ffdf99] border-[#fdd663]'
            }`}
            title="Click to configure Gemini API Key"
          >
            <span
              className={`h-2 w-2 rounded-full ${
                isLiveGemini ? 'bg-[#81c995] animate-pulse' : 'bg-[#fdd663]'
              }`}
            />
            <span className="hidden sm:inline font-sans">
              {isLiveGemini ? 'Gemini 2.5 Flash' : 'Simulator Mode'}
            </span>
            <Zap className="h-3 w-3" />
          </button>

          {/* Settings Icon Button */}
          <button
            onClick={() => toggleApiKeyModal(true)}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-[#191c20] hover:bg-[#272a2f] text-[#c4c6d0] hover:text-white border border-[#2d3036] transition-all cursor-pointer"
            title="API Key Settings"
            aria-label="Settings"
          >
            <Settings className="h-4 w-4" />
          </button>

        </div>
      </div>
    </header>
  );
};

export default TopNavBar;
