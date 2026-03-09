import { AppLayout } from '@/layouts/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings as SettingsIcon, Upload, Trash2, FileText, Bot } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

type AvatarId = 'TINO' | 'ZAHIA' | 'ROMA';

interface RagDocument {
  id: number;
  metadata: { source?: string; chunk_index?: number } | null;
  created_at: string;
}

const AVATAR_COLORS: Record<AvatarId, string> = {
  TINO: 'bg-tino/10 text-tino border-tino/40',
  ZAHIA: 'bg-zahia/10 text-zahia border-zahia/40',
  ROMA: 'bg-roma/10 text-roma border-roma/40',
};

const Settings = () => {
  const { toast } = useToast();
  const [selectedAvatar, setSelectedAvatar] = useState<AvatarId>('TINO');
  const [documents, setDocuments] = useState<RagDocument[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeletingFile, setIsDeletingFile] = useState<string | null>(null);

  const loadDocuments = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('avatar-rag-upload', {
        body: { avatar: selectedAvatar, action: 'list' },
      });
      if (error) throw error;
      setDocuments(data?.documents ?? []);
    } catch (e: any) {
      console.error('Error loading docs:', e);
    } finally {
      setIsLoading(false);
    }
  }, [selectedAvatar]);

  useEffect(() => {
    loadDocuments();
  }, [loadDocuments]);

  // Group documents by source filename
  const groupedDocs = documents.reduce<Record<string, { count: number; date: string }>>((acc, doc) => {
    const source = doc.metadata?.source || 'Sin nombre';
    if (!acc[source]) {
      acc[source] = { count: 0, date: doc.created_at };
    }
    acc[source].count++;
    return acc;
  }, {});

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ['text/plain', 'text/markdown', 'application/pdf'];
    const validExtensions = ['.txt', '.md', '.csv'];
    const ext = file.name.slice(file.name.lastIndexOf('.')).toLowerCase();

    if (!validTypes.includes(file.type) && !validExtensions.includes(ext)) {
      toast({ title: 'Formato no soportado', description: 'Usá archivos .txt, .md o .csv' });
      return;
    }

    setIsUploading(true);
    try {
      const content = await file.text();
      const { data, error } = await supabase.functions.invoke('avatar-rag-upload', {
        body: { avatar: selectedAvatar, content, filename: file.name },
      });
      if (error) throw error;
      toast({
        title: 'Documento procesado',
        description: `${data?.chunks ?? 0} fragmentos creados para ${selectedAvatar}`,
      });
      loadDocuments();
    } catch (err: any) {
      toast({ title: 'Error al subir', description: err.message });
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  const handleDelete = async (filename: string) => {
    setIsDeletingFile(filename);
    try {
      const { error } = await supabase.functions.invoke('avatar-rag-upload', {
        body: { avatar: selectedAvatar, action: 'delete', filename },
      });
      if (error) throw error;
      toast({ title: 'Documento eliminado' });
      loadDocuments();
    } catch (err: any) {
      toast({ title: 'Error al eliminar', description: err.message });
    } finally {
      setIsDeletingFile(null);
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <SettingsIcon className="w-6 h-6" />
              Configuración del Sistema
            </CardTitle>
            <CardDescription>Ajustes generales de NETIA</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-6 text-muted-foreground">
              Configuración general próximamente...
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="w-6 h-6" />
              Base de Conocimiento RAG
            </CardTitle>
            <CardDescription>
              Subí documentos para enriquecer las respuestas de cada avatar con conocimiento específico
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Avatar selector */}
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
              <label className="text-sm font-medium text-foreground">Avatar:</label>
              <Select value={selectedAvatar} onValueChange={(v) => setSelectedAvatar(v as AvatarId)}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TINO">🏋️ TINO — Entrenamiento</SelectItem>
                  <SelectItem value="ZAHIA">🥗 ZAHIA — Nutrición</SelectItem>
                  <SelectItem value="ROMA">🧠 ROMA — Psicología</SelectItem>
                </SelectContent>
              </Select>
              <Badge variant="outline" className={`${AVATAR_COLORS[selectedAvatar]} border`}>
                {Object.keys(groupedDocs).length} documentos · {documents.length} fragmentos
              </Badge>
            </div>

            {/* Upload */}
            <div className="flex items-center gap-3">
              <label
                className={`inline-flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-border/60 bg-muted/30 px-4 py-3 text-sm font-medium transition-colors hover:bg-muted/60 ${
                  isUploading ? 'pointer-events-none opacity-60' : ''
                }`}
              >
                <Upload className="h-4 w-4" />
                {isUploading ? 'Procesando...' : 'Subir documento (.txt, .md, .csv)'}
                <input
                  type="file"
                  accept=".txt,.md,.csv,text/plain,text/markdown"
                  onChange={handleFileUpload}
                  className="hidden"
                  disabled={isUploading}
                />
              </label>
            </div>

            {/* Document list */}
            <div className="space-y-2">
              {isLoading ? (
                <div className="py-8 text-center text-sm text-muted-foreground">Cargando documentos...</div>
              ) : Object.keys(groupedDocs).length === 0 ? (
                <div className="py-8 text-center text-sm text-muted-foreground">
                  No hay documentos cargados para {selectedAvatar}
                </div>
              ) : (
                Object.entries(groupedDocs).map(([filename, info]) => (
                  <div
                    key={filename}
                    className="flex items-center justify-between rounded-lg border border-border/40 bg-background/60 px-4 py-3"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium text-foreground">{filename}</p>
                        <p className="text-xs text-muted-foreground">
                          {info.count} fragmentos · {new Date(info.date).toLocaleDateString('es-AR')}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(filename)}
                      disabled={isDeletingFile === filename}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Settings;
