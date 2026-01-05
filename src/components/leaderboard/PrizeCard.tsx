import { motion } from 'framer-motion';
import { Crown, Medal, Award, ExternalLink } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { Prize } from '@/data/mockPrizes';

interface PrizeCardProps {
  position: 1 | 2 | 3;
  prize: Prize;
  onClick?: () => void;
  delay?: number;
}

const positionConfig = {
  1: {
    icon: Crown,
    label: '1er Premio',
    gradient: 'from-yellow-400/20 to-yellow-500/5',
    border: 'border-yellow-400/50',
    iconColor: 'text-yellow-500',
    badgeBg: 'bg-yellow-500',
  },
  2: {
    icon: Medal,
    label: '2do Premio',
    gradient: 'from-slate-300/20 to-slate-400/5',
    border: 'border-slate-400/50',
    iconColor: 'text-slate-500',
    badgeBg: 'bg-slate-500',
  },
  3: {
    icon: Award,
    label: '3er Premio',
    gradient: 'from-amber-500/20 to-amber-600/5',
    border: 'border-amber-500/50',
    iconColor: 'text-amber-600',
    badgeBg: 'bg-amber-600',
  },
};

export const PrizeCard = ({ position, prize, onClick, delay = 0 }: PrizeCardProps) => {
  const config = positionConfig[position];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{ y: -5 }}
    >
      <Card
        className={cn(
          'overflow-hidden cursor-pointer transition-all duration-300',
          'hover:shadow-lg',
          `bg-gradient-to-br ${config.gradient}`,
          `border-2 ${config.border}`
        )}
        onClick={onClick}
      >
        <CardContent className="p-0">
          {/* Image */}
          <div className="relative h-36 overflow-hidden">
            <img
              src={prize.imageUrl}
              alt={prize.name}
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
            />
            <div className="absolute top-2 left-2">
              <Badge className={cn('gap-1 text-white', config.badgeBg)}>
                <Icon className="w-3 h-3" />
                {config.label}
              </Badge>
            </div>
            {prize.value && (
              <div className="absolute bottom-2 right-2">
                <Badge variant="secondary" className="bg-background/90 backdrop-blur-sm">
                  {prize.value}
                </Badge>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-4">
            <h3 className="font-semibold text-sm mb-1 line-clamp-1">{prize.name}</h3>
            <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
              {prize.description}
            </p>
            
            <div className="flex items-center justify-between">
              {prize.sponsor && (
                <span className="text-xs text-muted-foreground">
                  Por <span className="font-medium text-foreground">{prize.sponsor}</span>
                </span>
              )}
              <Button variant="ghost" size="sm" className="h-7 text-xs gap-1 ml-auto">
                Ver más
                <ExternalLink className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
