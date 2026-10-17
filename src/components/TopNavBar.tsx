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
  Sliders,
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
    isProcessing,
  } = useAppContext();

  const [jurisdictionDropdownOpen, setJurisdictionDropdownOpen] = useState(false);
  const [scenarioDropdownOpen, setScenarioDropdownOpen] = useState(false);

  const jurisdictionRef = useRef<HTMLDivElement>(null);
  const scenarioRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
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
    { id: 'bank', label: 'Bank Dashboard', icon: Monitor },
  ];

  return (
    <header className="sticky top-0 z-40 h-16 w-full bg-slate-900/95 backdrop-blur-md border-b border-slate-700/50 shadow-lg px-3 sm:px-6">
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between gap-2 sm:gap-4">
        
        {/* ========================================== */}
        {/* LEFT: Logo & Branding                      */}
        {/* ========================================== */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500/20 via-emerald-600/10 to-transparent border border-emerald-500/40 shadow-inner group">
            <Shield className="h-5 w-5 text-emerald-400 group-hover:scale-110 transition-transform duration-300" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg sm:text-xl tracking-tight text-slate-100 font-sans">
                Nexus<span className="text-emerald-400">Clear</span>
              </span>
              <span className="hidden sm:inline-block rounded-md bg-emerald-500/15 px-1.5 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/30 uppercase tracking-widest">
                Pramaan-AI
              </span>
            </div>
            <span className="text-[11px] text-slate-400 font-medium hidden md:block">
              Lien Resolution &amp; CLS Engine
            </span>
          </div>
        </div>

        {/* ========================================== */}
        {/* CENTER: View Mode Tabs                     */}
        {/* ========================================== */}
        <div className="hidden md:flex items-center rounded-xl bg-slate-950/80 p-1 border border-slate-800 shadow-inner">
          {viewTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentView === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setView(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-emerald-600/25 to-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
                }`}
                title={`Switch to ${tab.label}`}
              >
                <Icon className={`h-3.5 w-3.5 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* ========================================== */}
        {/* RIGHT: Controls, Switcher & API Status     */}
        {/* ========================================== */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">

          {/* Quick Scenario Picker Dropdown */}
          <div className="relative" ref={scenarioRef}>
            <button
              onClick={() => setScenarioDropdownOpen(!scenarioDropdownOpen)}
              disabled={isProcessing}
              className="flex items-center gap-1.5 rounded-lg bg-slate-800/70 hover:bg-slate-800 px-2.5 py-1.5 text-xs font-medium text-slate-300 border border-slate-700/60 hover:border-slate-600 transition-all cursor-pointer disabled:opacity-50"
              title="Select Demo Scenario"
            >
              <Sliders className="h-3.5 w-3.5 text-slate-400" />
              <span className="hidden xl:inline max-w-[120px] truncate">
                {currentScenario?.name || 'Scenarios'}
              </span>
              <span className="xl:hidden">Demo</span>
              <ChevronDown className={`h-3 w-3 text-slate-400 transition-transform ${scenarioDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {scenarioDropdownOpen && (
              <div className="absolute right-0 mt-2 w-80 rounded-xl bg-slate-900 border border-slate-700/80 shadow-2xl z-50 p-1.5 backdrop-blur-xl">
                <div className="px-3 py-2 border-b border-slate-800">
                  <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Select Test Scenario
                  </p>
                </div>
                <div className="py-1 space-y-1">
                  {DEMO_SCENARIOS.map((scenario) => {
                    const isSelected = currentScenario?.id === scenario.id;
                    const isMule = scenario.expectedCLS.riskLevel === 'critical';
                    return (
                      <button
                        key={scenario.id}
                        onClick={() => handleSelectScenario(scenario)}
                        className={`w-full text-left p-2.5 rounded-lg text-xs transition-colors flex items-start gap-2.5 cursor-pointer ${
                          isSelected
                            ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-200'
                            : 'hover:bg-slate-800/80 text-slate-300'
                        }`}
                      >
                        <div className="mt-0.5 shrink-0">
                          {isSelected ? (
                            <Check className="h-4 w-4 text-emerald-400" />
                          ) : (
                            <div className="h-4 w-4 rounded-full border border-slate-600" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-1">
                            <span className="font-semibold text-slate-200 truncate">
                              {scenario.name}
                            </span>
                            <span
                              className={`shrink-0 px-1.5 py-0.2 rounded text-[10px] font-mono font-bold ${
                                isMule
                                  ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                                  : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              }`}
                            >
                              {formatCurrency(scenario.transaction.amount, scenario.jurisdiction)}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                            {scenario.description}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* 1. Jurisdiction Switcher Dropdown */}
          <div className="relative" ref={jurisdictionRef}>
            <button
              onClick={() => setJurisdictionDropdownOpen(!jurisdictionDropdownOpen)}
              className="flex items-center gap-2 rounded-lg bg-slate-800/80 hover:bg-slate-800 px-2.5 py-1.5 text-xs font-semibold text-slate-200 border border-slate-700/70 hover:border-slate-600 transition-all cursor-pointer"
              title="Select Jurisdiction"
            >
              <span className="text-base leading-none">{activeJurisdictionConfig.flag}</span>
              <span className="hidden lg:inline text-slate-200">
                {activeJurisdictionConfig.name.split(' ')[0]}
              </span>
              <ChevronDown
                className={`h-3.5 w-3.5 text-slate-400 transition-transform duration-200 ${
                  jurisdictionDropdownOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {jurisdictionDropdownOpen && (
              <div className="absolute right-0 mt-2 w-72 rounded-xl bg-slate-900 border border-slate-700/80 shadow-2xl z-50 p-1.5 backdrop-blur-xl animate-fade-in">
                <div className="px-3 py-2 border-b border-slate-800 flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Select Jurisdiction
                  </span>
                  <Globe className="h-3.5 w-3.5 text-slate-500" />
                </div>
                <div className="py-1 space-y-1">
                  {JURISDICTION_LIST.map((j) => {
                    const isSelected = currentJurisdiction === j.id;
                    return (
                      <button
                        key={j.id}
                        onClick={() => handleSelectJurisdiction(j.id)}
                        className={`w-full text-left p-2.5 rounded-lg text-xs transition-colors flex items-center justify-between cursor-pointer ${
                          isSelected
                            ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-200'
                            : 'hover:bg-slate-800/80 text-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="text-xl leading-none">{j.flag}</span>
                          <div>
                            <p className="font-semibold text-slate-100">{j.name}</p>
                            <p className="text-[10px] text-slate-400">{j.framework}</p>
                          </div>
                        </div>
                        {isSelected && <Check className="h-4 w-4 text-emerald-400 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* 2. API Status Badge */}
          <button
            onClick={() => toggleApiKeyModal(true)}
            className={`flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all duration-200 border cursor-pointer ${
              isLiveGemini
                ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/20 shadow-[0_0_12px_rgba(16,185,129,0.15)]'
                : 'bg-amber-500/10 border-amber-500/40 text-amber-300 hover:bg-amber-500/20 shadow-[0_0_12px_rgba(245,158,11,0.15)]'
            }`}
            title={
              isLiveGemini
                ? 'Gemini 2.5 Flash live API active. Click to manage key.'
                : 'Running in synthetic Simulator Mode. Click to enter API key.'
            }
          >
            <span className="relative flex h-2 w-2">
              <span
                className={`absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping ${
                  isLiveGemini ? 'bg-emerald-400' : 'bg-amber-400'
                }`}
              />
              <span
                className={`relative inline-flex rounded-full h-2 w-2 ${
                  isLiveGemini ? 'bg-emerald-500' : 'bg-amber-500'
                }`}
              />
            </span>
            <span className="hidden sm:inline font-mono font-semibold">
              {isLiveGemini ? 'Live Gemini 2.5 Flash' : 'Simulator Mode'}
            </span>
            <Zap className={`h-3 w-3 ${isLiveGemini ? 'text-emerald-400' : 'text-amber-400'}`} />
          </button>

          {/* 3. Settings Gear Button */}
          <button
            onClick={() => toggleApiKeyModal(true)}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 hover:text-white border border-slate-700/70 transition-all cursor-pointer"
            title="API Key &amp; System Settings"
            aria-label="Settings"
          >
            <Settings className="h-4 w-4 hover:rotate-90 transition-transform duration-300" />
          </button>

        </div>
      </div>
    </header>
  );
};

export default TopNavBar;
