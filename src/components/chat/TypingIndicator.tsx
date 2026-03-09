import { cn } from '@/lib/utils';
import type { AvatarId } from './AvatarPill';

interface TypingIndicatorProps {
  avatar: AvatarId;
  avatarImage: string;
}

const dotClass = "w-1.5 h-1.5 rounded-full bg-muted-foreground/60";

export const TypingIndicator = ({ avatar, avatarImage }: TypingIndicatorProps) => {
  const bubbleClass =
    avatar === 'TINO' ? 'bg-tino/10 border-tino/40' :
    avatar === 'ZAHIA' ? 'bg-zahia/10 border-zahia/40' :
    'bg-roma/10 border-roma/40';

  return (
    <div className="flex items-end gap-2 justify-start animate-fade-in">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border/60 bg-background">
        <img src={avatarImage} alt={avatar} className="h-full w-full object-cover" />
      </div>
      <div className={cn("flex items-center gap-1 rounded-2xl border px-4 py-3 shadow-sm", bubbleClass)}>
        <span className={cn(dotClass, "animate-bounce")} style={{ animationDelay: '0ms', animationDuration: '1s' }} />
        <span className={cn(dotClass, "animate-bounce")} style={{ animationDelay: '150ms', animationDuration: '1s' }} />
        <span className={cn(dotClass, "animate-bounce")} style={{ animationDelay: '300ms', animationDuration: '1s' }} />
      </div>
    </div>
  );
};
