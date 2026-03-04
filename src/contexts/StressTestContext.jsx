import { createContext, useContext, useReducer, useMemo } from 'react';
import { applyScenario, computeAllStressResults } from '../engines/scenarioEngine';

const StressTestContext = createContext(null);

const initialState = {
  selectedScenarioId: 'gfc-2008',
  severity: 'severe',
  results: null,
  comparisonResults: null,
  isComputing: false,
};

function stressTestReducer(state, action) {
  switch (action.type) {
    case 'SELECT_SCENARIO':
      return { ...state, selectedScenarioId: action.payload };
    case 'SET_SEVERITY':
      return { ...state, severity: action.payload };
    case 'SET_RESULTS':
      return { ...state, results: action.payload, isComputing: false };
    case 'SET_COMPARISON':
      return { ...state, comparisonResults: action.payload };
    case 'SET_COMPUTING':
      return { ...state, isComputing: true };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

export function StressTestProvider({ children }) {
  const [state, dispatch] = useReducer(stressTestReducer, initialState);

  // Recompute results when scenario or severity changes
  const results = useMemo(() => {
    return applyScenario(state.selectedScenarioId, state.severity);
  }, [state.selectedScenarioId, state.severity]);

  const comparisonResults = useMemo(() => {
    return computeAllStressResults(state.severity);
  }, [state.severity]);

  const value = useMemo(() => ({
    ...state,
    results,
    comparisonResults,
    dispatch,
    selectScenario: (id) => dispatch({ type: 'SELECT_SCENARIO', payload: id }),
    setSeverity: (sev) => dispatch({ type: 'SET_SEVERITY', payload: sev }),
    reset: () => dispatch({ type: 'RESET' }),
  }), [state, results, comparisonResults]);

  return (
    <StressTestContext.Provider value={value}>
      {children}
    </StressTestContext.Provider>
  );
}

export function useStressTest() {
  const context = useContext(StressTestContext);
  if (!context) {
    throw new Error('useStressTest must be used within a StressTestProvider');
  }
  return context;
}
