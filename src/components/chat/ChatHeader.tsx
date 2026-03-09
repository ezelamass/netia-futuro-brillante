import { cn } from '@/lib/utils';
import { RotateCcw } from 'lucide-react';
import type { AvatarId } from './AvatarPill';

interface ChatHeaderProps {
  avatar: AvatarId;
  avatarImage: string;
  onNewChat: () => void;
  disabled?: boolean;
}

const AVATAR_META: Record<AvatarId, { tagline: string; accentBorder: string; accentBg: string }> = {
  TINO: { tagline: 'Tu coach de entrenamiento', accentBorder: 'border-tino/30', accentBg: 'bg-tino/5' },
  ZAHIA: { tagline: 'Tu guía de nutrición', accentBorder: 'border-zahia/30', accentBg: 'bg-zahia/5' },
  ROMA: { tagline: 'Tu mentor mental', accentBorder: 'border-roma/30', accentBg: 'bg-roma/5' },
};

export const ChatHeader = ({ avatar, avatarImage, onNewChat, disabled }: ChatHeaderProps) => {
  const meta = AVATAR_META[avatar];

  return (
    <div className={cn(
      "flex items-center justify-between gap-3 border-b px-4 py-2.5",
      meta.accentBorder, meta.accentBg
    )}>
      <div className="flex items-center gap-3 min-w-0">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border/60 bg-background shadow-sm">
          <img src={avatarImage} alt={avatar} className="h-full w-full object-cover" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-foreground leading-tight">{avatar}</p>
          <p className="text-xs text-muted-foreground truncate">{meta.tagline}</p>
        </div>
      </div>
      <button
        type="button"
        onClick={onNewChat}
        disabled={disabled}
        className="flex items-center gap-1.5 rounded-full border border-border/60 bg-background/80 px-3 py-1.5 text-xs font-medium text-muted-foreground shadow-sm transition-colors hover:bg-muted hover:text-foreground disabled:opacity-50"
      >
        <RotateCcw className="h-3 w-3" />
        Nuevo chat
      </button>
    </div>
  );
};
