import { useState } from 'react';
import { AppLayout } from '@/layouts/AppLayout';
import { Button } from '@/components/ui/button';
import { UserPlus, AlertCircle } from 'lucide-react';
import { useRoster } from '@/hooks/useRoster';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  GroupSummary,
  RosterFiltersBar,
  PlayerCard,
  RosterTable,
  PlayerDetailPanel,
  InvitePlayerModal,
} from '@/components/club/roster';

const Roster = () => {
  const isMobile = useIsMobile();
  const {
    players,
    filters,
    setFilters,
    sort,
    setSort,
    selectedPlayer,
    setSelectedPlayer,
    summary,
    addCoachNote,
    sports,
  } = useRoster();

  const [showInviteModal, setShowInviteModal] = useState(false);

  // Add trafficLight to selected player if not present
  const selectedPlayerWithStatus = selectedPlayer 
    ? players.find(p => p.id === selectedPlayer.id) || null
    : null;

  return (
    <AppLayout>
      <div className="flex h-full">
        {/* Main content */}
        <div className="flex-1 space-y-6 overflow-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Mis Jugadores</h1>
              <p className="text-muted-foreground">
                {summary.total} jugadores activos · {summary.redCount} alertas
              </p>
            </div>
            <Button onClick={() => setShowInviteModal(true)}>
              <UserPlus className="h-4 w-4 mr-2" />
              Invitar
            </Button>
          </div>

          {/* Summary */}
          <GroupSummary {...summary} />

          {/* Filters */}
          <RosterFiltersBar
            filters={filters}
            setFilters={setFilters}
            sort={sort}
            setSort={setSort}
            sports={sports}
          />

          {/* Player list */}
          {isMobile ? (
            <div className="space-y-3">
              {players.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <AlertCircle className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No se encontraron jugadores</p>
                </div>
              ) : (
                players.map((player) => (
                  <PlayerCard
                    key={player.id}
                    player={player}
                    onClick={() => setSelectedPlayer(player)}
                  />
                ))
              )}
            </div>
          ) : (
            <RosterTable
              players={players}
              onSelectPlayer={setSelectedPlayer}
            />
          )}
        </div>

        {/* Detail panel - desktop */}
        {!isMobile && selectedPlayerWithStatus && (
          <PlayerDetailPanel
            player={selectedPlayerWithStatus}
            onClose={() => setSelectedPlayer(null)}
            onAddNote={addCoachNote}
          />
        )}

        {/* Detail panel - mobile */}
        {isMobile && (
          <PlayerDetailPanel
            player={selectedPlayerWithStatus}
            onClose={() => setSelectedPlayer(null)}
            onAddNote={addCoachNote}
            isMobile
          />
        )}

        {/* Invite modal */}
        <InvitePlayerModal
          open={showInviteModal}
          onClose={() => setShowInviteModal(false)}
        />
      </div>
    </AppLayout>
  );
};

export default Roster;
