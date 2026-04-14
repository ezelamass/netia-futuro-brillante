import { useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppLayout } from '@/layouts/AppLayout';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, X, Check, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLessonPlayer } from '@/hooks/useLessonPlayer';
import { useLessonQuiz } from '@/hooks/useLessonQuiz';
import { useLessonNavigation } from '@/hooks/useLessonNavigation';
import { useClassroomXP } from '@/hooks/useClassroomXP';
import { VideoEmbed, LessonQuiz, ModuleCompletionDialog, LessonContent } from '@/components/classroom';

const ClassroomLesson = () => {
  const { moduleId, lessonId } = useParams<{ moduleId: string; lessonId: string }>();
  const navigate = useNavigate();

  const { lesson, isCompleted, markComplete, isLoading, refetch: refetchLesson } = useLessonPlayer(lessonId);
  const { quiz, bestAttempt, submitAttempt } = useLessonQuiz(lessonId);
  const { prevLesson, nextLesson, currentIndex, totalLessons } = useLessonNavigation(moduleId, lessonId);
  const { checkClassroomBadges } = useClassroomXP();

  const [showCompletion, setShowCompletion] = useState(false);
  const [moduleName, setModuleName] = useState('');

  const handleMarkComplete = useCallback(async () => {
    await markComplete();
    await checkClassroomBadges();
    refetchLesson();
  }, [markComplete, checkClassroomBadges, refetchLesson]);

  const handleQuizSubmit = useCallback(async (answers: number[]) => {
    const result = await submitAttempt(answers);
    if (result.passed) {
      await checkClassroomBadges();
      refetchLesson();
    }
    return result;
  }, [submitAttempt, checkClassroomBadges, refetchLesson]);

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AppLayout>
    );
  }

  if (!lesson) {
    return (
      <AppLayout>
        <div className="text-center py-16 text-muted-foreground">
          Lección no encontrada
        </div>
      </AppLayout>
    );
  }

  const hasQuiz = !!quiz;

  return (
    <AppLayout>
      <div className="flex flex-col h-[calc(100vh-80px)] lg:h-[calc(100vh-56px)]">
        <div className="rounded-2xl border border-border/60 bg-background/80 shadow-lg backdrop-blur-xl flex flex-col flex-1 overflow-hidden">
          {/* Top bar */}
          <div className="border-b border-border/60 bg-background/95 px-4 py-3 backdrop-blur-sm flex items-center justify-between shrink-0">
            <h2 className="text-sm font-semibold truncate flex-1">{lesson.title}</h2>
            <span className="text-xs text-muted-foreground mx-3 shrink-0">
              {currentIndex + 1} de {totalLessons}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 shrink-0"
              onClick={() => navigate(`/classroom/${moduleId}`)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
            {/* Video */}
            {lesson.videoUrl && <VideoEmbed url={lesson.videoUrl} />}

            {/* Text content */}
            {lesson.contentMd && (
              <LessonContent content={lesson.contentMd} />
            )}

            {/* Quiz */}
            {quiz && (
              <LessonQuiz
                quiz={quiz}
                bestAttempt={bestAttempt}
                onSubmit={handleQuizSubmit}
              />
            )}

            {/* Empty lesson */}
            {!lesson.videoUrl && !lesson.contentMd && !quiz && (
              <div className="text-center py-12 text-muted-foreground">
                Esta lección aún no tiene contenido
              </div>
            )}
          </div>

          {/* Bottom navigation */}
          <div className="border-t border-border/60 bg-background/95 px-3 py-2.5 backdrop-blur-sm flex items-center justify-between shrink-0">
            <Button
              variant="ghost"
              size="sm"
              disabled={!prevLesson}
              onClick={() => prevLesson && navigate(`/classroom/${moduleId}/lesson/${prevLesson.id}`)}
              className="gap-1"
            >
              <ChevronLeft className="w-4 h-4" />
              Anterior
            </Button>

            {/* Mark complete button — only if no quiz */}
            {!hasQuiz && (
              <Button
                size="sm"
                disabled={isCompleted}
                onClick={handleMarkComplete}
                className={cn(
                  'gap-1.5',
                  isCompleted && 'bg-emerald-500 hover:bg-emerald-500 cursor-default'
                )}
              >
                {isCompleted ? (
                  <>
                    <Check className="w-4 h-4" />
                    Completada
                  </>
                ) : (
                  'Marcar completada'
                )}
              </Button>
            )}

            {/* Completed via quiz indicator */}
            {hasQuiz && isCompleted && (
              <span className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                <Check className="w-3.5 h-3.5" />
                Quiz aprobado
              </span>
            )}

            <Button
              variant="ghost"
              size="sm"
              disabled={!nextLesson}
              onClick={() => nextLesson && navigate(`/classroom/${moduleId}/lesson/${nextLesson.id}`)}
              className="gap-1"
            >
              Siguiente
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <ModuleCompletionDialog
        open={showCompletion}
        onOpenChange={setShowCompletion}
        moduleName={moduleName}
      />
    </AppLayout>
  );
};

export default ClassroomLesson;
