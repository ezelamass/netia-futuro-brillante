import { AppLayout } from '@/layouts/AppLayout';
import { MessageDock, Character } from '@/components/ui/message-dock';
import tinoAvatar from '@/assets/tino-avatar.avif';
import zahiaAvatar from '@/assets/zahia-avatar.avif';
import romaAvatar from '@/assets/roma-avatar.avif';

const netiaCharacters: Character[] = [
  { emoji: "✨", name: "NETIA", online: false },
  {
    name: "TINO",
    emoji: "🏃",
    online: true,
    backgroundColor: "bg-tino",
    gradientColors: "hsl(var(--tino)), hsl(var(--tino) / 0.3)",
    avatar: tinoAvatar,
  },
  {
    name: "ZAHIA",
    emoji: "🌊",
    online: true,
    backgroundColor: "bg-zahia",
    gradientColors: "hsl(var(--zahia)), hsl(var(--zahia) / 0.3)",
    avatar: zahiaAvatar,
  },
  {
    name: "ROMA",
    emoji: "🎯",
    online: true,
    backgroundColor: "bg-roma",
    gradientColors: "hsl(var(--roma)), hsl(var(--roma) / 0.3)",
    avatar: romaAvatar,
  },
  { emoji: "⚙️", name: "Settings", online: false },
];

const Chat = () => {
  const handleMessageSend = (message: string, character: Character, index: number) => {
    console.log("Mensaje enviado:", { message, character: character.name, index });
    // Aquí se integrará con el backend en el futuro
  };

  const handleCharacterSelect = (character: Character) => {
    console.log("Avatar seleccionado:", character.name);
  };

  const handleDockToggle = (isExpanded: boolean) => {
    console.log("Chat expandido:", isExpanded);
  };

  return (
    <AppLayout>
      <div className="min-h-[calc(100vh-200px)] flex flex-col items-center justify-center">
        <div className="text-center mb-12 space-y-4">
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground">
            Chat con Avatares IA
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Consulta con TINO, ZAHIA y ROMA para obtener recomendaciones personalizadas sobre entrenamiento, nutrición y técnica.
          </p>
        </div>

        <MessageDock 
          characters={netiaCharacters}
          onMessageSend={handleMessageSend}
          onCharacterSelect={handleCharacterSelect}
          onDockToggle={handleDockToggle}
          expandedWidth={500}
          placeholder={(name) => `Escribe tu consulta a ${name}...`}
          theme="light"
          enableAnimations={true}
          closeOnSend={false}
          autoFocus={true}
        />
      </div>
    </AppLayout>
  );
};

export default Chat;
