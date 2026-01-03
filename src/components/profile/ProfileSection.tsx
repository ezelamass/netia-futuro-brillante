import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProfileSectionProps {
  title: string;
  icon: LucideIcon;
  iconColor?: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  isEditing?: boolean;
}

export const ProfileSection = ({
  title,
  icon: Icon,
  iconColor = 'text-primary',
  children,
  defaultOpen = false,
  isEditing = false,
}: ProfileSectionProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "rounded-xl border border-border/50 overflow-hidden mb-3",
        "bg-card/50 backdrop-blur-sm",
        isEditing && "ring-2 ring-primary/20"
      )}
    >
      {/* Header */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full flex items-center justify-between p-4",
          "hover:bg-muted/50 transition-colors",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        )}
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-3">
          <div className={cn("p-2 rounded-lg bg-muted", iconColor)}>
            <Icon className="w-5 h-5" />
          </div>
          <span className="font-semibold text-foreground">{title}</span>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-5 h-5 text-muted-foreground" />
        </motion.div>
      </button>

      {/* Content */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="px-4 pb-4 pt-0">
              <div className="border-t border-border/50 pt-4">
                {children}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
