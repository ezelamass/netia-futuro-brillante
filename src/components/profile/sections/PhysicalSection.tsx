import { UseFormReturn } from 'react-hook-form';
import { Activity } from 'lucide-react';
import { ProfileSection } from '../ProfileSection';
import { 
  FieldDisplay, 
  EditableTextField,
  EditableTextareaField,
  EditableRadioGroup,
  EditableSwitchField,
} from '../EditableField';
import { UserProfile } from '@/types/profile';

interface PhysicalSectionProps {
  profile: UserProfile;
  form: UseFormReturn<UserProfile>;
  isEditing: boolean;
}

const PHYSICAL_PREP = [
  { value: 'yes', label: 'Sí' },
  { value: 'sometimes', label: 'A veces' },
  { value: 'no', label: 'No' },
] as const;

export const PhysicalSection = ({
  profile,
  form,
  isEditing,
}: PhysicalSectionProps) => {
  const physicalPrepLabel = PHYSICAL_PREP.find(p => p.value === profile.doesPhysicalPrep)?.label || profile.doesPhysicalPrep;
  const hasSmartwatch = form.watch('hasSmartwatch');

  return (
    <ProfileSection
      title="Salud y Físico"
      icon={Activity}
      iconColor="text-red-500"
      isEditing={isEditing}
    >
      {isEditing ? (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <EditableTextField
              form={form}
              name="height"
              label="Altura (cm)"
              type="number"
              placeholder="155"
            />
            <EditableTextField
              form={form}
              name="weight"
              label="Peso (kg)"
              type="number"
              placeholder="45"
            />
          </div>

          <EditableTextareaField
            form={form}
            name="injuries"
            label="Lesiones o condiciones"
            placeholder="Describí cualquier lesión o condición relevante..."
            rows={2}
          />

          <EditableRadioGroup
            form={form}
            name="doesPhysicalPrep"
            label="¿Hacés preparación física?"
            options={PHYSICAL_PREP}
          />

          <EditableSwitchField
            form={form}
            name="hasSmartwatch"
            label="¿Usás smartwatch/pulsera?"
          />

          {hasSmartwatch && (
            <EditableTextField
              form={form}
              name="smartwatchType"
              label="Modelo del dispositivo"
              placeholder="Ej: Apple Watch, Garmin..."
            />
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
          <FieldDisplay label="Altura" value={`${profile.height} cm`} />
          <FieldDisplay label="Peso" value={`${profile.weight} kg`} />
          <FieldDisplay label="Lesiones" value={profile.injuries || 'Ninguna'} className="col-span-2" />
          <FieldDisplay label="Preparación física" value={physicalPrepLabel} />
          <FieldDisplay 
            label="Smartwatch" 
            value={profile.hasSmartwatch ? profile.smartwatchType || 'Sí' : 'No'} 
          />
        </div>
      )}
    </ProfileSection>
  );
};
