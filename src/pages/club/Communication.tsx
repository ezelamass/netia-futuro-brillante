import { useState } from 'react';
import { AppLayout } from '@/layouts/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Megaphone, Plus, Pin, Trash2, MoreVertical, Loader2, MessageSquare, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useClubAnnouncements, type Announcement } from '@/hooks/useClubAnnouncements';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

const PRIORITY_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  urgent: { label: 'Urgente', color: 'text-red-700', bg: 'bg-red-100 border-red-200' },
  high: { label: 'Alta', color: 'text-orange-700', bg: 'bg-orange-100 border-orange-200' },
  normal: { label: 'Normal', color: 'text-blue-700', bg: 'bg-blue-100 border-blue-200' },
  low: { label: 'Baja', color: 'text-gray-600', bg: 'bg-gray-100 border-gray-200' },
};

const ROLE_OPTIONS = [
  { value: 'player', label: 'Jugadores' },
  { value: 'parent', label: 'Familias' },
  { value: 'coach', label: 'Coaches' },
];

function AnnouncementCard({
  announcement,
  canManage,
  onTogglePin,
  onDelete,
}: {
  announcement: Announcement;
  canManage: boolean;
  onTogglePin: () => void;
  onDelete: () => void;
}) {
  const priorityCfg = PRIORITY_CONFIG[announcement.priority] || PRIORITY_CONFIG.normal;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      layout
    >
      <Card className={cn(
        'transition-colors',
        announcement.isPinned && 'border-primary/30 bg-primary/5'
      )}>
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                {announcement.isPinned && (
                  <Pin className="h-3.5 w-3.5 text-primary shrink-0" />
                )}
                <h3 className="font-semibold text-sm truncate">{announcement.title}</h3>
                <Badge variant="outline" className={cn('text-xs shrink-0', priorityCfg.color, priorityCfg.bg)}>
                  {priorityCfg.label}
                </Badge>
              </div>
              <p className="text-sm text-foreground/80 whitespace-pre-wrap line-clamp-4">
                {announcement.content}
              </p>
              <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                <span>{announcement.authorName}</span>
                <span>·</span>
                <span>{formatDistanceToNow(announcement.createdAt, { addSuffix: true, locale: es })}</span>
              </div>
            </div>

            {canManage && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={onTogglePin}>
                    <Pin className="h-4 w-4 mr-2" />
                    {announcement.isPinned ? 'Desfijar' : 'Fijar arriba'}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={onDelete} className="text-destructive">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Eliminar
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

const Communication = () => {
  const { user } = useAuth();
  const {
    pinnedAnnouncements,
    recentAnnouncements,
    isLoading,
    createAnnouncement,
    togglePin,
    deleteAnnouncement,
    canCreate,
  } = useClubAnnouncements();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newPriority, setNewPriority] = useState('normal');
  const [newTargetRoles, setNewTargetRoles] = useState<string[]>(['player', 'parent', 'coach']);
  const [isSaving, setIsSaving] = useState(false);

  const handleCreate = async () => {
    if (!newTitle.trim() || !newContent.trim()) return;
    setIsSaving(true);
    const success = await createAnnouncement({
      title: newTitle.trim(),
      content: newContent.trim(),
      priority: newPriority,
      targetRoles: newTargetRoles,
    });
    setIsSaving(false);
    if (success) {
      setIsCreateOpen(false);
      setNewTitle('');
      setNewContent('');
      setNewPriority('normal');
      setNewTargetRoles(['player', 'parent', 'coach']);
    }
  };

  const canManage = user?.role === 'coach' || user?.role === 'club_admin' || user?.role === 'admin';
  const totalCount = pinnedAnnouncements.length + recentAnnouncements.length;

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6 pb-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        >
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Megaphone className="h-6 w-6 text-primary" />
              Comunicación
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Comunicados y mensajes del equipo
            </p>
          </div>
          {canCreate && (
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Nuevo Comunicado
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                  <DialogTitle>Nuevo Comunicado</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Input
                      placeholder="Título del comunicado"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                    />
                  </div>
                  <div>
                    <Textarea
                      placeholder="Escribí el mensaje..."
                      value={newContent}
                      onChange={(e) => setNewContent(e.target.value)}
                      rows={5}
                    />
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="text-sm font-medium mb-1.5 block">Prioridad</label>
                      <Select value={newPriority} onValueChange={setNewPriority}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Baja</SelectItem>
                          <SelectItem value="normal">Normal</SelectItem>
                          <SelectItem value="high">Alta</SelectItem>
                          <SelectItem value="urgent">Urgente</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">Destinatarios</label>
                    <div className="flex gap-4">
                      {ROLE_OPTIONS.map(opt => (
                        <label key={opt.value} className="flex items-center gap-2 text-sm">
                          <Checkbox
                            checked={newTargetRoles.includes(opt.value)}
                            onCheckedChange={(checked) => {
                              setNewTargetRoles(prev =>
                                checked
                                  ? [...prev, opt.value]
                                  : prev.filter(r => r !== opt.value)
                              );
                            }}
                          />
                          {opt.label}
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                    Cancelar
                  </Button>
                  <Button
                    onClick={handleCreate}
                    disabled={!newTitle.trim() || !newContent.trim() || isSaving}
                  >
                    {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                    Publicar
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </motion.div>

        {/* Empty state */}
        {totalCount === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <MessageSquare className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
              <h3 className="font-medium text-lg mb-1">No hay comunicados</h3>
              <p className="text-sm text-muted-foreground">
                {canCreate
                  ? 'Creá el primer comunicado para tu equipo'
                  : 'Tu equipo aún no ha publicado comunicados'}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Pinned announcements */}
        {pinnedAnnouncements.length > 0 && (
          <section className="space-y-3">
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-2">
              <Pin className="h-3.5 w-3.5" />
              Fijados
            </h2>
            <AnimatePresence>
              {pinnedAnnouncements.map(a => (
                <AnnouncementCard
                  key={a.id}
                  announcement={a}
                  canManage={canManage}
                  onTogglePin={() => togglePin(a.id, a.isPinned)}
                  onDelete={() => deleteAnnouncement(a.id)}
                />
              ))}
            </AnimatePresence>
          </section>
        )}

        {/* Recent announcements */}
        {recentAnnouncements.length > 0 && (
          <section className="space-y-3">
            {pinnedAnnouncements.length > 0 && (
              <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                Recientes
              </h2>
            )}
            <AnimatePresence>
              {recentAnnouncements.map(a => (
                <AnnouncementCard
                  key={a.id}
                  announcement={a}
                  canManage={canManage}
                  onTogglePin={() => togglePin(a.id, a.isPinned)}
                  onDelete={() => deleteAnnouncement(a.id)}
                />
              ))}
            </AnimatePresence>
          </section>
        )}
      </div>
    </AppLayout>
  );
};

export default Communication;
