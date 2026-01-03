import { useState } from 'react';
import { Download } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';

interface ExportDataModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const EXPORT_OPTIONS = [
  { id: 'profile', label: 'Perfil y configuración' },
  { id: 'training', label: 'Historial de entrenamientos' },
  { id: 'logs', label: 'Registros diarios' },
  { id: 'chat', label: 'Conversaciones con IA' },
  { id: 'achievements', label: 'Logros y estadísticas' },
  { id: 'calendar', label: 'Calendario y eventos' },
];

export const ExportDataModal = ({ open, onOpenChange }: ExportDataModalProps) => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>(
    EXPORT_OPTIONS.map(o => o.id)
  );
  const [format, setFormat] = useState('json');
  const [isLoading, setIsLoading] = useState(false);

  const toggleOption = (id: string) => {
    setSelectedOptions(prev =>
      prev.includes(id)
        ? prev.filter(o => o !== id)
        : [...prev, id]
    );
  };

  const handleExport = async () => {
    if (selectedOptions.length === 0) {
      toast.error('Seleccioná al menos una opción');
      return;
    }

    setIsLoading(true);
    
    // Gather all data from localStorage
    const exportData: Record<string, unknown> = {
      exportedAt: new Date().toISOString(),
      version: '1.0.0',
    };

    if (selectedOptions.includes('profile')) {
      exportData.profile = JSON.parse(localStorage.getItem('netia_user_profile') || '{}');
      exportData.settings = JSON.parse(localStorage.getItem('netia_settings') || '{}');
    }
    if (selectedOptions.includes('training')) {
      exportData.training = JSON.parse(localStorage.getItem('netia-calendar-events') || '[]');
    }
    if (selectedOptions.includes('logs')) {
      exportData.dailyLogs = JSON.parse(localStorage.getItem('netia-daily-logs') || '[]');
    }
    if (selectedOptions.includes('achievements')) {
      exportData.achievements = {
        streak: JSON.parse(localStorage.getItem('netia_streak') || '0'),
        xp: JSON.parse(localStorage.getItem('netia_xp') || '0'),
      };
    }
    if (selectedOptions.includes('calendar')) {
      exportData.calendar = JSON.parse(localStorage.getItem('netia-calendar-events') || '[]');
    }
    if (selectedOptions.includes('chat')) {
      exportData.chatHistory = JSON.parse(localStorage.getItem('netia_chat_history') || '[]');
    }

    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 500));

    // Create and download file
    const blob = new Blob(
      [JSON.stringify(exportData, null, 2)],
      { type: 'application/json' }
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `netia-export-${new Date().toISOString().split('T')[0]}.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setIsLoading(false);
    toast.success('Datos exportados correctamente');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="w-5 h-5" />
            Exportar mis datos
          </DialogTitle>
          <DialogDescription>
            Seleccioná qué datos querés exportar.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-4">
          <div className="space-y-3">
            {EXPORT_OPTIONS.map((option) => (
              <div key={option.id} className="flex items-center space-x-3">
                <Checkbox
                  id={option.id}
                  checked={selectedOptions.includes(option.id)}
                  onCheckedChange={() => toggleOption(option.id)}
                />
                <Label htmlFor={option.id} className="text-sm cursor-pointer">
                  {option.label}
                </Label>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <Label>Formato</Label>
            <Select value={format} onValueChange={setFormat}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="json">JSON</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleExport} disabled={isLoading}>
            {isLoading ? 'Exportando...' : 'Descargar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
