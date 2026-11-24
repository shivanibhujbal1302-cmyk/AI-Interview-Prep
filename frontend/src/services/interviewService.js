// ---------------------------------------------------------------------------
// INTERVIEW SERVICE: the ONE place the pages talk to for interview data.
//
// Phase 1: everything comes from mockApi.js (no backend needed).
// Phase 6: we replace these exports with real calls using api.js, e.g.
//   export const getQuestions = (params) => apiRequest(`/questions?...`)
// The pages do not need to change at all.
// ---------------------------------------------------------------------------

export {
  getQuestions,
  analyzeAnswer,
  saveInterview,
  getInterviews,
  getInterviewById,
  getDashboardStats,
} from './mockApi.js';

// Flag used to show a small "demo feedback" note in the UI. Set to false in Phase 7.
export const USING_MOCK_DATA = true;

// The interview setup (type, difficulty, ...) is remembered for the current
// browser tab, so refreshing the interview page does not lose it.
const CONFIG_KEY = 'aiprep_interview_config';

export function saveInterviewConfig(config) {
  sessionStorage.setItem(CONFIG_KEY, JSON.stringify(config));
}

export function loadInterviewConfig() {
  try {
    return JSON.parse(sessionStorage.getItem(CONFIG_KEY));
  } catch {
    return null;
  }
}

export function clearInterviewConfig() {
  sessionStorage.removeItem(CONFIG_KEY);
}
