import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AppLayout } from '@/layouts/AppLayout';
import { TestCard, TestRunner, TestResults } from '@/components/diagnostic';
import { useDiagnosticTests, useDiagnosticQuestions, useSubmitDiagnostic, useCompletedSessions } from '@/hooks/useDiagnostic';
import { ClipboardCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AXIS_CONFIG, type DiagnosticTest as DTest, type DiagnosticAxis, type DiagnosticResponse } from '@/types/diagnostic';
import { toast } from 'sonner';

const AXES: DiagnosticAxis[] = ['físico', 'técnico', 'táctico', 'mental'];

const DiagnosticTestPage = () => {
  const [searchParams] = useSearchParams();
  const defaultAxis = (searchParams.get('axis') as DiagnosticAxis) || 'físico';

  const { data: tests = [], isLoading } = useDiagnosticTests();
  const { data: sessions = [] } = useCompletedSessions();
  const submitMutation = useSubmitDiagnostic();

  const [activeTest, setActiveTest] = useState<DTest | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [lastScore, setLastScore] = useState(0);

  const { data: questions = [] } = useDiagnosticQuestions(activeTest?.id ?? null);

  const getLastCompleted = (testId: string) => {
    const session = sessions.find((s: any) => s.test_id === testId);
    return session?.completed_at ?? null;
  };

  const handleSubmit = async (responses: DiagnosticResponse[]) => {
    if (!activeTest) return;
    try {
      const result = await submitMutation.mutateAsync({
        testId: activeTest.id,
        axis: activeTest.axis,
        responses,
        questions,
      });
      setLastScore(result.normalizedScore);
      setActiveTest(null);
      setShowResults(true);
      toast.success('Test completado exitosamente');
    } catch {
      toast.error('Error al guardar el test');
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6 pb-8">
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <ClipboardCheck className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Tests Diagnósticos</h1>
              <p className="text-xs text-muted-foreground">Evaluá tu estado en cada eje de la metodología NETIA</p>
            </div>
          </div>
        </motion.div>

        <Tabs defaultValue={defaultAxis}>
          <TabsList className="w-full grid grid-cols-4">
            {AXES.map(axis => (
              <TabsTrigger key={axis} value={axis} className="text-xs gap-1">
                <span>{AXIS_CONFIG[axis].icon}</span>
                <span className="hidden sm:inline">{AXIS_CONFIG[axis].label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {AXES.map(axis => (
            <TabsContent key={axis} value={axis} className="mt-4">
              <div className="grid gap-4 sm:grid-cols-2">
                {isLoading ? (
                  <p className="text-sm text-muted-foreground col-span-2 text-center py-8">Cargando tests...</p>
                ) : (
                  tests
                    .filter(t => t.axis === axis)
                    .map(test => (
                      <TestCard
                        key={test.id}
                        test={test}
                        lastCompletedAt={getLastCompleted(test.id)}
                        onStart={setActiveTest}
                      />
                    ))
                )}
              </div>
            </TabsContent>
          ))}
        </Tabs>

        {activeTest && questions.length > 0 && (
          <TestRunner
            test={activeTest}
            questions={questions}
            open={!!activeTest}
            onClose={() => setActiveTest(null)}
            onSubmit={handleSubmit}
            isSubmitting={submitMutation.isPending}
          />
        )}

        {showResults && activeTest === null && (
          <TestResults
            open={showResults}
            onClose={() => setShowResults(false)}
            axis={(submitMutation.data?.session?.axis as DiagnosticAxis) ?? 'físico'}
            normalizedScore={lastScore}
            testTitle="Evaluación completada"
          />
        )}
      </div>
    </AppLayout>
  );
};

export default DiagnosticTestPage;
