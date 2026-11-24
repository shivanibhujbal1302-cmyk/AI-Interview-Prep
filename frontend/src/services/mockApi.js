import { questionBank } from '../data/questionBank.js';
import { generateMockFeedback } from '../data/mockFeedback.js';

import { getInterviewType } from '../data/interviewOptions.js';

// ---------------------------------------------------------------------------
// MOCK API (Phase 1)
// Pretends to be the backend. Everything is stored in the browser
// (localStorage) and every function waits a moment, like a real network call.
// In Phase 6 these functions are replaced by real calls to the Express API.
// ---------------------------------------------------------------------------

const STORAGE_KEY = 'aiprep_interviews';
const DIFFICULTY_ORDER = ['Easy', 'Medium', 'Hard'];

const wait = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

function shuffle(list) {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}


function readInterviews() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

// ---- Questions ------------------------------------------------------------

// Picks questions for the chosen interview type, preferring the chosen difficulty.
export async function getQuestions({ type, difficulty, count }) {
  await wait(700);

  const { categories } = getInterviewType(type);
  const pool = questionBank.filter((q) => categories.includes(q.category));

  // Closest difficulty first (exact matches, then neighbours), random inside each group.
  const distance = (q) => Math.abs(DIFFICULTY_ORDER.indexOf(q.difficulty) - DIFFICULTY_ORDER.indexOf(difficulty));
  const ranked = shuffle(pool).sort((a, b) => distance(a) - distance(b));

  return shuffle(ranked.slice(0, count));
}

// ---- AI analysis ----------------------------------------------------------

export async function analyzeAnswer({ question, answer, category }) {
  await wait(1800);
  if (!answer || answer.trim().length < 5) {
    throw new Error('Please write or record an answer before submitting.');
  }
  return generateMockFeedback({ question, answer, category });
}

// ---- Interview history ----------------------------------------------------

export async function saveInterview(result) {
  await wait(600);
  const interviews = readInterviews();
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...interviews, result]));
  return result;
}

export async function getInterviews() {
  await wait(500);
  return readInterviews().sort((a, b) => new Date(b.date) - new Date(a.date));
}

export async function getInterviewById(id) {
  await wait(400);
  return readInterviews().find((interview) => interview.id === id) || null;
}

// ---- Dashboard ------------------------------------------------------------

function average(numbers) {
  if (numbers.length === 0) return 0;
  return Math.round(numbers.reduce((sum, n) => sum + n, 0) / numbers.length);
}

// Consecutive days (ending today or yesterday) with at least one interview.
function calculateStreak(interviews) {
  const days = new Set(interviews.map((i) => new Date(i.date).toDateString()));
  const cursor = new Date();
  if (!days.has(cursor.toDateString())) cursor.setDate(cursor.getDate() - 1);

  let streak = 0;
  while (days.has(cursor.toDateString())) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

export async function getDashboardStats() {
  await wait(700);
  const newestFirst = readInterviews().sort((a, b) => new Date(b.date) - new Date(a.date));
  const oldestFirst = [...newestFirst].reverse();

  const categoryGroups = {};
  oldestFirst.forEach((i) => {
    categoryGroups[i.category] = [...(categoryGroups[i.category] || []), i.overallScore];
  });

  const averageOf = (key) => average(newestFirst.map((i) => i.breakdown[key]));

  return {
    stats: {
      interviewsCompleted: newestFirst.length,
      averageScore: average(newestFirst.map((i) => i.overallScore)),
      questionsPracticed: newestFirst.reduce((sum, i) => sum + i.answeredCount, 0),
      currentStreak: calculateStreak(newestFirst),
    },
    performanceOverTime: oldestFirst.slice(-8).map((i) => ({
      date: i.date,
      category: i.category,
      score: i.overallScore,
    })),
    categoryPerformance: Object.entries(categoryGroups).map(([category, scores]) => ({
      category,
      score: average(scores),
    })),
    skills: [
      { name: 'Technical Knowledge', score: averageOf('accuracy') },
      { name: 'Communication', score: averageOf('communication') },
      { name: 'Clarity', score: averageOf('clarity') },
      // "Confidence" is estimated from relevance + communication until real voice analysis exists.
      { name: 'Confidence', score: Math.round((averageOf('relevance') + averageOf('communication')) / 2) },
      { name: 'Completeness', score: averageOf('completeness') },
    ],
    recentInterviews: newestFirst.slice(0, 5),
  };
}
