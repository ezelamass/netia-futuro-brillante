import { Bell } from 'lucide-react';
import { motion } from 'framer-motion';

export const NotificationEmpty = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-12 px-4 text-center"
    >
      <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
        <Bell className="w-8 h-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold mb-1">Todo en orden</h3>
      <p className="text-sm text-muted-foreground">
        No tenés notificaciones pendientes. ¡Seguí así!
      </p>
    </motion.div>
  );
};
