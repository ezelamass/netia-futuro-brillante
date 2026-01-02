import { useOnboarding } from '@/contexts/OnboardingContext';
import { OnboardingStep } from '../OnboardingStep';
import { AvatarGuide } from '../AvatarGuide';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { motion } from 'framer-motion';
import { Target, Calendar, Clock, Zap, Bell } from 'lucide-react';

const goals = [
  { value: 'tecnica', label: 'Mejorar técnica', emoji: '🎯', icon: Target },
  { value: 'competir', label: 'Prepararme para competir', emoji: '🏆', icon: Target },
  { value: 'lesion', label: 'Recuperarme de lesión', emoji: '🩹', icon: Target },
  { value: 'activo', label: 'Mantenerme activo', emoji: '💪', icon: Target },
  { value: 'otro', label: 'Otro', emoji: '✨', icon: Target },
];

const areas = [
  { value: 'fisico', label: 'Físico', emoji: '💪' },
  { value: 'mental', label: 'Mental', emoji: '🧠' },
  { value: 'nutricion', label: 'Nutrición', emoji: '🥗' },
  { value: 'tactica', label: 'Táctica', emoji: '📋' },
  { value: 'coordinacion', label: 'Coordinación', emoji: '🎯' },
];

const durations = [
  { value: '30', label: '30 min' },
  { value: '60', label: '1 hora' },
  { value: '90', label: '1.5 horas' },
  { value: '120', label: '2 horas' },
];

export const ObjectivesStep = () => {
  const { data, updateData } = useOnboarding();

  const toggleArea = (area: string) => {
    const current = data.areasToImprove || [];
    if (current.includes(area)) {
      updateData({ areasToImprove: current.filter(a => a !== area) });
    } else {
      updateData({ areasToImprove: [...current, area] });
    }
  };

  return (
    <OnboardingStep>
      <div className="space-y-6">
        <AvatarGuide
          avatar="tino"
          message="¡Genial! Ahora contame sobre tus objetivos. ¿Qué querés lograr? 🎯 Esto me ayuda a personalizar tu entrenamiento."
        />

        <motion.div
          className="glass rounded-2xl p-6 space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {/* Main Goal */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2 text-sm font-medium">
              <Target className="w-4 h-4 text-primary" />
              ¿Cuál es tu meta principal? *
            </Label>
            <RadioGroup
              value={data.mainGoal}
              onValueChange={(value) => updateData({ mainGoal: value })}
              className="grid gap-2"
            >
              {goals.map((goal) => (
                <Label
                  key={goal.value}
                  htmlFor={`goal-${goal.value}`}
                  className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    data.mainGoal === goal.value
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <RadioGroupItem value={goal.value} id={`goal-${goal.value}`} className="sr-only" />
                  <span className="text-2xl">{goal.emoji}</span>
                  <span className="font-medium">{goal.label}</span>
                </Label>
              ))}
            </RadioGroup>

            {data.mainGoal === 'otro' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
              >
                <Input
                  placeholder="Contanos cuál es tu objetivo..."
                  value={data.otherGoal}
                  onChange={(e) => updateData({ otherGoal: e.target.value })}
                  className="h-12 mt-2"
                />
              </motion.div>
            )}
          </div>

          {/* Training Days */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2 text-sm font-medium">
              <Calendar className="w-4 h-4 text-primary" />
              ¿Cuántos días entrenás por semana?
            </Label>
            <div className="px-2">
              <Slider
                value={[data.trainingDaysPerWeek]}
                onValueChange={([value]) => updateData({ trainingDaysPerWeek: value })}
                min={1}
                max={7}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                <span>1 día</span>
                <span className="text-lg font-bold text-primary">{data.trainingDaysPerWeek} días</span>
                <span>7 días</span>
              </div>
            </div>
          </div>

          {/* Average Duration */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2 text-sm font-medium">
              <Clock className="w-4 h-4 text-primary" />
              ¿Cuánto dura cada entrenamiento?
            </Label>
            <Select
              value={data.averageDuration.toString()}
              onValueChange={(value) => updateData({ averageDuration: parseInt(value) })}
            >
              <SelectTrigger className="h-12">
                <SelectValue placeholder="Duración promedio" />
              </SelectTrigger>
              <SelectContent>
                {durations.map((dur) => (
                  <SelectItem key={dur.value} value={dur.value}>
                    {dur.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Areas to Improve */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2 text-sm font-medium">
              <Zap className="w-4 h-4 text-primary" />
              ¿En qué áreas querés mejorar?
            </Label>
            <div className="flex flex-wrap gap-2">
              {areas.map((area) => (
                <button
                  key={area.value}
                  type="button"
                  onClick={() => toggleArea(area.value)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    data.areasToImprove?.includes(area.value)
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  {area.emoji} {area.label}
                </button>
              ))}
            </div>
          </div>

          {/* Champion Mode Reminders */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/10 border border-secondary/20">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-secondary" />
              <div>
                <p className="font-medium text-sm">Modo Campeón 🏆</p>
                <p className="text-xs text-muted-foreground">Recibir recordatorios motivacionales</p>
              </div>
            </div>
            <Switch
              checked={data.championModeReminders}
              onCheckedChange={(checked) => updateData({ championModeReminders: checked })}
            />
          </div>
        </motion.div>
      </div>
    </OnboardingStep>
  );
};
