import { Progress } from '@/components/ui/progress';

interface ModuleProgressBarProps {
  completed: number;
  total: number;
  className?: string;
}

export function ModuleProgressBar({ completed, total, className }: ModuleProgressBarProps) {
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-sm text-muted-foreground">
          {completed} de {total} lecciones completadas
        </span>
        <span className="text-sm font-medium">{percent}%</span>
      </div>
      <Progress value={percent} className="h-2" />
    </div>
  );
}
