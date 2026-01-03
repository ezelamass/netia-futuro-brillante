import { useState } from 'react';
import { AppLayout } from '@/layouts/AppLayout';
import { Form } from '@/components/ui/form';
import { useProfile } from '@/hooks/useProfile';
import { ProfileHeader, ProfileStats } from '@/components/profile';
import {
  PersonalDataSection,
  SportProfileSection,
  GoalsSection,
  PhysicalSection,
  NutritionSection,
  MentalSection,
  FamilySection,
  PreferencesSection,
} from '@/components/profile/sections';
import { TodayCardSkeleton } from '@/components/skeletons';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const Profile = () => {
  const {
    profile,
    form,
    isEditing,
    isDirty,
    isLoading,
    isSaving,
    startEditing,
    cancelEditing,
    saveProfile,
  } = useProfile();

  const [showCancelDialog, setShowCancelDialog] = useState(false);

  const handleCancel = () => {
    if (isDirty) {
      setShowCancelDialog(true);
    } else {
      cancelEditing();
    }
  };

  const confirmCancel = () => {
    setShowCancelDialog(false);
    cancelEditing();
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div className="max-w-2xl mx-auto">
          <TodayCardSkeleton />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto pb-8">
        <Form {...form}>
          <form onSubmit={(e) => e.preventDefault()}>
            {/* Header with avatar and basic info */}
            <ProfileHeader
              profile={profile}
              isEditing={isEditing}
              isDirty={isDirty}
              isSaving={isSaving}
              onEdit={startEditing}
              onSave={saveProfile}
              onCancel={handleCancel}
            />

            {/* Stats cards */}
            <ProfileStats profile={profile} />

            {/* Collapsible sections */}
            <PersonalDataSection
              profile={profile}
              form={form}
              isEditing={isEditing}
            />

            <SportProfileSection
              profile={profile}
              form={form}
              isEditing={isEditing}
            />

            <GoalsSection
              profile={profile}
              form={form}
              isEditing={isEditing}
            />

            <PhysicalSection
              profile={profile}
              form={form}
              isEditing={isEditing}
            />

            <NutritionSection
              profile={profile}
              form={form}
              isEditing={isEditing}
            />

            <MentalSection
              profile={profile}
              form={form}
              isEditing={isEditing}
            />

            <FamilySection
              profile={profile}
              form={form}
              isEditing={isEditing}
            />

            <PreferencesSection
              profile={profile}
              form={form}
              isEditing={isEditing}
            />
          </form>
        </Form>

        {/* Cancel confirmation dialog */}
        <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>¿Descartar cambios?</AlertDialogTitle>
              <AlertDialogDescription>
                Tenés cambios sin guardar. Si cancelás ahora, se perderán.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Seguir editando</AlertDialogCancel>
              <AlertDialogAction onClick={confirmCancel}>
                Descartar cambios
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AppLayout>
  );
};

export default Profile;
