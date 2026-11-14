import { Loader } from "lucide-react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import AthleteStatRadial from "@/features/stats/components/AthleteStatRadar";
import StatDialog from "@/features/stats/components/StatDialog";
import { useAthleteStats } from "../hooks/useAthleteStats";
import { useCreateStat } from "../hooks/useCreateStat";
import useConfirmBlankStatForm from "../hooks/useConfirmBlankStatForm";
import AthleteStatDashboard from "../components/AthleteStatDashboard";
import { type StatEvent, aggregateEvents } from "../config/statConfig";
import { createEmptyStatForm } from "../types/Stat";
import { withCurrentTime } from "@/lib/date";
import { logger } from "@/lib/logger";

type AthleteStatsParams = {
  athleteId: string;
};

const AthleteStats = () => {
  const { athleteId = "" } = useParams<AthleteStatsParams>();

  const {
    data: { athlete, stats },
    isLoading,
    isFetching,
    error,
  } = useAthleteStats({ athleteId });

  // ----- new stat entry -----
  const [dialogOpen, setDialogOpen] = useState(false);
  const [events, setEvents] = useState<StatEvent[]>([]);
  const [recordedAt, setRecordedAt] = useState<Date>(() => new Date());
  const { confirm, ConfirmDialog, changeAlertAthleteName } =
    useConfirmBlankStatForm();

  const resetForm = () => {
    setEvents([]);
    setRecordedAt(new Date());
    setDialogOpen(false);
  };

  const {
    isPending,
    error: createError,
    mutate,
  } = useCreateStat({ athleteId, resetForm });

  const handleSave = async () => {
    try {
      if (events.length === 0) {
        changeAlertAthleteName(athlete.name);
        const shouldContinue = await confirm();
        if (!shouldContinue) return;
      }
      mutate({
        athleteId,
        statForm: {
          ...createEmptyStatForm(),
          ...aggregateEvents(events),
          recordedAt,
        },
      });
    } catch (error) {
      logger.error("[AthleteStats.tsx::handleSave]", error);
    }
  };

  if (isFetching && athlete.name == "")
    return <Loader className="animate-spin" />;

  if (isLoading) return <Loader className="animate-spin" />;

  if (error) return <p>Error: No athlete exists {error.message}</p>;

  if (!athleteId) return <p>Error: No athlete exists</p>;

  return (
    <>
      <ConfirmDialog />
      <div className="w-full max-w-6xl ">
        <div className="flex flex-col gap-6 w-full max-w-6xl py-3">
          <div className="card-container w-full grid sm:grid-cols-2">
            <div className="px-2 flex flex-col">
              <h1>{athlete.name}</h1>
              <p className="text-foreground/80">Age: {athlete.age}</p>
              <p className="text-foreground/80">Height: {athlete.height} cm</p>
            </div>
            <AthleteStatRadial stats={stats} />
          </div>
          <div>
            <StatDialog
              athlete={athlete}
              trigger={
                <Button variant="default" size="lg">
                  Add New Game Stats
                </Button>
              }
              open={dialogOpen}
              onOpenChange={setDialogOpen}
              events={events}
              onEventsChange={setEvents}
              date={recordedAt}
              onDateChange={(date) => setRecordedAt(withCurrentTime(date))}
              onSave={handleSave}
              isPending={isPending}
              error={createError}
            />
          </div>
          <AthleteStatDashboard stats={stats} athleteId={athleteId} />
        </div>
      </div>
    </>
  );
};

export default AthleteStats;
