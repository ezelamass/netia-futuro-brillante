import { useOnboarding } from '@/contexts/OnboardingContext';
import { OnboardingStep } from '../OnboardingStep';
import { AvatarGuide } from '../AvatarGuide';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Trophy, Plane, Plus, Trash2, Users } from 'lucide-react';

const weekDays = [
  { value: 'lunes', label: 'Lun', fullLabel: 'Lunes' },
  { value: 'martes', label: 'Mar', fullLabel: 'Martes' },
  { value: 'miercoles', label: 'Mié', fullLabel: 'Miércoles' },
  { value: 'jueves', label: 'Jue', fullLabel: 'Jueves' },
  { value: 'viernes', label: 'Vie', fullLabel: 'Viernes' },
  { value: 'sabado', label: 'Sáb', fullLabel: 'Sábado' },
  { value: 'domingo', label: 'Dom', fullLabel: 'Domingo' },
];

export const CalendarStep = () => {
  const { data, updateData } = useOnboarding();

  const toggleDay = (day: string) => {
    const current = data.trainingDays || [];
    if (current.includes(day)) {
      updateData({ trainingDays: current.filter(d => d !== day) });
    } else {
      updateData({ trainingDays: [...current, day] });
    }
  };

  const addTournament = () => {
    updateData({
      tournaments: [...(data.tournaments || []), { name: '', date: '' }],
    });
  };

  const removeTournament = (index: number) => {
    const updated = [...(data.tournaments || [])];
    updated.splice(index, 1);
    updateData({ tournaments: updated });
  };

  const updateTournament = (index: number, field: 'name' | 'date', value: string) => {
    const updated = [...(data.tournaments || [])];
    updated[index] = { ...updated[index], [field]: value };
    updateData({ tournaments: updated });
  };

  return (
    <OnboardingStep>
      <div className="space-y-6">
        <AvatarGuide
          avatar="tino"
          message="¡Vamos a organizar tu calendario! 📅 Así puedo ayudarte a planificar mejor tus entrenamientos y descansos."
        />

        <motion.div
          className="glass rounded-2xl p-6 space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {/* Training Days */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2 text-sm font-medium">
              <Calendar className="w-4 h-4 text-primary" />
              ¿Qué días entrenás habitualmente?
            </Label>
            <div className="flex gap-1.5 justify-between">
              {weekDays.map((day) => (
                <button
                  key={day.value}
                  type="button"
                  onClick={() => toggleDay(day.value)}
                  className={`w-10 h-10 md:w-12 md:h-12 rounded-xl text-xs md:text-sm font-medium transition-all ${
                    data.trainingDays?.includes(day.value)
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  {day.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tournaments */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-2 text-sm font-medium">
                <Trophy className="w-4 h-4 text-primary" />
                ¿Tenés torneos programados?
              </Label>
              <Switch
                checked={data.hasTournaments}
                onCheckedChange={(checked) => {
                  updateData({ hasTournaments: checked });
                  if (checked && (!data.tournaments || data.tournaments.length === 0)) {
                    addTournament();
                  }
                }}
              />
            </div>

            <AnimatePresence>
              {data.hasTournaments && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-3"
                >
                  {data.tournaments?.map((tournament, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="flex gap-2 items-center"
                    >
                      <Input
                        placeholder="Nombre del torneo"
                        value={tournament.name}
                        onChange={(e) => updateTournament(index, 'name', e.target.value)}
                        className="flex-1 h-10"
                      />
                      <Input
                        type="date"
                        value={tournament.date}
                        onChange={(e) => updateTournament(index, 'date', e.target.value)}
                        className="w-36 h-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeTournament(index)}
                        className="shrink-0"
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </motion.div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addTournament}
                    className="w-full"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Agregar torneo
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Important Dates */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2 text-sm font-medium">
              <Plane className="w-4 h-4 text-primary" />
              Fechas importantes (viajes, exámenes...)
            </Label>
            <p className="text-xs text-muted-foreground">
              Podés agregar estas fechas más adelante desde tu calendario
            </p>
          </div>

          {/* NETIA Plans Rest */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-primary/5 border border-primary/10">
            <div className="flex items-center gap-3">
              <span className="text-2xl">😴</span>
              <div>
                <p className="font-medium text-sm">Planificar descansos</p>
                <p className="text-xs text-muted-foreground">NETIA sugiere días de recuperación</p>
              </div>
            </div>
            <Switch
              checked={data.netiaPlansRest}
              onCheckedChange={(checked) => updateData({ netiaPlansRest: checked })}
            />
          </div>

          {/* Share Calendar */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-primary/5 border border-primary/10">
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-primary" />
              <div>
                <p className="font-medium text-sm">Compartir calendario</p>
                <p className="text-xs text-muted-foreground">Con familia o entrenador</p>
              </div>
            </div>
            <Switch
              checked={data.shareCalendar}
              onCheckedChange={(checked) => updateData({ shareCalendar: checked })}
            />
          </div>
        </motion.div>
      </div>
    </OnboardingStep>
  );
};
