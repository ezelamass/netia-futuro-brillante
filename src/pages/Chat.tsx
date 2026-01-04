import { AppLayout } from '@/layouts/AppLayout';
import { useEffect, useMemo, useRef, useState, FormEvent } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { EmptyState } from '@/components/ui/empty-state';
import { ErrorState } from '@/components/ui/error-state';
import tinoAvatar from '@/assets/tino-avatar.png';
import zahiaAvatar from '@/assets/zahia-avatar.png';
import romaAvatar from '@/assets/roma-avatar.png';
import { AvatarPill, AvatarId, AvatarPillAvatar } from '@/components/chat/AvatarPill';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface ChatMessage {
  id: string;
  sender: 'user' | 'avatar';
  avatar: AvatarId;
  text: string;
  timestamp: string;
}

type ConversationState = Record<AvatarId, ChatMessage[]>;

const AVATAR_WEBHOOKS: Record<AvatarId, string> = {
  TINO: 'https://devwebhookn8n.ezequiellamas.com/webhook/8c5faf4e-a8c1-441b-be05-1f50464e1a4d',
  ZAHIA: 'https://devwebhookn8n.ezequiellamas.com/webhook/795bd04f-9a82-4ac1-b7b4-691ede32286c',
  ROMA: 'https://devwebhookn8n.ezequiellamas.com/webhook/cfe8b8a1-65b9-49de-bd4c-37881afe5c7f',
};

const STORAGE_KEY = 'netia_chat_state_v1';

const EMPTY_CONVERSATIONS: ConversationState = {
  TINO: [],
  ZAHIA: [],
  ROMA: [],
};

const AVATAR_CONFIG: Record<AvatarId, { description: string }> = {
  TINO: {
    description:
      'TINO te acompaña con entrenamiento físico y preparación atlética para rendir al máximo.',
  },
  ZAHIA: {
    description:
      'ZAHIA es tu guía en nutrición, hidratación y hábitos saludables para deportistas.',
  },
  ROMA: {
    description:
      'ROMA te ayuda con estrategia de regatas, decisiones tácticas y foco mental.',
  },
};

function generateId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function parseWebhookResponse(raw: string): string[] {
  const messages: string[] = [];

  if (!raw || !raw.trim()) return messages;

  try {
    const parsed = JSON.parse(raw);

    if (Array.isArray(parsed)) {
      for (const item of parsed) {
        if (item && typeof item === 'object') {
          const direct = (item as Record<string, unknown>)['output.respuesta'];
          const value =
            typeof direct === 'string' && direct.trim()
              ? direct
              : Object.values(item as Record<string, unknown>)[0];

          if (typeof value === 'string' && value.trim()) {
            messages.push(value.trim());
          }
        }
      }
    } else if (typeof parsed === 'string' && parsed.trim()) {
      messages.push(parsed.trim());
    }
  } catch {
    // Si no es JSON válido, usamos el texto completo como un único mensaje
    if (raw.trim()) {
      messages.push(raw.trim());
    }
  }

  return messages;
}

const Chat = () => {
  const { toast } = useToast();

  const [conversations, setConversations] = useState<ConversationState>(EMPTY_CONVERSATIONS);
  const [selectedAvatar, setSelectedAvatar] = useState<AvatarId | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [hasStartedChat, setHasStartedChat] = useState(false);
  const [pendingAvatar, setPendingAvatar] = useState<AvatarId | null>(null);
  const [avatarToReset, setAvatarToReset] = useState<AvatarId | null>(null);

  // Generar un conversationId por avatar para esta sesión
  const [conversationIds, setConversationIds] = useState<Record<AvatarId, string>>(() => ({
    TINO: `TINO-${generateId()}`,
    ZAHIA: `ZAHIA-${generateId()}`,
    ROMA: `ROMA-${generateId()}`,
  }));

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // IMPORTANTE: los archivos de imagen están cruzados, así que mapeamos manualmente
  // para que cada avatar muestre su foto correcta.
  const avatarOptions: AvatarPillAvatar[] = useMemo(
    () => [
      {
        id: 'TINO',
        name: 'TINO',
        image: romaAvatar, // archivo de ROMA contiene la foto de TINO
        accentClass: 'ring-tino',
      },
      {
        id: 'ZAHIA',
        name: 'ZAHIA',
        image: tinoAvatar, // archivo de TINO contiene la foto de ZAHIA
        accentClass: 'ring-zahia',
      },
      {
        id: 'ROMA',
        name: 'ROMA',
        image: zahiaAvatar, // archivo de ZAHIA contiene la foto de ROMA
        accentClass: 'ring-roma',
      },
    ],
    []
  );

  // Cargar estado inicial desde sessionStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const stored = sessionStorage.getItem(STORAGE_KEY);
      if (!stored) return;

      const parsed = JSON.parse(stored) as {
        conversations?: ConversationState;
        selectedAvatar?: AvatarId | null;
        hasStartedChat?: boolean;
      };

      setConversations(parsed.conversations ?? EMPTY_CONVERSATIONS);
      setSelectedAvatar(parsed.selectedAvatar ?? null);
      setHasStartedChat(parsed.hasStartedChat ?? false);
    } catch (error) {
      console.error('Error al cargar el estado del chat desde sessionStorage:', error);
    }
  }, []);

  // Guardar estado en sessionStorage cuando cambie
  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const payload = JSON.stringify({
        conversations,
        selectedAvatar,
        hasStartedChat,
      });
      sessionStorage.setItem(STORAGE_KEY, payload);
    } catch (error) {
      console.error('Error al guardar el estado del chat en sessionStorage:', error);
    }
  }, [conversations, selectedAvatar, hasStartedChat]);

  const currentConversation: ChatMessage[] = selectedAvatar
    ? conversations[selectedAvatar] ?? []
    : [];

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [selectedAvatar, currentConversation.length]);

  const handleAvatarSelect = (avatar: AvatarId) => {
    setSelectedAvatar(avatar);

    // Si ya hubo actividad en cualquier avatar, mantenemos el estado de chat iniciado
    setHasStartedChat((prev) =>
      prev || Object.values(conversations).some((msgs) => msgs.length > 0)
    );
  };

  const handleResetAvatarChat = (avatar: AvatarId) => {
    setConversations((prev) => {
      const updated: ConversationState = {
        ...prev,
        [avatar]: [],
      };
      const hasAnyMessages = Object.values(updated).some((msgs) => msgs.length > 0);
      setHasStartedChat(hasAnyMessages);
      return updated;
    });

    setConversationIds((prev) => ({
      ...prev,
      [avatar]: `${avatar}-${generateId()}`,
    }));
  };

  const handleConfirmReset = () => {
    if (avatarToReset) {
      handleResetAvatarChat(avatarToReset);
    }
    setAvatarToReset(null);
  };

  const handleSend = async (event: FormEvent) => {
    event.preventDefault();

    const text = inputValue.trim();
    if (!text) return;

    if (!selectedAvatar) {
      toast({
        title: 'Elegí un avatar',
        description: 'Seleccioná uno de los avatares de abajo para comenzar a chatear.',
      });
      return;
    }

    if (isSending) return;

    const avatarForThisMessage = selectedAvatar;
    const conversationId = conversationIds[avatarForThisMessage];

    const userMessage: ChatMessage = {
      id: generateId(),
      sender: 'user',
      avatar: avatarForThisMessage,
      text,
      timestamp: new Date().toISOString(),
    };

    setConversations((prev) => ({
      ...prev,
      [avatarForThisMessage]: [...(prev[avatarForThisMessage] ?? []), userMessage],
    }));

    setInputValue('');
    setIsSending(true);
    setHasStartedChat(true);
    setPendingAvatar(avatarForThisMessage);

    const webhookUrl = AVATAR_WEBHOOKS[avatarForThisMessage];

    if (!webhookUrl) {
      toast({
        title: 'Avatar no disponible',
        description: 'Este avatar aún no tiene un chat conectado.',
      });
      setIsSending(false);
      setPendingAvatar(null);
      return;
    }

    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: text,
          avatar: avatarForThisMessage,
          conversationId,
        }),
      });

      const raw = await response.text();

      if (!response.ok) {
        throw new Error(raw || 'Error en el servidor de IA');
      }

      const assistantMessages = parseWebhookResponse(raw);

      if (!assistantMessages.length) {
        toast({
          title: `${avatarForThisMessage} respondió sin contenido`,
          description: 'El servidor de IA no devolvió texto para mostrar.',
        });
        return;
      }

      // Añadimos los mensajes del avatar de forma escalonada para simular que escribe varios mensajes seguidos
      assistantMessages.forEach((textPart, index) => {
        const delay = index * 450; // 450ms entre mensajes
        setTimeout(() => {
          setConversations((prev) => {
            const existing = prev[avatarForThisMessage] ?? [];
            const newMessage: ChatMessage = {
              id: generateId(),
              sender: 'avatar',
              avatar: avatarForThisMessage,
              text: textPart,
              timestamp: new Date().toISOString(),
            };

            return {
              ...prev,
              [avatarForThisMessage]: [...existing, newMessage],
            };
          });
        }, delay);
      });
    } catch (error) {
      console.error('Error al enviar mensaje al webhook:', error);
      toast({
        title: 'Error al contactar al avatar',
        description:
          'Ocurrió un problema al enviar tu mensaje. Intenta nuevamente en unos instantes.',
      });
    } finally {
      setIsSending(false);
      setPendingAvatar(null);
    }
  };

  const renderPlaceholder = () => {
    if (!hasStartedChat && !selectedAvatar) {
      return (
        <EmptyState
          variant="first-chat"
          avatar="all"
          title="Chat con tus coaches IA"
          description="Elegí a TINO, ZAHIA o ROMA en la píldora de abajo para iniciar una conversación personalizada sobre entrenamiento, nutrición y estrategia."
          suggestions={['¿Qué entreno hoy?', 'Dame un consejo', '¿Cómo me hidrato mejor?']}
          className="bg-transparent border-none"
        />
      );
    }

    if (selectedAvatar && currentConversation.length === 0) {
      const config = AVATAR_CONFIG[selectedAvatar];

      return (
        <EmptyState
          variant="first-chat"
          avatar={selectedAvatar}
          title={`¡Hola! Soy ${selectedAvatar}`}
          description={config.description}
          suggestions={
            selectedAvatar === 'TINO' 
              ? ['¿Qué entreno hoy?', '¿Cómo mejoro mi resistencia?', 'Dame un plan de ejercicios']
              : selectedAvatar === 'ZAHIA'
              ? ['¿Qué como antes de entrenar?', '¿Cuánta agua tomo?', 'Dame un snack saludable']
              : ['¿Cómo me concentro mejor?', 'Tengo nervios antes del partido', 'Dame un consejo mental']
          }
          className="bg-transparent border-none"
        />
      );
    }

    return null;
  };

  const getAvatarImage = (avatar: AvatarId) => {
    // Mismo mapeo cruzado que en avatarOptions para mantener consistencia
    switch (avatar) {
      case 'TINO':
        return romaAvatar; // foto correcta de TINO
      case 'ZAHIA':
        return tinoAvatar; // foto correcta de ZAHIA
      case 'ROMA':
      default:
        return zahiaAvatar; // foto correcta de ROMA
    }
  };

  const getAvatarBubbleClasses = (avatar: AvatarId) => {
    switch (avatar) {
      case 'TINO':
        return 'bg-tino/10 text-foreground border border-tino/40';
      case 'ZAHIA':
        return 'bg-zahia/10 text-foreground border border-zahia/40';
      case 'ROMA':
      default:
        return 'bg-roma/10 text-foreground border border-roma/40';
    }
  };

  return (
    <AppLayout>
      <div className="relative flex min-h-[calc(100vh-200px)] flex-col items-center justify-center px-4 pb-20">
        {!hasStartedChat && (
          <header className="mb-6 w-full max-w-4xl text-center">
            <h1 className="font-heading px-4 text-3xl font-bold text-foreground sm:text-4xl md:text-5xl">
              Chat con Avatares IA
            </h1>
            <p className="mx-auto mt-3 max-w-2xl px-4 text-base text-muted-foreground sm:text-lg">
              Conversá de forma continua con TINO, ZAHIA y ROMA. Elegí un avatar abajo y mantené
              un chat fluido con historial separado para cada uno.
            </p>
          </header>
        )}

        <main className="glass relative w-full max-w-4xl flex-1 rounded-3xl border border-border/60 bg-background/80 p-0 shadow-lg backdrop-blur-xl">
          <div className="flex h-full flex-col">
            {/* Área de mensajes */}
            <div className="flex-1 overflow-y-auto px-4 py-4">
              {selectedAvatar && (
                <div className="mb-3 flex items-center justify-between text-xs text-muted-foreground">
                  <span>Conversación con {selectedAvatar}</span>
                  <button
                    type="button"
                    onClick={() => setAvatarToReset(selectedAvatar)}
                    className="rounded-full border border-border/60 bg-background/80 px-3 py-1 text-[11px] font-medium text-foreground shadow-sm transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60"
                    disabled={isSending && pendingAvatar === selectedAvatar}
                  >
                    Nuevo chat
                  </button>
                </div>
              )}

              {renderPlaceholder()}

              {selectedAvatar && currentConversation.length > 0 && (
                <div className="flex flex-col gap-3">
                  {currentConversation.map((message, index) => {
                    const isUser = message.sender === 'user';
                    const alignment = isUser ? 'justify-end' : 'justify-start';
                    const isFirstUserMessage = isUser && index === 0;
                    const bubbleAnimationClass = !isUser
                      ? 'animate-enter'
                      : isFirstUserMessage
                      ? 'animate-enter'
                      : '';

                    return (
                      <div
                        key={message.id}
                        className={`flex ${alignment} items-end gap-2`}
                      >
                        {!isUser && (
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border/60 bg-background">
                            <img
                              src={getAvatarImage(message.avatar)}
                              alt={`Avatar ${message.avatar}`}
                              className="h-full w-full object-cover"
                            />
                          </div>
                        )}
                        <div
                          className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm shadow-sm ${
                            isUser
                              ? 'bg-primary text-primary-foreground'
                              : getAvatarBubbleClasses(message.avatar)
                          } ${bubbleAnimationClass}`}
                        >
                          <p className="whitespace-pre-wrap break-words text-sm">{message.text}</p>
                        </div>
                      </div>
                    );
                  })}

                  {/* Mensaje temporal de "pensando..." con shimmer plateado */}
                  {isSending && pendingAvatar && pendingAvatar === selectedAvatar && (
                    <div className="flex items-end gap-2 justify-start">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border/60 bg-background">
                        <img
                          src={getAvatarImage(pendingAvatar)}
                          alt={`Avatar ${pendingAvatar}`}
                          className="h-full w-full object-cover"
                        />
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

            {/* Input de mensaje */}
            <div className="border-t border-border/60 bg-background/90 px-4 py-3">
              <form onSubmit={handleSend} className="flex items-center gap-3">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="flex-1 rounded-full border border-border/60 bg-background px-4 py-2 text-sm text-foreground outline-none ring-offset-background placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/40"
                  placeholder={
                    selectedAvatar
                      ? `Escribí tu consulta para ${selectedAvatar}...`
                      : 'Elegí un avatar abajo para comenzar a chatear'
                  }
                  disabled={isSending && !selectedAvatar}
                />
                <button
                  type="submit"
                  className="inline-flex h-10 items-center justify-center rounded-full bg-primary px-4 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
                  disabled={!inputValue.trim() || !selectedAvatar || isSending}
                >
                  {isSending ? 'Enviando...' : 'Enviar'}
                </button>
              </form>
              {isSending && selectedAvatar && (
                <p className="mt-1 text-xs text-muted-foreground">
                  {selectedAvatar} está pensando su respuesta...
                </p>
              )}
            </div>
          </div>
        </main>

        {/* Diálogo de confirmación para nuevo chat */}
        <AlertDialog
          open={avatarToReset !== null}
          onOpenChange={(open) => {
            if (!open) setAvatarToReset(null);
          }}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>¿Empezar un nuevo chat?</AlertDialogTitle>
              <AlertDialogDescription>
                Esto borrará el historial de conversación con {avatarToReset ?? ''} en esta sesión.
                Esta acción no se puede deshacer.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setAvatarToReset(null)}>
                Cancelar
              </AlertDialogCancel>
              <AlertDialogAction onClick={handleConfirmReset}>
                Nuevo chat
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Píldora de selección de avatares */}
        <AvatarPill
          avatars={avatarOptions}
          selectedAvatar={selectedAvatar}
          onSelect={handleAvatarSelect}
        />
      </div>
    </AppLayout>
  );
};

export default Chat;
