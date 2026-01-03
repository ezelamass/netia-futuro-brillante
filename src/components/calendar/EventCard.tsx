import { motion } from 'framer-motion';
import { CalendarEvent, getEventConfig } from '@/hooks/useCalendarEvents';
import { cn } from '@/lib/utils';
import tinoAvatar from '@/assets/tino-avatar.avif';
import zahiaAvatar from '@/assets/zahia-avatar.avif';
import romaAvatar from '@/assets/roma-avatar.avif';

interface EventCardProps {
  event: CalendarEvent;
  compact?: boolean;
  onClick?: () => void;
}

const avatarImages = {
  TINO: tinoAvatar,
  ZAHIA: zahiaAvatar,
  ROMA: romaAvatar,
};

export const EventCard = ({ event, compact = false, onClick }: EventCardProps) => {
  const config = getEventConfig(event.type);

  if (compact) {
    return (
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onClick}
        className={cn(
          "w-full text-left p-2 rounded-lg border transition-all",
          "bg-background/80 backdrop-blur-sm hover:bg-background",
          event.isCompleted && "opacity-60"
        )}
      >
        <div className="flex items-center gap-2">
          <span className={cn("w-2 h-2 rounded-full", config.bgColor)} />
          <span className="text-xs font-medium truncate flex-1">
            {event.title}
          </span>
          {event.startTime && (
            <span className="text-[10px] text-muted-foreground">
              {event.startTime}
            </span>
          )}
        </div>
      </motion.button>
    );
  }

  return (
    <motion.button
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      onClick={onClick}
      className={cn(
        "w-full text-left p-3 rounded-xl border transition-all",
        "bg-background/80 backdrop-blur-sm hover:shadow-md",
        event.isCompleted && "opacity-60"
      )}
    >
      <div className="flex items-start gap-3">
        {/* Avatar or emoji */}
        {event.avatar ? (
          <img
            src={avatarImages[event.avatar]}
            alt={event.avatar}
            className={cn(
              "w-10 h-10 rounded-full object-cover ring-2 ring-offset-1",
              event.type === 'training' ? 'ring-blue-600' 
                : event.type === 'nutrition' ? 'ring-emerald-500' 
                : 'ring-violet-500'
            )}
          />
        ) : (
          <div className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center text-lg",
            config.bgColor,
            "text-white"
          )}>
            {config.emoji}
          </div>
        )}
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className={cn(
              "font-medium text-sm truncate",
              event.isCompleted && "line-through"
            )}>
              {event.title}
            </h4>
          </div>
          
          {event.startTime && (
            <p className="text-xs text-muted-foreground mt-0.5">
              {event.startTime}
              {event.endTime && ` - ${event.endTime}`}
            </p>
          )}
          
          {event.description && (
            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
              {event.description}
            </p>
          )}
        </div>
        
        {/* Status indicators */}
        <div className="flex flex-col items-end gap-1">
          {event.isRecurring && (
            <span className="text-[10px] text-muted-foreground">🔄</span>
          )}
          {event.isCompleted && (
            <span className="text-[10px] text-emerald-500">✓</span>
          )}
        </div>
      </div>
    </motion.button>
  );
};
