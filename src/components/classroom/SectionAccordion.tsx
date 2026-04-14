import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { LessonRow } from './LessonRow';
import type { CourseSection } from '@/types/classroom';

interface SectionAccordionProps {
  sections: CourseSection[];
  completedIds: Set<string>;
  onLessonClick: (lessonId: string) => void;
}

export function SectionAccordion({ sections, completedIds, onLessonClick }: SectionAccordionProps) {
  return (
    <Accordion type="multiple" defaultValue={sections.map(s => s.id)} className="space-y-3">
      {sections.map((section) => {
        const completedInSection = section.lessons.filter(l => completedIds.has(l.id)).length;
        const totalInSection = section.lessons.length;

        return (
          <AccordionItem key={section.id} value={section.id} className="border rounded-xl px-1">
            <AccordionTrigger className="px-3 py-3 hover:no-underline">
              <div className="flex items-center justify-between w-full pr-2">
                <span className="font-semibold text-sm">{section.title}</span>
                <Badge variant="outline" className="text-xs ml-2">
                  {completedInSection}/{totalInSection}
                </Badge>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-1 pb-2">
              <div className="space-y-0.5">
                {section.lessons.map((lesson, lessonIdx) => {
                  const isCompleted = completedIds.has(lesson.id);
                  // Sequential unlock: first lesson always available, subsequent need previous completed
                  const prevLesson = lessonIdx > 0 ? section.lessons[lessonIdx - 1] : null;
                  const isLocked = lessonIdx > 0 && prevLesson && !completedIds.has(prevLesson.id);

                  return (
                    <LessonRow
                      key={lesson.id}
                      id={lesson.id}
                      title={lesson.title}
                      durationMin={lesson.durationMin}
                      number={lessonIdx + 1}
                      isCompleted={isCompleted}
                      isLocked={!!isLocked}
                      hasQuiz={lesson.hasQuiz}
                      onClick={() => onLessonClick(lesson.id)}
                      index={lessonIdx}
                    />
                  );
                })}
              </div>
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
}
