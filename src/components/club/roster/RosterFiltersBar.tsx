import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import { RosterFilters, RosterSort, CATEGORY_OPTIONS, STATUS_OPTIONS, RosterSortField } from '@/types/player';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface RosterFiltersBarProps {
  filters: RosterFilters;
  setFilters: (filters: RosterFilters) => void;
  sort: RosterSort;
  setSort: (sort: RosterSort) => void;
  sports: string[];
}

const SORT_OPTIONS: { value: RosterSortField; label: string }[] = [
  { value: 'status', label: 'Por estado' },
  { value: 'name', label: 'Alfabético' },
  { value: 'lastSession', label: 'Última actividad' },
  { value: 'age', label: 'Por edad' },
];

export function RosterFiltersBar({ filters, setFilters, sort, setSort, sports }: RosterFiltersBarProps) {
  return (
    <div className="flex flex-col md:flex-row gap-3">
      {/* Search */}
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar jugador..."
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          className="pl-9"
        />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {/* Category */}
        <Select
          value={filters.category}
          onValueChange={(value) => setFilters({ ...filters, category: value as any })}
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Categoría" />
          </SelectTrigger>
          <SelectContent>
            {CATEGORY_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Status */}
        <Select
          value={filters.status}
          onValueChange={(value) => setFilters({ ...filters, status: value as any })}
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Sort */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <ArrowUpDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {SORT_OPTIONS.map((opt) => (
              <DropdownMenuItem
                key={opt.value}
                onClick={() => setSort({ 
                  field: opt.value, 
                  direction: sort.field === opt.value && sort.direction === 'asc' ? 'desc' : 'asc' 
                })}
                className={sort.field === opt.value ? 'bg-accent' : ''}
              >
                {opt.label}
                {sort.field === opt.value && (
                  <span className="ml-auto">{sort.direction === 'asc' ? '↑' : '↓'}</span>
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
