import { AppLayout } from '@/layouts/AppLayout';
import { MessageDock, Character } from '@/components/ui/message-dock';
import { motion } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';
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
    avatar: romaAvatar,
  },
  {
    name: "ZAHIA",
    emoji: "🌊",
    online: true,
    backgroundColor: "bg-zahia",
    gradientColors: "hsl(var(--zahia)), hsl(var(--zahia) / 0.3)",
    avatar: tinoAvatar,
  },
  {
    name: "ROMA",
    emoji: "🎯",
    online: true,
    backgroundColor: "bg-roma",
    gradientColors: "hsl(var(--roma)), hsl(var(--roma) / 0.3)",
    avatar: zahiaAvatar,
  },
  { emoji: "⚙️", name: "Settings", online: false },
];

const Chat = () => {
  const { toast } = useToast();

  const handleMessageSend = async (
    message: string,
    character: Character,
    index: number
  ) => {
    console.log('Mensaje enviado:', { message, character: character.name, index });

    let webhookUrl: string | null = null;
    switch (character.name.toUpperCase()) {
      case 'TINO':
        webhookUrl = 'https://devwebhookn8n.ezequiellamas.com/webhook/8c5faf4e-a8c1-441b-be05-1f50464e1a4d';
        break;
      case 'ZAHIA':
        webhookUrl = 'https://devwebhookn8n.ezequiellamas.com/webhook/795bd04f-9a82-4ac1-b7b4-691ede32286c';
        break;
      case 'ROMA':
        webhookUrl = 'https://devwebhookn8n.ezequiellamas.com/webhook/cfe8b8a1-65b9-49de-bd4c-37881afe5c7f';
        break;
      default:
        webhookUrl = null;
    }

    if (!webhookUrl) {
      toast({
        title: 'Avatar no disponible',
        description: 'Este avatar aún no tiene un chat conectado.',
      });
      return;
    }

    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          avatar: character.name,
          index,
        }),
      });

      const responseText = await response.text();

      if (!response.ok) {
        throw new Error(responseText || 'Error en el servidor de IA');
      }

      toast({
        title: `${character.name} respondió`,
        description: responseText || 'El avatar respondió sin contenido visible.',
      });
    } catch (error) {
      console.error('Error al enviar mensaje al webhook:', error);
      toast({
        title: 'Error al contactar al avatar',
        description: 'Ocurrió un problema al enviar tu mensaje. Intenta nuevamente en unos instantes.',
      });
    }
  };

  const handleCharacterSelect = (character: Character) => {
    console.log("Avatar seleccionado:", character.name);
  };

  const handleDockToggle = (isExpanded: boolean) => {
    console.log("Chat expandido:", isExpanded);
  };

  // Animations variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      }
    }
  };

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 30,
      scale: 0.9
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 15,
        duration: 0.6
      }
    }
  };

  return (
    <AppLayout>
      <div className="min-h-[calc(100vh-200px)] flex flex-col items-center justify-center px-4">
        <div className="text-center mb-8 md:mb-12 space-y-3 md:space-y-4 max-w-4xl mx-auto w-full">
          <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-foreground px-4">
            Chat con Avatares IA
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto px-4">
            Consulta con TINO, ZAHIA y ROMA para obtener recomendaciones personalizadas sobre entrenamiento, nutrición y técnica.
          </p>
        </div>

        {/* Wrapper for MessageDock with mobile optimization */}
        <div className="w-full flex justify-center items-center">
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
            className="w-full max-w-[calc(100vw-2rem)] sm:max-w-none"
          />
        </div>

        {/* Info cards about avatars - mobile optimized with staggered animations */}
        <motion.div 
          className="mt-12 md:mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 max-w-5xl mx-auto w-full px-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div 
            className="glass p-4 md:p-6 rounded-2xl border border-border/50 hover:border-tino/50 transition-all"
            variants={cardVariants}
            whileHover={{ y: -8, transition: { duration: 0.2 } }}
          >
            <div className="flex items-center gap-3 mb-3">
              <img src={romaAvatar} alt="TINO" className="w-12 h-12 rounded-full object-cover" />
              <h3 className="font-heading text-lg md:text-xl font-bold text-tino">TINO</h3>
            </div>
            <p className="text-sm md:text-base text-muted-foreground">
              Especialista en entrenamiento físico y preparación atlética para veleristas.
            </p>
          </motion.div>

          <motion.div 
            className="glass p-4 md:p-6 rounded-2xl border border-border/50 hover:border-zahia/50 transition-all"
            variants={cardVariants}
            whileHover={{ y: -8, transition: { duration: 0.2 } }}
          >
            <div className="flex items-center gap-3 mb-3">
              <img src={tinoAvatar} alt="ZAHIA" className="w-12 h-12 rounded-full object-cover" />
              <h3 className="font-heading text-lg md:text-xl font-bold text-zahia">ZAHIA</h3>
            </div>
            <p className="text-sm md:text-base text-muted-foreground">
              Experta en técnica de navegación, maniobras y optimización del rendimiento en el agua.
            </p>
          </motion.div>

          <motion.div 
            className="glass p-4 md:p-6 rounded-2xl border border-border/50 hover:border-roma/50 transition-all sm:col-span-2 lg:col-span-1"
            variants={cardVariants}
            whileHover={{ y: -8, transition: { duration: 0.2 } }}
          >
            <div className="flex items-center gap-3 mb-3">
              <img src={zahiaAvatar} alt="ROMA" className="w-12 h-12 rounded-full object-cover" />
              <h3 className="font-heading text-lg md:text-xl font-bold text-roma">ROMA</h3>
            </div>
            <p className="text-sm md:text-base text-muted-foreground">
              Estratega de regatas, análisis táctico y planificación de competencias.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </AppLayout>
  );
};

export default Chat;
