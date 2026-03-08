import { useEffect } from 'react';
import { AppLayout } from '@/layouts/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart } from 'lucide-react';
import { useFamilyLinks } from '@/hooks/useFamilyLinks';
import { MedicalClearanceStatus } from '@/components/medical/MedicalClearanceStatus';
import { MedicalClearanceUpload } from '@/components/medical/MedicalClearanceUpload';

const ParentMedical = () => {
  const { links, fetchLinks } = useFamilyLinks();

  useEffect(() => { fetchLinks(); }, [fetchLinks]);

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold font-heading">Apto Médico</h1>
          <p className="text-muted-foreground">Gestión de certificados médicos de tu hijo/a</p>
        </div>

        {links.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <Heart className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Vinculá a tu hijo/a primero</h3>
              <p className="text-muted-foreground max-w-md">
                Para subir un certificado médico, necesitás vincular a tu hijo/a desde el Panel Familiar.
              </p>
            </CardContent>
          </Card>
        ) : (
          links.map((link) => (
            <Card key={link.id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Heart className="h-5 w-5" />
                    {link.childName || link.childEmail}
                  </span>
                  <MedicalClearanceUpload targetUserId={link.childId} />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <MedicalClearanceStatus userId={link.childId} />
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </AppLayout>
  );
};

export default ParentMedical;
