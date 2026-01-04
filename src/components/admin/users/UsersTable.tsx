import { User } from '@/types/user';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { UserRow } from './UserRow';

interface UsersTableProps {
  users: User[];
  selectedUsers: Set<string>;
  onToggleSelect: (userId: string) => void;
  onSelectAll: () => void;
  onView: (user: User) => void;
  onEdit: (user: User) => void;
  onChangeRole: (user: User) => void;
  onAssignClub: (user: User) => void;
  onToggleStatus: (user: User) => void;
  onResetPassword: (user: User) => void;
  onDelete: (user: User) => void;
}

export function UsersTable({
  users,
  selectedUsers,
  onToggleSelect,
  onSelectAll,
  onView,
  onEdit,
  onChangeRole,
  onAssignClub,
  onToggleStatus,
  onResetPassword,
  onDelete,
}: UsersTableProps) {
  const allSelected = users.length > 0 && users.every((u) => selectedUsers.has(u.id));
  const someSelected = users.some((u) => selectedUsers.has(u.id)) && !allSelected;

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <Checkbox
                checked={allSelected}
                ref={(el) => {
                  if (el) {
                    (el as HTMLButtonElement & { indeterminate: boolean }).indeterminate = someSelected;
                  }
                }}
                onCheckedChange={onSelectAll}
              />
            </TableHead>
            <TableHead>Usuario</TableHead>
            <TableHead>Rol</TableHead>
            <TableHead className="hidden md:table-cell">Club</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <UserRow
              key={user.id}
              user={user}
              isSelected={selectedUsers.has(user.id)}
              onToggleSelect={onToggleSelect}
              onView={onView}
              onEdit={onEdit}
              onChangeRole={onChangeRole}
              onAssignClub={onAssignClub}
              onToggleStatus={onToggleStatus}
              onResetPassword={onResetPassword}
              onDelete={onDelete}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
