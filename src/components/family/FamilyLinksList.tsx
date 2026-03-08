import { useEffect } from 'react';
import { useFamilyLinks } from '@/hooks/useFamilyLinks';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, ShieldCheck } from 'lucide-react';

export const FamilyLinksList = () => {
  const { links, isLoading, fetchLinks, giveConsent } = useFamilyLinks();

  useEffect(() => { fetchLinks(); }, [fetchLinks]);

  if (isLoading) return <p className="text-sm text-muted-foreground">Cargando vínculos...</p>;
  if (!links.length) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Users className="h-4 w-4" />
          Hijos vinculados
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {links.map((link) => (
          <div key={link.id} className="flex items-center justify-between rounded-lg border p-3">
            <div>
              <p className="font-medium">{link.childName || link.childEmail}</p>
              <p className="text-xs text-muted-foreground">{link.childEmail}</p>
            </div>
            <div className="flex items-center gap-2">
              {link.consentGiven ? (
                <Badge variant="default" className="gap-1">
                  <ShieldCheck className="h-3 w-3" />
                  Consentimiento otorgado
                </Badge>
              ) : (
                <Button size="sm" variant="outline" onClick={() => giveConsent(link.id)}>
                  Dar consentimiento
                </Button>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
