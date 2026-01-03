import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface ChatSkeletonProps {
  className?: string;
  messageCount?: number;
}

export const ChatSkeleton = ({ 
  className,
  messageCount = 4 
}: ChatSkeletonProps) => {
  // Alternate between user and avatar messages
  const messages = [...Array(messageCount)].map((_, i) => ({
    isUser: i % 2 === 0,
  }));

  return (
    <div
      className={cn("flex flex-col gap-3 p-4", className)}
      aria-busy="true"
      aria-label="Cargando conversación"
    >
      {messages.map((msg, i) => (
        <div
          key={i}
          className={cn(
            "flex items-end gap-2",
            msg.isUser ? "justify-end" : "justify-start"
          )}
        >
          {!msg.isUser && (
            <Skeleton className="w-8 h-8 rounded-full shrink-0" />
          )}
          <div
            className={cn(
              "rounded-2xl p-3",
              msg.isUser 
                ? "bg-primary/20 ml-12" 
                : "bg-muted/50 mr-12"
            )}
          >
            <Skeleton className={cn("h-4 mb-1", msg.isUser ? "w-32" : "w-48")} />
            <Skeleton className={cn("h-4", msg.isUser ? "w-20" : "w-36")} />
          </div>
        </div>
      ))}
    </div>
  );
};
