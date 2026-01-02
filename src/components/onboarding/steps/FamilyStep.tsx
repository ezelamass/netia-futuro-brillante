import { useOnboarding } from '@/contexts/OnboardingContext';
import { OnboardingStep } from '../OnboardingStep';
import { AvatarGuide } from '../AvatarGuide';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { motion } from 'framer-motion';
import { Users, Mail, Phone, FileText, Shield } from 'lucide-react';

export const FamilyStep = () => {
  const { data, updateData } = useOnboarding();

  return (
    <OnboardingStep>
      <div className="space-y-6">
        <AvatarGuide
          avatar="tino"
          message="¡Casi terminamos! 👨‍👩‍👧 Necesitamos los datos de tu tutor para mantenerlos informados sobre tu progreso y garantizar tu seguridad."
        />

        <motion.div
          className="glass rounded-2xl p-6 space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {/* Tutor Name */}
          <div className="space-y-2">
            <Label htmlFor="tutorName" className="flex items-center gap-2 text-sm font-medium">
              <Users className="w-4 h-4 text-primary" />
              Nombre del tutor/responsable *
            </Label>
            <Input
              id="tutorName"
              placeholder="Nombre completo del tutor"
              value={data.tutorName}
              onChange={(e) => updateData({ tutorName: e.target.value })}
              className="h-12"
            />
          </div>

          {/* Tutor Email */}
          <div className="space-y-2">
            <Label htmlFor="tutorEmail" className="flex items-center gap-2 text-sm font-medium">
              <Mail className="w-4 h-4 text-primary" />
              Email del tutor *
            </Label>
            <Input
              id="tutorEmail"
              type="email"
              placeholder="tutor@email.com"
              value={data.tutorEmail}
              onChange={(e) => updateData({ tutorEmail: e.target.value })}
              className="h-12"
            />
            <p className="text-xs text-muted-foreground">
              Enviaremos actualizaciones y reportes a este email
            </p>
          </div>

          {/* Tutor Phone */}
          <div className="space-y-2">
            <Label htmlFor="tutorPhone" className="flex items-center gap-2 text-sm font-medium">
              <Phone className="w-4 h-4 text-primary" />
              Teléfono de contacto
            </Label>
            <Input
              id="tutorPhone"
              type="tel"
              placeholder="+54 11 1234-5678"
              value={data.tutorPhone}
              onChange={(e) => updateData({ tutorPhone: e.target.value })}
              className="h-12"
            />
          </div>

          {/* Weekly Reports */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-primary/5 border border-primary/10">
            <div className="flex items-center gap-3">
              <span className="text-2xl">📊</span>
              <div>
                <p className="font-medium text-sm">Reportes semanales</p>
                <p className="text-xs text-muted-foreground">Enviar resumen de progreso al tutor</p>
              </div>
            </div>
            <Switch
              checked={data.weeklyReports}
              onCheckedChange={(checked) => updateData({ weeklyReports: checked })}
            />
          </div>

          {/* Legal Checkboxes */}
          <div className="space-y-4 pt-4 border-t border-border">
            <div className="flex items-start gap-3">
              <Checkbox
                id="dataAuth"
                checked={data.dataAuthorization}
                onCheckedChange={(checked) => updateData({ dataAuthorization: checked === true })}
                className="mt-1"
              />
              <div>
                <Label htmlFor="dataAuth" className="flex items-center gap-2 text-sm font-medium cursor-pointer">
                  <Shield className="w-4 h-4 text-primary" />
                  Autorización de uso de datos *
                </Label>
                <p className="text-xs text-muted-foreground mt-1">
                  Autorizo el uso de los datos proporcionados con fines educativos y de mejora del rendimiento deportivo del menor.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Checkbox
                id="terms"
                checked={data.termsAccepted}
                onCheckedChange={(checked) => updateData({ termsAccepted: checked === true })}
                className="mt-1"
              />
              <div>
                <Label htmlFor="terms" className="flex items-center gap-2 text-sm font-medium cursor-pointer">
                  <FileText className="w-4 h-4 text-primary" />
                  Términos y Manifiesto de Valores *
                </Label>
                <p className="text-xs text-muted-foreground mt-1">
                  Acepto los{' '}
                  <a href="#" className="text-primary underline">términos de servicio</a>
                  {' '}y el{' '}
                  <a href="#" className="text-primary underline">Manifiesto de Valores</a>
                  {' '}de NETIA.
                </p>
              </div>
            </div>
          </div>

          {!data.dataAuthorization || !data.termsAccepted ? (
            <p className="text-xs text-destructive text-center">
              ⚠️ Debes aceptar ambas autorizaciones para continuar
            </p>
          ) : null}
        </motion.div>
      </div>
    </OnboardingStep>
  );
};
