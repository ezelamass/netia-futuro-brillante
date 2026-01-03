import { UseFormReturn } from 'react-hook-form';
import { Target } from 'lucide-react';
import { ProfileSection } from '../ProfileSection';
import { 
  FieldDisplay, 
  EditableRadioGroup,
  EditableChipsField,
  EditableSwitchField,
} from '../EditableField';
import { UserProfile, GOALS, AREAS_TO_IMPROVE } from '@/types/profile';

interface GoalsSectionProps {
  profile: UserProfile;
  form: UseFormReturn<UserProfile>;
  isEditing: boolean;
}

export const GoalsSection = ({
  profile,
  form,
  isEditing,
}: GoalsSectionProps) => {
  const goalLabel = GOALS.find(g => g.value === profile.mainGoal)?.label || profile.mainGoal;

  return (
    <ProfileSection
      title="Objetivos"
      icon={Target}
      iconColor="text-emerald-500"
      isEditing={isEditing}
    >
      {isEditing ? (
        <div className="space-y-4">
          <EditableRadioGroup
            form={form}
            name="mainGoal"
            label="Meta principal"
            options={GOALS}
          />

          <EditableChipsField
            form={form}
            name="areasToImprove"
            label="Áreas a mejorar"
            options={AREAS_TO_IMPROVE}
          />

          <EditableSwitchField
            form={form}
            name="championModeReminders"
            label="Recordatorios Modo Campeón"
            description="Recibir notificaciones motivacionales"
          />
        </div>
      ) : (
        <div className="space-y-2">
          <FieldDisplay label="Meta principal" value={goalLabel} />
          <FieldDisplay label="Áreas a mejorar" value={profile.areasToImprove} />
          <FieldDisplay label="Recordatorios Modo Campeón" value={profile.championModeReminders} />
        </div>
      )}
    </ProfileSection>
  );
};
