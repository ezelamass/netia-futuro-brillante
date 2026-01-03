import { UseFormReturn, FieldPath, FieldValues } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

interface FieldDisplayProps {
  label: string;
  value: string | number | boolean | string[];
  className?: string;
}

export const FieldDisplay = ({ label, value, className }: FieldDisplayProps) => {
  const displayValue = Array.isArray(value)
    ? value.join(', ') || '—'
    : typeof value === 'boolean'
    ? value ? 'Sí' : 'No'
    : value || '—';

  return (
    <div className={cn("py-2", className)}>
      <span className="text-sm text-muted-foreground">{label}</span>
      <p className="font-medium text-foreground">{displayValue}</p>
    </div>
  );
};

interface EditableTextFieldProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  name: FieldPath<T>;
  label: string;
  placeholder?: string;
  type?: 'text' | 'email' | 'tel' | 'number';
  disabled?: boolean;
}

export function EditableTextField<T extends FieldValues>({
  form,
  name,
  label,
  placeholder,
  type = 'text',
  disabled = false,
}: EditableTextFieldProps<T>) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input
              {...field}
              type={type}
              placeholder={placeholder}
              disabled={disabled}
              value={field.value ?? ''}
              onChange={(e) => {
                const value = type === 'number' 
                  ? (e.target.value ? Number(e.target.value) : '')
                  : e.target.value;
                field.onChange(value);
              }}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

interface EditableTextareaFieldProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  name: FieldPath<T>;
  label: string;
  placeholder?: string;
  rows?: number;
}

export function EditableTextareaField<T extends FieldValues>({
  form,
  name,
  label,
  placeholder,
  rows = 3,
}: EditableTextareaFieldProps<T>) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Textarea
              {...field}
              placeholder={placeholder}
              rows={rows}
              value={field.value ?? ''}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

interface EditableSelectFieldProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  name: FieldPath<T>;
  label: string;
  options: readonly { value: string; label: string }[];
  placeholder?: string;
}

export function EditableSelectField<T extends FieldValues>({
  form,
  name,
  label,
  options,
  placeholder = 'Seleccionar...',
}: EditableSelectFieldProps<T>) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <Select onValueChange={field.onChange} value={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

interface EditableSwitchFieldProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  name: FieldPath<T>;
  label: string;
  description?: string;
}

export function EditableSwitchField<T extends FieldValues>({
  form,
  name,
  label,
  description,
}: EditableSwitchFieldProps<T>) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex items-center justify-between rounded-lg border border-border/50 p-3">
          <div className="space-y-0.5">
            <FormLabel className="text-base">{label}</FormLabel>
            {description && (
              <p className="text-sm text-muted-foreground">{description}</p>
            )}
          </div>
          <FormControl>
            <Switch
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          </FormControl>
        </FormItem>
      )}
    />
  );
}

interface EditableCheckboxGroupProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  name: FieldPath<T>;
  label: string;
  options: readonly { value: string; label: string }[];
}

export function EditableCheckboxGroup<T extends FieldValues>({
  form,
  name,
  label,
  options,
}: EditableCheckboxGroupProps<T>) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <div className="flex flex-wrap gap-2 mt-2">
            {options.map((option) => {
              const isChecked = (field.value as string[])?.includes(option.value);
              return (
                <label
                  key={option.value}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-full cursor-pointer",
                    "border transition-colors text-sm",
                    isChecked
                      ? "bg-primary/10 border-primary text-primary"
                      : "bg-muted/50 border-border hover:bg-muted"
                  )}
                >
                  <Checkbox
                    checked={isChecked}
                    onCheckedChange={(checked) => {
                      const current = (field.value as string[]) || [];
                      if (checked) {
                        field.onChange([...current, option.value]);
                      } else {
                        field.onChange(current.filter((v: string) => v !== option.value));
                      }
                    }}
                    className="sr-only"
                  />
                  {option.label}
                </label>
              );
            })}
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

interface EditableChipsFieldProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  name: FieldPath<T>;
  label: string;
  options: readonly string[];
}

export function EditableChipsField<T extends FieldValues>({
  form,
  name,
  label,
  options,
}: EditableChipsFieldProps<T>) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <div className="flex flex-wrap gap-2 mt-2">
            {options.map((option) => {
              const isSelected = (field.value as string[])?.includes(option);
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => {
                    const current = (field.value as string[]) || [];
                    if (isSelected) {
                      field.onChange(current.filter((v: string) => v !== option));
                    } else {
                      field.onChange([...current, option]);
                    }
                  }}
                  className={cn(
                    "px-3 py-1.5 rounded-full text-sm transition-colors",
                    "border",
                    isSelected
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-muted/50 text-foreground border-border hover:bg-muted"
                  )}
                >
                  {option}
                </button>
              );
            })}
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

interface EditableRadioGroupProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  name: FieldPath<T>;
  label: string;
  options: readonly { value: string; label: string }[];
}

export function EditableRadioGroup<T extends FieldValues>({
  form,
  name,
  label,
  options,
}: EditableRadioGroupProps<T>) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <div className="flex flex-wrap gap-2 mt-2">
            {options.map((option) => {
              const isSelected = field.value === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => field.onChange(option.value)}
                  className={cn(
                    "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                    "border",
                    isSelected
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-muted/50 text-foreground border-border hover:bg-muted"
                  )}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

interface EditableSliderFieldProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  name: FieldPath<T>;
  label: string;
  min: number;
  max: number;
  step?: number;
  unit?: string;
}

export function EditableSliderField<T extends FieldValues>({
  form,
  name,
  label,
  min,
  max,
  step = 1,
  unit = '',
}: EditableSliderFieldProps<T>) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <div className="flex justify-between items-center">
            <FormLabel>{label}</FormLabel>
            <span className="text-sm font-medium text-primary">
              {field.value}{unit}
            </span>
          </div>
          <FormControl>
            <input
              type="range"
              min={min}
              max={max}
              step={step}
              value={field.value}
              onChange={(e) => field.onChange(Number(e.target.value))}
              className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
            />
          </FormControl>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{min}{unit}</span>
            <span>{max}{unit}</span>
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
