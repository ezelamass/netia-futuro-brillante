import { cn } from '@/lib/utils';

interface ChoiceQuestionProps {
  options: string[];
  value: string | null;
  onChange: (value: string, index: number) => void;
}

export function ChoiceQuestion({ options, value, onChange }: ChoiceQuestionProps) {
  return (
    <div className="grid gap-2 py-4">
      {options.map((opt, i) => (
        <button
          key={opt}
          type="button"
          onClick={() => onChange(opt, i)}
          className={cn(
            'w-full text-left px-4 py-3 rounded-xl border-2 transition-all text-sm font-medium',
            value === opt
              ? 'border-primary bg-primary/10 text-primary'
              : 'border-border hover:border-primary/50 hover:bg-accent text-foreground'
          )}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}
