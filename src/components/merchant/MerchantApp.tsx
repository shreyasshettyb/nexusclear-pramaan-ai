import React, { useState, useEffect, useRef } from 'react';
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
  RefreshCw,
  Volume2,
  ZoomIn,
  X,
  Store,
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

  useEffect(() => {
    if (!currentScenario) return;
    const statements = SCENARIO_STATEMENTS[currentScenario.id];
    if (statements && statements[merchantLanguage]) {
      setStatementText(statements[merchantLanguage]);
    } else {
      setStatementText(currentScenario.evidence.voiceStatement || '');
    }
  }, [currentScenario?.id, merchantLanguage]);

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
            : 'Microphone permission denied. You can still type your statement.';
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
    <div className={`w-full max-w-sm sm:max-w-md mx-auto ${className}`}>
      {/* Material 3 Pixel Chassis */}
      <div className="flex flex-col rounded-3xl border border-[#2d3036] bg-[#131314] shadow-xl overflow-hidden text-[#e2e2e9]">
        
        {/* ========================================================= */}
        {/* MATERIAL 3 APP BAR: Minimalist Merchant Header          */}
        {/* ========================================================= */}
        <div className="bg-[#1d2024] p-3.5 border-b border-[#2d3036]">
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#004a77] text-[#8ab4f8]">
                <Store className="h-4 w-4" />
              </div>
              <div>
                <h2 className="text-xs sm:text-sm font-semibold text-white leading-tight">
                  {t.portalTitle}
                </h2>
                <p className="text-[11px] text-[#9aa0a6] truncate max-w-[180px]">
                  {currentScenario ? currentScenario.transaction.merchantName : 'NexusClear'}
                </p>
              </div>
            </div>

            {/* Material 3 Language Chips */}
            <div className="flex items-center rounded-full bg-[#111318] p-0.5 border border-[#3c4048]">
              {(['kn', 'hi', 'en'] as MerchantLanguage[]).map((lang) => {
                const label = lang === 'kn' ? 'ಕನ್ನಡ' : lang === 'hi' ? 'हिन्दी' : 'EN';
                const isSelected = merchantLanguage === lang;
                return (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => setMerchantLanguage(lang)}
                    className={`px-2.5 py-1 rounded-full text-[10.5px] font-medium transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#8ab4f8] text-[#003258] font-bold shadow-xs'
                        : 'text-[#9aa0a6] hover:text-white'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Material 3 Demo Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 custom-scrollbar">
            {DEMO_SCENARIOS.map((sc) => {
              const isActive = currentScenario?.id === sc.id;
              const isMule = sc.id === 'rajesh-trading';
              return (
                <button
                  key={sc.id}
                  onClick={() => handleSelectScenario(sc.id)}
                  className={`shrink-0 flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-medium border transition-all cursor-pointer ${
                    isActive
                      ? isMule
                        ? 'bg-[#8c1d18]/40 text-[#f28b82] border-[#f28b82]'
                        : 'bg-[#004a77] text-[#d1e4ff] border-[#8ab4f8]'
                      : 'bg-[#191c20] text-[#9aa0a6] border-[#2d3036] hover:bg-[#272a2f]'
                  }`}
                >
                  <span>{sc.id === 'ramesh-medicals' ? '🏥' : sc.id === 'uncle-tan-chicken-rice' ? '🍗' : '🚩'}</span>
                  <span className="truncate max-w-[110px]">{sc.name.split(' ')[0]}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ========================================================= */}
        {/* MAIN BODY: Minimalist Material Surfaces                  */}
        {/* ========================================================= */}
        <div className="p-3.5 space-y-3 overflow-y-auto max-h-[calc(100vh-13rem)] custom-scrollbar">
          
          {/* 1. DYNAMIC STATUS CARD */}
          {isCleared ? (
            <div className="rounded-2xl border border-[#81c995] bg-[#00522b]/30 p-3.5 text-[#c4eed0]">
              <div className="flex items-start gap-2.5">
                <CheckCircle className="h-5 w-5 text-[#81c995] shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h3 className="text-xs sm:text-sm font-semibold text-white">
                    {t.statusCleared}
                  </h3>
                  <p className="text-[11.5px] text-[#c4eed0] mt-0.5 leading-relaxed">
                    {t.statusClearedDesc}
                  </p>
                  <div className="mt-2 pt-1.5 border-t border-[#81c995]/30 flex items-center justify-between text-[10.5px] font-mono text-[#81c995]">
                    <span>{t.safeHarborProtected}</span>
                    <span className="font-bold">UNBLOCKED</span>
                  </div>
                </div>
              </div>
            </div>
          ) : isRejected ? (
            <div className="rounded-2xl border border-[#f28b82] bg-[#8c1d18]/30 p-3.5 text-[#fce8e6]">
              <div className="flex items-start gap-2.5">
                <AlertTriangle className="h-5 w-5 text-[#f28b82] shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h3 className="text-xs sm:text-sm font-semibold text-white">
                    {t.statusRejected}
                  </h3>
                  <p className="text-[11.5px] text-[#fce8e6] mt-0.5 leading-relaxed">
                    {t.statusRejectedDesc}
                  </p>
                  <div className="mt-2 pt-1.5 border-t border-[#f28b82]/30 text-[10.5px] font-mono text-[#f28b82]">
                    Ref: {currentScenario?.transaction.regulatoryReference || 'STR-2026-MULE'}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-[#f28b82]/40 bg-[#1d2024] p-3.5">
              <div className="flex items-center justify-between mb-1.5">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-500/15 text-[#f28b82] text-[10.5px] font-medium border border-rose-500/30">
                  <AlertTriangle className="h-3 w-3" />
                  {t.holdLayer}
                </span>
                <span className="text-[10.5px] text-[#fdd663] font-mono">
                  {t.daysRemaining}
                </span>
              </div>

              <div className="flex items-baseline justify-between mb-1">
                <span className="text-xs text-[#9aa0a6]">{t.frozenAmount}:</span>
                <span className="text-xl font-bold font-mono text-white">
                  {currentScenario ? formatCurrency(currentScenario.transaction.amount, currentJurisdiction) : '₹0'}
                </span>
              </div>

              <p className="text-[11px] text-[#c4c6d0] leading-normal">
                {t.freezeAlertDesc}
              </p>
            </div>
          )}

          {/* 2. VERNACULAR STATEMENT (Voice / Text) */}
          <div className="rounded-2xl border border-[#2d3036] bg-[#1d2024] p-3 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-white flex items-center gap-1.5">
                <Volume2 className="h-3.5 w-3.5 text-[#8ab4f8]" />
                {t.statementTitle}
              </span>
              <button
                type="button"
                onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                className="text-[#8ab4f8] hover:text-[#a8c7fa] flex items-center gap-1 font-medium text-[11px] cursor-pointer"
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

            <textarea
              rows={3}
              value={statementText}
              onChange={(e) => setStatementText(e.target.value)}
              placeholder={t.statementPlaceholder}
              className="w-full resize-none rounded-xl border border-[#3c4048] bg-[#131314] p-2.5 text-xs text-white placeholder-[#80868b] focus:border-[#8ab4f8] focus:outline-none"
            />

            {/* Waveform Bar */}
            <div className="rounded-xl bg-[#131314] border border-[#2d3036] p-2">
              <WaveformVisualizer
                waveformData={isRecording ? liveWaveform : syntheticWaveform}
                isActive={isRecording || isPlayingAudio}
                style={currentScenario?.id === 'rajesh-trading' ? 'nervous' : 'confident'}
              />
            </div>

            {/* Record Voice Button */}
            <div className="flex items-center justify-between pt-0.5">
              <button
                type="button"
                onClick={handleToggleRecord}
                className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all cursor-pointer ${
                  isRecording
                    ? 'bg-[#d93025] text-white animate-pulse'
                    : 'bg-[#272a2f] hover:bg-[#32353a] text-white border border-[#3c4048]'
                }`}
              >
                {isRecording ? (
                  <>
                    <MicOff className="h-3.5 w-3.5" />
                    {t.stopRecord} ({recordingDuration.toFixed(1)}s)
                  </>
                ) : (
                  <>
                    <Mic className="h-3.5 w-3.5 text-[#8ab4f8]" />
                    {t.recordVoice}
                  </>
                )}
              </button>

              <span className="text-[10px] text-[#9aa0a6]">
                Gemini Multimodal Voice
              </span>
            </div>

            {recordingError && (
              <p className="text-[10.5px] text-[#f28b82] bg-rose-950/30 p-1.5 rounded-lg border border-rose-500/20">
                {recordingError}
              </p>
            )}
          </div>

          {/* 3. PROOF OF SALE EVIDENCE (Bill & Shop Photo) */}
          <div className="rounded-2xl border border-[#2d3036] bg-[#1d2024] p-3 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-white flex items-center gap-1.5">
                <FileText className="h-3.5 w-3.5 text-[#8ab4f8]" />
                {t.evidenceTitle}
              </span>
              <span className="text-[10px] text-[#9aa0a6]">
                Canvas 2D Base64
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {/* Receipt Slot */}
              <div className="flex flex-col space-y-1">
                <span className="text-[10.5px] text-[#c4c6d0] truncate">
                  {t.receiptLabel}
                </span>
                <div
                  onClick={() => receiptImage && setActiveModalImage(receiptImage)}
                  className="relative h-28 w-full rounded-xl bg-[#131314] border border-[#2d3036] hover:border-[#8ab4f8] overflow-hidden cursor-pointer group flex items-center justify-center p-1"
                >
                  {receiptImage ? (
                    <>
                      <img
                        src={receiptImage}
                        alt="Receipt"
                        className="h-full w-full object-contain rounded bg-white"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <ZoomIn className="h-4 w-4 text-[#8ab4f8]" />
                      </div>
                    </>
                  ) : (
                    <span className="text-[10.5px] text-[#80868b]">No receipt</span>
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
                  className="text-[10px] text-[#9aa0a6] hover:text-white flex items-center justify-center gap-1 py-1 rounded-full bg-[#191c20] border border-[#2d3036] cursor-pointer"
                >
                  <Upload className="h-3 w-3" />
                  {t.uploadCustom}
                </button>
              </div>

              {/* Shop Photo Slot */}
              <div className="flex flex-col space-y-1">
                <span className="text-[10.5px] text-[#c4c6d0] truncate">
                  {t.shopPhotoLabel}
                </span>
                <div
                  onClick={() => shopPhoto && setActiveModalImage(shopPhoto)}
                  className="relative h-28 w-full rounded-xl bg-[#131314] border border-[#2d3036] hover:border-[#8ab4f8] overflow-hidden cursor-pointer group flex items-center justify-center p-1"
                >
                  {shopPhoto ? (
                    <>
                      <img
                        src={shopPhoto}
                        alt="Shop Premises"
                        className="h-full w-full object-cover rounded"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <ZoomIn className="h-4 w-4 text-[#8ab4f8]" />
                      </div>
                    </>
                  ) : (
                    <span className="text-[10.5px] text-[#80868b]">No photo</span>
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
                  className="text-[10px] text-[#9aa0a6] hover:text-white flex items-center justify-center gap-1 py-1 rounded-full bg-[#191c20] border border-[#2d3036] cursor-pointer"
                >
                  <Camera className="h-3 w-3" />
                  {t.uploadCustom}
                </button>
              </div>
            </div>
          </div>

          {/* 4. MATERIAL SUBMIT BUTTON */}
          <div className="pt-1">
            {isProcessing && (
              <div className="mb-2 p-2 rounded-xl bg-[#1d2024] border border-[#8ab4f8]/30 text-xs text-[#8ab4f8] flex items-center gap-2">
                <Loader2 className="h-3.5 w-3.5 animate-spin text-[#8ab4f8] shrink-0" />
                <span className="text-[11px] font-sans truncate">{processingStage || t.processingText}</span>
              </div>
            )}

            <button
              type="button"
              disabled={isProcessing}
              onClick={handleSubmitEvidence}
              className={`w-full flex items-center justify-center gap-2 rounded-full py-2.5 px-4 text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                isProcessing
                  ? 'bg-[#272a2f] text-[#80868b] cursor-not-allowed border border-[#3c4048]'
                  : 'bg-[#8ab4f8] hover:bg-[#a8c7fa] text-[#003258] shadow-sm'
              }`}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin text-[#003258]" />
                  <span>{t.processingText}</span>
                </>
              ) : evidenceSubmitted ? (
                <>
                  <RefreshCw className="h-4 w-4 text-[#003258]" />
                  <span>{t.reSubmitButton}</span>
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 text-[#003258] fill-current" />
                  <span>{t.submitButton}</span>
                </>
              )}
            </button>
          </div>

        </div>

        {/* Material Modal Dialog */}
        {activeModalImage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4">
            <div className="relative max-w-md w-full bg-[#1d2024] border border-[#3c4048] rounded-3xl p-3 shadow-2xl flex flex-col items-center">
              <button
                type="button"
                onClick={() => setActiveModalImage(null)}
                className="absolute top-2.5 right-2.5 p-1 rounded-full bg-[#272a2f] text-[#c4c6d0] hover:text-white cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
              <img
                src={activeModalImage}
                alt="Enlarged evidence"
                className="max-h-[70vh] w-auto object-contain rounded-2xl bg-white mt-4"
              />
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default MerchantApp;
