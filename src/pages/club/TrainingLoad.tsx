import { useState } from 'react';
import { AppLayout } from '@/layouts/AppLayout';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus } from 'lucide-react';
import { useTrainingSessions } from '@/hooks/useTrainingSessions';
import { CATEGORY_LABELS, CategoryType } from '@/types/training';
import {
  WeekNavigator,
  LoadSummaryCards,
  SessionsTable,
  LoadBarChart,
  AcuteChronicGauge,
  RegisterSessionModal,
} from '@/components/club/training';

const TrainingLoad = () => {
  const {
    sessions,
    weekLabel,
    goToPreviousWeek,
    goToNextWeek,
    goToCurrentWeek,
    categoryFilter,
    setCategoryFilter,
    weekSummary,
    loadByCategory,
    acRatio,
    addSession,
    categories,
  } = useTrainingSessions();

  const [showRegisterModal, setShowRegisterModal] = useState(false);

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Carga de Entrenamiento</h1>
            <p className="text-muted-foreground">
              Semana {weekLabel.weekNumber} · {weekLabel.month}
            </p>
          </div>
          <Button onClick={() => setShowRegisterModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Registrar
          </Button>
        </div>

        {/* Week Navigation & Filters */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <WeekNavigator
            weekNumber={weekLabel.weekNumber}
            month={weekLabel.month}
            range={weekLabel.range}
            onPrevious={goToPreviousWeek}
            onNext={goToNextWeek}
            onCurrent={goToCurrentWeek}
          />
          
          <Select 
            value={categoryFilter} 
            onValueChange={(value) => setCategoryFilter(value as CategoryType | 'all')}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Categoría" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las categorías</SelectItem>
              {categories.filter(c => c !== 'all').map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {CATEGORY_LABELS[cat as CategoryType] || cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Summary Cards */}
        <LoadSummaryCards {...weekSummary} />

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <LoadBarChart data={loadByCategory} />
          </div>
          <div>
            <AcuteChronicGauge {...acRatio} />
          </div>
        </div>

        {/* Sessions Table */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Sesiones de la Semana</h2>
          <SessionsTable sessions={sessions} />
        </div>

        {/* Register Modal */}
        <RegisterSessionModal
          open={showRegisterModal}
          onClose={() => setShowRegisterModal(false)}
          onSave={addSession}
        />
      </div>
    </AppLayout>
  );
};

export default TrainingLoad;
