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
    <div className="pointer-events-none fixed bottom-4 left-1/2 z-40 flex -translate-x-1/2 items-center justify-center px-4">
      <div className="pointer-events-auto glass flex w-full max-w-md items-center justify-between gap-3 rounded-full border border-border/60 bg-background/90 px-3 py-2 shadow-lg backdrop-blur-xl">
        {avatars.map((avatar) => {
          const isActive = selectedAvatar === avatar.id;

          return (
            <button
              key={avatar.id}
              type="button"
              onClick={() => onSelect(avatar.id)}
              className={cn(
                'relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border border-border/60 bg-background/80 transition-all hover:shadow-md sm:h-14 sm:w-14',
                isActive && 'ring-2 ring-offset-2 ring-offset-background',
                isActive && (avatar.accentClass ?? 'ring-primary')
              )}
              aria-label={`Seleccionar avatar ${avatar.name}`}
            >
              <img
                src={avatar.image}
                alt={`Avatar ${avatar.name}`}
                className="h-full w-full object-cover"
              />
              <span className="absolute bottom-1 right-1 h-3 w-3 rounded-full border border-background bg-emerald-400 shadow" />
            </button>
          );
        })}
      </div>
    </div>
  );
};
