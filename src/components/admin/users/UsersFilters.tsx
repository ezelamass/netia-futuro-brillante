import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, Download, X } from 'lucide-react';
import { UserFilters, ROLE_OPTIONS, STATUS_OPTIONS } from '@/types/user';

interface UsersFiltersProps {
  filters: UserFilters;
  clubs: { id: string; name: string }[];
  onFilterChange: (key: keyof UserFilters, value: string) => void;
  onReset: () => void;
  onExport: () => void;
}

export function UsersFilters({
  filters,
  clubs,
  onFilterChange,
  onReset,
  onExport,
}: UsersFiltersProps) {
  const hasActiveFilters = 
    filters.search !== '' ||
    filters.role !== 'all' ||
    filters.status !== 'all' ||
    filters.club !== 'all';

  return (
    <div className="flex flex-col md:flex-row gap-3 p-4 bg-muted/50 rounded-lg">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar usuario..."
          value={filters.search}
          onChange={(e) => onFilterChange('search', e.target.value)}
          className="pl-9"
        />
      </div>

      <Select value={filters.role} onValueChange={(v) => onFilterChange('role', v)}>
        <SelectTrigger className="w-full md:w-[160px]">
          <SelectValue placeholder="Rol" />
        </SelectTrigger>
        <SelectContent>
          {ROLE_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              <span className="flex items-center gap-2">
                <span>{option.icon}</span>
                <span>{option.label}</span>
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={filters.status} onValueChange={(v) => onFilterChange('status', v)}>
        <SelectTrigger className="w-full md:w-[150px]">
          <SelectValue placeholder="Estado" />
        </SelectTrigger>
        <SelectContent>
          {STATUS_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={filters.club} onValueChange={(v) => onFilterChange('club', v)}>
        <SelectTrigger className="w-full md:w-[180px]">
          <SelectValue placeholder="Club" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos los clubes</SelectItem>
          <SelectItem value="none">Sin club asignado</SelectItem>
          {clubs.map((club) => (
            <SelectItem key={club.id} value={club.id}>
              {club.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="flex gap-2">
        {hasActiveFilters && (
          <Button variant="ghost" size="icon" onClick={onReset}>
            <X className="h-4 w-4" />
          </Button>
        )}
        <Button variant="outline" onClick={onExport} className="gap-2">
          <Download className="h-4 w-4" />
          <span className="hidden sm:inline">Exportar</span>
        </Button>
      </div>
    </div>
  );
}
