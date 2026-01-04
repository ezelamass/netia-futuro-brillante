import { useState, useMemo, useCallback } from 'react';
import { User, UserFilters, UserRole, UserStatus } from '@/types/user';
import { mockUsers, mockClubs, getUserActivities } from '@/data/mockUsers';

const defaultFilters: UserFilters = {
  search: '',
  role: 'all',
  status: 'all',
  club: 'all',
  dateFilter: 'all',
};

export function useUsers() {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [filters, setFilters] = useState<UserFilters>(defaultFilters);
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        if (
          !user.fullName.toLowerCase().includes(searchLower) &&
          !user.email.toLowerCase().includes(searchLower)
        ) {
          return false;
        }
      }

      // Role filter
      if (filters.role !== 'all' && user.role !== filters.role) {
        return false;
      }

      // Status filter
      if (filters.status !== 'all' && user.status !== filters.status) {
        return false;
      }

      // Club filter
      if (filters.club !== 'all') {
        if (filters.club === 'none' && user.clubId) return false;
        if (filters.club !== 'none' && user.clubId !== filters.club) return false;
      }

      // Date filter
      if (filters.dateFilter !== 'all') {
        const now = new Date();
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

        switch (filters.dateFilter) {
          case 'this_week':
            if (user.createdAt < weekAgo) return false;
            break;
          case 'this_month':
            if (user.createdAt < monthAgo) return false;
            break;
          case 'inactive_30':
            if (user.lastLoginAt && user.lastLoginAt > thirtyDaysAgo) return false;
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
    const active = users.filter(u => u.status === 'active').length;
    const inactive = users.filter(u => u.status === 'inactive').length;
    const pending = users.filter(u => u.status === 'pending').length;
    
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const newThisWeek = users.filter(u => u.createdAt > weekAgo).length;

    const roleDistribution = {
      player: users.filter(u => u.role === 'player').length,
      family: users.filter(u => u.role === 'family').length,
      coach: users.filter(u => u.role === 'coach').length,
      other: users.filter(u => !['player', 'family', 'coach'].includes(u.role)).length,
    };

    return { total, active, inactive, pending, newThisWeek, roleDistribution };
  }, [users]);

  const updateFilter = useCallback((key: keyof UserFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(defaultFilters);
    setCurrentPage(1);
  }, []);

  const toggleUserSelection = useCallback((userId: string) => {
    setSelectedUsers(prev => {
      const next = new Set(prev);
      if (next.has(userId)) {
        next.delete(userId);
      } else {
        next.add(userId);
      }
      return next;
    });
  }, []);

  const selectAllVisible = useCallback(() => {
    setSelectedUsers(new Set(paginatedUsers.map(u => u.id)));
  }, [paginatedUsers]);

  const clearSelection = useCallback(() => {
    setSelectedUsers(new Set());
  }, []);

  const createUser = useCallback((userData: Omit<User, 'id' | 'createdAt' | 'emailVerified'>) => {
    const newUser: User = {
      ...userData,
      id: `usr_${Date.now()}`,
      createdAt: new Date(),
      emailVerified: false,
    };
    setUsers(prev => [newUser, ...prev]);
    return newUser;
  }, []);

  const updateUser = useCallback((userId: string, updates: Partial<User>) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, ...updates } : u));
  }, []);

  const deleteUser = useCallback((userId: string) => {
    setUsers(prev => prev.filter(u => u.id !== userId));
    setSelectedUsers(prev => {
      const next = new Set(prev);
      next.delete(userId);
      return next;
    });
  }, []);

  const deleteUsers = useCallback((userIds: string[]) => {
    setUsers(prev => prev.filter(u => !userIds.includes(u.id)));
    setSelectedUsers(new Set());
  }, []);

  const toggleUserStatus = useCallback((userId: string) => {
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        return { ...u, status: u.status === 'active' ? 'inactive' : 'active' as UserStatus };
      }
      return u;
    }));
  }, []);

  const bulkUpdateStatus = useCallback((userIds: string[], status: UserStatus) => {
    setUsers(prev => prev.map(u => userIds.includes(u.id) ? { ...u, status } : u));
    setSelectedUsers(new Set());
  }, []);

  const bulkAssignClub = useCallback((userIds: string[], clubId: string, clubName: string) => {
    setUsers(prev => prev.map(u => userIds.includes(u.id) ? { ...u, clubId, clubName } : u));
    setSelectedUsers(new Set());
  }, []);

  const changeUserRole = useCallback((userId: string, role: UserRole) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, role } : u));
  }, []);

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
    clubs: mockClubs,
    getUserActivities,
    createUser,
    updateUser,
    deleteUser,
    deleteUsers,
    toggleUserStatus,
    bulkUpdateStatus,
    bulkAssignClub,
    changeUserRole,
  };
}
