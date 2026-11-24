// ---------------------------------------------------------------------------
// ADAPTIVE INTERVIEW HELPERS
// Small, pure functions (no React, no network) that decide things like
// "which topics are weak?" and "should the next question be harder?".
//
// - getWeakTopics / getStrongTopics are already used by the result page.
// - getNextDifficulty is ready but NOT wired in yet. Later, the interview page
//   can call it after each answer to pick the next question's difficulty.
// ---------------------------------------------------------------------------

const DIFFICULTY_LEVELS = ['Easy', 'Medium', 'Hard'];

export const STRONG_TOPIC_SCORE = 75;
export const WEAK_TOPIC_SCORE = 65;

// Good answer -> harder. Weak answer -> easier. Otherwise stay the same.
export function getNextDifficulty(currentDifficulty, score) {
  const index = DIFFICULTY_LEVELS.indexOf(currentDifficulty);
  if (index === -1) return 'Medium';
  if (score >= 80) return DIFFICULTY_LEVELS[Math.min(index + 1, DIFFICULTY_LEVELS.length - 1)];
  if (score < 50) return DIFFICULTY_LEVELS[Math.max(index - 1, 0)];
  return currentDifficulty;
}

// items: [{ topic: 'OOP', score: 80 }, ...]
// returns: [{ topic: 'OOP', averageScore: 78, count: 3 }, ...]
export function summarizeTopicPerformance(items) {
  const groups = {};
  items.forEach(({ topic, score }) => {
    if (!groups[topic]) groups[topic] = { total: 0, count: 0 };
    groups[topic].total += score;
    groups[topic].count += 1;
  });

  return Object.entries(groups).map(([topic, { total, count }]) => ({
    topic,
    averageScore: Math.round(total / count),
    count,
  }));
}

export function getStrongTopics(topicStats) {
  return topicStats
    .filter((topic) => topic.averageScore >= STRONG_TOPIC_SCORE)
    .sort((a, b) => b.averageScore - a.averageScore);
}

export function getWeakTopics(topicStats) {
  return topicStats
    .filter((topic) => topic.averageScore < WEAK_TOPIC_SCORE)
    .sort((a, b) => a.averageScore - b.averageScore);
}
