import { UseFormReturn } from 'react-hook-form';
import { Trophy } from 'lucide-react';
import { ProfileSection } from '../ProfileSection';
import { 
  FieldDisplay, 
  EditableTextField, 
  EditableSelectField,
  EditableSwitchField,
  EditableCheckboxGroup,
  EditableRadioGroup,
} from '../EditableField';
import { UserProfile, SPORTS, LEVELS, DAYS_OF_WEEK } from '@/types/profile';

interface SportProfileSectionProps {
  profile: UserProfile;
  form: UseFormReturn<UserProfile>;
  isEditing: boolean;
}

const HANDEDNESS = [
  { value: 'right', label: 'Diestro' },
  { value: 'left', label: 'Zurdo' },
  { value: 'ambidextrous', label: 'Ambidiestro' },
] as const;

const DURATIONS = [
  { value: '30', label: '30 min' },
  { value: '60', label: '1 hora' },
  { value: '90', label: '1.5 horas' },
  { value: '120', label: '2 horas' },
] as const;

export const SportProfileSection = ({
  profile,
  form,
  isEditing,
}: SportProfileSectionProps) => {
  const sportLabel = SPORTS.find(s => s.value === profile.sport)?.label || profile.sport;
  const levelLabel = LEVELS.find(l => l.value === profile.level)?.label || profile.level;
  const handednessLabel = HANDEDNESS.find(h => h.value === profile.handedness)?.label || profile.handedness;
  const trainingDaysLabels = profile.trainingDays
    .map(d => DAYS_OF_WEEK.find(day => day.value === d)?.label)
    .filter(Boolean)
    .join(', ');

  const hasCoach = form.watch('hasCoach');

  return (
    <ProfileSection
      title="Perfil Deportivo"
      icon={Trophy}
      iconColor="text-yellow-500"
      defaultOpen={true}
      isEditing={isEditing}
    >
      {isEditing ? (
        <div className="space-y-4">
          <EditableSelectField
            form={form}
            name="sport"
            label="Deporte principal"
            options={SPORTS}
          />

          <EditableRadioGroup
            form={form}
            name="level"
            label="Nivel"
            options={LEVELS}
          />

          <EditableRadioGroup
            form={form}
            name="handedness"
            label="Lateralidad"
            options={HANDEDNESS}
          />

          <EditableSwitchField
            form={form}
            name="hasCoach"
            label="¿Tenés entrenador o academia?"
          />

          {hasCoach && (
            <EditableTextField
              form={form}
              name="coachName"
              label="Nombre del entrenador/academia"
              placeholder="Ej: Academia Wilson"
            />
          )}

          <EditableCheckboxGroup
            form={form}
            name="trainingDays"
            label="Días de entrenamiento"
            options={DAYS_OF_WEEK}
          />

          <EditableSelectField
            form={form}
            name="sessionDuration"
            label="Duración promedio de sesión"
            options={DURATIONS.map(d => ({ value: d.value, label: d.label }))}
          />
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
          <FieldDisplay label="Deporte" value={sportLabel} />
          <FieldDisplay label="Nivel" value={levelLabel} />
          <FieldDisplay label="Lateralidad" value={handednessLabel} />
          <FieldDisplay 
            label="Entrenador/Academia" 
            value={profile.hasCoach ? profile.coachName || 'Sí' : 'No'} 
          />
          <FieldDisplay label="Días de entrenamiento" value={trainingDaysLabels} />
          <FieldDisplay label="Duración sesión" value={`${profile.sessionDuration} min`} />
        </div>
      )}
    </ProfileSection>
  );
};
