import { Crown, Medal, Award, Gift, Calendar, Building2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import type { Prize } from '@/hooks/usePrizes';

interface PrizeDetailModalProps {
  prize: Prize | null;
  position: 1 | 2 | 3;
  open: boolean;
  onClose: () => void;
}

const positionConfig = {
  1: {
    icon: Crown,
    label: '1er Premio',
    gradient: 'from-yellow-400 to-amber-500',
    iconColor: 'text-yellow-500',
  },
  2: {
    icon: Medal,
    label: '2do Premio',
    gradient: 'from-slate-300 to-slate-500',
    iconColor: 'text-slate-500',
  },
  3: {
    icon: Award,
    label: '3er Premio',
    gradient: 'from-amber-500 to-amber-700',
    iconColor: 'text-amber-600',
  },
};

export const PrizeDetailModal = ({ prize, position, open, onClose }: PrizeDetailModalProps) => {
  if (!prize) return null;

  const config = positionConfig[position];
  const Icon = config.icon;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden">
        {/* Hero Image */}
        <div className="relative h-48">
          <img
            src={prize.imageUrl}
            alt={prize.name}
            className="w-full h-full object-cover"
          />
          <div className={cn(
            'absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent'
          )} />
          <div className="absolute top-4 left-4">
            <Badge className={cn(
              'gap-1.5 text-white px-3 py-1',
              `bg-gradient-to-r ${config.gradient}`
            )}>
              <Icon className="w-4 h-4" />
              {config.label}
            </Badge>
          </div>
        </div>

        <DialogHeader className="px-6 pb-0">
          <DialogTitle className="text-xl">{prize.name}</DialogTitle>
        </DialogHeader>

        <div className="px-6 pb-6 space-y-4">
          <p className="text-muted-foreground text-sm">
            {prize.details || prize.description}
          </p>

          <Separator />

          <div className="grid grid-cols-2 gap-4">
            {prize.value && (
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-muted">
                  <Gift className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Valor</p>
                  <p className="font-semibold text-sm">{prize.value}</p>
                </div>
              </div>
            )}

            {prize.sponsor && (
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-muted">
                  <Building2 className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Patrocinador</p>
                  <p className="font-semibold text-sm">{prize.sponsor}</p>
                </div>
              </div>
            )}

            <div className="flex items-center gap-2 col-span-2">
              <div className="p-2 rounded-lg bg-muted">
                <Calendar className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Entrega</p>
                <p className="font-semibold text-sm">Al finalizar la semana</p>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-muted/50 border border-border">
            <p className="text-xs text-muted-foreground text-center">
              🏆 ¡Consigue el <strong>Top {position}</strong> para ganar este premio!
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
