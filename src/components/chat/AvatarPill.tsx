import { cn } from '@/lib/utils';
import type { FC } from 'react';

export type AvatarId = 'TINO' | 'ZAHIA' | 'ROMA';

export interface AvatarPillAvatar {
  id: AvatarId;
  name: string;
  image: string;
  accentClass?: string;
}

interface AvatarPillProps {
  avatars: AvatarPillAvatar[];
  selectedAvatar: AvatarId | null;
  onSelect: (avatar: AvatarId) => void;
}

export const AvatarPill: FC<AvatarPillProps> = ({ avatars, selectedAvatar, onSelect }) => {
  return (
    <div className="pointer-events-none fixed bottom-20 lg:bottom-6 left-1/2 z-40 flex -translate-x-1/2 items-center justify-center px-4">
      <div className="pointer-events-auto flex w-full max-w-md items-center justify-center gap-4 rounded-full border border-border/60 bg-background/95 px-4 py-2.5 shadow-lg backdrop-blur-xl">
        {avatars.map((avatar) => {
          const isActive = selectedAvatar === avatar.id;

          return (
            <button
              key={avatar.id}
              type="button"
              onClick={() => onSelect(avatar.id)}
              className={cn(
                'relative flex flex-col items-center gap-1 transition-all duration-200',
                isActive ? 'opacity-100' : 'opacity-70 hover:opacity-100'
              )}
              aria-label={`Seleccionar avatar ${avatar.name}`}
            >
              <div className={cn(
                'flex h-11 w-11 items-center justify-center overflow-hidden rounded-full border-2 bg-background/80 transition-all duration-200 sm:h-12 sm:w-12',
                isActive
                  ? cn('scale-110 shadow-lg ring-2 ring-offset-2 ring-offset-background', avatar.accentClass ?? 'ring-primary', 'border-transparent')
                  : 'border-border/60 hover:shadow-md hover:scale-105'
              )}>
                <img
                  src={avatar.image}
                  alt={`Avatar ${avatar.name}`}
                  className="h-full w-full object-cover"
                />
              </div>
              <span className={cn(
                'text-[10px] font-semibold tracking-wide transition-colors',
                isActive ? 'text-foreground' : 'text-muted-foreground'
              )}>
                {avatar.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
