import { questionBank } from './questionBank.js';
import { generateMockFeedback } from './mockFeedback.js';
import { buildInterviewResult } from '../utils/interviewResult.js';

// ---------------------------------------------------------------------------
// SAMPLE HISTORY
// So the dashboard is not empty on the first visit, we create four finished
// interviews (scores 62 -> 68 -> 74 -> 82) the first time the app runs.
// They are built with the same function used for real interviews.
// ---------------------------------------------------------------------------

const SAMPLE_ANSWER =
  'This is a sample answer saved with the demo data. It explains the idea, gives a short example, and mentions one trade-off.';

// Small offsets so each answer differs a little but the average stays on target.
const SCORE_OFFSETS = [4, -3, 2, -5, 2];

const SAMPLE_INTERVIEWS = [
  { daysAgo: 9, type: 'HR', category: 'HR', difficulty: 'Easy', score: 62 },
  { daysAgo: 5, type: 'Python', category: 'Python', difficulty: 'Medium', score: 68 },
  { daysAgo: 1, type: 'DBMS', category: 'DBMS', difficulty: 'Medium', score: 74 },
  { daysAgo: 0, type: 'Java', category: 'Java', difficulty: 'Medium', score: 82 },
];

export function createSampleInterviews() {
  return SAMPLE_INTERVIEWS.map((sample, index) => {
    const questions = questionBank.filter((q) => q.category === sample.category).slice(index * 5, index * 5 + 5);
    const date = new Date();
    date.setDate(date.getDate() - sample.daysAgo);
    date.setHours(11, 30, 0, 0);

    const answers = questions.map((question, i) => ({
      question,
      answerText: SAMPLE_ANSWER,
      answerType: i % 2 === 0 ? 'text' : 'voice',
      skipped: false,
      feedback: generateMockFeedback({
        question: question.question,
        answer: SAMPLE_ANSWER,
        category: question.category,
        targetScore: sample.score + SCORE_OFFSETS[i],
      }),
    }));

    return buildInterviewResult({
      id: `sample-${index + 1}`,
      date: date.toISOString(),
      config: { type: sample.type, difficulty: sample.difficulty },
      answers,
    });
  });
}
