import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Mic,
  MicOff,
  Camera,
  Upload,
  AlertTriangle,
  Send,
  CheckCircle,
  FileText,
  Play,
  Square,
  Loader2,
  Sparkles,
  RefreshCw,
  Building2,
  Volume2,
  Languages,
  ShieldCheck,
  ShieldAlert,
  ZoomIn,
  X,
  Store,
} from 'lucide-react';
import type { MerchantEvidence, DemoScenario, MerchantLanguage } from '../../types';
import { useAppContext } from '../../context/AppContext';
import { DEMO_SCENARIOS } from '../../data/scenarios';
import { getJurisdiction, formatCurrency } from '../../data/jurisdictions';
import { TRANSLATIONS, SCENARIO_STATEMENTS } from '../../data/translations';
import {
  generateMedicalReceipt,
  generateHawkerReceipt,
  generateFakeReceipt,
  generateShopPhoto,
} from '../../services/syntheticReceiptGenerator';
import {
  startRecording,
  stopRecording,
  subscribeAudioState,
  generateSyntheticWaveform,
  AudioRecordingState,
} from '../../services/audioService';
import WaveformVisualizer from './WaveformVisualizer';

export interface MerchantAppProps {
  onSubmitEvidence?: (evidence: MerchantEvidence) => void;
  className?: string;
}

export const MerchantApp: React.FC<MerchantAppProps> = ({
  onSubmitEvidence,
  className = '',
}) => {
  const {
    currentScenario,
    currentJurisdiction,
    loadScenario,
    isProcessing,
    processingStage,
    evidenceSubmitted,
    submitEvidence,
    runAuditPipeline,
    merchantLanguage,
    setMerchantLanguage,
    adjudicationStatus,
    adjudicatedAt,
  } = useAppContext();

  const t = TRANSLATIONS[merchantLanguage] || TRANSLATIONS.en;
  const jurisdictionConfig = getJurisdiction(currentJurisdiction);

  // Evidence state
  const [statementText, setStatementText] = useState<string>('');
  const [receiptImage, setReceiptImage] = useState<string>('');
  const [isCustomReceipt, setIsCustomReceipt] = useState<boolean>(false);
  const [shopPhoto, setShopPhoto] = useState<string>('');
  const [isCustomShopPhoto, setIsCustomShopPhoto] = useState<boolean>(false);
  const [activeModalImage, setActiveModalImage] = useState<string | null>(null);

  // Audio recording & playback state
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordingDuration, setRecordingDuration] = useState<number>(0);
  const [liveWaveform, setLiveWaveform] = useState<number[]>([]);
  const [syntheticWaveform, setSyntheticWaveform] = useState<number[]>([]);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [recordingError, setRecordingError] = useState<string | null>(null);

  const receiptFileInputRef = useRef<HTMLInputElement | null>(null);
  const shopPhotoFileInputRef = useRef<HTMLInputElement | null>(null);

  // Audio state subscription
  useEffect(() => {
    const unsubscribe = subscribeAudioState((state: AudioRecordingState) => {
      setIsRecording(state.isRecording);
      setRecordingDuration(state.duration);
      if (state.waveform.length > 0) {
        setLiveWaveform(state.waveform);
      }
    });
    return () => unsubscribe();
  }, []);

  // Update statement text when scenario or language changes
  useEffect(() => {
    if (!currentScenario) return;
    const statements = SCENARIO_STATEMENTS[currentScenario.id];
    if (statements && statements[merchantLanguage]) {
      setStatementText(statements[merchantLanguage]);
    } else {
      setStatementText(currentScenario.evidence.voiceStatement || '');
    }
  }, [currentScenario?.id, merchantLanguage]);

  // Sync canvas receipts and synthetic waveform when scenario changes
  useEffect(() => {
    if (!currentScenario) {
      setReceiptImage('');
      setShopPhoto('');
      setIsCustomReceipt(false);
      setIsCustomShopPhoto(false);
      setSyntheticWaveform([]);
      return;
    }

    setIsCustomReceipt(false);
    setIsCustomShopPhoto(false);

    // Generate waveform
    const style = currentScenario.id === 'rajesh-trading' ? 'nervous' : 'confident';
    const wave = generateSyntheticWaveform(4000, style);
    setSyntheticWaveform(wave);

    // Generate Canvas Receipts
    try {
      let canvasReceiptBase64 = '';
      if (currentScenario.id === 'ramesh-medicals') {
        canvasReceiptBase64 = generateMedicalReceipt({
          amount: currentScenario.transaction.amount,
        });
      } else if (currentScenario.id === 'uncle-tan-chicken-rice') {
        canvasReceiptBase64 = generateHawkerReceipt({
          amount: currentScenario.transaction.amount,
        });
      } else if (currentScenario.id === 'rajesh-trading') {
        canvasReceiptBase64 = generateFakeReceipt({
          amount: 12000,
        });
      }

      if (canvasReceiptBase64) {
        setReceiptImage(`data:image/png;base64,${canvasReceiptBase64}`);
      } else if (currentScenario.evidence.receiptImage) {
        setReceiptImage(currentScenario.evidence.receiptImage);
      }

      // Generate Shop Photo
      let photoType: 'medical' | 'hawker' | 'suspicious' = 'medical';
      if (currentScenario.id === 'uncle-tan-chicken-rice') photoType = 'hawker';
      else if (currentScenario.id === 'rajesh-trading') photoType = 'suspicious';

      const canvasShopBase64 = generateShopPhoto(photoType);
      if (canvasShopBase64) {
        setShopPhoto(`data:image/png;base64,${canvasShopBase64}`);
      } else if (currentScenario.evidence.shopPhoto) {
        setShopPhoto(currentScenario.evidence.shopPhoto);
      }
    } catch (e) {
      console.warn('Canvas generator fallback to scenario payload', e);
      setReceiptImage(currentScenario.evidence.receiptImage || '');
      setShopPhoto(currentScenario.evidence.shopPhoto || '');
    }
  }, [currentScenario?.id]);

  // Toggle Recording
  const handleToggleRecord = async () => {
    setRecordingError(null);
    if (isRecording) {
      try {
        const result = await stopRecording();
        if (result.waveformData.length > 0) {
          setLiveWaveform(result.waveformData);
        }
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Could not stop recording';
        setRecordingError(message);
      }
    } else {
      try {
        await startRecording();
      } catch (err: unknown) {
        const message =
          err instanceof Error
            ? err.message
            : 'Microphone permission denied. You can still type your statement.';
        setRecordingError(message);
      }
    }
  };

  // Upload Custom Receipt
  const handleReceiptUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const base64Url = uploadEvent.target?.result as string;
      if (base64Url) {
        setReceiptImage(base64Url);
        setIsCustomReceipt(true);
      }
    };
    reader.readAsDataURL(file);
  };

  // Upload Custom Shop Photo
  const handleShopPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const base64Url = uploadEvent.target?.result as string;
      if (base64Url) {
        setShopPhoto(base64Url);
        setIsCustomShopPhoto(true);
      }
    };
    reader.readAsDataURL(file);
  };

  // Submit Evidence handler
  const handleSubmitEvidence = () => {
    if (!currentScenario) return;

    const evidencePayload: MerchantEvidence = {
      voiceStatement: statementText.trim(),
      receiptImage: receiptImage || currentScenario.evidence.receiptImage,
      shopPhoto: shopPhoto || currentScenario.evidence.shopPhoto,
      uploadedAt: new Date().toISOString(),
    };

    submitEvidence(evidencePayload);
    onSubmitEvidence?.(evidencePayload);
    runAuditPipeline(evidencePayload);
  };

  const handleSelectScenario = (id: string) => {
    const found = DEMO_SCENARIOS.find((s) => s.id === id);
    if (found) {
      loadScenario(found);
    }
  };

  const isCleared = adjudicationStatus === 'approved' || currentScenario?.transaction.status === 'cleared';
  const isRejected = adjudicationStatus === 'rejected' || currentScenario?.transaction.status === 'escalated';

  return (
    <div className={`w-full max-w-md mx-auto ${className}`}>
      <div className="flex flex-col rounded-2xl border border-slate-700/80 bg-slate-950 shadow-2xl overflow-hidden text-slate-100">
        
        {/* ========================================================= */}
        {/* TOP BAR: Language Selector & Portal Title                */}
        {/* ========================================================= */}
        <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 p-3.5 border-b border-emerald-600/30">
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/20 border border-emerald-400/40 text-emerald-300">
                <Store className="h-4 w-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-white leading-tight">
                  {t.portalTitle}
                </h2>
                <p className="text-[10.5px] text-emerald-200/80 truncate max-w-[190px]">
                  {currentScenario ? currentScenario.transaction.merchantName : 'NexusClear'}
                </p>
              </div>
            </div>

            {/* Language Switcher Buttons */}
            <div className="flex items-center rounded-lg bg-black/40 border border-emerald-500/30 p-0.5">
              <button
                type="button"
                onClick={() => setMerchantLanguage('kn')}
                className={`px-2 py-1 rounded text-[11px] font-bold transition-all cursor-pointer ${
                  merchantLanguage === 'kn'
                    ? 'bg-emerald-500 text-slate-950 shadow-sm'
                    : 'text-slate-300 hover:text-white'
                }`}
                title="ಕನ್ನಡ (Kannada)"
              >
                ಕನ್ನಡ
              </button>
              <button
                type="button"
                onClick={() => setMerchantLanguage('hi')}
                className={`px-2 py-1 rounded text-[11px] font-bold transition-all cursor-pointer ${
                  merchantLanguage === 'hi'
                    ? 'bg-emerald-500 text-slate-950 shadow-sm'
                    : 'text-slate-300 hover:text-white'
                }`}
                title="हिन्दी (Hindi)"
              >
                हिन्दी
              </button>
              <button
                type="button"
                onClick={() => setMerchantLanguage('en')}
                className={`px-2 py-1 rounded text-[11px] font-bold transition-all cursor-pointer ${
                  merchantLanguage === 'en'
                    ? 'bg-emerald-500 text-slate-950 shadow-sm'
                    : 'text-slate-300 hover:text-white'
                }`}
                title="English"
              >
                EN
              </button>
            </div>
          </div>

          {/* Quick Scenario Selector Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 custom-scrollbar">
            <span className="text-[10px] text-emerald-200/70 shrink-0 font-medium mr-0.5">
              Demo:
            </span>
            {DEMO_SCENARIOS.map((sc) => {
              const isActive = currentScenario?.id === sc.id;
              const isMule = sc.id === 'rajesh-trading';
              return (
                <button
                  key={sc.id}
                  onClick={() => handleSelectScenario(sc.id)}
                  className={`shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-full text-[10.5px] font-semibold border transition-all cursor-pointer ${
                    isActive
                      ? isMule
                        ? 'bg-rose-500/20 text-rose-300 border-rose-500 shadow-sm'
                        : 'bg-emerald-500/20 text-emerald-300 border-emerald-400 shadow-sm ring-1 ring-emerald-500/40'
                      : 'bg-black/30 text-slate-300 border-slate-700/60 hover:bg-black/50'
                  }`}
                >
                  <span>{sc.id === 'ramesh-medicals' ? '🏥' : sc.id === 'uncle-tan-chicken-rice' ? '🍗' : '🚩'}</span>
                  <span className="truncate max-w-[120px]">{sc.name.split(' ')[0]}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ========================================================= */}
        {/* MAIN BODY: Simple, Clean, Intuitive                      */}
        {/* ========================================================= */}
        <div className="p-3.5 space-y-3.5 overflow-y-auto max-h-[calc(100vh-12rem)] custom-scrollbar">
          
          {/* SECTION 1: DYNAMIC STATUS BANNER */}
          {isCleared ? (
            <div className="rounded-xl border border-emerald-500/60 bg-gradient-to-br from-emerald-950/90 via-emerald-900/40 to-slate-950 p-4 shadow-lg text-emerald-100 animate-slide-up">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-6 w-6 text-emerald-400 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h3 className="text-sm font-bold text-white">
                    {t.statusCleared}
                  </h3>
                  <p className="text-xs text-emerald-200/90 mt-1 leading-relaxed">
                    {t.statusClearedDesc}
                  </p>
                  <div className="mt-2.5 pt-2 border-t border-emerald-500/30 flex items-center justify-between text-[11px] font-mono text-emerald-300">
                    <span>{t.safeHarborProtected}</span>
                    <span className="text-emerald-400 font-bold">100% UNBLOCKED</span>
                  </div>
                </div>
              </div>
            </div>
          ) : isRejected ? (
            <div className="rounded-xl border border-rose-500/60 bg-gradient-to-br from-rose-950/90 via-rose-900/40 to-slate-950 p-4 shadow-lg text-rose-100 animate-slide-up">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-6 w-6 text-rose-400 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h3 className="text-sm font-bold text-white">
                    {t.statusRejected}
                  </h3>
                  <p className="text-xs text-rose-200/90 mt-1 leading-relaxed">
                    {t.statusRejectedDesc}
                  </p>
                  <div className="mt-2.5 pt-2 border-t border-rose-500/30 text-[11px] font-mono text-rose-300">
                    NCRP Case Ref: {currentScenario?.transaction.regulatoryReference || 'STR-2026-MULE'}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Active Freeze Notice */
            <div className="rounded-xl border border-rose-500/50 bg-gradient-to-br from-rose-950/40 via-slate-900 to-slate-950 p-3.5 shadow-md">
              <div className="flex items-center justify-between mb-2">
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[10.5px] font-bold">
                  <AlertTriangle className="h-3 w-3" />
                  {t.holdLayer}
                </span>
                <span className="text-[11px] font-mono text-amber-400">
                  {t.daysRemaining}
                </span>
              </div>

              <div className="flex items-baseline justify-between mb-1.5">
                <span className="text-xs text-slate-400">{t.frozenAmount}:</span>
                <span className="text-2xl font-black font-mono text-white">
                  {currentScenario ? formatCurrency(currentScenario.transaction.amount, currentJurisdiction) : '₹0'}
                </span>
              </div>

              <p className="text-[11.5px] text-slate-300 leading-normal">
                {t.freezeAlertDesc}
              </p>
            </div>
          )}

          {/* SECTION 2: VERNACULAR STATEMENT (Voice & Text) */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-3.5 space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-200 flex items-center gap-1.5">
                <Volume2 className="h-3.5 w-3.5 text-emerald-400" />
                {t.statementTitle}
              </span>
              <button
                type="button"
                onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-semibold text-[11px] cursor-pointer"
              >
                {isPlayingAudio ? (
                  <>
                    <Square className="h-3 w-3 fill-current" />
                    {t.pauseAudio}
                  </>
                ) : (
                  <>
                    <Play className="h-3 w-3 fill-current" />
                    {t.previewAudio}
                  </>
                )}
              </button>
            </div>

            {/* Statement Textarea */}
            <textarea
              rows={3}
              value={statementText}
              onChange={(e) => setStatementText(e.target.value)}
              placeholder={t.statementPlaceholder}
              className="w-full resize-none rounded-lg border border-slate-700 bg-black/40 p-2.5 text-xs text-slate-100 placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
            />

            {/* Waveform Bar */}
            <div className="rounded-lg bg-black/60 border border-slate-800 p-2">
              <WaveformVisualizer
                waveformData={isRecording ? liveWaveform : syntheticWaveform}
                isActive={isRecording || isPlayingAudio}
                style={currentScenario?.id === 'rajesh-trading' ? 'nervous' : 'confident'}
              />
            </div>

            {/* Record Voice Button */}
            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={handleToggleRecord}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                  isRecording
                    ? 'bg-rose-600 text-white animate-pulse'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-slate-950'
                }`}
              >
                {isRecording ? (
                  <>
                    <MicOff className="h-3.5 w-3.5" />
                    {t.stopRecord} ({recordingDuration.toFixed(1)}s)
                  </>
                ) : (
                  <>
                    <Mic className="h-3.5 w-3.5" />
                    {t.recordVoice}
                  </>
                )}
              </button>

              <span className="text-[10px] text-slate-400 font-mono">
                Gemini 2.5 Speech Engine
              </span>
            </div>

            {recordingError && (
              <p className="text-[10.5px] text-rose-400 bg-rose-950/40 p-1.5 rounded">
                {recordingError}
              </p>
            )}
          </div>

          {/* SECTION 3: PROOF OF SALE EVIDENCE (Bill & Shop Photo) */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-3.5 space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-200 flex items-center gap-1.5">
                <FileText className="h-3.5 w-3.5 text-emerald-400" />
                {t.evidenceTitle}
              </span>
              <span className="text-[10.5px] text-slate-400 font-mono">
                Canvas 2D Auto-Gen
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {/* Receipt Slot */}
              <div className="flex flex-col space-y-1">
                <span className="text-[11px] text-slate-300 font-medium truncate">
                  {t.receiptLabel}
                </span>
                <div
                  onClick={() => receiptImage && setActiveModalImage(receiptImage)}
                  className="relative h-32 w-full rounded-lg bg-slate-950 border border-slate-700 hover:border-emerald-500 overflow-hidden cursor-pointer group flex items-center justify-center p-1"
                >
                  {receiptImage ? (
                    <>
                      <img
                        src={receiptImage}
                        alt="Receipt"
                        className="h-full w-full object-contain rounded bg-white"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <ZoomIn className="h-5 w-5 text-emerald-400" />
                      </div>
                    </>
                  ) : (
                    <span className="text-[11px] text-slate-500">No receipt</span>
                  )}
                </div>
                <input
                  ref={receiptFileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleReceiptUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => receiptFileInputRef.current?.click()}
                  className="text-[10.5px] text-slate-400 hover:text-emerald-300 flex items-center justify-center gap-1 py-1 rounded bg-black/40 border border-slate-800 cursor-pointer"
                >
                  <Upload className="h-3 w-3" />
                  {t.uploadCustom}
                </button>
              </div>

              {/* Shop Photo Slot */}
              <div className="flex flex-col space-y-1">
                <span className="text-[11px] text-slate-300 font-medium truncate">
                  {t.shopPhotoLabel}
                </span>
                <div
                  onClick={() => shopPhoto && setActiveModalImage(shopPhoto)}
                  className="relative h-32 w-full rounded-lg bg-slate-950 border border-slate-700 hover:border-emerald-500 overflow-hidden cursor-pointer group flex items-center justify-center p-1"
                >
                  {shopPhoto ? (
                    <>
                      <img
                        src={shopPhoto}
                        alt="Shop Premises"
                        className="h-full w-full object-cover rounded"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <ZoomIn className="h-5 w-5 text-emerald-400" />
                      </div>
                    </>
                  ) : (
                    <span className="text-[11px] text-slate-500">No photo</span>
                  )}
                </div>
                <input
                  ref={shopPhotoFileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleShopPhotoUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => shopPhotoFileInputRef.current?.click()}
                  className="text-[10.5px] text-slate-400 hover:text-emerald-300 flex items-center justify-center gap-1 py-1 rounded bg-black/40 border border-slate-800 cursor-pointer"
                >
                  <Camera className="h-3 w-3" />
                  {t.uploadCustom}
                </button>
              </div>
            </div>
          </div>

          {/* SECTION 4: SUBMIT BUTTON */}
          <div className="pt-1">
            {isProcessing && (
              <div className="mb-2 p-2.5 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-xs text-emerald-300 flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin text-emerald-400 shrink-0" />
                <span className="font-mono text-[11px]">{processingStage || t.processingText}</span>
              </div>
            )}

            <button
              type="button"
              disabled={isProcessing}
              onClick={handleSubmitEvidence}
              className={`w-full flex items-center justify-center gap-2 rounded-xl py-3 px-4 text-xs sm:text-sm font-bold shadow-lg transition-all cursor-pointer ${
                isProcessing
                  ? 'bg-slate-800 text-slate-400 cursor-not-allowed border border-slate-700'
                  : 'bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 text-slate-950 hover:from-emerald-400 hover:to-teal-400 shadow-emerald-500/20 active:scale-[0.99]'
              }`}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin text-slate-950" />
                  <span>{t.processingText}</span>
                </>
              ) : evidenceSubmitted ? (
                <>
                  <RefreshCw className="h-4 w-4 text-slate-950" />
                  <span>{t.reSubmitButton}</span>
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 text-slate-950 fill-current" />
                  <span>{t.submitButton}</span>
                </>
              )}
            </button>
          </div>

        </div>

        {/* Image Zoom Modal */}
        {activeModalImage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="relative max-w-lg w-full bg-slate-900 border border-slate-700 rounded-xl p-3 shadow-2xl flex flex-col items-center">
              <button
                type="button"
                onClick={() => setActiveModalImage(null)}
                className="absolute top-2 right-2 p-1.5 rounded-full bg-slate-800 text-slate-300 hover:text-white cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
              <img
                src={activeModalImage}
                alt="Enlarged evidence"
                className="max-h-[75vh] w-auto object-contain rounded-lg bg-white mt-4"
              />
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default MerchantApp;
