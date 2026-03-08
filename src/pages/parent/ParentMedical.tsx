import { AppLayout } from '@/layouts/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ParentMedical = () => {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold font-heading">Apto Médico</h1>
          <p className="text-muted-foreground">Gestión de certificados médicos de tu hijo/a</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5" />
              Certificados médicos
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <Upload className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Sube el apto médico</h3>
            <p className="text-muted-foreground max-w-md mb-4">
              Cargá el certificado médico para que el club pueda verificar que tu hijo/a está habilitado para entrenar.
            </p>
            <Button disabled>
              <Upload className="mr-2 h-4 w-4" />
              Subir certificado (próximamente)
            </Button>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default ParentMedical;
