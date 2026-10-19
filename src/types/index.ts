export type SubjectType = 'Matematika' | 'Bahasa Indonesia' | 'IPAS' | 'Pendidikan Pancasila';

export type DifficultyLevel = 'Mudah' | 'Sedang' | 'Menantang';

export type QuestionType = 'multiple_choice' | 'true_false' | 'matching' | 'ordering' | 'short_answer';

export type GameMode = 'individual' | 'group' | 'projector';

export interface Student {
  id: string;
  name: string;
  code?: string;
  group?: string;
  avatar: string;
  totalScore: number;
  gamesPlayed: number;
  starsEarned: number;
  xp: number;
  createdAt: string;
}

export interface StudentGroup {
  id: string;
  name: string;
  color: string;
  avatar: string;
  members: string[]; // student ids
  score?: number;
}

export interface Question {
  id: string;
  subject: SubjectType;
  topic: string;
  difficulty: DifficultyLevel;
  type: QuestionType;
  question: string;
  options: string[];
  correctAnswer: number; // 0-indexed
  explanation: string;
  hint?: string;
  createdAt?: string;
}

export interface Game {
  id: string;
  title: string;
  subject: SubjectType;
  topic: string;
  learningObjective: string;
  difficulty: DifficultyLevel;
  gameType: QuestionType;
  mode: GameMode;
  durationSeconds: number; // 0 = no limit
  pointsPerQuestion: number;
  questionIds: string[];
  realmId?: 'numerasi' | 'kata' | 'alam' | 'pancasila';
  createdAt: string;
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
  criteria: string;
  unlockedAt?: string;
}

export interface SessionAnswer {
  questionId: string;
  questionText: string;
  selectedAnswer: number;
  correctAnswer: number;
  isCorrect: boolean;
  topic: string;
}

export interface GameSession {
  id: string;
  gameId: string;
  gameTitle: string;
  subject: SubjectType;
  topic: string;
  mode: GameMode;
  participantId: string;
  participantName: string;
  avatar?: string;
  totalQuestions: number;
  correctCount: number;
  incorrectCount: number;
  score: number;
  maxScore: number;
  percentage: number;
  durationSeconds: number;
  stars: number; // 0 - 3
  xpEarned: number;
  badges: Badge[];
  completedAt: string;
  answers: SessionAnswer[];
}

export interface AppSettings {
  schoolName: string;
  className: string;
  teacherName: string;
  soundEnabled: boolean;
  animationsEnabled: boolean;
  defaultDuration: number;
  defaultPoints: number;
  demoMode: boolean;
  lastUpdated?: string;
}

export interface AppStateData {
  schemaVersion: number;
  settings: AppSettings;
  students: Student[];
  groups: StudentGroup[];
  questions: Question[];
  games: Game[];
  sessions: GameSession[];
  lastUpdated: string;
}

export type ActiveNavTab =
  | 'dashboard'
  | 'students'
  | 'adventure'
  | 'game-builder'
  | 'question-bank'
  | 'classroom-game'
  | 'classroom-tools'
  | 'reports'
  | 'settings'
  | 'about';
