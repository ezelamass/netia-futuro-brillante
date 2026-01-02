import { useOnboarding } from '@/contexts/OnboardingContext';
import { OnboardingStep } from '../OnboardingStep';
import { AvatarGuide } from '../AvatarGuide';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { motion } from 'framer-motion';
import { Ruler, Scale, Activity, Moon, Dumbbell, Watch } from 'lucide-react';

const energyLevels = [
  { value: 'bajo', emoji: '😴', label: 'Bajo', color: 'text-amber-500' },
  { value: 'medio', emoji: '😊', label: 'Medio', color: 'text-primary' },
  { value: 'alto', emoji: '🔥', label: 'Alto', color: 'text-green-500' },
];

const physicalPrepOptions = [
  { value: 'si', label: 'Sí', emoji: '✅' },
  { value: 'no', label: 'No', emoji: '❌' },
  { value: 'aveces', label: 'A veces', emoji: '🤔' },
];

const smartwatches = [
  { value: 'apple', label: 'Apple Watch' },
  { value: 'garmin', label: 'Garmin' },
  { value: 'fitbit', label: 'Fitbit' },
  { value: 'samsung', label: 'Samsung' },
  { value: 'xiaomi', label: 'Xiaomi' },
  { value: 'otro', label: 'Otro' },
];

export const PhysicalProfileStep = () => {
  const { data, updateData } = useOnboarding();

  return (
    <OnboardingStep>
      <div className="space-y-6">
        <AvatarGuide
          avatar="tino"
          message="¡Hora de conocer tu cuerpo! 💪 Estos datos nos ayudan a cuidarte mejor y ajustar los entrenamientos a tu nivel."
        />

        <motion.div
          className="glass rounded-2xl p-6 space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {/* Height & Weight */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-sm font-medium">
                <Ruler className="w-4 h-4 text-primary" />
                Altura
              </Label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="170"
                  value={data.height || ''}
                  onChange={(e) => updateData({ height: parseFloat(e.target.value) || 0 })}
                  className="h-12"
                />
                <Select
                  value={data.heightUnit}
                  onValueChange={(value) => updateData({ heightUnit: value })}
                >
                  <SelectTrigger className="w-20 h-12">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cm">cm</SelectItem>
                    <SelectItem value="ft">ft</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-sm font-medium">
                <Scale className="w-4 h-4 text-primary" />
                Peso
              </Label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="60"
                  value={data.weight || ''}
                  onChange={(e) => updateData({ weight: parseFloat(e.target.value) || 0 })}
                  className="h-12"
                />
                <Select
                  value={data.weightUnit}
                  onValueChange={(value) => updateData({ weightUnit: value })}
                >
                  <SelectTrigger className="w-20 h-12">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kg">kg</SelectItem>
                    <SelectItem value="lb">lb</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Injuries */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-sm font-medium">
              🩹 ¿Tenés lesiones previas o actuales?
            </Label>
            <Textarea
              placeholder="Contanos si tenés alguna lesión o molestia que debamos tener en cuenta..."
              value={data.injuries}
              onChange={(e) => updateData({ injuries: e.target.value })}
              className="min-h-[80px] resize-none"
            />
          </div>

          {/* Energy Level */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2 text-sm font-medium">
              <Activity className="w-4 h-4 text-primary" />
              ¿Cómo es tu nivel de energía promedio?
            </Label>
            <RadioGroup
              value={data.energyLevel}
              onValueChange={(value) => updateData({ energyLevel: value })}
              className="flex gap-3"
            >
              {energyLevels.map((level) => (
                <Label
                  key={level.value}
                  htmlFor={`energy-${level.value}`}
                  className={`flex-1 flex flex-col items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    data.energyLevel === level.value
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <RadioGroupItem value={level.value} id={`energy-${level.value}`} className="sr-only" />
                  <span className="text-3xl mb-1">{level.emoji}</span>
                  <span className="font-medium text-sm">{level.label}</span>
                </Label>
              ))}
            </RadioGroup>
          </div>

          {/* Sleep Hours */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2 text-sm font-medium">
              <Moon className="w-4 h-4 text-primary" />
              ¿Cuántas horas dormís en promedio?
            </Label>
            <div className="px-2">
              <Slider
                value={[data.sleepHours]}
                onValueChange={([value]) => updateData({ sleepHours: value })}
                min={4}
                max={12}
                step={0.5}
                className="w-full"
              />
              <div className="flex justify-between mt-2">
                <span className="text-xs text-muted-foreground">4h</span>
                <span className="text-lg font-bold text-primary">{data.sleepHours}h 😴</span>
                <span className="text-xs text-muted-foreground">12h</span>
              </div>
            </div>
          </div>

          {/* Physical Preparation */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2 text-sm font-medium">
              <Dumbbell className="w-4 h-4 text-primary" />
              ¿Hacés preparación física?
            </Label>
            <RadioGroup
              value={data.physicalPreparation}
              onValueChange={(value) => updateData({ physicalPreparation: value })}
              className="flex gap-2"
            >
              {physicalPrepOptions.map((opt) => (
                <Label
                  key={opt.value}
                  htmlFor={`prep-${opt.value}`}
                  className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                    data.physicalPreparation === opt.value
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <RadioGroupItem value={opt.value} id={`prep-${opt.value}`} className="sr-only" />
                  <span>{opt.emoji}</span>
                  <span className="font-medium text-sm">{opt.label}</span>
                </Label>
              ))}
            </RadioGroup>
          </div>

          {/* Smartwatch */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-2 text-sm font-medium">
                <Watch className="w-4 h-4 text-primary" />
                ¿Usás smartwatch?
              </Label>
              <Switch
                checked={data.usesSmartwatch}
                onCheckedChange={(checked) => updateData({ usesSmartwatch: checked })}
              />
            </div>

            {data.usesSmartwatch && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
              >
                <Select
                  value={data.smartwatchBrand}
                  onValueChange={(value) => updateData({ smartwatchBrand: value })}
                >
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="¿Cuál?" />
                  </SelectTrigger>
                  <SelectContent>
                    {smartwatches.map((sw) => (
                      <SelectItem key={sw.value} value={sw.value}>
                        {sw.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </OnboardingStep>
  );
};
