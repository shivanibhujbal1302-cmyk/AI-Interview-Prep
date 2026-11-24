import { getStrongTopics, getWeakTopics, summarizeTopicPerformance } from './adaptive.js';
import { joinWithAnd } from './format.js';

// ---------------------------------------------------------------------------
// Turns the list of answers from a finished interview into one "result"
// object. The same object is saved to history and shown on the result page.
//
// answers: [{ question, answerText, answerType, skipped, feedback }]
// ---------------------------------------------------------------------------

function average(numbers) {
  if (numbers.length === 0) return 0;
  return Math.round(numbers.reduce((sum, n) => sum + n, 0) / numbers.length);
}

export function buildInterviewResult({ config, answers, id, date }) {
  const answered = answers.filter((answer) => !answer.skipped);
  const averageOf = (key) => average(answered.map((answer) => answer.feedback[key]));

  const overallScore = averageOf('overallScore');
  const breakdown = {
    relevance: averageOf('relevanceScore'),
    accuracy: averageOf('accuracyScore'),
    completeness: averageOf('completenessScore'),
    clarity: averageOf('clarityScore'),
    communication: averageOf('communicationScore'),
  };

  // Skipped questions count as 0 for topic performance, so they show up as weak areas.
  const topicStats = summarizeTopicPerformance(
    answers.map((answer) => ({
      topic: answer.question.topic,
      score: answer.skipped ? 0 : answer.feedback.overallScore,
    }))
  );
  const strongAreas = getStrongTopics(topicStats);
  const weakAreas = getWeakTopics(topicStats);

  // If nothing is clearly weak, still suggest the two lowest topics to polish.
  const recommendedTopics = (
    weakAreas.length > 0 ? weakAreas : [...topicStats].sort((a, b) => a.averageScore - b.averageScore).slice(0, 2)
  ).map((topic) => topic.topic);

  const skippedCount = answers.length - answered.length;

  return {
    id: id || String(Date.now()),
    date: date || new Date().toISOString(),
    category: config.type,
    difficulty: config.difficulty,
    totalQuestions: answers.length,
    answeredCount: answered.length,
    skippedCount,
    overallScore,
    status: 'Completed',
    breakdown,
    strongAreas,
    weakAreas,
    recommendedTopics,
    summary: buildSummary({ config, overallScore, answeredCount: answered.length, skippedCount, strongAreas, weakAreas }),
    answers: answers.map((answer) => ({
      question: answer.question.question,
      topic: answer.question.topic,
      category: answer.question.category,
      answerText: answer.answerText,
      answerType: answer.answerType,
      skipped: answer.skipped,
      feedback: answer.feedback,
    })),
  };
}

// A simple template-based summary. In Phase 7 the AI can write this instead.
function buildSummary({ config, overallScore, answeredCount, skippedCount, strongAreas, weakAreas }) {
  if (answeredCount === 0) {
    return 'You skipped every question this time. Try again and attempt each answer, even a rough one. Practice is the fastest way to improve.';
  }

  const parts = [`You scored ${overallScore}% on this ${config.difficulty.toLowerCase()} ${config.type} interview.`];

  if (strongAreas.length > 0) {
    parts.push(`You demonstrated strong understanding of ${joinWithAnd(strongAreas.slice(0, 3).map((t) => t.topic))}.`);
  }
  if (weakAreas.length > 0) {
    parts.push(
      `You should improve ${joinWithAnd(weakAreas.slice(0, 3).map((t) => t.topic))} by adding clearer structure and practical examples.`
    );
  } else {
    parts.push('Try a harder difficulty next time to keep growing.');
  }
  if (skippedCount > 0) {
    parts.push(`You skipped ${skippedCount} question${skippedCount > 1 ? 's' : ''}, so attempt every answer next time.`);
  }
  return parts.join(' ');
}
