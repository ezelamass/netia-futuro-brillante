import { AppLayout } from '@/layouts/AppLayout';
import { useEffect, useMemo, useRef, useState, FormEvent } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { EmptyState } from '@/components/ui/empty-state';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Send } from 'lucide-react';
import tinoAvatar from '@/assets/tino-avatar.png';
import zahiaAvatar from '@/assets/zahia-avatar.png';
import romaAvatar from '@/assets/roma-avatar.png';
import { AvatarPill, AvatarId, AvatarPillAvatar } from '@/components/chat/AvatarPill';
import { ChatHeader } from '@/components/chat/ChatHeader';
import { MessageBubble } from '@/components/chat/MessageBubble';
import { TypingIndicator } from '@/components/chat/TypingIndicator';
import { ChatSkeleton } from '@/components/skeletons/ChatSkeleton';
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

const AVATAR_CONFIG: Record<AvatarId, { description: string }> = {
  TINO: { description: 'TINO te acompaña con entrenamiento físico y preparación atlética para rendir al máximo.' },
  ZAHIA: { description: 'ZAHIA es tu guía en nutrición, hidratación y hábitos saludables para deportistas.' },
  ROMA: { description: 'ROMA te ayuda con estrategia de regatas, decisiones tácticas y foco mental.' },
};

const AVATAR_SUGGESTIONS: Record<AvatarId, string[]> = {
  TINO: ['¿Qué entreno hoy?', '¿Cómo mejoro mi resistencia?', 'Dame un plan'],
  ZAHIA: ['¿Qué como antes de entrenar?', '¿Cuánta agua tomo?', 'Snack saludable'],
  ROMA: ['¿Cómo me concentro?', 'Nervios antes del partido', 'Consejo mental'],
};

const WELCOME_SUGGESTIONS = ['¿Qué entreno hoy?', 'Dame un consejo', '¿Cómo me hidrato mejor?'];

function generateId() { return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`; }

const AVATAR_IMAGES: Record<AvatarId, string> = { TINO: tinoAvatar, ZAHIA: zahiaAvatar, ROMA: romaAvatar };

const Chat = () => {
  const { toast } = useToast();
  const { user } = useAuth();

  const [conversations, setConversations] = useState<Record<AvatarId, ChatMessage[]>>({ TINO: [], ZAHIA: [], ROMA: [] });
  const [dbConversationIds, setDbConversationIds] = useState<Record<AvatarId, string | null>>({ TINO: null, ZAHIA: null, ROMA: null });
  const [selectedAvatar, setSelectedAvatar] = useState<AvatarId | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [pendingAvatar, setPendingAvatar] = useState<AvatarId | null>(null);
  const [avatarToReset, setAvatarToReset] = useState<AvatarId | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const avatarOptions: AvatarPillAvatar[] = useMemo(() => [
    { id: 'TINO', name: 'TINO', image: tinoAvatar, accentClass: 'ring-tino' },
    { id: 'ZAHIA', name: 'ZAHIA', image: zahiaAvatar, accentClass: 'ring-zahia' },
    { id: 'ROMA', name: 'ROMA', image: romaAvatar, accentClass: 'ring-roma' },
  ], []);

  // Load conversations from Supabase on mount
  useEffect(() => {
    if (!user) { setIsLoading(false); return; }
    (async () => {
      try {
        const { data: convos } = await supabase
          .from('ai_conversations')
          .select('id, avatar')
          .eq('user_id', user.id)
          .order('last_message_at', { ascending: false });

        if (!convos || convos.length === 0) { setIsLoading(false); return; }

        const newDbIds: Record<AvatarId, string | null> = { TINO: null, ZAHIA: null, ROMA: null };
        const newConvos: Record<AvatarId, ChatMessage[]> = { TINO: [], ZAHIA: [], ROMA: [] };

        for (const convo of convos) {
          const avatar = convo.avatar as AvatarId;
          if (newDbIds[avatar]) continue;
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
      } finally {
        setIsLoading(false);
      }
    })();
  }, [user]);

  const currentConversation: ChatMessage[] = selectedAvatar ? conversations[selectedAvatar] ?? [] : [];

  useEffect(() => {
    if (messagesEndRef.current) messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [selectedAvatar, currentConversation.length]);

  // Focus input when avatar is selected
  useEffect(() => {
    if (selectedAvatar && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [selectedAvatar]);

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
  };

  const handleResetAvatarChat = async (avatar: AvatarId) => {
    setConversations(prev => ({ ...prev, [avatar]: [] }));
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

  const sendMessage = async (text: string) => {
    if (!text.trim() || !selectedAvatar || isSending) return;

    const avatarForMsg = selectedAvatar;
    const conversationId = await getOrCreateConversation(avatarForMsg);

    const userMessage: ChatMessage = { id: generateId(), sender: 'user', avatar: avatarForMsg, text: text.trim(), timestamp: new Date().toISOString() };
    setConversations(prev => ({ ...prev, [avatarForMsg]: [...(prev[avatarForMsg] ?? []), userMessage] }));
    setInputValue('');
    setIsSending(true);
    setPendingAvatar(avatarForMsg);

    if (conversationId) await saveMessage(conversationId, 'user', text.trim());

    try {
      const { data: fnData, error: fnError } = await supabase.functions.invoke('avatar-chat', {
        body: { message: text.trim(), avatar: avatarForMsg, conversationId: conversationId || avatarForMsg },
      });
      if (fnError) throw new Error(fnError.message || 'Edge function error');

      const assistantMessages: string[] = Array.isArray(fnData?.respuesta) ? fnData.respuesta.filter((s: any) => typeof s === 'string' && s.trim()) : [];
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

  const handleSend = (event: FormEvent) => {
    event.preventDefault();
    sendMessage(inputValue);
  };

  const handleSuggestionClick = (suggestion: string) => {
    if (!selectedAvatar) {
      // No avatar selected yet — set input value so user picks avatar first
      setInputValue(suggestion);
      return;
    }
    sendMessage(suggestion);
  };

  return (
    <AppLayout>
      <div className="flex h-[calc(100vh-80px)] lg:h-[calc(100vh-56px)] flex-col pb-24 lg:pb-16">
        {/* Chat card — fills available height */}
        <div className="relative flex flex-1 flex-col overflow-hidden rounded-2xl border border-border/60 bg-background/80 shadow-lg backdrop-blur-xl">

          {/* Header area */}
          {selectedAvatar ? (
            <ChatHeader
              avatar={selectedAvatar}
              avatarImage={AVATAR_IMAGES[selectedAvatar]}
              onNewChat={() => setAvatarToReset(selectedAvatar)}
              disabled={isSending && pendingAvatar === selectedAvatar}
            />
          ) : null}

          {/* Messages area */}
          <div className="flex-1 overflow-y-auto px-4 py-4">
            {isLoading ? (
              <ChatSkeleton messageCount={5} />
            ) : !selectedAvatar ? (
              /* No avatar selected — always show welcome */
              <div className="flex h-full items-center justify-center">
                <EmptyState
                  variant="first-chat"
                  avatar="all"
                  title="Chat con tus coaches IA"
                  description="Elegí a TINO, ZAHIA o ROMA para iniciar una conversación personalizada."
                  suggestions={WELCOME_SUGGESTIONS}
                  onSuggestionClick={handleSuggestionClick}
                  className="bg-transparent border-none"
                />
              </div>
            ) : currentConversation.length === 0 ? (
              /* Avatar selected but no messages */
              <div className="flex h-full items-center justify-center">
                <EmptyState
                  variant="first-chat"
                  avatar={selectedAvatar}
                  title={`¡Hola! Soy ${selectedAvatar}`}
                  description={AVATAR_CONFIG[selectedAvatar].description}
                  suggestions={AVATAR_SUGGESTIONS[selectedAvatar]}
                  onSuggestionClick={handleSuggestionClick}
                  className="bg-transparent border-none"
                />
              </div>
            ) : (
              /* Messages */
              <div className="flex flex-col gap-3">
                {currentConversation.map((message, index) => (
                  <MessageBubble
                    key={message.id}
                    isUser={message.sender === 'user'}
                    avatar={message.avatar}
                    avatarImage={AVATAR_IMAGES[message.avatar]}
                    text={message.text}
                    index={index}
                  />
                ))}
                {isSending && pendingAvatar === selectedAvatar && (
                  <TypingIndicator avatar={selectedAvatar} avatarImage={AVATAR_IMAGES[selectedAvatar]} />
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Input bar — always pinned at bottom */}
          <div className="border-t border-border/60 bg-background/95 px-3 py-2.5 backdrop-blur-sm">
            <form onSubmit={handleSend} className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="flex-1 rounded-full border border-border/60 bg-muted/50 px-4 py-2.5 text-sm text-foreground outline-none ring-offset-background placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/30"
                placeholder={selectedAvatar ? `Escribí tu consulta para ${selectedAvatar}...` : 'Elegí un avatar para comenzar'}
                disabled={!selectedAvatar || isSending}
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || !selectedAvatar || isSending}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm transition-all hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>

        {/* Reset confirmation */}
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

        {/* Avatar pill — fixed, positioned above mobile nav */}
        <AvatarPill avatars={avatarOptions} selectedAvatar={selectedAvatar} onSelect={handleAvatarSelect} />
      </div>
    </AppLayout>
  );
};

export default Chat;
