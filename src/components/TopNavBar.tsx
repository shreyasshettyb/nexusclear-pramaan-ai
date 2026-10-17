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
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { JURISDICTION_LIST } from '../data/jurisdictions';
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
    { id: 'bank', label: 'Bank Command Center', icon: Monitor },
  ];

  return (
    <header className="sticky top-0 z-40 h-14 w-full bg-[#131314] border-b border-[#2d2f31] px-4 sm:px-6">
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between gap-3">
        
        {/* LEFT: Clean Logo */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1b3a5b] text-[#8ab4f8]">
            <Shield className="h-4 w-4 text-[#8ab4f8]" />
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm sm:text-base tracking-tight text-white">
              Nexus<span className="text-[#8ab4f8]">Clear</span>
            </span>
            <span className="rounded-full bg-[#1e1f20] px-2 py-0.5 text-[10.5px] font-medium text-[#9aa0a6] border border-[#333538]">
              Pramaan-AI
            </span>
          </div>
        </div>

        {/* CENTER: Google Segmented Pill Switch */}
        <div className="hidden sm:flex items-center rounded-full bg-[#1e1f20] p-1 border border-[#333538]">
          {viewTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentView === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setView(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#8ab4f8] text-[#002b4f] font-semibold shadow-xs'
                    : 'text-[#9aa0a6] hover:text-white'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* RIGHT: Cases & Jurisdiction Controls */}
        <div className="flex items-center gap-2">
          
          {/* Quick Scenario Dropdown */}
          <div className="relative" ref={scenarioRef}>
            <button
              type="button"
              onClick={() => setScenarioDropdownOpen(!scenarioDropdownOpen)}
              className="flex items-center gap-1.5 rounded-full bg-[#1e1f20] hover:bg-[#28292a] px-3 py-1 text-xs font-medium text-[#e3e3e3] border border-[#333538] transition-all cursor-pointer"
              title="Select Demo Case"
            >
              <span className="text-xs">
                {currentScenario?.id === 'ramesh-medicals' ? '🏥' : currentScenario?.id === 'uncle-tan-chicken-rice' ? '🍗' : '🚩'}
              </span>
              <span className="max-w-[120px] truncate hidden md:inline">
                {currentScenario?.name.split(' ')[0] ?? 'Demo Case'}
              </span>
              <ChevronDown
                className={`h-3 w-3 text-[#9aa0a6] transition-transform duration-200 ${
                  scenarioDropdownOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {scenarioDropdownOpen && (
              <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-[#1e1f20] border border-[#333538] shadow-2xl z-50 p-1.5 animate-slide-up">
                <div className="px-3 py-1.5 text-[11px] font-medium text-[#9aa0a6] border-b border-[#2d2f31] mb-1">
                  Select Demo Scenario
                </div>
                <div className="space-y-1">
                  {DEMO_SCENARIOS.map((scenario) => {
                    const isSelected = currentScenario?.id === scenario.id;
                    const isMule = scenario.id === 'rajesh-trading';
                    return (
                      <button
                        key={scenario.id}
                        type="button"
                        onClick={() => handleSelectScenario(scenario)}
                        className={`w-full text-left p-2 rounded-xl text-xs transition-colors flex items-center justify-between cursor-pointer ${
                          isSelected
                            ? 'bg-[#1b3a5b] text-[#d3e3fd]'
                            : 'hover:bg-[#28292a] text-[#c4c6d0]'
                        }`}
                      >
                        <div className="truncate pr-2">
                          <div className="font-semibold text-white truncate flex items-center gap-1.5">
                            <span>{scenario.id === 'ramesh-medicals' ? '🏥' : scenario.id === 'uncle-tan-chicken-rice' ? '🍗' : '🚩'}</span>
                            <span>{scenario.name}</span>
                          </div>
                          <div className="text-[11px] text-[#9aa0a6] truncate mt-0.5">
                            {scenario.description.slice(0, 40)}...
                          </div>
                        </div>
                        <span
                          className={`text-[9.5px] px-1.5 py-0.5 rounded-full font-medium shrink-0 ${
                            isMule ? 'bg-[#f28b82]/20 text-[#f28b82]' : 'bg-[#81c995]/20 text-[#81c995]'
                          }`}
                        >
                          {isMule ? 'Mule' : 'Legit'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Jurisdiction Dropdown */}
          <div className="relative" ref={jurisdictionRef}>
            <button
              type="button"
              onClick={() => setJurisdictionDropdownOpen(!jurisdictionDropdownOpen)}
              className="flex items-center gap-1.5 rounded-full bg-[#1e1f20] hover:bg-[#28292a] px-3 py-1 text-xs font-medium text-[#e3e3e3] border border-[#333538] transition-all cursor-pointer"
              title="Select Regulatory Regime"
            >
              <span>{activeJurisdictionConfig.flag}</span>
              <span className="hidden lg:inline">{activeJurisdictionConfig.name.split(' ')[0]}</span>
              <ChevronDown
                className={`h-3 w-3 text-[#9aa0a6] transition-transform duration-200 ${
                  jurisdictionDropdownOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {jurisdictionDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-[#1e1f20] border border-[#333538] shadow-2xl z-50 p-1.5 animate-slide-up">
                <div className="px-3 py-1.5 text-[11px] font-medium text-[#9aa0a6] border-b border-[#2d2f31] mb-1">
                  Regulatory Clearing Rail
                </div>
                <div className="space-y-1">
                  {JURISDICTION_LIST.map((jur) => {
                    const isSelected = jur.id === currentJurisdiction;
                    return (
                      <button
                        key={jur.id}
                        type="button"
                        onClick={() => handleSelectJurisdiction(jur.id)}
                        className={`w-full text-left p-2 rounded-xl text-xs transition-colors flex items-center justify-between cursor-pointer ${
                          isSelected
                            ? 'bg-[#1b3a5b] text-[#d3e3fd]'
                            : 'hover:bg-[#28292a] text-[#c4c6d0]'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-sm">{jur.flag}</span>
                          <div>
                            <div className="font-semibold text-white">{jur.name}</div>
                            <div className="text-[10px] text-[#9aa0a6]">{jur.framework}</div>
                          </div>
                        </div>
                        {isSelected && <Check className="h-3.5 w-3.5 text-[#8ab4f8]" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Gemini AI Status Badge */}
          <button
            type="button"
            onClick={() => toggleApiKeyModal(true)}
            className="flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium border border-[#333538] bg-[#1e1f20] hover:bg-[#28292a] transition-all cursor-pointer"
            title="Configure Gemini API Key"
          >
            <span
              className={`h-2 w-2 rounded-full ${
                isLiveGemini ? 'bg-[#81c995] animate-pulse' : 'bg-[#fdd663]'
              }`}
            />
            <span className="hidden xl:inline text-[#e3e3e3]">
              {isLiveGemini ? 'Gemini 2.5 Flash' : 'Simulator Mode'}
            </span>
            <Zap className="h-3 w-3 text-[#8ab4f8]" />
          </button>

          {/* Settings Cog */}
          <button
            type="button"
            onClick={() => toggleApiKeyModal(true)}
            className="p-1.5 rounded-full bg-[#1e1f20] hover:bg-[#28292a] text-[#9aa0a6] hover:text-white border border-[#333538] transition-colors cursor-pointer"
            title="API Settings"
          >
            <Settings className="h-4 w-4" />
          </button>

        </div>

      </div>
    </header>
  );
};

export default TopNavBar;
