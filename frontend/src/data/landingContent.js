import { Brain, Mic, Target, LineChart, Briefcase, TrendingUp } from 'lucide-react';

// Text content for the landing page lives here so the page file stays tidy.

export const FEATURES = [
  {
    icon: Brain,
    title: 'AI Answer Analysis',
    description: 'Every answer is scored on relevance, accuracy, completeness, clarity, and communication.',
  },
  {
    icon: Mic,
    title: 'Voice Interviews',
    description: 'Speak your answers out loud like a real interview. We turn your voice into editable text.',
  },
  {
    icon: Target,
    title: 'Personalized Feedback',
    description: 'See what you did well, what is missing, and a polished ideal answer to learn from.',
  },
  {
    icon: LineChart,
    title: 'Performance Tracking',
    description: 'Follow your scores over time and spot the topics that need more practice.',
  },
  {
    icon: Briefcase,
    title: 'Technical + HR Interviews',
    description: 'Practice HR, behavioral, Java, Python, DBMS, SQL, AI/ML, and software engineering.',
  },
  {
    icon: TrendingUp,
    title: 'Adaptive Difficulty',
    description: 'Choose Easy, Medium, or Hard and level up as your answers get stronger.',
  },
];

export const STEPS = [
  { title: 'Choose your interview', description: 'Pick a type, a difficulty, and how many questions you want.' },
  { title: 'Answer questions', description: 'Type your answer or speak it, just like you would in the room.' },
  { title: 'Get AI feedback', description: 'Receive scores, strengths, gaps, and an ideal answer in seconds.' },
  { title: 'Improve and practice again', description: 'Review your results, fix weak topics, and come back stronger.' },
];

// These are placeholder testimonials for the design. Replace with real ones later.
export const TESTIMONIALS = [
  {
    quote:
      'The feedback on my Java answers was more specific than anything I got from friends. I finally knew what I was leaving out.',
    name: 'Aarav Mehta',
    role: 'Final-year CS student',
  },
  {
    quote:
      'Practicing out loud made a huge difference. By my third mock interview I stopped rambling and started structuring my answers.',
    name: 'Priya Nair',
    role: 'Junior Software Engineer',
  },
  {
    quote:
      'The behavioral questions with STAR-style feedback helped me turn vague stories into clear, confident answers.',
    name: 'Rohan Deshmukh',
    role: 'Campus placement candidate',
  },
];
