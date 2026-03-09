import { Input } from '@/components/ui/input';

interface NumericQuestionProps {
  value: string;
  onChange: (value: string) => void;
}

export function NumericQuestion({ value, onChange }: NumericQuestionProps) {
  return (
    <div className="flex justify-center py-4">
      <Input
        type="number"
        min={0}
        max={999}
        placeholder="Ingresá un número"
        value={value}
        onChange={e => onChange(e.target.value)}
        className="max-w-[200px] text-center text-lg font-bold"
      />
    </div>
  );
}
