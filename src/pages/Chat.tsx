import { AppLayout } from '@/layouts/AppLayout';
import { useEffect, useMemo, useRef, useState, FormEvent } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { EmptyState } from '@/components/ui/empty-state';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import tinoAvatar from '@/assets/tino-avatar.png';
import zahiaAvatar from '@/assets/zahia-avatar.png';
import romaAvatar from '@/assets/roma-avatar.png';
import { AvatarPill, AvatarId, AvatarPillAvatar } from '@/components/chat/AvatarPill';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface ChatMessage {
  id: string;
  sender: 'user' | 'avatar';
  avatar: AvatarId;
  text: string;
  timestamp: string;
}

const AVATAR_WEBHOOKS: Record<AvatarId, string> = {
  TINO: 'https://devwebhookn8n.ezequiellamas.com/webhook/8c5faf4e-a8c1-441b-be05-1f50464e1a4d',
  ZAHIA: 'https://devwebhookn8n.ezequiellamas.com/webhook/795bd04f-9a82-4ac1-b7b4-691ede32286c',
  ROMA: 'https://devwebhookn8n.ezequiellamas.com/webhook/cfe8b8a1-65b9-49de-bd4c-37881afe5c7f',
};

const AVATAR_CONFIG: Record<AvatarId, { description: string }> = {
  TINO: { description: 'TINO te acompaña con entrenamiento físico y preparación atlética para rendir al máximo.' },
  ZAHIA: { description: 'ZAHIA es tu guía en nutrición, hidratación y hábitos saludables para deportistas.' },
  ROMA: { description: 'ROMA te ayuda con estrategia de regatas, decisiones tácticas y foco mental.' },
};

function generateId() { return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`; }

function parseWebhookResponse(raw: string): string[] {
  const messages: string[] = [];
  if (!raw || !raw.trim()) return messages;
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      for (const item of parsed) {
        if (item && typeof item === 'object') {
          const direct = (item as Record<string, unknown>)['output.respuesta'];
          const value = typeof direct === 'string' && direct.trim() ? direct : Object.values(item as Record<string, unknown>)[0];
          if (typeof value === 'string' && value.trim()) messages.push(value.trim());
        }
      }
    } else if (typeof parsed === 'string' && parsed.trim()) messages.push(parsed.trim());
  } catch { if (raw.trim()) messages.push(raw.trim()); }
  return messages;
}

const Chat = () => {
  const { toast } = useToast();
  const { user } = useAuth();

  const [conversations, setConversations] = useState<Record<AvatarId, ChatMessage[]>>({ TINO: [], ZAHIA: [], ROMA: [] });
  const [dbConversationIds, setDbConversationIds] = useState<Record<AvatarId, string | null>>({ TINO: null, ZAHIA: null, ROMA: null });
  const [selectedAvatar, setSelectedAvatar] = useState<AvatarId | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [hasStartedChat, setHasStartedChat] = useState(false);
  const [pendingAvatar, setPendingAvatar] = useState<AvatarId | null>(null);
  const [avatarToReset, setAvatarToReset] = useState<AvatarId | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const avatarOptions: AvatarPillAvatar[] = useMemo(() => [
    { id: 'TINO', name: 'TINO', image: tinoAvatar, accentClass: 'ring-tino' },
    { id: 'ZAHIA', name: 'ZAHIA', image: zahiaAvatar, accentClass: 'ring-zahia' },
    { id: 'ROMA', name: 'ROMA', image: romaAvatar, accentClass: 'ring-roma' },
  ], []);

  // Load conversations from Supabase on mount
  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data: convos } = await supabase
        .from('ai_conversations')
        .select('id, avatar')
        .eq('user_id', user.id)
        .order('last_message_at', { ascending: false });

      if (!convos || convos.length === 0) return;

      const newDbIds: Record<AvatarId, string | null> = { TINO: null, ZAHIA: null, ROMA: null };
      const newConvos: Record<AvatarId, ChatMessage[]> = { TINO: [], ZAHIA: [], ROMA: [] };

      for (const convo of convos) {
        const avatar = convo.avatar as AvatarId;
        if (newDbIds[avatar]) continue; // Only latest conversation per avatar
        newDbIds[avatar] = convo.id;

        const { data: msgs } = await supabase
          .from('ai_messages')
          .select('*')
          .eq('conversation_id', convo.id)
          .order('created_at', { ascending: true });

        if (msgs) {
          newConvos[avatar] = msgs.map((m: any) => ({
            id: m.id,
            sender: m.role === 'user' ? 'user' : 'avatar',
            avatar,
            text: m.content,
            timestamp: m.created_at,
          }));
        }
      }

      setDbConversationIds(newDbIds);
      setConversations(newConvos);
      setHasStartedChat(Object.values(newConvos).some(msgs => msgs.length > 0));
    })();
  }, [user]);

  const currentConversation: ChatMessage[] = selectedAvatar ? conversations[selectedAvatar] ?? [] : [];

  useEffect(() => {
    if (messagesEndRef.current) messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [selectedAvatar, currentConversation.length]);

  const getOrCreateConversation = async (avatar: AvatarId): Promise<string | null> => {
    if (!user) return null;
    if (dbConversationIds[avatar]) return dbConversationIds[avatar];

    const { data, error } = await supabase
      .from('ai_conversations')
      .insert({ user_id: user.id, avatar, title: `Chat con ${avatar}` })
      .select('id')
      .single();

    if (error || !data) return null;
    setDbConversationIds(prev => ({ ...prev, [avatar]: data.id }));
    return data.id;
  };

  const saveMessage = async (conversationId: string, role: 'user' | 'assistant', content: string) => {
    await supabase.from('ai_messages').insert({ conversation_id: conversationId, role, content });
    await supabase.from('ai_conversations').update({ last_message_at: new Date().toISOString() }).eq('id', conversationId);
  };

  const handleAvatarSelect = (avatar: AvatarId) => {
    setSelectedAvatar(avatar);
    setHasStartedChat(prev => prev || Object.values(conversations).some(msgs => msgs.length > 0));
  };

  const handleResetAvatarChat = async (avatar: AvatarId) => {
    setConversations(prev => { const updated = { ...prev, [avatar]: [] }; setHasStartedChat(Object.values(updated).some(m => m.length > 0)); return updated; });
    // Create new conversation in DB
    if (user) {
      const { data } = await supabase
        .from('ai_conversations')
        .insert({ user_id: user.id, avatar, title: `Chat con ${avatar}` })
        .select('id')
        .single();
      if (data) setDbConversationIds(prev => ({ ...prev, [avatar]: data.id }));
    }
  };

  const handleConfirmReset = () => { if (avatarToReset) handleResetAvatarChat(avatarToReset); setAvatarToReset(null); };

  const handleSend = async (event: FormEvent) => {
    event.preventDefault();
    const text = inputValue.trim();
    if (!text || !selectedAvatar || isSending) return;

    const avatarForMsg = selectedAvatar;
    const conversationId = await getOrCreateConversation(avatarForMsg);

    const userMessage: ChatMessage = { id: generateId(), sender: 'user', avatar: avatarForMsg, text, timestamp: new Date().toISOString() };
    setConversations(prev => ({ ...prev, [avatarForMsg]: [...(prev[avatarForMsg] ?? []), userMessage] }));
    setInputValue('');
    setIsSending(true);
    setHasStartedChat(true);
    setPendingAvatar(avatarForMsg);

    // Save user message to DB
    if (conversationId) await saveMessage(conversationId, 'user', text);

    try {
      const response = await fetch(AVATAR_WEBHOOKS[avatarForMsg], {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, avatar: avatarForMsg, conversationId: conversationId || avatarForMsg }),
      });
      const raw = await response.text();
      if (!response.ok) throw new Error(raw);

      const assistantMessages = parseWebhookResponse(raw);
      if (!assistantMessages.length) { toast({ title: `${avatarForMsg} respondió sin contenido` }); return; }

      assistantMessages.forEach((textPart, index) => {
        setTimeout(() => {
          setConversations(prev => ({
            ...prev,
            [avatarForMsg]: [...(prev[avatarForMsg] ?? []), {
              id: generateId(), sender: 'avatar', avatar: avatarForMsg, text: textPart, timestamp: new Date().toISOString(),
            }],
          }));
          if (conversationId) saveMessage(conversationId, 'assistant', textPart);
        }, index * 450);
      });
    } catch (error) {
      console.error('Error:', error);
      toast({ title: 'Error al contactar al avatar', description: 'Intenta nuevamente.' });
    } finally {
      setIsSending(false);
      setPendingAvatar(null);
    }
  };

  const handleSuggestionClick = (suggestion: string) => setInputValue(suggestion);

  const getAvatarImage = (avatar: AvatarId) => avatar === 'TINO' ? tinoAvatar : avatar === 'ZAHIA' ? zahiaAvatar : romaAvatar;
  const getAvatarBubbleClasses = (avatar: AvatarId) =>
    avatar === 'TINO' ? 'bg-tino/10 text-foreground border border-tino/40' :
    avatar === 'ZAHIA' ? 'bg-zahia/10 text-foreground border border-zahia/40' :
    'bg-roma/10 text-foreground border border-roma/40';

  const renderPlaceholder = () => {
    if (!hasStartedChat && !selectedAvatar) {
      return <EmptyState variant="first-chat" avatar="all" title="Chat con tus coaches IA"
        description="Elegí a TINO, ZAHIA o ROMA para iniciar una conversación personalizada."
        suggestions={['¿Qué entreno hoy?', 'Dame un consejo', '¿Cómo me hidrato mejor?']}
        onSuggestionClick={handleSuggestionClick} className="bg-transparent border-none" />;
    }
    if (selectedAvatar && currentConversation.length === 0) {
      const config = AVATAR_CONFIG[selectedAvatar];
      return <EmptyState variant="first-chat" avatar={selectedAvatar} title={`¡Hola! Soy ${selectedAvatar}`}
        description={config.description}
        suggestions={selectedAvatar === 'TINO' ? ['¿Qué entreno hoy?', '¿Cómo mejoro mi resistencia?', 'Dame un plan'] :
          selectedAvatar === 'ZAHIA' ? ['¿Qué como antes de entrenar?', '¿Cuánta agua tomo?', 'Snack saludable'] :
          ['¿Cómo me concentro?', 'Nervios antes del partido', 'Consejo mental']}
        onSuggestionClick={handleSuggestionClick} className="bg-transparent border-none" />;
    }
    return null;
  };

  return (
    <AppLayout>
      <div className="relative flex min-h-[calc(100vh-200px)] flex-col items-center justify-center px-4 pb-20">
        {!hasStartedChat && (
          <header className="mb-6 w-full max-w-4xl text-center">
            <h1 className="font-heading px-4 text-3xl font-bold text-foreground sm:text-4xl md:text-5xl">Chat con Avatares IA</h1>
            <p className="mx-auto mt-3 max-w-2xl px-4 text-base text-muted-foreground sm:text-lg">
              Conversá con TINO, ZAHIA y ROMA. Historial persistente para cada avatar.
            </p>
          </header>
        )}

        <main className="glass relative w-full max-w-4xl flex-1 rounded-3xl border border-border/60 bg-background/80 p-0 shadow-lg backdrop-blur-xl">
          <div className="flex h-full flex-col">
            <div className="flex-1 overflow-y-auto px-4 py-4">
              {selectedAvatar && (
                <div className="mb-3 flex items-center justify-between text-xs text-muted-foreground">
                  <span>Conversación con {selectedAvatar}</span>
                  <button type="button" onClick={() => setAvatarToReset(selectedAvatar)}
                    className="rounded-full border border-border/60 bg-background/80 px-3 py-1 text-[11px] font-medium text-foreground shadow-sm transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60"
                    disabled={isSending && pendingAvatar === selectedAvatar}>
                    Nuevo chat
                  </button>
                </div>
              )}
              {renderPlaceholder()}
              {selectedAvatar && currentConversation.length > 0 && (
                <div className="flex flex-col gap-3">
                  {currentConversation.map((message, index) => {
                    const isUser = message.sender === 'user';
                    return (
                      <div key={message.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'} items-end gap-2`}>
                        {!isUser && (
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border/60 bg-background">
                            <img src={getAvatarImage(message.avatar)} alt={message.avatar} className="h-full w-full object-cover" />
                          </div>
                        )}
                        <div className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm shadow-sm ${isUser ? 'bg-primary text-primary-foreground' : getAvatarBubbleClasses(message.avatar)} animate-enter`}>
                          <p className="whitespace-pre-wrap break-words text-sm">{message.text}</p>
                        </div>
                      </div>
                    );
                  })}
                  {isSending && pendingAvatar === selectedAvatar && (
                    <div className="flex items-end gap-2 justify-start">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border/60 bg-background">
                        <img src={getAvatarImage(pendingAvatar)} alt={pendingAvatar} className="h-full w-full object-cover" />
                      </div>
                      <div className="pulse max-w-[70%] rounded-2xl border border-border/40 bg-muted/70 px-3 py-2 text-xs text-muted-foreground shadow-sm">
                        pensando...
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              )}
              {!selectedAvatar && hasStartedChat && <div ref={messagesEndRef} />}
            </div>

            <div className="border-t border-border/60 bg-background/90 px-4 py-3">
              <form onSubmit={handleSend} className="flex items-center gap-3">
                <input type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)}
                  className="flex-1 rounded-full border border-border/60 bg-background px-4 py-2 text-sm text-foreground outline-none ring-offset-background placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/40"
                  placeholder={selectedAvatar ? `Escribí tu consulta para ${selectedAvatar}...` : 'Elegí un avatar abajo para comenzar'}
                  disabled={isSending && !selectedAvatar} />
                <button type="submit" disabled={!inputValue.trim() || !selectedAvatar || isSending}
                  className="inline-flex h-10 items-center justify-center rounded-full bg-primary px-4 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60">
                  {isSending ? 'Enviando...' : 'Enviar'}
                </button>
              </form>
            </div>
          </div>
        </main>

        <AlertDialog open={avatarToReset !== null} onOpenChange={(open) => { if (!open) setAvatarToReset(null); }}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>¿Empezar un nuevo chat?</AlertDialogTitle>
              <AlertDialogDescription>Se creará una nueva conversación con {avatarToReset ?? ''}.</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={handleConfirmReset}>Nuevo chat</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <AvatarPill avatars={avatarOptions} selectedAvatar={selectedAvatar} onSelect={handleAvatarSelect} />
      </div>
    </AppLayout>
  );
};

export default Chat;
