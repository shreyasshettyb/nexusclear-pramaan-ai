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
    }, 600);
  };

  const handleClear = () => {
    setInputKey('');
    setApiKey(null);
    setSavedSuccess(true);
    setTimeout(() => {
      toggleApiKeyModal(false);
    }, 600);
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      toggleApiKeyModal(false);
    }
  };

  return (
    <div
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 animate-fade-in"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-lg rounded-3xl bg-[#1e1f23] border border-[#33353b] shadow-2xl p-6 sm:p-7 text-[#e3e3e8] overflow-hidden flex flex-col gap-4">
        {/* Top accent line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-[#8ab4f8]" />

        {/* Close Button */}
        <button
          onClick={() => toggleApiKeyModal(false)}
          className="absolute top-4 right-4 rounded-full p-1.5 text-[#9aa0a6] hover:text-white hover:bg-[#26282d] transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#1b3a5b] text-[#8ab4f8]">
            <Key className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-white flex items-center gap-2">
              Gemini API Key
              <span className="rounded-full bg-[#1b3a5b] px-2 py-0.5 text-[10.5px] font-medium text-[#8ab4f8]">
                2.5 Flash
              </span>
            </h2>
            <p className="text-xs text-[#9aa0a6]">
              Real-time multimodal forensic engine
            </p>
          </div>
        </div>

        {/* Info card */}
        <div className="rounded-2xl bg-[#121316] border border-[#2f3136] p-3.5 space-y-1.5 text-xs text-[#c4c6d0] leading-relaxed">
          <p>
            Enter your free <strong className="text-white">Gemini API key</strong> from Google AI Studio to perform live multimodal vision &amp; vernacular voice audits.
          </p>
          <div className="flex items-center gap-1.5 text-[11px] text-[#9aa0a6]">
            <ShieldCheck className="h-3.5 w-3.5 text-[#81c995] shrink-0" />
            <span>Without a key, the app runs in <strong className="text-[#ffe082]">Simulator Mode</strong> with realistic responses.</span>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1.5 text-xs">
              <label htmlFor="gemini-api-key" className="font-medium text-white">
                Google AI Studio Key
              </label>
              <a
                href="https://aistudio.google.com/apikey"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[#8ab4f8] hover:underline text-[11px]"
              >
                <span>Get Free Key</span>
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
                className="w-full rounded-xl bg-[#121316] border border-[#33353b] px-3.5 py-2.5 text-xs font-mono text-white placeholder-[#5f6368] focus:border-[#8ab4f8] focus:outline-none pr-10"
                autoComplete="off"
                spellCheck="false"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9aa0a6] hover:text-white cursor-pointer"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <p className="text-[11px] text-[#5f6368] mt-1">
              Key is saved directly in your browser's localStorage.
            </p>
          </div>

          {savedSuccess && (
            <div className="flex items-center gap-2 rounded-xl bg-[#183824] border border-[#81c995]/40 p-2.5 text-xs text-[#c4eed0] animate-slide-up">
              <CheckCircle2 className="h-4 w-4 text-[#81c995]" />
              <span>Settings updated successfully!</span>
            </div>
          )}

          <div className="flex items-center justify-between gap-2 pt-2 border-t border-[#2f3136]">
            {geminiApiKey ? (
              <button
                type="button"
                onClick={handleClear}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#441816] text-[#f28b82] text-xs font-medium hover:bg-[#571e1b] cursor-pointer"
              >
                <Trash2 className="h-3 w-3" />
                <span>Clear Key</span>
              </button>
            ) : <div />}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => toggleApiKeyModal(false)}
                className="px-4 py-2 rounded-full text-xs font-medium text-[#9aa0a6] hover:bg-[#26282d] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full bg-[#8ab4f8] hover:bg-[#a8c7fa] text-[#002b4f] text-xs font-semibold cursor-pointer shadow-xs"
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
