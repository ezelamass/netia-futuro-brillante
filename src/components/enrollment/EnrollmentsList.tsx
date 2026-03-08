import { useEffect } from 'react';
import { useEnrollment } from '@/hooks/useEnrollment';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2 } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const statusMap: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  active: { label: 'Activo', variant: 'default' },
  pending: { label: 'Pendiente', variant: 'secondary' },
  inactive: { label: 'Inactivo', variant: 'destructive' },
};

export const EnrollmentsList = () => {
  const { enrollments, isLoading, fetchEnrollments } = useEnrollment();

  useEffect(() => { fetchEnrollments(); }, [fetchEnrollments]);

  if (isLoading) return <p className="text-sm text-muted-foreground">Cargando clubs...</p>;
  if (!enrollments.length) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Building2 className="h-4 w-4" />
          Mis Clubs
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {enrollments.map((e) => {
          const st = statusMap[e.status] || statusMap.pending;
          return (
            <div key={e.id} className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <p className="font-medium">{e.clubName}</p>
                <p className="text-xs text-muted-foreground">
                  Desde {format(e.joinedAt, "d MMM yyyy", { locale: es })}
                </p>
              </div>
              <Badge variant={st.variant}>{st.label}</Badge>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};
