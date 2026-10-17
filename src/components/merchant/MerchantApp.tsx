import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Camera,
  Upload,
  AlertTriangle,
  Send,
  CheckCircle2,
  FileText,
  Play,
  Square,
  Loader2,
  RefreshCw,
  Volume2,
  ZoomIn,
  X,
  Store,
  ShieldCheck,
  Check,
} from 'lucide-react';
import type { MerchantEvidence, MerchantLanguage } from '../../types';
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
  } = useAppContext();

  const t = TRANSLATIONS[merchantLanguage] || TRANSLATIONS.en;
  const jurisdictionConfig = getJurisdiction(currentJurisdiction);

  const [statementText, setStatementText] = useState<string>('');
  const [receiptImage, setReceiptImage] = useState<string>('');
  const [shopPhoto, setShopPhoto] = useState<string>('');
  const [activeModalImage, setActiveModalImage] = useState<string | null>(null);

  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordingDuration, setRecordingDuration] = useState<number>(0);
  const [liveWaveform, setLiveWaveform] = useState<number[]>([]);
  const [syntheticWaveform, setSyntheticWaveform] = useState<number[]>([]);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [recordingError, setRecordingError] = useState<string | null>(null);

  const receiptFileInputRef = useRef<HTMLInputElement | null>(null);
  const shopPhotoFileInputRef = useRef<HTMLInputElement | null>(null);

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

  // Update text when scenario or language changes
  useEffect(() => {
    if (!currentScenario) return;
    const statements = SCENARIO_STATEMENTS[currentScenario.id];
    if (statements && statements[merchantLanguage]) {
      setStatementText(statements[merchantLanguage]);
    } else {
      setStatementText(currentScenario.evidence.voiceStatement || '');
    }
  }, [currentScenario?.id, merchantLanguage]);

  // Generate synthetic canvas images for demo
  useEffect(() => {
    if (!currentScenario) {
      setReceiptImage('');
      setShopPhoto('');
      setSyntheticWaveform([]);
      return;
    }

    const style = currentScenario.id === 'rajesh-trading' ? 'nervous' : 'confident';
    const wave = generateSyntheticWaveform(4000, style);
    setSyntheticWaveform(wave);

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
      setReceiptImage(currentScenario.evidence.receiptImage || '');
      setShopPhoto(currentScenario.evidence.shopPhoto || '');
    }
  }, [currentScenario?.id]);

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
            : 'Microphone permission denied. You can type your statement instead.';
        setRecordingError(message);
      }
    }
  };

  const handleReceiptUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const base64Url = uploadEvent.target?.result as string;
      if (base64Url) setReceiptImage(base64Url);
    };
    reader.readAsDataURL(file);
  };

  const handleShopPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const base64Url = uploadEvent.target?.result as string;
      if (base64Url) setShopPhoto(base64Url);
    };
    reader.readAsDataURL(file);
  };

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
    if (found) loadScenario(found);
  };

  const isCleared = adjudicationStatus === 'approved' || currentScenario?.transaction.status === 'cleared';
  const isRejected = adjudicationStatus === 'rejected' || currentScenario?.transaction.status === 'escalated';

  return (
    <div className={`w-full max-w-lg mx-auto ${className}`}>
      {/* Google Material Surface Container */}
      <div className="rounded-3xl bg-[#1e1f20] border border-[#333538] p-4 sm:p-6 shadow-sm flex flex-col gap-4 text-[#e3e3e3]">
        
        {/* ========================================================= */}
        {/* 1. HEADER: Merchant Identity & Language Switcher          */}
        {/* ========================================================= */}
        <div className="flex items-center justify-between gap-2.5 pb-3 border-b border-[#2d2f31]">
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1b3a5b] text-[#8ab4f8] shrink-0">
              <Store className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-sm font-semibold text-white leading-tight truncate">
                {currentScenario?.transaction.merchantName || t.portalTitle}
              </h2>
              <p className="text-[11px] text-[#9aa0a6] truncate">
                {currentScenario ? `${currentScenario.transaction.merchantCategory} • ${currentScenario.transaction.merchantAddress}` : t.portalSubtitle}
              </p>
            </div>
          </div>

          {/* Google Translate Style Language Switcher */}
          <div className="flex items-center rounded-full bg-[#131314] p-0.5 border border-[#333538] shrink-0">
            {(['kn', 'en', 'hi'] as MerchantLanguage[]).map((lang) => {
              const label = lang === 'kn' ? 'ಕನ್ನಡ' : lang === 'hi' ? 'हिन्दी' : 'EN';
              const isSelected = merchantLanguage === lang;
              return (
                <button
                  key={lang}
                  type="button"
                  onClick={() => setMerchantLanguage(lang)}
                  className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#8ab4f8] text-[#002b4f] font-semibold shadow-xs'
                      : 'text-[#9aa0a6] hover:text-white'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* ========================================================= */}
        {/* 2. DEMO SCENARIO CHIPS (Minimal, 1-Click)                 */}
        {/* ========================================================= */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar">
          {DEMO_SCENARIOS.map((sc) => {
            const isActive = currentScenario?.id === sc.id;
            const isMule = sc.id === 'rajesh-trading';
            return (
              <button
                key={sc.id}
                type="button"
                onClick={() => handleSelectScenario(sc.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium shrink-0 transition-all cursor-pointer border ${
                  isActive
                    ? 'bg-[#8ab4f8] text-[#002b4f] border-[#8ab4f8] font-semibold'
                    : 'bg-[#131314] border-[#2d2f31] text-[#9aa0a6] hover:text-white hover:border-[#3c4043]'
                }`}
              >
                <span>{sc.id === 'ramesh-medicals' ? '🏥' : sc.id === 'uncle-tan-chicken-rice' ? '🍗' : '🚩'}</span>
                <span>{sc.name.split(' ')[0]}</span>
                <span className="opacity-80 font-mono text-[10px]">
                  {formatCurrency(sc.transaction.amount, sc.jurisdiction)}
                </span>
              </button>
            );
          })}
        </div>

        {/* ========================================================= */}
        {/* 3. TRANSACTION HERO & STATUS CARD                         */}
        {/* ========================================================= */}
        {isCleared ? (
          <div className="rounded-2xl border border-[#81c995]/50 bg-[#133924] p-4 text-[#c4eed0] flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 text-[#81c995] shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-semibold text-white">
                {t.statusCleared}
              </h3>
              <p className="text-xs text-[#c4eed0] mt-1 leading-relaxed">
                {t.statusClearedDesc}
              </p>
              <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#81c995]/20 text-[#81c995] text-[11px] font-medium">
                <ShieldCheck className="h-3 w-3" />
                <span>{t.safeHarborProtected}</span>
              </div>
            </div>
          </div>
        ) : isRejected ? (
          <div className="rounded-2xl border border-[#f28b82]/50 bg-[#3c1618] p-4 text-[#fce8e6] flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-[#f28b82] shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-semibold text-white">
                {t.statusRejected}
              </h3>
              <p className="text-xs text-[#fce8e6] mt-1 leading-relaxed">
                {t.statusRejectedDesc}
              </p>
              <div className="mt-2 text-[11px] font-mono text-[#f28b82]">
                Case Ref: {currentScenario?.transaction.regulatoryReference || 'STR-2026-MULE'}
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl bg-[#131314] p-4 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#9aa0a6]">{t.frozenAmount}</span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#3b2f0a] text-[#fdd663] text-[11px] font-medium">
                <AlertTriangle className="h-3 w-3" />
                {t.holdLayer}
              </span>
            </div>
            <div className="text-2xl sm:text-3xl font-bold font-mono text-white">
              {currentScenario ? formatCurrency(currentScenario.transaction.amount, currentJurisdiction) : '₹0'}
            </div>
            <p className="text-xs text-[#9aa0a6] leading-relaxed">
              {t.freezeAlertDesc}
            </p>
          </div>
        )}

        {/* ========================================================= */}
        {/* 4. STEP 1: EXPLANATION (Vernacular Voice / Text)          */}
        {/* ========================================================= */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-[#e3e3e3] flex items-center gap-1.5">
              <Volume2 className="h-3.5 w-3.5 text-[#8ab4f8]" />
              {t.statementTitle}
            </label>
            <button
              type="button"
              onClick={() => setIsPlayingAudio(!isPlayingAudio)}
              className="inline-flex items-center gap-1 text-[11px] font-medium text-[#8ab4f8] hover:text-[#a8c7fa] cursor-pointer"
            >
              {isPlayingAudio ? (
                <>
                  <Square className="h-3 w-3 fill-current" />
                  <span>{t.pauseAudio}</span>
                </>
              ) : (
                <>
                  <Play className="h-3 w-3 fill-current" />
                  <span>{t.previewAudio}</span>
                </>
              )}
            </button>
          </div>

          <div className="relative">
            <textarea
              rows={2}
              value={statementText}
              onChange={(e) => setStatementText(e.target.value)}
              placeholder={t.statementPlaceholder}
              className="w-full resize-none rounded-xl border border-[#2d2f31] bg-[#131314] p-3 pr-11 text-xs text-white placeholder-[#5f6368] focus:border-[#8ab4f8] focus:outline-none leading-relaxed"
            />
            <button
              type="button"
              onClick={handleToggleRecord}
              className={`absolute right-2.5 bottom-3 p-1.5 rounded-full transition-colors cursor-pointer ${
                isRecording
                  ? 'bg-[#d93025] text-white animate-pulse'
                  : 'bg-[#28292a] text-[#8ab4f8] hover:bg-[#333538]'
              }`}
              title={isRecording ? 'Stop recording' : 'Record voice'}
            >
              {isRecording ? <MicOff className="h-3.5 w-3.5" /> : <Mic className="h-3.5 w-3.5" />}
            </button>
          </div>

          {/* Minimal Subtle Waveform */}
          <div className="h-7 w-full overflow-hidden rounded-lg bg-[#131314] px-2 py-1">
            <WaveformVisualizer
              waveformData={isRecording ? liveWaveform : syntheticWaveform}
              isActive={isRecording || isPlayingAudio}
              style={currentScenario?.id === 'rajesh-trading' ? 'nervous' : 'confident'}
            />
          </div>

          {recordingError && (
            <p className="text-xs text-[#f28b82] bg-[#3c1618] p-2 rounded-xl">
              {recordingError}
            </p>
          )}
        </div>

        {/* ========================================================= */}
        {/* 5. STEP 2: DOCUMENTS (Receipt & Store Photo)              */}
        {/* ========================================================= */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold text-[#e3e3e3] flex items-center gap-1.5">
            <FileText className="h-3.5 w-3.5 text-[#8ab4f8]" />
            {t.evidenceTitle}
          </span>

          <div className="grid grid-cols-2 gap-2.5">
            {/* Receipt Preview */}
            <div className="flex flex-col gap-1">
              <div
                onClick={() => receiptImage && setActiveModalImage(receiptImage)}
                className="relative h-24 w-full rounded-xl bg-[#131314] border border-[#2d2f31] hover:border-[#8ab4f8] overflow-hidden cursor-pointer group flex items-center justify-center p-1 transition-colors"
              >
                {receiptImage ? (
                  <>
                    <img
                      src={receiptImage}
                      alt="Receipt"
                      className="h-full w-full object-contain rounded-lg bg-white"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-xl">
                      <ZoomIn className="h-4 w-4 text-white" />
                    </div>
                  </>
                ) : (
                  <span className="text-[11px] text-[#5f6368]">No receipt</span>
                )}
              </div>
              <div className="flex items-center justify-between text-[11px] text-[#9aa0a6]">
                <span className="truncate">{t.receiptLabel.split('.')[1] || t.receiptLabel}</span>
                <button
                  type="button"
                  onClick={() => receiptFileInputRef.current?.click()}
                  className="text-[#8ab4f8] hover:underline cursor-pointer"
                >
                  Upload
                </button>
              </div>
              <input
                ref={receiptFileInputRef}
                type="file"
                accept="image/*"
                onChange={handleReceiptUpload}
                className="hidden"
              />
            </div>

            {/* Shop Photo Preview */}
            <div className="flex flex-col gap-1">
              <div
                onClick={() => shopPhoto && setActiveModalImage(shopPhoto)}
                className="relative h-24 w-full rounded-xl bg-[#131314] border border-[#2d2f31] hover:border-[#8ab4f8] overflow-hidden cursor-pointer group flex items-center justify-center p-1 transition-colors"
              >
                {shopPhoto ? (
                  <>
                    <img
                      src={shopPhoto}
                      alt="Store Counter"
                      className="h-full w-full object-cover rounded-lg"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-xl">
                      <ZoomIn className="h-4 w-4 text-white" />
                    </div>
                  </>
                ) : (
                  <span className="text-[11px] text-[#5f6368]">No photo</span>
                )}
              </div>
              <div className="flex items-center justify-between text-[11px] text-[#9aa0a6]">
                <span className="truncate">{t.shopPhotoLabel.split('.')[1] || t.shopPhotoLabel}</span>
                <button
                  type="button"
                  onClick={() => shopPhotoFileInputRef.current?.click()}
                  className="text-[#8ab4f8] hover:underline cursor-pointer"
                >
                  Upload
                </button>
              </div>
              <input
                ref={shopPhotoFileInputRef}
                type="file"
                accept="image/*"
                onChange={handleShopPhotoUpload}
                className="hidden"
              />
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* 6. PRIMARY ACTION BUTTON                                  */}
        {/* ========================================================= */}
        <div className="pt-1 flex flex-col gap-2">
          {isProcessing && (
            <div className="p-2.5 rounded-xl bg-[#1b3a5b] text-xs text-[#d3e3fd] flex items-center gap-2">
              <Loader2 className="h-3.5 w-3.5 animate-spin text-[#8ab4f8] shrink-0" />
              <span className="truncate">{processingStage || t.processingText}</span>
            </div>
          )}

          <button
            type="button"
            disabled={isProcessing}
            onClick={handleSubmitEvidence}
            className={`w-full flex items-center justify-center gap-2 rounded-full py-2.5 px-4 text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              isProcessing
                ? 'bg-[#28292a] text-[#5f6368] cursor-not-allowed'
                : 'bg-[#8ab4f8] hover:bg-[#a8c7fa] text-[#002b4f] shadow-sm'
            }`}
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin text-[#002b4f]" />
                <span>{t.processingText}</span>
              </>
            ) : evidenceSubmitted ? (
              <>
                <RefreshCw className="h-4 w-4 text-[#002b4f]" />
                <span>{t.reSubmitButton}</span>
              </>
            ) : (
              <>
                <Send className="h-4 w-4 text-[#002b4f] fill-current" />
                <span>{t.submitButton}</span>
              </>
            )}
          </button>
        </div>

      </div>

      {/* Lightbox Modal */}
      {activeModalImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="relative max-w-md w-full bg-[#1e1f20] border border-[#333538] rounded-3xl p-4 shadow-2xl flex flex-col items-center">
            <button
              type="button"
              onClick={() => setActiveModalImage(null)}
              className="absolute top-3 right-3 p-1 rounded-full bg-[#28292a] text-[#9aa0a6] hover:text-white cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
            <img
              src={activeModalImage}
              alt="Enlarged evidence"
              className="max-h-[75vh] w-auto object-contain rounded-2xl bg-white mt-4"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default MerchantApp;
