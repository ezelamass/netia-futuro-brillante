import { useState, useMemo, useCallback, useEffect } from 'react';
import { User, UserFilters, UserRole, UserStatus } from '@/types/user';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const defaultFilters: UserFilters = {
  search: '',
  role: 'all',
  status: 'all',
  club: 'all',
  dateFilter: 'all',
};

interface Club {
  id: string;
  name: string;
}

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [clubs, setClubs] = useState<Club[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<UserFilters>(defaultFilters);
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // Fetch users from Supabase
  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      // Fetch profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;

      // Fetch roles
      const { data: roles, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, role');

      if (rolesError) throw rolesError;

      // Fetch enrollments with club names
      const { data: enrollments, error: enrollmentsError } = await supabase
        .from('enrollments')
        .select('user_id, club_id, clubs(id, name)');

      if (enrollmentsError) throw enrollmentsError;

      // Fetch player stats
      const { data: stats, error: statsError } = await supabase
        .from('player_stats')
        .select('user_id, current_streak, xp, total_logs, total_training_min');

      if (statsError) throw statsError;

      // Build lookup maps
      const rolesMap = new Map<string, UserRole>();
      roles?.forEach((r) => {
        rolesMap.set(r.user_id, r.role as UserRole);
      });

      const enrollmentMap = new Map<string, { clubId: string; clubName: string }>();
      enrollments?.forEach((e: any) => {
        if (!enrollmentMap.has(e.user_id) && e.clubs) {
          enrollmentMap.set(e.user_id, {
            clubId: e.club_id,
            clubName: e.clubs.name,
          });
        }
      });

      const statsMap = new Map<string, {
        currentStreak: number;
        totalXP: number;
        totalLogs: number;
        totalTrainingMin: number;
      }>();
      stats?.forEach((s) => {
        statsMap.set(s.user_id, {
          currentStreak: s.current_streak,
          totalXP: s.xp,
          totalLogs: s.total_logs,
          totalTrainingMin: s.total_training_min,
        });
      });

      // Combine into User objects
      const combinedUsers: User[] = (profiles || []).map((p) => {
        const role = rolesMap.get(p.id) || 'player';
        const enrollment = enrollmentMap.get(p.id);
        const playerStats = statsMap.get(p.id);

        return {
          id: p.id,
          email: p.email,
          fullName: p.full_name,
          phone: p.phone || undefined,
          avatar: p.avatar_url || undefined,
          role,
          clubId: enrollment?.clubId,
          clubName: enrollment?.clubName,
          status: p.status as UserStatus,
          emailVerified: true, // profiles are created after email confirm via trigger
          createdAt: new Date(p.created_at),
          lastLoginAt: undefined, // not available from client-side
          metrics: playerStats
            ? {
                totalSessions: playerStats.totalLogs,
                activeDays: playerStats.totalTrainingMin,
                currentStreak: playerStats.currentStreak,
                totalXP: playerStats.totalXP,
              }
            : undefined,
        };
      });

      setUsers(combinedUsers);
    } catch (err) {
      console.error('Error fetching users:', err);
      toast.error('Error al cargar usuarios');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch clubs
  const fetchClubs = useCallback(async () => {
    const { data, error } = await supabase
      .from('clubs')
      .select('id, name')
      .eq('is_active', true)
      .order('name');

    if (!error && data) {
      setClubs(data);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
    fetchClubs();
  }, [fetchUsers, fetchClubs]);

  // Filter users
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        if (
          !user.fullName.toLowerCase().includes(searchLower) &&
          !user.email.toLowerCase().includes(searchLower)
        ) {
          return false;
        }
      }

      if (filters.role !== 'all' && user.role !== filters.role) return false;
      if (filters.status !== 'all' && user.status !== filters.status) return false;

      if (filters.club !== 'all') {
        if (filters.club === 'none' && user.clubId) return false;
        if (filters.club !== 'none' && user.clubId !== filters.club) return false;
      }

      if (filters.dateFilter !== 'all') {
        const now = new Date();
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

        switch (filters.dateFilter) {
          case 'this_week':
            if (user.createdAt < weekAgo) return false;
            break;
          case 'this_month':
            if (user.createdAt < monthAgo) return false;
            break;
          case 'inactive_30':
            if (user.status === 'active') return false;
            break;
        }
      }

      return true;
    });
  }, [users, filters]);

  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredUsers.slice(start, start + itemsPerPage);
  }, [filteredUsers, currentPage]);

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  const stats = useMemo(() => {
    const total = users.length;
    const active = users.filter((u) => u.status === 'active').length;
    const inactive = users.filter((u) => u.status === 'inactive').length;
    const pending = users.filter((u) => u.status === 'pending').length;

    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const newThisWeek = users.filter((u) => u.createdAt > weekAgo).length;

    const roleDistribution = {
      player: users.filter((u) => u.role === 'player').length,
      family: users.filter((u) => u.role === 'parent').length,
      coach: users.filter((u) => u.role === 'coach').length,
      other: users.filter(
        (u) => !['player', 'parent', 'coach'].includes(u.role)
      ).length,
    };

    return { total, active, inactive, pending, newThisWeek, roleDistribution };
  }, [users]);

  const updateFilter = useCallback((key: keyof UserFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(defaultFilters);
    setCurrentPage(1);
  }, []);

  const toggleUserSelection = useCallback((userId: string) => {
    setSelectedUsers((prev) => {
      const next = new Set(prev);
      if (next.has(userId)) next.delete(userId);
      else next.add(userId);
      return next;
    });
  }, []);

  const selectAllVisible = useCallback(() => {
    setSelectedUsers(new Set(paginatedUsers.map((u) => u.id)));
  }, [paginatedUsers]);

  const clearSelection = useCallback(() => {
    setSelectedUsers(new Set());
  }, []);

  // CREATE USER via edge function
  const createUser = useCallback(
    async (userData: {
      fullName: string;
      email: string;
      phone?: string;
      role: UserRole;
      clubId?: string;
      status?: string;
    }) => {
      try {
        const { data, error } = await supabase.functions.invoke(
          'admin-manage-user',
          {
            body: {
              action: 'create',
              email: userData.email,
              fullName: userData.fullName,
              phone: userData.phone,
              role: userData.role,
              clubId: userData.clubId,
              status: userData.status || 'active',
            },
          }
        );

        if (error) throw error;
        if (data?.error) throw new Error(data.error);

        await fetchUsers();
        return data;
      } catch (err) {
        console.error('Error creating user:', err);
        toast.error('Error al crear usuario');
        throw err;
      }
    },
    [fetchUsers]
  );

  // UPDATE USER profile + role + enrollment
  const updateUser = useCallback(
    async (userId: string, updates: Partial<User>) => {
      try {
        // Update profile
        const profileUpdates: Record<string, unknown> = {};
        if (updates.fullName !== undefined) profileUpdates.full_name = updates.fullName;
        if (updates.email !== undefined) profileUpdates.email = updates.email;
        if (updates.phone !== undefined) profileUpdates.phone = updates.phone || null;
        if (updates.status !== undefined) profileUpdates.status = updates.status;

        if (Object.keys(profileUpdates).length > 0) {
          const { error } = await supabase
            .from('profiles')
            .update(profileUpdates)
            .eq('id', userId);
          if (error) throw error;
        }

        // Update role if changed
        if (updates.role) {
          const { error } = await supabase
            .from('user_roles')
            .update({ role: updates.role })
            .eq('user_id', userId);
          if (error) throw error;
        }

        // Update club enrollment if changed
        if (updates.clubId !== undefined) {
          // Remove existing enrollments
          await supabase
            .from('enrollments')
            .delete()
            .eq('user_id', userId);

          // Add new enrollment if clubId provided
          if (updates.clubId) {
            const role = updates.role || users.find((u) => u.id === userId)?.role || 'player';
            await supabase.from('enrollments').insert({
              user_id: userId,
              club_id: updates.clubId,
              role,
              status: 'active' as const,
            });
          }
        }

        await fetchUsers();
      } catch (err) {
        console.error('Error updating user:', err);
        toast.error('Error al actualizar usuario');
        throw err;
      }
    },
    [fetchUsers, users]
  );

  // DELETE USER via edge function
  const deleteUser = useCallback(
    async (userId: string) => {
      try {
        const { data, error } = await supabase.functions.invoke(
          'admin-manage-user',
          { body: { action: 'delete', userId } }
        );

        if (error) throw error;
        if (data?.error) throw new Error(data.error);

        setUsers((prev) => prev.filter((u) => u.id !== userId));
        setSelectedUsers((prev) => {
          const next = new Set(prev);
          next.delete(userId);
          return next;
        });
      } catch (err) {
        console.error('Error deleting user:', err);
        toast.error('Error al eliminar usuario');
        throw err;
      }
    },
    []
  );

  const deleteUsers = useCallback(
    async (userIds: string[]) => {
      for (const id of userIds) {
        await deleteUser(id);
      }
      setSelectedUsers(new Set());
    },
    [deleteUser]
  );

  // TOGGLE STATUS
  const toggleUserStatus = useCallback(
    async (userId: string) => {
      const user = users.find((u) => u.id === userId);
      if (!user) return;

      const newStatus: UserStatus = user.status === 'active' ? 'inactive' : 'active';

      const { error } = await supabase
        .from('profiles')
        .update({ status: newStatus })
        .eq('id', userId);

      if (error) {
        toast.error('Error al cambiar estado');
        return;
      }

      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, status: newStatus } : u))
      );
    },
    [users]
  );

  const bulkUpdateStatus = useCallback(
    async (userIds: string[], status: UserStatus) => {
      const { error } = await supabase
        .from('profiles')
        .update({ status })
        .in('id', userIds);

      if (error) {
        toast.error('Error al actualizar estados');
        return;
      }

      setUsers((prev) =>
        prev.map((u) => (userIds.includes(u.id) ? { ...u, status } : u))
      );
      setSelectedUsers(new Set());
    },
    []
  );

  const bulkAssignClub = useCallback(
    async (userIds: string[], clubId: string, clubName: string) => {
      // Remove existing enrollments for these users
      await supabase.from('enrollments').delete().in('user_id', userIds);

      // Insert new enrollments
      const inserts = userIds.map((userId) => {
        const user = users.find((u) => u.id === userId);
        return {
          user_id: userId,
          club_id: clubId,
          role: (user?.role || 'player') as any,
          status: 'active' as const,
        };
      });

      const { error } = await supabase.from('enrollments').insert(inserts);

      if (error) {
        toast.error('Error al asignar club');
        return;
      }

      setUsers((prev) =>
        prev.map((u) =>
          userIds.includes(u.id) ? { ...u, clubId, clubName } : u
        )
      );
      setSelectedUsers(new Set());
    },
    [users]
  );

  const changeUserRole = useCallback(
    async (userId: string, role: UserRole) => {
      const { error } = await supabase
        .from('user_roles')
        .update({ role })
        .eq('user_id', userId);

      if (error) {
        toast.error('Error al cambiar rol');
        return;
      }

      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role } : u))
      );
    },
    []
  );

  // RESET PASSWORD via edge function
  const resetPassword = useCallback(async (email: string) => {
    try {
      const { data, error } = await supabase.functions.invoke(
        'admin-manage-user',
        { body: { action: 'reset_password', email } }
      );
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
    } catch (err) {
      console.error('Error resetting password:', err);
      toast.error('Error al resetear contraseña');
      throw err;
    }
  }, []);

  // GET USER ACTIVITIES from daily_logs and ai_messages
  const getUserActivities = useCallback(
    async (userId: string) => {
      const { data: logs } = await supabase
        .from('daily_logs')
        .select('id, created_at, mood')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(10);

      const activities = (logs || []).map((log) => ({
        id: log.id,
        userId,
        action: `Registro diario${log.mood ? ` (${log.mood})` : ''}`,
        timestamp: new Date(log.created_at),
      }));

      return activities;
    },
    []
  );

  return {
    users: paginatedUsers,
    allUsers: users,
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
    deleteUsers,
    toggleUserStatus,
    bulkUpdateStatus,
    bulkAssignClub,
    changeUserRole,
    resetPassword,
    refetch: fetchUsers,
  };
}
