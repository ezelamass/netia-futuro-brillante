import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useMedicalClearance } from '@/hooks/useMedicalClearance';
import { Upload, Loader2 } from 'lucide-react';

interface Props {
  targetUserId?: string;
}

export const MedicalClearanceUpload = ({ targetUserId }: Props) => {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [issuedDate, setIssuedDate] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [doctorName, setDoctorName] = useState('');
  const [loading, setLoading] = useState(false);
  const { uploadClearance } = useMedicalClearance();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !issuedDate || !expiryDate) return;
    setLoading(true);
    const success = await uploadClearance(file, issuedDate, expiryDate, doctorName || undefined, targetUserId);
    setLoading(false);
    if (success) {
      setFile(null);
      setIssuedDate('');
      setExpiryDate('');
      setDoctorName('');
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Upload className="h-4 w-4" />
          Subir certificado
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Subir apto médico</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Archivo (PDF o imagen)</Label>
            <Input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Fecha emisión</Label>
              <Input type="date" value={issuedDate} onChange={(e) => setIssuedDate(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label>Fecha vencimiento</Label>
              <Input type="date" value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)} required />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Nombre del médico (opcional)</Label>
            <Input value={doctorName} onChange={(e) => setDoctorName(e.target.value)} placeholder="Dr. ..." />
          </div>
          <Button type="submit" className="w-full" disabled={loading || !file || !issuedDate || !expiryDate}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            Subir certificado
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
