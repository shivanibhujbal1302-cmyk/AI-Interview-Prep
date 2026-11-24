import { countWords } from '../utils/format.js';

// ---------------------------------------------------------------------------
// MOCK AI FEEDBACK (Phase 1 only)
// Produces feedback in EXACTLY the same shape the real AI endpoint will
// return in Phase 7, so the UI does not need to change later.
// The score here is only a rough demo based on answer length.
// ---------------------------------------------------------------------------

const IDEAL_ANSWERS = {
  'What is inheritance in Java?':
    "Inheritance is an object-oriented mechanism that lets one class (the subclass) acquire the fields and methods of another class (the superclass) using the extends keyword. It promotes code reuse and models an 'is-a' relationship. For example, a Dog class can extend an Animal class, reuse its eat() method, and add its own bark() method. A subclass can also override superclass methods to change behaviour, and the super keyword gives access to the parent's constructor and methods. Java allows a class to extend only one class, but it can implement many interfaces.",
};

const GENERIC_IDEAL_ANSWERS = {
  technical:
    'A strong answer starts with a one-sentence definition of the concept, explains how it works and why it matters, gives a short practical example, and finishes with trade-offs or common pitfalls that an experienced engineer would mention.',
  hr: 'A strong answer opens with a direct, confident response, supports it with one or two specific examples from your own experience, links it back to the role you are applying for, and stays under two minutes.',
  behavioral:
    'A strong answer follows the STAR method: briefly set the Situation, explain your Task, describe the specific Actions you took, and finish with a measurable Result and what you learned.',
};

const TIERS = {
  high: {
    strengths: [
      'Your answer directly addressed the question.',
      'You used correct terminology and showed solid understanding.',
      'The answer was well organised and easy to follow.',
    ],
    weaknesses: [
      'A concrete, real-world example would make the answer more memorable.',
      'A short closing sentence summarising your main point would tighten the structure.',
    ],
    summary: 'A strong answer. Polish it with a practical example and a clear closing line.',
  },
  mid: {
    strengths: ['You showed a basic understanding of the topic.', 'Your answer stayed mostly relevant to the question.'],
    weaknesses: [
      'Some key details were mentioned only briefly.',
      'The answer would benefit from a clearer structure.',
      'A practical example is missing.',
    ],
    summary: 'A decent start. Add more depth, structure, and an example to make it interview-ready.',
  },
  low: {
    strengths: ['You made an attempt to address the question.'],
    weaknesses: [
      'The answer was too short to show depth of knowledge.',
      'Core concepts were missing or unclear.',
      'Try a simple structure: definition, explanation, example.',
    ],
    summary: 'This answer needs more detail. Aim for a clear definition, an explanation, and one example.',
  },
};

const BY_KIND = {
  technical: {
    missingPoints: [
      'A practical, real-world example',
      'Trade-offs or limitations of the concept',
      'Related concepts worth mentioning',
    ],
    tips: [
      'Start with a one-line definition before going into detail.',
      'Include a short example to show you have used the concept.',
      'End by mentioning a trade-off or common mistake.',
    ],
  },
  hr: {
    missingPoints: ['A specific example from your experience', 'A clear link between your answer and the role'],
    tips: [
      'Lead with your main point, then support it with one example.',
      'Connect your answer to the company or role.',
      'Keep it concise and finish with confidence.',
    ],
  },
  behavioral: {
    missingPoints: ['A measurable Result of your actions', 'A clear Task: what you were responsible for'],
    tips: [
      'Structure the story with Situation, Task, Action, Result.',
      'Say "I" instead of "we" so your own contribution is clear.',
      'Finish with what you learned or the impact you made.',
    ],
  },
};

function getKind(category) {
  if (category === 'HR') return 'hr';
  if (category === 'Behavioral') return 'behavioral';
  return 'technical';
}

function simpleHash(text) {
  let hash = 0;
  for (let i = 0; i < text.length; i += 1) {
    hash = (hash * 31 + text.charCodeAt(i)) % 100000;
  }
  return hash;
}

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

export function generateMockFeedback({ question, answer = '', category = '', targetScore }) {
  const kind = getKind(category);
  const words = countWords(answer);

  // Demo scoring: longer answers score higher, with a little variation.
  const jitter = (simpleHash(question + answer) % 9) - 4;
  const overallScore = targetScore ?? clamp(Math.round(46 + words * 0.9 + jitter), 25, 94);

  const tier = overallScore >= 75 ? 'high' : overallScore >= 55 ? 'mid' : 'low';
  const missingCount = tier === 'high' ? 2 : tier === 'mid' ? 2 : 3;

  return {
    overallScore,
    relevanceScore: clamp(overallScore + 6, 0, 100),
    accuracyScore: clamp(overallScore + 2, 0, 100),
    completenessScore: clamp(overallScore - 6, 0, 100),
    clarityScore: overallScore,
    communicationScore: clamp(overallScore + 1, 0, 100),
    strengths: TIERS[tier].strengths,
    weaknesses: TIERS[tier].weaknesses,
    missingPoints: BY_KIND[kind].missingPoints.slice(0, missingCount),
    improvementTips: BY_KIND[kind].tips,
    idealAnswer: IDEAL_ANSWERS[question] || GENERIC_IDEAL_ANSWERS[kind],
    summary: TIERS[tier].summary,
  };
}
