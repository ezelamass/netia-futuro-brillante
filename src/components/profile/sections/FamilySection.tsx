import { UseFormReturn } from 'react-hook-form';
import { Users } from 'lucide-react';
import { ProfileSection } from '../ProfileSection';
import { 
  FieldDisplay, 
  EditableTextField,
  EditableSwitchField,
} from '../EditableField';
import { UserProfile } from '@/types/profile';

interface FamilySectionProps {
  profile: UserProfile;
  form: UseFormReturn<UserProfile>;
  isEditing: boolean;
}

export const FamilySection = ({
  profile,
  form,
  isEditing,
}: FamilySectionProps) => {
  return (
    <ProfileSection
      title="Familia y Tutor"
      icon={Users}
      iconColor="text-blue-500"
      isEditing={isEditing}
    >
      {isEditing ? (
        <div className="space-y-4">
          <EditableTextField
            form={form}
            name="tutorName"
            label="Nombre del tutor"
            placeholder="Nombre del padre/madre/tutor"
          />

          <EditableTextField
            form={form}
            name="tutorEmail"
            label="Email del tutor"
            type="email"
            placeholder="email@ejemplo.com"
          />

          <EditableTextField
            form={form}
            name="tutorPhone"
            label="Teléfono"
            type="tel"
            placeholder="+54 11 1234-5678"
          />

          <EditableSwitchField
            form={form}
            name="weeklyReports"
            label="Reportes semanales"
            description="Enviar resumen de progreso al tutor"
          />
        </div>
      ) : (
        <div className="space-y-2">
          <FieldDisplay label="Nombre del tutor" value={profile.tutorName} />
          <FieldDisplay label="Email" value={profile.tutorEmail} />
          <FieldDisplay label="Teléfono" value={profile.tutorPhone || '—'} />
          <FieldDisplay label="Reportes semanales" value={profile.weeklyReports} />
        </div>
      )}
    </ProfileSection>
  );
};
