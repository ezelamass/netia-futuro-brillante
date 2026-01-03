import { useState } from 'react';
import { Camera, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import tinoAvatar from '@/assets/tino-avatar.avif';
import zahiaAvatar from '@/assets/zahia-avatar.avif';
import romaAvatar from '@/assets/roma-avatar.avif';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface ProfileAvatarProps {
  avatarUrl?: string;
  fullName: string;
  preferredAvatar: 'TINO' | 'ZAHIA' | 'ROMA';
  isEditing?: boolean;
  onAvatarChange?: (url: string) => void;
  size?: 'sm' | 'md' | 'lg';
}

// Avatar images mapped correctly (files are swapped)
const AVATAR_IMAGES = {
  TINO: romaAvatar,
  ZAHIA: tinoAvatar,
  ROMA: zahiaAvatar,
};

const AVATAR_OPTIONS = [
  { id: 'TINO', name: 'TINO', image: romaAvatar },
  { id: 'ZAHIA', name: 'ZAHIA', image: tinoAvatar },
  { id: 'ROMA', name: 'ROMA', image: zahiaAvatar },
];

const sizeClasses = {
  sm: 'w-12 h-12',
  md: 'w-20 h-20',
  lg: 'w-28 h-28',
};

export const ProfileAvatar = ({
  avatarUrl,
  fullName,
  preferredAvatar,
  isEditing = false,
  onAvatarChange,
  size = 'lg',
}: ProfileAvatarProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const initials = fullName
    .split(' ')
    .map(n => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const defaultAvatarImage = AVATAR_IMAGES[preferredAvatar];

  const handleSelectAvatar = (avatarId: string) => {
    const avatar = AVATAR_OPTIONS.find(a => a.id === avatarId);
    if (avatar && onAvatarChange) {
      onAvatarChange(avatar.image);
    }
    setIsOpen(false);
  };

  const avatarContent = (
    <div
      className={cn(
        "relative rounded-full overflow-hidden border-4 border-background shadow-lg",
        sizeClasses[size],
        isEditing && "cursor-pointer group"
      )}
    >
      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt={fullName}
          className="w-full h-full object-cover"
        />
      ) : defaultAvatarImage ? (
        <img
          src={defaultAvatarImage}
          alt={preferredAvatar}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
          <span className="text-white font-bold text-lg">{initials}</span>
        </div>
      )}

      {/* Edit overlay */}
      {isEditing && (
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <Camera className="w-6 h-6 text-white" />
        </div>
      )}
    </div>
  );

  if (!isEditing) {
    return avatarContent;
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {avatarContent}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Elegí tu avatar</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-3 gap-4 py-4">
          {AVATAR_OPTIONS.map((avatar) => (
            <button
              key={avatar.id}
              type="button"
              onClick={() => handleSelectAvatar(avatar.id)}
              className={cn(
                "flex flex-col items-center gap-2 p-3 rounded-xl",
                "border-2 transition-all",
                "hover:border-primary hover:bg-primary/5",
                preferredAvatar === avatar.id
                  ? "border-primary bg-primary/10"
                  : "border-border"
              )}
            >
              <div className="w-16 h-16 rounded-full overflow-hidden">
                <img
                  src={avatar.image}
                  alt={avatar.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-sm font-medium">{avatar.name}</span>
            </button>
          ))}
        </div>
        <div className="flex justify-center">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Usar iniciales
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
