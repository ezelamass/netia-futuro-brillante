import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { TrainingSession, SessionType, CategoryType, SESSION_TYPE_LABELS, RPE_LABELS } from '@/types/training';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface RegisterSessionModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (session: Omit<TrainingSession, 'id' | 'createdAt'>) => void;
}

const groups = [
  { id: 'g1', name: 'U14 Tenis', category: 'U14' as CategoryType, total: 7 },
  { id: 'g2', name: 'U12 Tenis', category: 'U12' as CategoryType, total: 6 },
  { id: 'g3', name: 'U16 Tenis', category: 'U16' as CategoryType, total: 6 },
  { id: 'g4', name: 'U10 Tenis', category: 'U10' as CategoryType, total: 6 },
];

export function RegisterSessionModal({ open, onClose, onSave }: RegisterSessionModalProps) {
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [groupId, setGroupId] = useState('g1');
  const [sessionType, setSessionType] = useState<SessionType>('technical');
  const [duration, setDuration] = useState(60);
  const [rpe, setRpe] = useState([6]);
  const [present, setPresent] = useState(7);
  const [warmupDone, setWarmupDone] = useState(true);
  const [cooldownDone, setCooldownDone] = useState(true);
  const [notes, setNotes] = useState('');

  const selectedGroup = groups.find(g => g.id === groupId);

  const handleSave = () => {
    if (!selectedGroup) return;

    const session: Omit<TrainingSession, 'id' | 'createdAt'> = {
      date: new Date(date),
      groupId,
      groupName: selectedGroup.name,
      category: selectedGroup.category,
      sport: 'Tenis',
      type: sessionType,
      duration,
      rpeGroup: rpe[0],
      attendance: {
        present: Array(present).fill('').map((_, i) => `player-${i}`),
        absent: [],
        total: selectedGroup.total,
      },
      warmupDone,
      cooldownDone,
      notes: notes || undefined,
      coachId: 'coach1',
    };

    onSave(session);
    toast.success('Sesión registrada correctamente');
    onClose();
    
    // Reset form
    setDate(format(new Date(), 'yyyy-MM-dd'));
    setGroupId('g1');
    setSessionType('technical');
    setDuration(60);
    setRpe([6]);
    setPresent(7);
    setWarmupDone(true);
    setCooldownDone(true);
    setNotes('');
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Registrar sesión</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Date */}
          <div className="space-y-2">
            <Label htmlFor="date">Fecha</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          {/* Group */}
          <div className="space-y-2">
            <Label>Grupo</Label>
            <Select value={groupId} onValueChange={setGroupId}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {groups.map((group) => (
                  <SelectItem key={group.id} value={group.id}>
                    {group.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Session Type */}
          <div className="space-y-3">
            <Label>Tipo de sesión</Label>
            <RadioGroup 
              value={sessionType} 
              onValueChange={(value) => setSessionType(value as SessionType)}
              className="grid grid-cols-2 gap-2"
            >
              {(Object.entries(SESSION_TYPE_LABELS) as [SessionType, string][]).map(([value, label]) => (
                <div key={value} className="flex items-center space-x-2">
                  <RadioGroupItem value={value} id={value} />
                  <Label htmlFor={value} className="cursor-pointer">{label}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Duration */}
          <div className="space-y-2">
            <Label htmlFor="duration">Duración (minutos)</Label>
            <Input
              id="duration"
              type="number"
              min={15}
              max={180}
              step={15}
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
            />
          </div>

          {/* RPE */}
          <div className="space-y-3">
            <div className="flex justify-between">
              <Label>RPE promedio del grupo</Label>
              <span className="text-sm font-medium">{rpe[0]}</span>
            </div>
            <Slider
              value={rpe}
              onValueChange={setRpe}
              min={1}
              max={10}
              step={0.5}
              className="py-2"
            />
            <p className="text-sm text-muted-foreground text-center">
              {RPE_LABELS[Math.round(rpe[0])] || 'Moderado'}
            </p>
          </div>

          {/* Attendance */}
          <div className="space-y-2">
            <Label>Asistencia</Label>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Presentes:</span>
              <Input
                type="number"
                min={0}
                max={selectedGroup?.total || 10}
                value={present}
                onChange={(e) => setPresent(Number(e.target.value))}
                className="w-20"
              />
              <span className="text-sm text-muted-foreground">de {selectedGroup?.total || 0} jugadores</span>
            </div>
          </div>

          {/* Checkboxes */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="warmup" 
                checked={warmupDone}
                onCheckedChange={(checked) => setWarmupDone(checked as boolean)}
              />
              <Label htmlFor="warmup" className="cursor-pointer">Entrada en calor realizada</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="cooldown" 
                checked={cooldownDone}
                onCheckedChange={(checked) => setCooldownDone(checked as boolean)}
              />
              <Label htmlFor="cooldown" className="cursor-pointer">Vuelta a la calma realizada</Label>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notas (opcional)</Label>
            <Textarea
              id="notes"
              placeholder="Descripción de la sesión..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="min-h-[80px]"
            />
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>
            Guardar sesión
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
