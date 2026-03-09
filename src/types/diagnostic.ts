export type DiagnosticAxis = 'físico' | 'técnico' | 'táctico' | 'mental';
export type QuestionType = 'likert' | 'choice' | 'numeric' | 'text';

export interface DiagnosticTest {
  id: string;
  axis: DiagnosticAxis;
  title: string;
  description: string | null;
  sport: string | null;
  question_count: number;
  estimated_minutes: number;
  is_active: boolean;
  created_at: string;
}

export interface DiagnosticQuestion {
  id: string;
  test_id: string;
  order_index: number;
  question_text: string;
  question_type: QuestionType;
  options: string[] | null;
  weight: number;
}

export interface DiagnosticSession {
  id: string;
  user_id: string;
  test_id: string;
  axis: string;
  started_at: string;
  completed_at: string | null;
  total_score: number;
  max_score: number;
  normalized_score: number;
  notes: string | null;
}

export interface DiagnosticResponse {
  question_id: string;
  response_value: string;
  score: number;
}

export interface DiagnosticHistoryEntry {
  id: string;
  user_id: string;
  axis: string;
  score: number;
  detail: string | null;
  recorded_at: string;
  session_id: string | null;
}

export const AXIS_CONFIG: Record<DiagnosticAxis, { color: string; icon: string; label: string }> = {
  'físico': { color: 'hsl(var(--chart-1))', icon: '💪', label: 'Físico' },
  'técnico': { color: 'hsl(var(--chart-2))', icon: '🎯', label: 'Técnico' },
  'táctico': { color: 'hsl(var(--chart-3))', icon: '🧠', label: 'Táctico' },
  'mental': { color: 'hsl(var(--chart-4))', icon: '🧘', label: 'Mental' },
};
