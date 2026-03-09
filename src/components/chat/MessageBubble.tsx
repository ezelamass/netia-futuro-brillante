import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import type { AvatarId } from './AvatarPill';

interface MessageBubbleProps {
  isUser: boolean;
  avatar: AvatarId;
  avatarImage: string;
  text: string;
  index: number;
}

export const MessageBubble = ({ isUser, avatar, avatarImage, text, index }: MessageBubbleProps) => {
  const avatarBubbleClass =
    avatar === 'TINO' ? 'bg-tino/10 text-foreground border border-tino/30' :
    avatar === 'ZAHIA' ? 'bg-zahia/10 text-foreground border border-zahia/30' :
    'bg-roma/10 text-foreground border border-roma/30';

  return (
    <motion.div
      initial={{ opacity: 0, y: 8, x: isUser ? 8 : -8 }}
      animate={{ opacity: 1, y: 0, x: 0 }}
      transition={{ duration: 0.25, delay: Math.min(index * 0.05, 0.3) }}
      className={cn('flex items-end gap-2', isUser ? 'justify-end' : 'justify-start')}
    >
      {!isUser && (
        <div className="flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border/60 bg-background">
          <img src={avatarImage} alt={avatar} className="h-full w-full object-cover" />
        </div>
      )}
      <div className={cn(
        'max-w-[80%] px-3.5 py-2 text-sm shadow-sm',
        isUser
          ? 'rounded-2xl rounded-br-md bg-primary text-primary-foreground'
          : cn('rounded-2xl rounded-bl-md', avatarBubbleClass),
      )}>
        <p className="whitespace-pre-wrap break-words text-sm leading-relaxed font-ai">{text}</p>
      </div>
    </motion.div>
  );
};
