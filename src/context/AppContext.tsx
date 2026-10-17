import React, { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import type {
  Jurisdiction,
  DemoScenario,
  CLSBreakdown,
  GeminiAuditResult,
  ViewMode,
  MerchantEvidence,
  AppState,
  MerchantLanguage,
  AdjudicationStatus,
} from '../types';
import { DEMO_SCENARIOS } from '../data/scenarios';
import { runGeminiAudit } from '../services/geminiService';

// ==========================================
// Action Types & Union
// ==========================================
export type AppAction =
  | { type: 'SET_JURISDICTION'; payload: Jurisdiction }
  | { type: 'LOAD_SCENARIO'; payload: DemoScenario }
  | { type: 'SET_PROCESSING'; payload: boolean }
  | { type: 'SET_PROCESSING_STAGE'; payload: string }
  | { type: 'SET_API_KEY'; payload: string | null }
  | { type: 'TOGGLE_API_KEY_MODAL'; payload?: boolean }
  | { type: 'SET_CLS_RESULT'; payload: CLSBreakdown | null }
  | { type: 'SET_GEMINI_RESULT'; payload: GeminiAuditResult | null }
  | { type: 'SET_VIEW'; payload: ViewMode }
  | { type: 'SUBMIT_EVIDENCE'; payload?: MerchantEvidence }
  | { type: 'SET_MERCHANT_EVIDENCE'; payload: MerchantEvidence | null }
  | { type: 'SET_MERCHANT_LANGUAGE'; payload: MerchantLanguage }
  | { type: 'ADJUDICATE_CASE'; payload: { decision: 'approved' | 'rejected'; notes?: string } }
  | { type: 'RESET_RESULTS' };

// ==========================================
// Context Interface
// ==========================================
export interface AppContextValue extends AppState {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  setJurisdiction: (jurisdiction: Jurisdiction) => void;
  loadScenario: (scenario: DemoScenario) => void;
  setProcessing: (isProcessing: boolean) => void;
  setProcessingStage: (stage: string) => void;
  setApiKey: (key: string | null) => void;
  toggleApiKeyModal: (show?: boolean) => void;
  setClsResult: (result: CLSBreakdown | null) => void;
  setGeminiResult: (result: GeminiAuditResult | null) => void;
  setView: (view: ViewMode) => void;
  submitEvidence: (evidence?: MerchantEvidence) => void;
  setMerchantEvidence: (evidence: MerchantEvidence | null) => void;
  setMerchantLanguage: (lang: MerchantLanguage) => void;
  approveCase: (notes?: string) => void;
  rejectCase: (notes?: string) => void;
  resetResults: () => void;
  runAuditPipeline: (customEvidence?: MerchantEvidence) => Promise<void>;
}

const LOCAL_STORAGE_KEY = 'nexusclear_api_key';

// Helper to retrieve initial API key
const getInitialApiKey = (): string | null => {
  if (typeof window === 'undefined') return null;
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved && saved.trim().length > 0) return saved.trim();
  } catch (err) {
    console.warn('Unable to access localStorage for API key', err);
  }

  // Fallback to Vite env variable if provided
  const envKey = (import.meta as unknown as { env?: { VITE_GEMINI_API_KEY?: string } }).env?.VITE_GEMINI_API_KEY;
  if (envKey && envKey.trim().length > 0) {
    return envKey.trim();
  }
  return null;
};

// Initial state setup
const initialApiKey = getInitialApiKey();
const defaultScenario = DEMO_SCENARIOS[0] ?? null;

export const initialState: AppState = {
  currentJurisdiction: defaultScenario?.jurisdiction ?? 'india',
  currentScenario: defaultScenario,
  isProcessing: false,
  geminiApiKey: initialApiKey,
  isLiveGemini: Boolean(initialApiKey && initialApiKey.trim().length > 0),
  clsResult: null,
  geminiResult: null,
  currentView: 'split',
  showApiKeyModal: false,
  processingStage: '',
  evidenceSubmitted: false,
  merchantEvidence: defaultScenario ? { ...defaultScenario.evidence } : null,
  merchantLanguage: 'kn', // Default to Kannada for Ramesh Medicals
  adjudicationStatus: 'pending',
  adjudicationNotes: undefined,
  adjudicatedAt: undefined,
};

// ==========================================
// App Reducer
// ==========================================
export function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_JURISDICTION': {
      const nextJurisdiction = action.payload;
      if (state.currentJurisdiction === nextJurisdiction) {
        return state;
      }
      // Pick matching scenario for jurisdiction or keep current if matches
      const matchingScenario =
        DEMO_SCENARIOS.find((s) => s.jurisdiction === nextJurisdiction) ??
        DEMO_SCENARIOS[0] ??
        null;

      return {
        ...state,
        currentJurisdiction: nextJurisdiction,
        currentScenario: matchingScenario,
        merchantEvidence: matchingScenario ? { ...matchingScenario.evidence } : null,
        evidenceSubmitted: false,
        clsResult: null,
        geminiResult: null,
        isProcessing: false,
        processingStage: '',
        adjudicationStatus: 'pending',
        adjudicationNotes: undefined,
        adjudicatedAt: undefined,
      };
    }

    case 'LOAD_SCENARIO': {
      const scenario = action.payload;
      return {
        ...state,
        currentScenario: scenario,
        currentJurisdiction: scenario.jurisdiction,
        merchantEvidence: { ...scenario.evidence },
        evidenceSubmitted: false,
        clsResult: null,
        geminiResult: null,
        isProcessing: false,
        processingStage: '',
        adjudicationStatus: 'pending',
        adjudicationNotes: undefined,
        adjudicatedAt: undefined,
        // If Ramesh Medicals (Karnataka), default to Kannada
        ...(scenario.id === 'ramesh-medicals' ? { merchantLanguage: 'kn' } : {}),
      };
    }

    case 'SET_PROCESSING':
      return {
        ...state,
        isProcessing: action.payload,
        ...(action.payload === false ? { processingStage: '' } : {}),
      };

    case 'SET_PROCESSING_STAGE':
      return {
        ...state,
        processingStage: action.payload,
      };

    case 'SET_API_KEY': {
      const newKey = action.payload ? action.payload.trim() : null;
      try {
        if (newKey) {
          localStorage.setItem(LOCAL_STORAGE_KEY, newKey);
        } else {
          localStorage.removeItem(LOCAL_STORAGE_KEY);
        }
      } catch (e) {
        console.warn('Failed to persist API key to localStorage', e);
      }
      return {
        ...state,
        geminiApiKey: newKey,
        isLiveGemini: Boolean(newKey && newKey.length > 0),
      };
    }

    case 'TOGGLE_API_KEY_MODAL':
      return {
        ...state,
        showApiKeyModal:
          typeof action.payload === 'boolean' ? action.payload : !state.showApiKeyModal,
      };

    case 'SET_CLS_RESULT':
      return {
        ...state,
        clsResult: action.payload,
      };

    case 'SET_GEMINI_RESULT':
      return {
        ...state,
        geminiResult: action.payload,
      };

    case 'SET_VIEW':
      return {
        ...state,
        currentView: action.payload,
      };

    case 'SUBMIT_EVIDENCE':
      return {
        ...state,
        evidenceSubmitted: true,
        ...(action.payload ? { merchantEvidence: action.payload } : {}),
      };

    case 'SET_MERCHANT_EVIDENCE':
      return {
        ...state,
        merchantEvidence: action.payload,
      };

    case 'SET_MERCHANT_LANGUAGE':
      return {
        ...state,
        merchantLanguage: action.payload,
      };

    case 'ADJUDICATE_CASE': {
      const { decision, notes } = action.payload;
      const updatedScenario = state.currentScenario
        ? {
            ...state.currentScenario,
            transaction: {
              ...state.currentScenario.transaction,
              status: decision === 'approved' ? ('cleared' as const) : ('escalated' as const),
              hopChain: state.currentScenario.transaction.hopChain.map((node) =>
                node.type === 'merchant'
                  ? { ...node, status: decision === 'approved' ? ('cleared' as const) : ('escalated' as const) }
                  : node
              ),
            },
          }
        : null;

      return {
        ...state,
        adjudicationStatus: decision,
        adjudicationNotes: notes,
        adjudicatedAt: new Date().toISOString(),
        currentScenario: updatedScenario,
      };
    }

    case 'RESET_RESULTS':
      return {
        ...state,
        clsResult: null,
        geminiResult: null,
        evidenceSubmitted: false,
        isProcessing: false,
        processingStage: '',
        adjudicationStatus: 'pending',
        adjudicationNotes: undefined,
        adjudicatedAt: undefined,
      };

    default:
      return state;
  }
}

// ==========================================
// Context Creation
// ==========================================
const AppContext = createContext<AppContextValue | null>(null);

export interface AppProviderProps {
  children: React.ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Sync apiKey changes across tabs
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === LOCAL_STORAGE_KEY) {
        dispatch({ type: 'SET_API_KEY', payload: e.newValue });
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const setJurisdiction = useCallback((jurisdiction: Jurisdiction) => {
    dispatch({ type: 'SET_JURISDICTION', payload: jurisdiction });
  }, []);

  const loadScenario = useCallback((scenario: DemoScenario) => {
    dispatch({ type: 'LOAD_SCENARIO', payload: scenario });
  }, []);

  const setProcessing = useCallback((isProcessing: boolean) => {
    dispatch({ type: 'SET_PROCESSING', payload: isProcessing });
  }, []);

  const setProcessingStage = useCallback((stage: string) => {
    dispatch({ type: 'SET_PROCESSING_STAGE', payload: stage });
  }, []);

  const setApiKey = useCallback((key: string | null) => {
    dispatch({ type: 'SET_API_KEY', payload: key });
  }, []);

  const toggleApiKeyModal = useCallback((show?: boolean) => {
    dispatch({ type: 'TOGGLE_API_KEY_MODAL', payload: show });
  }, []);

  const setClsResult = useCallback((result: CLSBreakdown | null) => {
    dispatch({ type: 'SET_CLS_RESULT', payload: result });
  }, []);

  const setGeminiResult = useCallback((result: GeminiAuditResult | null) => {
    dispatch({ type: 'SET_GEMINI_RESULT', payload: result });
  }, []);

  const setView = useCallback((view: ViewMode) => {
    dispatch({ type: 'SET_VIEW', payload: view });
  }, []);

  const submitEvidence = useCallback((evidence?: MerchantEvidence) => {
    dispatch({ type: 'SUBMIT_EVIDENCE', payload: evidence });
  }, []);

  const setMerchantEvidence = useCallback((evidence: MerchantEvidence | null) => {
    dispatch({ type: 'SET_MERCHANT_EVIDENCE', payload: evidence });
  }, []);

  const setMerchantLanguage = useCallback((lang: MerchantLanguage) => {
    dispatch({ type: 'SET_MERCHANT_LANGUAGE', payload: lang });
  }, []);

  const approveCase = useCallback((notes?: string) => {
    dispatch({ type: 'ADJUDICATE_CASE', payload: { decision: 'approved', notes } });
  }, []);

  const rejectCase = useCallback((notes?: string) => {
    dispatch({ type: 'ADJUDICATE_CASE', payload: { decision: 'rejected', notes } });
  }, []);

  const resetResults = useCallback(() => {
    dispatch({ type: 'RESET_RESULTS' });
  }, []);

  // Comprehensive AI & CLS Pipeline runner
  const runAuditPipeline = useCallback(
    async (customEvidence?: MerchantEvidence) => {
      if (!state.currentScenario) return;

      const activeEvidence =
        customEvidence || state.merchantEvidence || state.currentScenario.evidence;

      dispatch({ type: 'SUBMIT_EVIDENCE', payload: activeEvidence });
      dispatch({ type: 'SET_PROCESSING', payload: true });

      try {
        // Stage 1: Validation
        dispatch({
          type: 'SET_PROCESSING_STAGE',
          payload: 'Cryptographically validating proof-of-sale payload & metadata...',
        });
        await new Promise((r) => setTimeout(r, 600));

        // Stage 2: Multimodal Gemini Analysis
        dispatch({
          type: 'SET_PROCESSING_STAGE',
          payload: state.isLiveGemini
            ? 'Dispatching multimodal prompt to Gemini 2.5 Flash API...'
            : 'Simulating Gemini 2.5 Flash neural vision & vernacular audio analysis...',
        });

        const geminiResult = await runGeminiAudit({
          apiKey: state.geminiApiKey,
          transaction: state.currentScenario.transaction,
          evidence: activeEvidence,
        });

        // Stage 3: Graph topology & dwell velocity
        dispatch({
          type: 'SET_PROCESSING_STAGE',
          payload: 'Traversing banking hop-tree velocity & fan-out dispersion...',
        });
        await new Promise((r) => setTimeout(r, 600));

        // Stage 4: Synthesize CLS Composite Score
        dispatch({
          type: 'SET_PROCESSING_STAGE',
          payload: 'Computing Composite Livelihood Score (CLS) & regulatory safe-harbor memo...',
        });
        await new Promise((r) => setTimeout(r, 500));

        // Calculate dynamic CLS using live Gemini score
        const expected = state.currentScenario.expectedCLS;
        const geminiScore = Math.min(350, Math.max(0, geminiResult.ai_evidence_score));
        const graphScore = expected.graphVelocityScore;
        const physicalScore = expected.physicalLivelihoodScore;
        const totalScore = graphScore + geminiScore + physicalScore;

        let riskLevel: CLSBreakdown['riskLevel'] = 'low';
        let recommendation: CLSBreakdown['recommendation'] = 'lift_hold';

        if (totalScore >= 700) {
          riskLevel = 'low';
          recommendation = 'lift_hold';
        } else if (totalScore >= 500) {
          riskLevel = 'medium';
          recommendation = 'escalate';
        } else if (totalScore >= 350) {
          riskLevel = 'high';
          recommendation = 'escalate';
        } else {
          riskLevel = 'critical';
          recommendation = 'permanent_freeze';
        }

        const calculatedCLS: CLSBreakdown = {
          graphVelocityScore: graphScore,
          geminiMultimodalScore: geminiScore,
          physicalLivelihoodScore: physicalScore,
          totalScore,
          riskLevel,
          recommendation,
          details: {
            ...expected.details,
            inventoryConsistency: geminiResult.amount_match_boolean
              ? expected.details.inventoryConsistency
              : 'Discrepancy: Extracted amount mismatch',
          },
        };

        dispatch({ type: 'SET_GEMINI_RESULT', payload: geminiResult });
        dispatch({ type: 'SET_CLS_RESULT', payload: calculatedCLS });
      } catch (err) {
        console.error('Audit pipeline execution failed:', err);
      } finally {
        dispatch({ type: 'SET_PROCESSING', payload: false });
        dispatch({ type: 'SET_PROCESSING_STAGE', payload: '' });
      }
    },
    [state.currentScenario, state.merchantEvidence, state.isLiveGemini, state.geminiApiKey]
  );

  const value: AppContextValue = {
    ...state,
    state,
    dispatch,
    setJurisdiction,
    loadScenario,
    setProcessing,
    setProcessingStage,
    setApiKey,
    toggleApiKeyModal,
    setClsResult,
    setGeminiResult,
    setView,
    submitEvidence,
    setMerchantEvidence,
    setMerchantLanguage,
    approveCase,
    rejectCase,
    resetResults,
    runAuditPipeline,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// ==========================================
// Custom Hook
// ==========================================
export function useAppContext(): AppContextValue {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
