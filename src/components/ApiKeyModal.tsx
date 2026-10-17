import React, { useState, useEffect, useRef } from 'react';
import {
  Key,
  Eye,
  EyeOff,
  ExternalLink,
  X,
  CheckCircle2,
  Trash2,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export const ApiKeyModal: React.FC = () => {
  const { showApiKeyModal, toggleApiKeyModal, geminiApiKey, setApiKey } = useAppContext();

  const [inputKey, setInputKey] = useState<string>(geminiApiKey || '');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (showApiKeyModal) {
      setInputKey(geminiApiKey || '');
      setSavedSuccess(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [showApiKeyModal, geminiApiKey]);

  // Handle Escape key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showApiKeyModal) {
        toggleApiKeyModal(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showApiKeyModal, toggleApiKeyModal]);

  if (!showApiKeyModal) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = inputKey.trim();
    setApiKey(trimmed.length > 0 ? trimmed : null);
    setSavedSuccess(true);
    setTimeout(() => {
      toggleApiKeyModal(false);
    }, 700);
  };

  const handleClear = () => {
    setInputKey('');
    setApiKey(null);
    setSavedSuccess(true);
    setTimeout(() => {
      toggleApiKeyModal(false);
    }, 700);
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      toggleApiKeyModal(false);
    }
  };

  return (
    <div
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="api-key-modal-title"
    >
      <div className="relative w-full max-w-lg rounded-2xl bg-[#0c1222] border border-slate-700/80 shadow-2xl p-6 sm:p-7 text-slate-100 overflow-hidden">
        {/* Glow accent */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500" />

        {/* Close Button */}
        <button
          onClick={() => toggleApiKeyModal(false)}
          className="absolute top-4 right-4 rounded-lg p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3.5 mb-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 shadow-inner">
            <Key className="h-6 w-6" />
          </div>
          <div>
            <h2 id="api-key-modal-title" className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              Gemini API Settings
              <span className="rounded-md bg-emerald-500/20 px-2 py-0.5 text-[11px] font-mono font-semibold text-emerald-400 border border-emerald-500/30">
                2.5 Flash
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Live multimodal evidence audit configuration
            </p>
          </div>
        </div>

        {/* Informational description */}
        <div className="rounded-xl bg-slate-900/90 border border-slate-800 p-4 mb-5 space-y-2">
          <p className="text-xs leading-relaxed text-slate-300">
            Enter your <strong className="text-emerald-400">Gemini API key</strong> from Google AI Studio to enable live Gemini 2.5 Flash analysis of merchant voice statements, invoice scans, and counterfeit forensic checks.
          </p>
          <div className="flex items-center gap-2 text-[11px] text-slate-400 pt-1">
            <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
            <span>Without a key, the platform operates seamlessly in <strong className="text-amber-400">Simulator Mode</strong> with realistic deterministic responses.</span>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-5">
          {/* Input Field */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="gemini-api-key" className="text-xs font-semibold text-slate-200">
                Google AI Studio API Key
              </label>
              <a
                href="https://aistudio.google.com/apikey"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-400 hover:text-emerald-300 transition-colors"
              >
                <span>Get API Key</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>

            <div className="relative">
              <input
                ref={inputRef}
                id="gemini-api-key"
                type={showPassword ? 'text' : 'password'}
                value={inputKey}
                onChange={(e) => setInputKey(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full rounded-xl bg-slate-950/80 border border-slate-700/80 px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 pr-11 font-mono transition-all"
                autoComplete="off"
                spellCheck="false"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                title={showPassword ? 'Hide API key' : 'Show API key'}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <p className="text-[11px] text-slate-500 mt-1.5">
              Key is stored locally in your browser’s localStorage. Never transmitted to third-party backends.
            </p>
          </div>

          {/* Success Banner */}
          {savedSuccess && (
            <div className="flex items-center gap-2 rounded-lg bg-emerald-500/20 border border-emerald-500/40 p-2.5 text-xs font-medium text-emerald-300 animate-fade-in">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
              <span>Settings updated successfully!</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-between gap-3 pt-2">
            {geminiApiKey ? (
              <button
                type="button"
                onClick={handleClear}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-medium transition-colors cursor-pointer"
                title="Remove API key and switch to Simulator Mode"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Revert to Simulator</span>
              </button>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => toggleApiKeyModal(false)}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-all shadow-md hover:shadow-emerald-500/25 cursor-pointer"
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>Save Key</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApiKeyModal;
