import { useState } from 'react';
import { AppLayout } from '@/layouts/AppLayout';
import { useUsers } from '@/hooks/useUsers';
import { User, UserRole, UserActivity } from '@/types/user';
import { toast } from 'sonner';
import {
  UsersHeader,
  UsersFilters,
  UsersTable,
  UserDetailModal,
  CreateEditUserModal,
  BulkActionsBar,
  UserStats,
  UsersPagination,
  DeactivateUserModal,
  DeleteUserModal,
  ResetPasswordModal,
  ChangeRoleModal,
  AssignClubModal,
} from '@/components/admin/users';

const Users = () => {
  const {
    users,
    allUsers,
    filteredUsers,
    filters,
    updateFilter,
    resetFilters,
    selectedUsers,
    toggleUserSelection,
    selectAllVisible,
    clearSelection,
    stats,
    currentPage,
    setCurrentPage,
    totalPages,
    itemsPerPage,
    clubs,
    isLoading,
    getUserActivities,
    createUser,
    updateUser,
    deleteUser,
    toggleUserStatus,
    bulkUpdateStatus,
    bulkAssignClub,
    changeUserRole,
    resetPassword,
  } = useUsers();

  // Modal states
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [viewingUser, setViewingUser] = useState<User | null>(null);
  const [viewingUserActivities, setViewingUserActivities] = useState<UserActivity[]>([]);
  const [deactivatingUser, setDeactivatingUser] = useState<User | null>(null);
  const [deletingUser, setDeletingUser] = useState<User | null>(null);
  const [resettingPasswordUser, setResettingPasswordUser] = useState<User | null>(null);
  const [changingRoleUser, setChangingRoleUser] = useState<User | null>(null);
  const [assigningClubUser, setAssigningClubUser] = useState<User | null>(null);
  const [bulkAssignClubOpen, setBulkAssignClubOpen] = useState(false);

  // Handlers
  const handleViewUser = async (user: User) => {
    setViewingUser(user);
    const activities = await getUserActivities(user.id);
    setViewingUserActivities(activities);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setViewingUser(null);
  };

  const handleCreateUser = () => {
    setEditingUser(null);
    setCreateModalOpen(true);
  };

  const handleSaveUser = async (data: {
    fullName: string;
    email: string;
    phone?: string;
    role: UserRole;
    clubId?: string;
    isActive: boolean;
  }) => {
    if (editingUser) {
      await updateUser(editingUser.id, {
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        role: data.role,
        clubId: data.clubId,
        status: data.isActive ? 'active' : 'inactive',
      });
      toast.success('Usuario actualizado');
    } else {
      await createUser({
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        role: data.role,
        clubId: data.clubId,
        status: data.isActive ? 'active' : 'pending',
      });
      toast.success('Usuario creado');
    }

    setEditingUser(null);
    setCreateModalOpen(false);
  };

  const handleToggleStatus = (user: User) => {
    if (user.status === 'active') {
      setDeactivatingUser(user);
    } else {
      toggleUserStatus(user.id);
      toast.success('Usuario activado');
    }
  };

  const handleConfirmDeactivate = () => {
    if (deactivatingUser) {
      toggleUserStatus(deactivatingUser.id);
      toast.success('Usuario desactivado');
      setDeactivatingUser(null);
      setViewingUser(null);
    }
  };

  const handleConfirmDelete = async () => {
    if (deletingUser) {
      await deleteUser(deletingUser.id);
      toast.success('Usuario eliminado');
      setDeletingUser(null);
    }
  };

  const handleResetPassword = async () => {
    if (resettingPasswordUser) {
      await resetPassword(resettingPasswordUser.email);
      toast.success(`Email de reseteo enviado a ${resettingPasswordUser.email}`);
      setResettingPasswordUser(null);
    }
  };

  const handleChangeRole = async (role: UserRole) => {
    if (changingRoleUser) {
      await changeUserRole(changingRoleUser.id, role);
      toast.success('Rol actualizado');
      setChangingRoleUser(null);
    }
  };

  const handleAssignClub = async (clubId: string, clubName: string) => {
    if (assigningClubUser) {
      await updateUser(assigningClubUser.id, { clubId, clubName });
      toast.success(`Usuario asignado a ${clubName}`);
      setAssigningClubUser(null);
    }
  };

  const handleBulkDeactivate = () => {
    bulkUpdateStatus(Array.from(selectedUsers), 'inactive');
    toast.success(`${selectedUsers.size} usuarios desactivados`);
  };

  const handleBulkAssignClub = (clubId: string, clubName: string) => {
    bulkAssignClub(Array.from(selectedUsers), clubId, clubName);
    toast.success(`${selectedUsers.size} usuarios asignados a ${clubName}`);
    setBulkAssignClubOpen(false);
  };

  const handleExport = () => {
    const headers = ['ID', 'Nombre', 'Email', 'Rol', 'Club', 'Estado', 'Fecha registro'];
    const rows = filteredUsers.map((u) => [
      u.id,
      u.fullName,
      u.email,
      u.role,
      u.clubName || '-',
      u.status,
      u.createdAt.toISOString().split('T')[0],
    ]);

    const csv = [headers, ...rows].map((row) => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `usuarios_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Exportación completada');
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <UsersHeader
          totalUsers={allUsers.length}
          onCreateUser={handleCreateUser}
        />

        <UserStats stats={stats} />

        <UsersFilters
          filters={filters}
          clubs={clubs}
          onFilterChange={updateFilter}
          onReset={resetFilters}
          onExport={handleExport}
        />

        <UsersTable
          users={users}
          selectedUsers={selectedUsers}
          onToggleSelect={toggleUserSelection}
          onSelectAll={selectAllVisible}
          onView={handleViewUser}
          onEdit={handleEditUser}
          onChangeRole={setChangingRoleUser}
          onAssignClub={setAssigningClubUser}
          onToggleStatus={handleToggleStatus}
          onResetPassword={setResettingPasswordUser}
          onDelete={setDeletingUser}
        />

        <UsersPagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredUsers.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
        />

        <BulkActionsBar
          selectedCount={selectedUsers.size}
          onDeactivate={handleBulkDeactivate}
          onAssignClub={() => setBulkAssignClubOpen(true)}
          onClear={clearSelection}
        />

        {/* Modals */}
        <CreateEditUserModal
          user={editingUser}
          clubs={clubs}
          open={createModalOpen || !!editingUser}
          onOpenChange={(open) => {
            if (!open) {
              setCreateModalOpen(false);
              setEditingUser(null);
            }
          }}
          onSave={handleSaveUser}
        />

        <UserDetailModal
          user={viewingUser}
          activities={viewingUserActivities}
          open={!!viewingUser}
          onOpenChange={(open) => !open && setViewingUser(null)}
          onEdit={handleEditUser}
          onToggleStatus={handleToggleStatus}
          onResetPassword={setResettingPasswordUser}
        />

        <DeactivateUserModal
          user={deactivatingUser}
          open={!!deactivatingUser}
          onOpenChange={(open) => !open && setDeactivatingUser(null)}
          onConfirm={handleConfirmDeactivate}
        />

        <DeleteUserModal
          user={deletingUser}
          open={!!deletingUser}
          onOpenChange={(open) => !open && setDeletingUser(null)}
          onConfirm={handleConfirmDelete}
        />

        <ResetPasswordModal
          user={resettingPasswordUser}
          open={!!resettingPasswordUser}
          onOpenChange={(open) => !open && setResettingPasswordUser(null)}
          onConfirm={handleResetPassword}
        />

        <ChangeRoleModal
          user={changingRoleUser}
          open={!!changingRoleUser}
          onOpenChange={(open) => !open && setChangingRoleUser(null)}
          onConfirm={handleChangeRole}
        />

        <AssignClubModal
          user={assigningClubUser}
          clubs={clubs}
          open={!!assigningClubUser}
          onOpenChange={(open) => !open && setAssigningClubUser(null)}
          onConfirm={handleAssignClub}
        />

        <AssignClubModal
          user={null}
          users={Array.from(selectedUsers).map((id) => allUsers.find((u) => u.id === id)!).filter(Boolean)}
          clubs={clubs}
          open={bulkAssignClubOpen}
          onOpenChange={setBulkAssignClubOpen}
          onConfirm={handleBulkAssignClub}
          isBulk
        />
      </div>
    </AppLayout>
  );
};

export default Users;
