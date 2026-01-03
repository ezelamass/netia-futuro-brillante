import { UseFormReturn } from 'react-hook-form';
import { Brain } from 'lucide-react';
import { ProfileSection } from '../ProfileSection';
import { 
  FieldDisplay, 
  EditableRadioGroup,
  EditableChipsField,
  EditableSwitchField,
} from '../EditableField';
import { UserProfile, FOCUS_TECHNIQUES } from '@/types/profile';

interface MentalSectionProps {
  profile: UserProfile;
  form: UseFormReturn<UserProfile>;
  isEditing: boolean;
}

const FEELINGS = [
  { value: 'nervous', label: 'Nervioso' },
  { value: 'calm', label: 'Tranquilo' },
  { value: 'motivated', label: 'Motivado' },
  { value: 'distracted', label: 'Distraído' },
] as const;

export const MentalSection = ({
  profile,
  form,
  isEditing,
}: MentalSectionProps) => {
  const feelingLabel = FEELINGS.find(f => f.value === profile.preCompetitionFeeling)?.label || profile.preCompetitionFeeling;

  return (
    <ProfileSection
      title="Perfil Mental (ROMA)"
      icon={Brain}
      iconColor="text-avatar-roma"
      isEditing={isEditing}
    >
      {isEditing ? (
        <div className="space-y-4">
          <EditableRadioGroup
            form={form}
            name="preCompetitionFeeling"
            label="¿Cómo te sentís antes de competir?"
            options={FEELINGS}
          />

          <EditableChipsField
            form={form}
            name="focusTechniques"
            label="Técnicas de concentración"
            options={FOCUS_TECHNIQUES}
          />

          <EditableSwitchField
            form={form}
            name="relaxationExercises"
            label="Ejercicios de relajación"
            description="Incluir técnicas de respiración y calma"
          />

          <EditableSwitchField
            form={form}
            name="romaGoalsActive"
            label="Metas con ROMA activas"
            description="Trabajar objetivos mentales con tu coach IA"
          />
        </div>
      ) : (
        <div className="space-y-2">
          <FieldDisplay label="Estado pre-competencia" value={feelingLabel} />
          <FieldDisplay label="Técnicas de concentración" value={profile.focusTechniques} />
          <FieldDisplay label="Ejercicios de relajación" value={profile.relaxationExercises} />
          <FieldDisplay label="Metas con ROMA" value={profile.romaGoalsActive} />
        </div>
      )}
    </ProfileSection>
  );
};
