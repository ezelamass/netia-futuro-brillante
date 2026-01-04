import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { Trophy } from 'lucide-react';

type HealthStatus = 'green' | 'yellow' | 'red';

interface ClubMetric {
  id: string;
  name: string;
  users: number;
  sessionsPerWeek: number;
  healthStatus: HealthStatus;
}

interface TopClubsTableProps {
  data: ClubMetric[];
}

const HealthIndicator = ({ status }: { status: HealthStatus }) => {
  return (
    <div className={cn(
      "w-3 h-3 rounded-full",
      status === 'green' && "bg-emerald-500",
      status === 'yellow' && "bg-amber-500",
      status === 'red' && "bg-red-500"
    )} />
  );
};

export const TopClubsTable = ({ data }: TopClubsTableProps) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Trophy className="h-5 w-5 text-amber-500" />
          Top Clubes por Actividad
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">#</TableHead>
              <TableHead>Club</TableHead>
              <TableHead className="text-right">Usuarios</TableHead>
              <TableHead className="text-right">Ses/sem</TableHead>
              <TableHead className="text-center">Estado</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((club, index) => (
              <TableRow key={club.id}>
                <TableCell>
                  <span className={cn(
                    "font-bold",
                    index === 0 && "text-amber-500",
                    index === 1 && "text-slate-400",
                    index === 2 && "text-amber-700"
                  )}>
                    {index + 1}
                  </span>
                </TableCell>
                <TableCell className="font-medium">{club.name}</TableCell>
                <TableCell className="text-right">{club.users}</TableCell>
                <TableCell className="text-right">{club.sessionsPerWeek}</TableCell>
                <TableCell>
                  <div className="flex justify-center">
                    <HealthIndicator status={club.healthStatus} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
