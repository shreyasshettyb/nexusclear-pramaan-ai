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
  Phone,
  Image as ImageIcon,
  Play,
  Square,
  Loader2,
  Sparkles,
  RefreshCw,
  CheckCheck,
  Building2,
  Volume2,
  Info,
  Wifi,
  Battery,
  Signal,
  Check,
} from 'lucide-react';
import type { MerchantEvidence, DemoScenario } from '../../types';
import { useAppContext } from '../../context/AppContext';
import { DEMO_SCENARIOS } from '../../data/scenarios';
import { getJurisdiction } from '../../data/jurisdictions';
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
import TransactionAlert from './TransactionAlert';
import ScenarioCards from './ScenarioCards';

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
  } = useAppContext();

  // Active jurisdiction config
  const jurisdictionConfig = getJurisdiction(currentJurisdiction);

  // Evidence state
  const [statementText, setStatementText] = useState<string>('');
  const [receiptImage, setReceiptImage] = useState<string>('');
  const [isCustomReceipt, setIsCustomReceipt] = useState<boolean>(false);
  const [shopPhoto, setShopPhoto] = useState<string>('');
  const [isCustomShopPhoto, setIsCustomShopPhoto] = useState<boolean>(false);
  const [additionalNotes, setAdditionalNotes] = useState<string>('');

  // Audio recording & playback state
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordingDuration, setRecordingDuration] = useState<number>(0);
  const [liveWaveform, setLiveWaveform] = useState<number[]>([]);
  const [syntheticWaveform, setSyntheticWaveform] = useState<number[]>([]);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [recordingError, setRecordingError] = useState<string | null>(null);

  // Hidden file input refs
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

  // Sync state whenever the scenario changes
  useEffect(() => {
    if (!currentScenario) {
      setStatementText('');
      setReceiptImage('');
      setShopPhoto('');
      setAdditionalNotes('');
      setIsCustomReceipt(false);
      setIsCustomShopPhoto(false);
      setSyntheticWaveform([]);
      return;
    }

    setStatementText(currentScenario.evidence.voiceStatement || '');
    setAdditionalNotes(currentScenario.evidence.additionalNotes || '');
    setIsCustomReceipt(false);
    setIsCustomShopPhoto(false);

    // Generate synthetic waveform for scenario statement
    const style = currentScenario.id === 'rajesh-trading' ? 'nervous' : 'confident';
    const wave = generateSyntheticWaveform(4000, style);
    setSyntheticWaveform(wave);

    // Call syntheticReceiptGenerator for high-fidelity canvas receipts
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
      } else {
        setReceiptImage(currentScenario.evidence.receiptImage);
      }
    } catch (err) {
      console.warn('Canvas receipt generation fallback to scenario SVG:', err);
      setReceiptImage(currentScenario.evidence.receiptImage);
    }

    // Call syntheticReceiptGenerator for shop photo
    try {
      const shopType =
        currentScenario.id === 'ramesh-medicals'
          ? 'medical'
          : currentScenario.id === 'uncle-tan-chicken-rice'
          ? 'hawker'
          : 'suspicious';
      const canvasShopBase64 = generateShopPhoto(shopType);
      if (canvasShopBase64) {
        setShopPhoto(`data:image/png;base64,${canvasShopBase64}`);
      } else if (currentScenario.evidence.shopPhoto) {
        setShopPhoto(currentScenario.evidence.shopPhoto);
      }
    } catch (err) {
      console.warn('Canvas shop photo generation fallback to scenario SVG:', err);
      if (currentScenario.evidence.shopPhoto) {
        setShopPhoto(currentScenario.evidence.shopPhoto);
      }
    }
  }, [currentScenario]);

  // Audio recording toggle handler
  const handleToggleRecord = useCallback(async () => {
    setRecordingError(null);
    if (!isRecording) {
      try {
        await startRecording();
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Microphone error';
        setRecordingError(message);
      }
    } else {
      try {
        const result = await stopRecording();
        if (result.waveformData && result.waveformData.length > 0) {
          setSyntheticWaveform(result.waveformData);
        }
        // If merchant recorded live voice, append note or replace text
        if (!statementText) {
          setStatementText(
            `[Live Voice Note Recorded: ${result.audioBlob.size} bytes (${recordingDuration}s)] - Verification statement captured from merchant microphone.`
          );
        }
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Failed to finalize audio recording';
        setRecordingError(message);
      }
    }
  }, [isRecording, statementText, recordingDuration]);

  // Handle custom receipt upload
  const handleReceiptUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setReceiptImage(reader.result);
        setIsCustomReceipt(true);
      }
    };
    reader.readAsDataURL(file);
  };

  // Handle custom shop photo upload
  const handleShopPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setShopPhoto(reader.result);
        setIsCustomShopPhoto(true);
      }
    };
    reader.readAsDataURL(file);
  };

  // Switch / load scenario
  const handleSelectScenario = (scenarioId: string) => {
    const scenario = DEMO_SCENARIOS.find((s) => s.id === scenarioId);
    if (scenario) {
      loadScenario(scenario);
    }
  };

  // Submit Evidence handler
  const handleSubmitEvidence = () => {
    if (!currentScenario) return;

    const evidencePayload: MerchantEvidence = {
      voiceStatement: statementText.trim(),
      receiptImage: receiptImage || currentScenario.evidence.receiptImage,
      shopPhoto: shopPhoto || currentScenario.evidence.shopPhoto,
      additionalNotes: additionalNotes.trim(),
      uploadedAt: new Date().toISOString(),
    };

    submitEvidence(evidencePayload);
    onSubmitEvidence?.(evidencePayload);
    runAuditPipeline(evidencePayload);
  };

  const hasEvidence = Boolean(receiptImage || statementText.trim());

  return (
    <div className={`w-full max-w-md mx-auto ${className}`}>
      {/* Phone Mockup Frame Container */}
      <div className="relative flex flex-col rounded-3xl border-2 border-slate-700/80 bg-slate-950 shadow-2xl shadow-emerald-950/20 overflow-hidden ring-1 ring-white/10">
        
        {/* Mobile Status Bar (WhatsApp / Mobile Look) */}
        <div className="flex items-center justify-between px-6 pt-2 pb-1 bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-950 text-slate-400 text-[11px] select-none">
          <span className="font-mono font-semibold text-slate-300">09:41</span>
          
          {/* Speaker / camera notch cutout */}
          <div className="h-4 w-28 rounded-full bg-black/80 border border-white/5 flex items-center justify-center">
            <div className="h-1.5 w-1.5 rounded-full bg-slate-700 mr-2" />
            <div className="h-1.5 w-8 rounded-full bg-slate-800" />
          </div>

          <div className="flex items-center gap-1.5 text-slate-300">
            <Signal className="h-3 w-3" />
            <Wifi className="h-3 w-3" />
            <Battery className="h-3 w-3" />
          </div>
        </div>

        {/* Emerald WhatsApp/UPI Header Bar */}
        <div className="relative px-4 py-3 bg-gradient-to-r from-emerald-800 via-teal-800 to-emerald-900 border-b border-emerald-600/30 text-white shadow-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Merchant Avatar with Active Status Indicator */}
              <div className="relative">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-700 border-2 border-emerald-400 text-white shadow-inner font-bold text-sm">
                  {currentScenario ? currentScenario.name.charAt(0) : 'P'}
                </div>
                <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-400 ring-2 ring-slate-900" />
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <h2 className="text-sm font-bold tracking-tight text-white leading-tight">
                    Pramaan-AI
                  </h2>
                  <span className="rounded bg-emerald-950/60 px-1.5 py-0.2 text-[9.5px] font-medium text-emerald-300 border border-emerald-500/30">
                    MERCHANT
                  </span>
                </div>
                <p className="text-[11px] text-emerald-200/90 font-medium truncate max-w-[200px]">
                  {currentScenario ? currentScenario.name : 'No Scenario Loaded'}
                </p>
              </div>
            </div>

            {/* Header Action Icons */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                title="Support Helpline"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                <Phone className="h-4 w-4" />
              </button>
              <button
                type="button"
                title="Platform Information"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                <Info className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Scrollable Mobile Body */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 max-h-[740px] bg-grid-pattern">
          
          {/* SECTION 1: Frozen Transaction Alert Card */}
          {currentScenario ? (
            <TransactionAlert
              transaction={currentScenario.transaction}
              jurisdiction={jurisdictionConfig}
            />
          ) : (
            /* Empty state if no scenario loaded */
            <div className="rounded-xl border border-dashed border-rose-500/40 bg-rose-950/10 p-5 text-center">
              <AlertTriangle className="mx-auto h-8 w-8 text-rose-400 animate-pulse mb-2" />
              <h3 className="text-sm font-bold text-white">No Frozen Transaction Active</h3>
              <p className="text-xs text-slate-400 mt-1 mb-3">
                Load a sample scenario below to trigger a simulated bank lien alert.
              </p>
              <div className="flex justify-center gap-2">
                <button
                  type="button"
                  onClick={() => handleSelectScenario('ramesh-medicals')}
                  className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white shadow-md hover:bg-emerald-500 transition-colors"
                >
                  Load Ramesh Medicals
                </button>
              </div>
            </div>
          )}

          {/* SECTION 2: 1-Click Scenario Loader */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between px-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Sparkles className="h-3 w-3 text-emerald-400" />
                1-Click Demo Scenarios
              </span>
              <span className="text-[10px] text-slate-500 font-mono">
                Click to switch case
              </span>
            </div>

            <ScenarioCards
              scenarios={DEMO_SCENARIOS}
              activeScenarioId={currentScenario?.id ?? null}
              onSelect={handleSelectScenario}
            />
          </div>

          {/* SECTION 3: Voice Statement Section (WhatsApp Chat Bubble) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between px-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Volume2 className="h-3 w-3 text-emerald-400" />
                Merchant Statement (Vernacular Audio)
              </span>
              {isRecording && (
                <span className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-rose-400 animate-pulse">
                  <span className="h-2 w-2 rounded-full bg-rose-500" />
                  REC {recordingDuration.toFixed(1)}s
                </span>
              )}
            </div>

            {/* WhatsApp Styled Merchant Chat Bubble */}
            <div className="relative rounded-2xl rounded-tr-none border border-emerald-500/30 bg-gradient-to-br from-[#0c231c] via-[#091a15] to-[#040f0c] p-3.5 shadow-lg shadow-emerald-950/20">
              <div className="flex items-center justify-between text-[11px] text-emerald-400 font-medium pb-1.5 mb-2 border-b border-emerald-500/20">
                <span className="flex items-center gap-1">
                  <Building2 className="h-3 w-3" />
                  {currentScenario?.transaction.merchantName || 'Merchant Statement'}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  {currentScenario ? 'Spoken vernacular' : 'Ready'}
                </span>
              </div>

              {/* Spoken Text Transcript or Editable Area */}
              <div className="space-y-2">
                <textarea
                  rows={3}
                  value={statementText}
                  onChange={(e) => setStatementText(e.target.value)}
                  placeholder="Record voice or type explanation of the transaction, customer details, and goods delivered..."
                  className="w-full resize-none rounded-lg border border-emerald-900/50 bg-black/40 p-2.5 text-xs text-slate-200 placeholder-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/50"
                />

                {/* Waveform Visualizer inside Chat Bubble */}
                <div className="rounded-lg bg-black/50 border border-emerald-500/15 p-2">
                  <div className="flex items-center justify-between mb-1 text-[10px] text-slate-400">
                    <span className="font-mono">
                      {isRecording
                        ? 'Live microphone waveform capture'
                        : statementText
                        ? 'Synthesized acoustic cadence'
                        : 'Audio waveform idle'}
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                      className="text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-1 font-medium"
                    >
                      {isPlayingAudio ? (
                        <>
                          <Square className="h-2.5 w-2.5 fill-current" />
                          Pause
                        </>
                      ) : (
                        <>
                          <Play className="h-2.5 w-2.5 fill-current" />
                          Preview
                        </>
                      )}
                    </button>
                  </div>

                  <WaveformVisualizer
                    waveformData={
                      isRecording
                        ? liveWaveform
                        : syntheticWaveform
                    }
                    isActive={isRecording || isPlayingAudio}
                    style={
                      currentScenario?.id === 'rajesh-trading'
                        ? 'nervous'
                        : 'confident'
                    }
                  />
                </div>

                {/* WhatsApp Chat Timestamp & Blue Ticks */}
                <div className="flex items-center justify-end gap-1 text-[10px] text-slate-400 pt-0.5">
                  <span className="font-mono">
                    {currentScenario
                      ? new Date(currentScenario.transaction.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })
                      : 'Just now'}
                  </span>
                  <CheckCheck className="h-3.5 w-3.5 text-sky-400" />
                </div>
              </div>

              {/* Microphone Record Live Voice Button */}
              <div className="mt-2.5 pt-2 border-t border-emerald-500/20 flex items-center justify-between">
                <button
                  type="button"
                  onClick={handleToggleRecord}
                  className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-semibold shadow-md transition-all ${
                    isRecording
                      ? 'bg-rose-600 text-white hover:bg-rose-700 animate-pulse ring-2 ring-rose-400'
                      : 'bg-emerald-700 hover:bg-emerald-600 text-white active:scale-95'
                  }`}
                >
                  {isRecording ? (
                    <>
                      <MicOff className="h-3.5 w-3.5" />
                      Stop Recording ({recordingDuration.toFixed(1)}s)
                    </>
                  ) : (
                    <>
                      <Mic className="h-3.5 w-3.5" />
                      Record Live Voice
                    </>
                  )}
                </button>

                <span className="text-[10px] text-slate-400">
                  Microphone or typed input
                </span>
              </div>

              {/* Error prompt if mic denied */}
              {recordingError && (
                <p className="mt-2 text-[10.5px] text-rose-400 bg-rose-950/40 p-2 rounded border border-rose-500/30">
                  {recordingError}
                </p>
              )}
            </div>
          </div>

          {/* SECTION 4: Evidence Upload Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between px-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <FileText className="h-3 w-3 text-emerald-400" />
                Commercial Proof-of-Sale Documents
              </span>
              <span className="text-[10px] text-slate-500">
                Auto-gen canvas or upload
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* Receipt Preview Slot */}
              <div className="flex flex-col">
                <div className="flex items-center justify-between mb-1 text-[11px]">
                  <span className="font-semibold text-slate-300 truncate">
                    1. Tax Invoice / Receipt
                  </span>
                  {receiptImage && (
                    <span
                      className={`text-[9.5px] font-bold uppercase px-1.5 py-0.2 rounded ${
                        isCustomReceipt
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      }`}
                    >
                      {isCustomReceipt ? 'Custom' : 'Canvas Gen'}
                    </span>
                  )}
                </div>

                <div
                  className={`group relative flex h-48 w-full flex-col items-center justify-center rounded-xl bg-slate-900/80 border p-1 transition-all overflow-hidden ${
                    receiptImage
                      ? isCustomReceipt
                        ? 'border-amber-500 shadow-lg shadow-amber-500/25 ring-1 ring-amber-500'
                        : 'border-emerald-500 shadow-lg shadow-emerald-500/25 ring-1 ring-emerald-500'
                      : 'border-dashed border-slate-700 hover:border-slate-500'
                  }`}
                >
                  {receiptImage ? (
                    <>
                      <img
                        src={receiptImage}
                        alt="Proof of sale receipt preview"
                        className="h-full w-full object-contain rounded-lg bg-white"
                      />
                      {/* Hover action overlay */}
                      <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          type="button"
                          onClick={() => receiptFileInputRef.current?.click()}
                          className="rounded-lg bg-slate-800 p-2 text-xs text-white hover:bg-slate-700 shadow"
                          title="Upload new file"
                        >
                          <Upload className="h-4 w-4" />
                        </button>
                      </div>
                    </>
                  ) : (
                    <div
                      onClick={() => receiptFileInputRef.current?.click()}
                      className="flex flex-col items-center justify-center p-4 text-center cursor-pointer text-slate-400 hover:text-slate-200"
                    >
                      <Upload className="h-6 w-6 mb-1 text-slate-500" />
                      <span className="text-xs font-medium">Click to upload receipt</span>
                      <span className="text-[10px] text-slate-500 mt-0.5">PNG, JPG, PDF</span>
                    </div>
                  )}
                </div>

                {/* Upload Custom Receipt Button */}
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
                  className="mt-1.5 flex items-center justify-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900/60 py-1 text-[11px] font-medium text-slate-300 hover:bg-slate-800 transition-colors"
                >
                  <Camera className="h-3 w-3 text-slate-400" />
                  Upload Custom Receipt
                </button>
              </div>

              {/* Shop Photo Slot */}
              <div className="flex flex-col">
                <div className="flex items-center justify-between mb-1 text-[11px]">
                  <span className="font-semibold text-slate-300 truncate">
                    2. Shop Front / Counter
                  </span>
                  {shopPhoto && (
                    <span
                      className={`text-[9.5px] font-bold uppercase px-1.5 py-0.2 rounded ${
                        isCustomShopPhoto
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      }`}
                    >
                      {isCustomShopPhoto ? 'Custom' : 'Premises'}
                    </span>
                  )}
                </div>

                <div
                  className={`group relative flex h-48 w-full flex-col items-center justify-center rounded-xl bg-slate-900/80 border p-1 transition-all overflow-hidden ${
                    shopPhoto
                      ? isCustomShopPhoto
                        ? 'border-amber-500 shadow-lg shadow-amber-500/25 ring-1 ring-amber-500'
                        : 'border-emerald-500 shadow-lg shadow-emerald-500/25 ring-1 ring-emerald-500'
                      : 'border-dashed border-slate-700 hover:border-slate-500'
                  }`}
                >
                  {shopPhoto ? (
                    <>
                      <img
                        src={shopPhoto}
                        alt="Shop front or counter premises"
                        className="h-full w-full object-cover rounded-lg"
                      />
                      <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          type="button"
                          onClick={() => shopPhotoFileInputRef.current?.click()}
                          className="rounded-lg bg-slate-800 p-2 text-xs text-white hover:bg-slate-700 shadow"
                          title="Upload new shop photo"
                        >
                          <Upload className="h-4 w-4" />
                        </button>
                      </div>
                    </>
                  ) : (
                    <div
                      onClick={() => shopPhotoFileInputRef.current?.click()}
                      className="flex flex-col items-center justify-center p-4 text-center cursor-pointer text-slate-400 hover:text-slate-200"
                    >
                      <ImageIcon className="h-6 w-6 mb-1 text-slate-500" />
                      <span className="text-xs font-medium">Add counter photo</span>
                      <span className="text-[10px] text-slate-500 mt-0.5">Physical store presence</span>
                    </div>
                  )}
                </div>

                {/* Upload Custom Shop Photo Button */}
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
                  className="mt-1.5 flex items-center justify-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900/60 py-1 text-[11px] font-medium text-slate-300 hover:bg-slate-800 transition-colors"
                >
                  <Camera className="h-3 w-3 text-slate-400" />
                  Upload Counter Photo
                </button>
              </div>
            </div>
          </div>

          {/* SECTION 5: Submit Button & Progress */}
          <div className="pt-2 space-y-2">
            {isProcessing && (
              <div className="rounded-lg border border-emerald-500/40 bg-emerald-950/40 p-3 shadow-inner">
                <div className="flex items-center gap-2.5 text-xs text-emerald-300 font-medium mb-1.5">
                  <Loader2 className="h-4 w-4 animate-spin text-emerald-400" />
                  <span>Processing Multi-Stage Verification:</span>
                </div>
                <p className="text-[11px] text-slate-300 pl-6 animate-pulse leading-snug">
                  {processingStage || 'Dispatching proof to Gemini 2.5 Flash & calculating CLS score...'}
                </p>
              </div>
            )}

            {evidenceSubmitted && !isProcessing && (
              <div className="flex items-center justify-center gap-2 rounded-lg border border-emerald-500/40 bg-emerald-950/40 p-2.5 text-xs font-semibold text-emerald-300">
                <CheckCircle className="h-4 w-4 text-emerald-400" />
                <span>Evidence submitted & verified in compliance vault</span>
              </div>
            )}

            <button
              type="button"
              disabled={!hasEvidence || isProcessing}
              onClick={handleSubmitEvidence}
              className={`w-full flex items-center justify-center gap-2.5 rounded-xl py-3 px-4 text-sm font-bold shadow-xl transition-all cursor-pointer ${
                isProcessing
                  ? 'bg-slate-800 text-slate-400 cursor-not-allowed border border-slate-700'
                  : !hasEvidence
                  ? 'bg-slate-800/80 text-slate-500 border border-slate-800 cursor-not-allowed'
                  : 'bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 text-slate-950 hover:from-emerald-400 hover:to-teal-400 shadow-emerald-500/25 active:scale-[0.99]'
              }`}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin text-emerald-400" />
                  <span>Running Gemini Multimodal Audit...</span>
                </>
              ) : evidenceSubmitted ? (
                <>
                  <RefreshCw className="h-4 w-4 text-slate-950" />
                  <span>Re-Submit & Re-Audit Evidence</span>
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 text-slate-950 fill-current" />
                  <span>Submit Evidence &amp; Run Gemini Audit</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Home Indicator Notch */}
        <div className="px-6 py-2 bg-slate-950 flex justify-center">
          <div className="h-1 w-32 rounded-full bg-slate-700" />
        </div>
      </div>
    </div>
  );
};

export default MerchantApp;
