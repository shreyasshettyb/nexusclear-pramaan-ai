/**
 * NexusClear Web Audio API Service
 * Handles microphone recording, real-time waveform extraction, synthetic waveforms, and audio serialization.
 */

export interface AudioRecordingState {
  isRecording: boolean;
  duration: number; // Duration in seconds
  waveform: number[]; // Normalized real-time amplitude values (0.0 to 1.0)
}

export interface RecordingResult {
  audioBlob: Blob;
  base64: string;
  waveformData: number[];
}

export type WaveformStyle = 'normal' | 'nervous' | 'confident';

type StateListener = (state: AudioRecordingState) => void;

let mediaStream: MediaStream | null = null;
let mediaRecorder: MediaRecorder | null = null;
let audioContext: AudioContext | null = null;
let analyserNode: AnalyserNode | null = null;
let animationFrameId: number | null = null;
let durationIntervalId: number | null = null;
let audioChunks: Blob[] = [];
let recordingStartTime = 0;

const listeners = new Set<StateListener>();

let currentState: AudioRecordingState = {
  isRecording: false,
  duration: 0,
  waveform: [],
};

function notifyListeners(): void {
  const snapshot: AudioRecordingState = {
    isRecording: currentState.isRecording,
    duration: currentState.duration,
    waveform: [...currentState.waveform],
  };
  listeners.forEach((listener) => {
    try {
      listener(snapshot);
    } catch (err) {
      console.error('[NexusClear AudioService] Listener error:', err);
    }
  });
}

/**
 * Returns current snapshot of recording state.
 */
export function getAudioState(): AudioRecordingState {
  return {
    isRecording: currentState.isRecording,
    duration: currentState.duration,
    waveform: [...currentState.waveform],
  };
}

/**
 * Subscribes to real-time audio state changes. Returns an unsubscribe function.
 */
export function subscribeAudioState(listener: StateListener): () => void {
  listeners.add(listener);
  listener(getAudioState());
  return () => {
    listeners.delete(listener);
  };
}

/**
 * Starts recording microphone input using MediaRecorder and Web Audio API.
 */
export async function startRecording(): Promise<void> {
  if (currentState.isRecording) {
    console.warn('[NexusClear AudioService] Recording is already in progress.');
    return;
  }

  if (typeof navigator === 'undefined' || !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    throw new Error('Web Audio / MediaDevices API is not supported in this browser environment.');
  }

  try {
    mediaStream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
      },
    });
  } catch (err: unknown) {
    const error = err as { name?: string; message?: string };
    if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
      throw new Error('Microphone access was denied. Please allow microphone permissions in your browser.');
    } else if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
      throw new Error('No microphone audio input device detected on this system.');
    } else if (error.name === 'NotReadableError' || error.name === 'TrackStartError') {
      throw new Error('Microphone is currently in use by another application.');
    }
    throw new Error(`Failed to access microphone: ${error.message || 'Unknown error'}`);
  }

  // Setup Web Audio Analyser for live visualizer
  try {
    const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    audioContext = new AudioCtxClass();
    const sourceNode = audioContext.createMediaStreamSource(mediaStream);
    analyserNode = audioContext.createAnalyser();
    analyserNode.fftSize = 64;
    analyserNode.smoothingTimeConstant = 0.8;
    sourceNode.connect(analyserNode);
  } catch (audioCtxErr) {
    console.warn('[NexusClear AudioService] Could not initialize Web Audio Analyser:', audioCtxErr);
  }

  // Setup MediaRecorder
  let mimeType = 'audio/webm;codecs=opus';
  if (typeof MediaRecorder !== 'undefined') {
    if (!MediaRecorder.isTypeSupported(mimeType)) {
      if (MediaRecorder.isTypeSupported('audio/webm')) {
        mimeType = 'audio/webm';
      } else if (MediaRecorder.isTypeSupported('audio/mp4')) {
        mimeType = 'audio/mp4';
      } else {
        mimeType = '';
      }
    }
  }

  audioChunks = [];
  mediaRecorder = mimeType ? new MediaRecorder(mediaStream, { mimeType }) : new MediaRecorder(mediaStream);

  mediaRecorder.ondataavailable = (event: BlobEvent) => {
    if (event.data && event.data.size > 0) {
      audioChunks.push(event.data);
    }
  };

  mediaRecorder.start(100);
  recordingStartTime = Date.now();

  currentState.isRecording = true;
  currentState.duration = 0;
  currentState.waveform = [];
  notifyListeners();

  // Duration timer
  durationIntervalId = window.setInterval(() => {
    currentState.duration = Math.round((Date.now() - recordingStartTime) / 100) / 10;
    notifyListeners();
  }, 100);

  // Live waveform sampling loop
  const dataArray = analyserNode ? new Uint8Array(analyserNode.frequencyBinCount) : null;
  const updateWaveform = () => {
    if (!currentState.isRecording) return;

    if (analyserNode && dataArray) {
      analyserNode.getByteFrequencyData(dataArray);
      let sum = 0;
      for (let i = 0; i < dataArray.length; i++) {
        sum += dataArray[i];
      }
      const avg = sum / (dataArray.length * 255);
      currentState.waveform.push(Math.min(1.0, Math.max(0.05, avg * 1.5)));

      // Keep recent 60 points for rolling display
      if (currentState.waveform.length > 60) {
        currentState.waveform.shift();
      }
    } else {
      // Fallback synthetic pulse if analyser is unavailable
      const pulse = 0.2 + Math.abs(Math.sin(Date.now() / 200)) * 0.5;
      currentState.waveform.push(pulse);
      if (currentState.waveform.length > 60) {
        currentState.waveform.shift();
      }
    }

    animationFrameId = requestAnimationFrame(updateWaveform);
  };

  animationFrameId = requestAnimationFrame(updateWaveform);
}

/**
 * Stops recording and resolves with the audio Blob, base64 data URL, and final waveform.
 */
export async function stopRecording(): Promise<RecordingResult> {
  if (!mediaRecorder || mediaRecorder.state === 'inactive') {
    throw new Error('No active recording to stop.');
  }

  return new Promise((resolve, reject) => {
    const recorder = mediaRecorder!;

    recorder.onstop = async () => {
      // Cleanup visualizer & intervals
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
      }
      if (durationIntervalId !== null) {
        clearInterval(durationIntervalId);
        durationIntervalId = null;
      }

      // Stop all tracks on microphone stream
      if (mediaStream) {
        mediaStream.getTracks().forEach((track) => track.stop());
        mediaStream = null;
      }

      if (audioContext && audioContext.state !== 'closed') {
        try {
          await audioContext.close();
        } catch (closeErr) {
          console.warn('[NexusClear AudioService] AudioContext close error:', closeErr);
        }
        audioContext = null;
        analyserNode = null;
      }

      currentState.isRecording = false;
      notifyListeners();

      const blobType = recorder.mimeType || 'audio/webm';
      const audioBlob = new Blob(audioChunks, { type: blobType });

      // Convert to base64 Data URL
      try {
        const base64 = await blobToBase64(audioBlob);
        let finalWaveform = await getWaveformFromBlob(audioBlob);
        if (!finalWaveform || finalWaveform.length === 0) {
          finalWaveform = generateSyntheticWaveform(5000, 'normal');
        }

        resolve({
          audioBlob,
          base64,
          waveformData: finalWaveform,
        });
      } catch (procErr) {
        reject(procErr);
      }
    };

    recorder.stop();
  });
}

/**
 * Helper to convert Blob to base64 Data URL.
 */
function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      resolve(reader.result as string);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

/**
 * Generates synthetic waveform points for demo scenarios.
 * Styles:
 * - 'normal': consistent natural speech rhythm with small pauses
 * - 'nervous': irregular bursts, hesitations, high variance, long pauses
 * - 'confident': strong steady cadence, uniform vocal resonance
 */
export function generateSyntheticWaveform(
  durationMs: number = 5000,
  style: WaveformStyle = 'normal'
): number[] {
  const pointsCount = Math.max(30, Math.min(100, Math.floor(durationMs / 70)));
  const waveform: number[] = [];

  for (let i = 0; i < pointsCount; i++) {
    const progress = i / pointsCount;
    let amplitude = 0.1;

    if (style === 'normal') {
      // Natural speech envelope with cadence
      const phrase = Math.sin(progress * Math.PI * 6);
      const syllables = Math.sin(progress * Math.PI * 24);
      const raw = Math.abs(phrase * 0.5 + syllables * 0.3) + 0.15;
      // Add minor natural noise
      amplitude = Math.min(0.85, Math.max(0.1, raw + (Math.random() * 0.15 - 0.075)));
    } else if (style === 'nervous') {
      // Erratic spikes followed by flatline pauses (hesitations)
      const isPause = (i % 9 === 0) || (i % 13 === 0);
      if (isPause) {
        amplitude = 0.05 + Math.random() * 0.06;
      } else {
        const jitter = Math.random() > 0.6 ? 0.92 : 0.35;
        amplitude = Math.min(0.98, Math.max(0.08, jitter + (Math.random() * 0.2 - 0.1)));
      }
    } else {
      // 'confident': steady projection, strong vocal formants
      const rhythm = Math.abs(Math.sin(progress * Math.PI * 8)) * 0.45 + 0.42;
      amplitude = Math.min(0.95, Math.max(0.3, rhythm + (Math.random() * 0.1 - 0.05)));
    }

    waveform.push(Math.round(amplitude * 100) / 100);
  }

  return waveform;
}

/**
 * Extracts true waveform amplitude curve from an audio Blob using AudioContext.decodeAudioData.
 */
export async function getWaveformFromBlob(blob: Blob, sampleCount = 64): Promise<number[]> {
  if (typeof window === 'undefined') {
    return generateSyntheticWaveform(5000, 'normal');
  }

  try {
    const arrayBuffer = await blob.arrayBuffer();
    const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const offlineCtx = new AudioCtxClass();

    const audioBuffer = await offlineCtx.decodeAudioData(arrayBuffer);
    const rawData = audioBuffer.getChannelData(0); // Channel 0 (Mono or Left)
    const blockSize = Math.floor(rawData.length / sampleCount);
    const filteredData: number[] = [];

    for (let i = 0; i < sampleCount; i++) {
      const blockStart = blockSize * i;
      let sum = 0;
      for (let j = 0; j < blockSize; j++) {
        sum += Math.abs(rawData[blockStart + j] || 0);
      }
      const peak = sum / blockSize;
      filteredData.push(peak);
    }

    // Normalize so highest peak reaches ~0.9
    const maxVal = Math.max(...filteredData, 0.001);
    const normalized = filteredData.map((val) => {
      const norm = (val / maxVal) * 0.9;
      return Math.round(Math.min(1.0, Math.max(0.05, norm)) * 100) / 100;
    });

    await offlineCtx.close();
    return normalized;
  } catch (err) {
    console.warn('[NexusClear AudioService] Decoding audio data failed, falling back to synthetic waveform:', err);
    return generateSyntheticWaveform(5000, 'normal');
  }
}
