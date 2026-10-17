import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  onSnapshot,
  updateDoc,
  type Firestore,
} from 'firebase/firestore';
import type {
  TransactionStatus,
  CLSBreakdown,
  GeminiAuditResult,
} from '../types';

let firebaseApp: FirebaseApp | null = null;
let firestoreDb: Firestore | null = null;
let isFirebaseInitialized = false;

// Attempt Firebase initialization if environment variables are defined
try {
  const env = import.meta.env;
  const apiKey = env.VITE_FIREBASE_API_KEY;
  const projectId = env.VITE_FIREBASE_PROJECT_ID;

  if (apiKey && projectId) {
    const firebaseConfig = {
      apiKey,
      authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || `${projectId}.firebaseapp.com`,
      projectId,
      storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET || `${projectId}.appspot.com`,
      messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
      appId: env.VITE_FIREBASE_APP_ID,
    };

    firebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
    firestoreDb = getFirestore(firebaseApp);
    isFirebaseInitialized = true;
    console.info('[NexusClear StateStore] Firebase Firestore successfully initialized.');
  } else {
    console.info(
      '[NexusClear StateStore] Firebase env credentials not provided. Operating in dual-mode fallback: localStorage + BroadcastChannel.'
    );
  }
} catch (err) {
  console.warn(
    '[NexusClear StateStore] Failed to initialize Firebase, falling back to BroadcastChannel + localStorage:',
    err
  );
  firebaseApp = null;
  firestoreDb = null;
  isFirebaseInitialized = false;
}

// ----------------------------------------------------------------------------
// BROADCASTCHANNEL & LOCALSTORAGE STATE ENGINE
// ----------------------------------------------------------------------------
const BROADCAST_CHANNEL_NAME = 'nexusclear-sync';
const STORAGE_PREFIX = 'nexusclear_case_';

interface BroadcastMessage {
  type: 'CASE_SAVED' | 'CASE_UPDATED';
  caseId: string;
  data: Record<string, unknown>;
  timestamp: number;
}

const localSubscribers = new Map<string, Set<(data: Record<string, unknown>) => void>>();
let channel: BroadcastChannel | null = null;

if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
  try {
    channel = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
    channel.onmessage = (event: MessageEvent<BroadcastMessage>) => {
      const { caseId, data } = event.data;
      if (!caseId) return;

      const listeners = localSubscribers.get(caseId);
      if (listeners) {
        listeners.forEach((listener) => {
          try {
            listener(data);
          } catch (listenerErr) {
            console.error('[NexusClear StateStore] Subscriber listener threw an error:', listenerErr);
          }
        });
      }
    };
  } catch (bcError) {
    console.warn('[NexusClear StateStore] BroadcastChannel initialization failed:', bcError);
  }
}

/**
 * Returns whether Firestore is active or fallback storage is being used.
 */
export function isFirebaseActive(): boolean {
  return isFirebaseInitialized && firestoreDb !== null;
}

/**
 * Saves a case document to Firestore or localStorage.
 */
export async function saveCase(caseData: Record<string, unknown> & { id?: string; caseId?: string }): Promise<void> {
  const caseId = (caseData.id || caseData.caseId || 'default_case') as string;
  const payload = {
    ...caseData,
    id: caseId,
    updatedAt: new Date().toISOString(),
  };

  if (isFirebaseActive() && firestoreDb) {
    try {
      const caseRef = doc(firestoreDb, 'cases', caseId);
      await setDoc(caseRef, payload, { merge: true });
      return;
    } catch (err) {
      console.warn(`[NexusClear StateStore] Firestore write failed for case ${caseId}, using local storage fallback:`, err);
    }
  }

  // LocalStorage fallback
  if (typeof localStorage !== 'undefined') {
    try {
      localStorage.setItem(`${STORAGE_PREFIX}${caseId}`, JSON.stringify(payload));
    } catch (storageErr) {
      console.error('[NexusClear StateStore] localStorage write failed:', storageErr);
    }
  }

  // Broadcast to peers
  if (channel) {
    try {
      channel.postMessage({
        type: 'CASE_SAVED',
        caseId,
        data: payload,
        timestamp: Date.now(),
      });
    } catch (postErr) {
      console.warn('[NexusClear StateStore] Failed to post to BroadcastChannel:', postErr);
    }
  }

  // Notify any local observers in current tab
  const listeners = localSubscribers.get(caseId);
  if (listeners) {
    listeners.forEach((cb) => {
      try {
        cb(payload);
      } catch (cbErr) {
        console.error(cbErr);
      }
    });
  }
}

/**
 * Loads a case document by ID from Firestore or localStorage.
 */
export async function loadCase(caseId: string): Promise<Record<string, unknown> | null> {
  if (isFirebaseActive() && firestoreDb) {
    try {
      const caseRef = doc(firestoreDb, 'cases', caseId);
      const snapshot = await getDoc(caseRef);
      if (snapshot.exists()) {
        return snapshot.data();
      }
    } catch (err) {
      console.warn(`[NexusClear StateStore] Firestore read failed for case ${caseId}, falling back to localStorage:`, err);
    }
  }

  // LocalStorage fallback
  if (typeof localStorage !== 'undefined') {
    try {
      const raw = localStorage.getItem(`${STORAGE_PREFIX}${caseId}`);
      if (raw) {
        return JSON.parse(raw);
      }
    } catch (err) {
      console.error('[NexusClear StateStore] Failed to parse case from localStorage:', err);
    }
  }

  return null;
}

/**
 * Subscribes to real-time case updates via Firestore onSnapshot or BroadcastChannel.
 * Returns an unsubscribe teardown function.
 */
export function subscribeToCaseUpdates(
  caseId: string,
  callback: (data: Record<string, unknown>) => void
): () => void {
  if (isFirebaseActive() && firestoreDb) {
    try {
      const caseRef = doc(firestoreDb, 'cases', caseId);
      const unsubscribe = onSnapshot(
        caseRef,
        (snapshot) => {
          if (snapshot.exists()) {
            callback(snapshot.data());
          }
        },
        (error) => {
          console.warn('[NexusClear StateStore] Firestore onSnapshot error, maintaining channel listener:', error);
        }
      );
      return unsubscribe;
    } catch (err) {
      console.warn('[NexusClear StateStore] Could not register Firestore listener, using local observer:', err);
    }
  }

  // Register in local subscribers set
  if (!localSubscribers.has(caseId)) {
    localSubscribers.set(caseId, new Set());
  }
  const set = localSubscribers.get(caseId)!;
  set.add(callback);

  // Immediately load initial state from localStorage if available
  loadCase(caseId).then((existing) => {
    if (existing) {
      try {
        callback(existing);
      } catch (cbErr) {
        console.error(cbErr);
      }
    }
  });

  return () => {
    const listeners = localSubscribers.get(caseId);
    if (listeners) {
      listeners.delete(callback);
      if (listeners.size === 0) {
        localSubscribers.delete(caseId);
      }
    }
  };
}

/**
 * Updates status, CLS breakdown, and Gemini audit results for a case.
 */
export async function updateCaseStatus(
  caseId: string,
  status: TransactionStatus,
  clsResult?: CLSBreakdown,
  geminiResult?: GeminiAuditResult
): Promise<void> {
  const updatePayload: Record<string, unknown> = {
    status,
    updatedAt: new Date().toISOString(),
  };

  if (clsResult) updatePayload.clsResult = clsResult;
  if (geminiResult) updatePayload.geminiResult = geminiResult;

  if (isFirebaseActive() && firestoreDb) {
    try {
      const caseRef = doc(firestoreDb, 'cases', caseId);
      await updateDoc(caseRef, updatePayload);
      return;
    } catch (err) {
      console.warn(`[NexusClear StateStore] Firestore updateDoc failed for ${caseId}:`, err);
    }
  }

  // LocalStorage update
  const existing = (await loadCase(caseId)) || { id: caseId };
  const merged = { ...existing, ...updatePayload };
  await saveCase(merged);
}

/**
 * StateStore singleton object
 */
export const stateStore = {
  saveCase,
  loadCase,
  subscribeToCaseUpdates,
  updateCaseStatus,
  isFirebaseActive,
};
