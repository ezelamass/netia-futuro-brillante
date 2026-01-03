import { UseFormReturn } from 'react-hook-form';
import { Apple } from 'lucide-react';
import { ProfileSection } from '../ProfileSection';
import { 
  FieldDisplay, 
  EditableRadioGroup,
  EditableChipsField,
  EditableSwitchField,
  EditableSliderField,
} from '../EditableField';
import { UserProfile, DIETARY_RESTRICTIONS } from '@/types/profile';

interface NutritionSectionProps {
  profile: UserProfile;
  form: UseFormReturn<UserProfile>;
  isEditing: boolean;
}

const BREAKFAST_OPTIONS = [
  { value: 'always', label: 'Siempre' },
  { value: 'sometimes', label: 'A veces' },
  { value: 'never', label: 'Nunca' },
] as const;

export const NutritionSection = ({
  profile,
  form,
  isEditing,
}: NutritionSectionProps) => {
  const breakfastLabel = BREAKFAST_OPTIONS.find(b => b.value === profile.breakfastBeforeTraining)?.label || profile.breakfastBeforeTraining;

  return (
    <ProfileSection
      title="Nutrición (ZAHIA)"
      icon={Apple}
      iconColor="text-avatar-zahia"
      isEditing={isEditing}
    >
      {isEditing ? (
        <div className="space-y-4">
          <EditableRadioGroup
            form={form}
            name="breakfastBeforeTraining"
            label="¿Desayunás antes de entrenar?"
            options={BREAKFAST_OPTIONS}
          />

          <EditableSliderField
            form={form}
            name="mealsPerDay"
            label="Comidas por día"
            min={2}
            max={8}
          />

          <EditableChipsField
            form={form}
            name="dietaryRestrictions"
            label="Restricciones alimentarias"
            options={DIETARY_RESTRICTIONS}
          />

          <EditableSwitchField
            form={form}
            name="zahiaPlanActive"
            label="Plan de ZAHIA activo"
            description="Recibir consejos de nutrición personalizados"
          />
        </div>
      ) : (
        <div className="space-y-2">
          <FieldDisplay label="Desayuno pre-entreno" value={breakfastLabel} />
          <FieldDisplay label="Comidas por día" value={profile.mealsPerDay} />
          <FieldDisplay 
            label="Restricciones" 
            value={profile.dietaryRestrictions.length > 0 ? profile.dietaryRestrictions : 'Ninguna'} 
          />
          <FieldDisplay label="Plan ZAHIA activo" value={profile.zahiaPlanActive} />
        </div>
      )}
    </ProfileSection>
  );
};
