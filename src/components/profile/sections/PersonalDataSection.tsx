import { UseFormReturn } from 'react-hook-form';
import { User } from 'lucide-react';
import { ProfileSection } from '../ProfileSection';
import { 
  FieldDisplay, 
  EditableTextField, 
  EditableSelectField 
} from '../EditableField';
import { UserProfile, COUNTRIES } from '@/types/profile';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface PersonalDataSectionProps {
  profile: UserProfile;
  form: UseFormReturn<UserProfile>;
  isEditing: boolean;
}

const LANGUAGES = [
  { value: 'es', label: 'Español' },
  { value: 'en', label: 'English' },
] as const;

export const PersonalDataSection = ({
  profile,
  form,
  isEditing,
}: PersonalDataSectionProps) => {
  const birthDate = profile.birthDate 
    ? format(new Date(profile.birthDate), "d 'de' MMMM, yyyy", { locale: es })
    : '—';

  const countryLabel = COUNTRIES.find(c => c.value === profile.country)?.label || profile.country;
  const languageLabel = LANGUAGES.find(l => l.value === profile.language)?.label || profile.language;

  return (
    <ProfileSection
      title="Datos Personales"
      icon={User}
      iconColor="text-primary"
      defaultOpen={true}
      isEditing={isEditing}
    >
      {isEditing ? (
        <div className="space-y-4">
          <EditableTextField
            form={form}
            name="fullName"
            label="Nombre completo"
            placeholder="Tu nombre completo"
          />
          
          <FieldDisplay 
            label="Fecha de nacimiento" 
            value={birthDate} 
          />

          <EditableSelectField
            form={form}
            name="country"
            label="País"
            options={COUNTRIES}
          />

          <EditableTextField
            form={form}
            name="city"
            label="Ciudad"
            placeholder="Tu ciudad"
          />

          <EditableSelectField
            form={form}
            name="language"
            label="Idioma"
            options={LANGUAGES}
          />
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
          <FieldDisplay label="Nombre completo" value={profile.fullName} />
          <FieldDisplay label="Fecha de nacimiento" value={birthDate} />
          <FieldDisplay label="País" value={countryLabel} />
          <FieldDisplay label="Ciudad" value={profile.city} />
          <FieldDisplay label="Idioma" value={languageLabel} />
        </div>
      )}
    </ProfileSection>
  );
};
