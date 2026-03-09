import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import type { DiagnosticTest, DiagnosticQuestion, DiagnosticResponse, DiagnosticHistoryEntry } from '@/types/diagnostic';

export function useDiagnosticTests() {
  return useQuery({
    queryKey: ['diagnostic-tests'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('diagnostic_tests')
        .select('*')
        .eq('is_active', true)
        .order('axis');
      if (error) throw error;
      return data as DiagnosticTest[];
    },
  });
}

export function useDiagnosticQuestions(testId: string | null) {
  return useQuery({
    queryKey: ['diagnostic-questions', testId],
    queryFn: async () => {
      if (!testId) return [];
      const { data, error } = await supabase
        .from('diagnostic_questions')
        .select('*')
        .eq('test_id', testId)
        .order('order_index');
      if (error) throw error;
      return data as DiagnosticQuestion[];
    },
    enabled: !!testId,
  });
}

export function useDiagnosticHistory() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['diagnostic-history', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('diagnostic_history')
        .select('*')
        .eq('user_id', user.id)
        .order('recorded_at', { ascending: false });
      if (error) throw error;
      return data as DiagnosticHistoryEntry[];
    },
    enabled: !!user,
  });
}

export function useLatestDiagnosticScores() {
  const { data: history } = useDiagnosticHistory();

  const latestByAxis = (history ?? []).reduce<Record<string, DiagnosticHistoryEntry>>((acc, entry) => {
    if (!acc[entry.axis] || new Date(entry.recorded_at) > new Date(acc[entry.axis].recorded_at)) {
      acc[entry.axis] = entry;
    }
    return acc;
  }, {});

  return latestByAxis;
}

export function useCompletedSessions() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['diagnostic-sessions', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('diagnostic_sessions')
        .select('*')
        .eq('user_id', user.id)
        .not('completed_at', 'is', null)
        .order('completed_at', { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
}

interface SubmitTestParams {
  testId: string;
  axis: string;
  responses: DiagnosticResponse[];
  questions: DiagnosticQuestion[];
}

export function useSubmitDiagnostic() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ testId, axis, responses, questions }: SubmitTestParams) => {
      if (!user) throw new Error('Not authenticated');

      // Calculate scores
      let totalScore = 0;
      let maxScore = 0;
      for (const r of responses) {
        totalScore += r.score;
        const q = questions.find(q => q.id === r.question_id);
        const weight = q?.weight ?? 1;
        // Max score per question: likert=5, choice=varies, numeric=10
        const qMax = q?.question_type === 'likert' ? 5 * weight
          : q?.question_type === 'choice' ? (q.options?.length ?? 4) * weight
          : 10 * weight;
        maxScore += qMax;
      }

      const normalizedScore = maxScore > 0 ? Math.round((totalScore / maxScore) * 10 * 10) / 10 : 0;

      // Create session
      const { data: session, error: sessionError } = await supabase
        .from('diagnostic_sessions')
        .insert({
          user_id: user.id,
          test_id: testId,
          axis,
          completed_at: new Date().toISOString(),
          total_score: totalScore,
          max_score: maxScore,
          normalized_score: normalizedScore,
        })
        .select()
        .single();
      if (sessionError) throw sessionError;

      // Insert responses
      const { error: respError } = await supabase
        .from('diagnostic_responses')
        .insert(responses.map(r => ({
          session_id: session.id,
          question_id: r.question_id,
          response_value: r.response_value,
          score: r.score,
        })));
      if (respError) throw respError;

      // Insert history entry
      const { error: histError } = await supabase
        .from('diagnostic_history')
        .insert({
          user_id: user.id,
          axis,
          score: normalizedScore,
          detail: `Score: ${totalScore}/${maxScore}`,
          session_id: session.id,
        });
      if (histError) throw histError;

      return { session, normalizedScore };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['diagnostic-history'] });
      queryClient.invalidateQueries({ queryKey: ['diagnostic-sessions'] });
    },
  });
}
