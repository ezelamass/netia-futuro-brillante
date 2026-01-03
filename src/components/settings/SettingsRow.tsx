import { ReactNode } from 'react';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';

// Base props for all row types
interface BaseRowProps {
  label: string;
  description?: string;
}

// Toggle row
interface ToggleRowProps extends BaseRowProps {
  type: 'toggle';
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

// Select row
interface SelectRowProps extends BaseRowProps {
  type: 'select';
  value: string;
  options: readonly { value: string; label: string }[];
  onValueChange: (value: string) => void;
}

// Link row (clickable, navigates or opens modal)
interface LinkRowProps extends BaseRowProps {
  type: 'link';
  onClick: () => void;
  value?: string;
}

// Display row (readonly information)
interface DisplayRowProps extends BaseRowProps {
  type: 'display';
  value: string;
}

// Button row
interface ButtonRowProps extends BaseRowProps {
  type: 'button';
  variant?: 'default' | 'destructive' | 'outline' | 'secondary';
  onClick: () => void;
}

export type SettingsRowProps = 
  | ToggleRowProps 
  | SelectRowProps 
  | LinkRowProps 
  | DisplayRowProps 
  | ButtonRowProps;

export const SettingsRow = (props: SettingsRowProps) => {
  const { label, description, type } = props;

  const renderContent = () => {
    switch (type) {
      case 'toggle':
        return (
          <Switch
            checked={props.checked}
            onCheckedChange={props.onCheckedChange}
          />
        );
      
      case 'select':
        return (
          <Select value={props.value} onValueChange={props.onValueChange}>
            <SelectTrigger className="w-auto min-w-[120px] h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {props.options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      
      case 'link':
        return (
          <div className="flex items-center gap-2 text-muted-foreground">
            {props.value && <span className="text-sm">{props.value}</span>}
            <ChevronRight className="w-5 h-5" />
          </div>
        );
      
      case 'display':
        return (
          <span className="text-sm text-muted-foreground">{props.value}</span>
        );
      
      case 'button':
        return null; // Button is rendered as full row
      
      default:
        return null;
    }
  };

  // Button row has different layout
  if (type === 'button') {
    return (
      <div className="px-4 py-3">
        <Button
          variant={props.variant || 'outline'}
          className={cn(
            "w-full",
            props.variant === 'destructive' && "hover:bg-destructive/90"
          )}
          onClick={props.onClick}
        >
          {label}
        </Button>
      </div>
    );
  }

  const isClickable = type === 'link';

  return (
    <div
      className={cn(
        "flex items-center justify-between gap-4 px-4 py-3",
        isClickable && "cursor-pointer hover:bg-muted/50 transition-colors"
      )}
      onClick={isClickable ? props.onClick : undefined}
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onKeyDown={isClickable ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          props.onClick();
        }
      } : undefined}
    >
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium">{label}</p>
        {description && (
          <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
        )}
      </div>
      {renderContent()}
    </div>
  );
};
