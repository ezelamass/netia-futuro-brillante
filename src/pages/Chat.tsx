import { AppLayout } from '@/layouts/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageCircle } from 'lucide-react';

const Chat = () => {
  return (
    <AppLayout>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="w-6 h-6" />
            Chat con Avatares IA
          </CardTitle>
          <CardDescription>Consulta con TINO, ZAHIA y ROMA</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-muted-foreground">
            Sistema de chat próximamente...
          </div>
        </CardContent>
      </Card>
    </AppLayout>
  );
};

export default Chat;
