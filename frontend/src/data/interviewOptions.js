import {
  Users,
  MessageSquare,
  Cpu,
  Coffee,
  Terminal,
  Database,
  Table,
  Brain,
  Layers,
  Keyboard,
  Mic,
  AudioLines,
} from 'lucide-react';

// The interview types shown on the "Configure Your Interview" page.
// `categories` tells us which question-bank categories each type draws from.
export const INTERVIEW_TYPES = [
  { id: 'HR', label: 'HR', icon: Users, description: 'Motivation, culture fit, and career goals', categories: ['HR'] },
  {
    id: 'Technical',
    label: 'Technical',
    icon: Cpu,
    description: 'A mix of core engineering topics',
    categories: ['Java', 'Python', 'DBMS', 'SQL', 'AI/ML', 'Software Engineering'],
  },
  { id: 'Behavioral', label: 'Behavioral', icon: MessageSquare, description: 'STAR-style situational questions', categories: ['Behavioral'] },
  { id: 'Java', label: 'Java', icon: Coffee, description: 'OOP, collections, concurrency', categories: ['Java'] },
  { id: 'Python', label: 'Python', icon: Terminal, description: 'Language features and internals', categories: ['Python'] },
  { id: 'DBMS', label: 'DBMS', icon: Database, description: 'Normalization, transactions, indexing', categories: ['DBMS'] },
  { id: 'SQL', label: 'SQL', icon: Table, description: 'Joins, queries, and optimization', categories: ['SQL'] },
  { id: 'AI/ML', label: 'AI/ML', icon: Brain, description: 'Models, evaluation, deep learning', categories: ['AI/ML'] },
  {
    id: 'Software Engineering',
    label: 'Software Engineering',
    icon: Layers,
    description: 'Design, testing, architecture',
    categories: ['Software Engineering'],
  },
];

export const DIFFICULTIES = ['Easy', 'Medium', 'Hard'];

export const QUESTION_COUNTS = [5, 10, 15];

export const ANSWER_MODES = [
  { id: 'text', label: 'Text', icon: Keyboard },
  { id: 'voice', label: 'Voice', icon: Mic },
  { id: 'both', label: 'Both', icon: AudioLines },
];

export function getInterviewType(id) {
  return INTERVIEW_TYPES.find((type) => type.id === id) || INTERVIEW_TYPES[0];
}
