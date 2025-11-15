import { AppLayout } from '@/layouts/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, Medal, Award } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const leaderboardData = [
  { rank: 1, name: 'Mateo García', points: 2450, streak: 15 },
  { rank: 2, name: 'Sofia Martínez', points: 2380, streak: 12 },
  { rank: 3, name: 'Lucas Rodríguez', points: 2290, streak: 10 },
  { rank: 4, name: 'Emma López', points: 2150, streak: 8 },
  { rank: 5, name: 'Diego Fernández', points: 2050, streak: 7 },
];

const Leaderboard = () => {
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Award className="w-6 h-6 text-amber-600" />;
      default:
        return <span className="w-6 h-6 flex items-center justify-center font-bold text-muted-foreground">{rank}</span>;
    }
  };

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-6 h-6" />
              Clasificación
            </CardTitle>
            <CardDescription>Los mejores deportistas de la semana</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {leaderboardData.map((athlete) => (
                <div
                  key={athlete.rank}
                  className="flex items-center gap-4 p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
                >
                  <div className="flex-shrink-0">
                    {getRankIcon(athlete.rank)}
                  </div>

                  <Avatar className="w-10 h-10">
                    <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white font-semibold">
                      {athlete.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1">
                    <p className="font-semibold">{athlete.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Racha: {athlete.streak} días
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-lg font-bold text-primary">{athlete.points}</p>
                    <p className="text-xs text-muted-foreground">puntos</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Leaderboard;
