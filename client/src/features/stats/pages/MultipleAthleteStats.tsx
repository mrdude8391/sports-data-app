import { DatePicker } from "@/components/DatePicker";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import type { Athlete } from "@/features/athletes/types/Athlete";
import { AlertCircleIcon, Loader } from "lucide-react";

import AthleteSelector from "../../athletes/components/MultipleAthleteSelector";
import StatDialog from "../components/StatDialog";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import useConfirmBlank from "@/features/stats/hooks/useConfirmBlankStatForm";
import { type NewStat, createEmptyStatForm } from "@/features/stats/types/Stat";
import {
  type StatEvent,
  aggregateEvents,
} from "@/features/stats/config/statConfig";
import { createStatsBatch } from "@/features/stats/api/statsApi";
import { logger } from "@/lib/logger";
import { withCurrentTime } from "@/lib/date";

const GameLog = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(() => new Date());
  const [selectedAthletes, setSelectedAthletes] = useState(new Set<Athlete>());
  // athleteId -> that athlete's taps. Totals are derived on submit.
  const [eventsByAthlete, setEventsByAthlete] = useState(
    new Map<string, StatEvent[]>(),
  );

  const { confirm, ConfirmDialog, changeAlertAthleteName } = useConfirmBlank();

  const queryClient = useQueryClient();

  const handleSelectAthlete = (athlete: Athlete) => {
    logger.debug(
      "[MultipleAthleteStats.tsx::handleSelectAthlete]\nSelected an athlete.",
      athlete,
    );
    if (selectedAthletes.has(athlete)) {
      setSelectedAthletes((prev) => {
        const next = new Set(prev);
        next.delete(athlete);
        return next;
      });
      setEventsByAthlete((prev) => {
        const next = new Map(prev);
        next.delete(athlete.id);
        return next;
      });
    } else {
      setSelectedAthletes((prev) => new Set(prev).add(athlete));
      setEventsByAthlete((prev) => new Map(prev).set(athlete.id, []));
    }
  };

  const setAthleteEvents = (athleteId: string, events: StatEvent[]) => {
    setEventsByAthlete((prev) => new Map(prev).set(athleteId, events));
  };

  const handleChangeDate = (date: Date) => {
    setSelectedDate(withCurrentTime(date));
  };

  const {
    isPending,
    error: statError,
    mutate,
  } = useMutation({
    mutationFn: createStatsBatch,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["statsBatch"] });
      setEventsByAthlete(new Map());
      setSelectedAthletes(new Set());
    },
  });

  const handleSubmit = async () => {
    if (selectedAthletes.size === 0) return;

    // Ask before saving any athlete with no taps recorded.
    for (const athlete of selectedAthletes) {
      const events = eventsByAthlete.get(athlete.id) ?? [];
      if (events.length === 0) {
        changeAlertAthleteName(athlete.name);
        const shouldContinue = await confirm();
        if (!shouldContinue) return;
      }
    }

    // Turn each athlete's taps into a stat form, all on the same game date.
    const forms = new Map<string, NewStat>();
    for (const athlete of selectedAthletes) {
      const events = eventsByAthlete.get(athlete.id) ?? [];
      forms.set(athlete.id, {
        ...createEmptyStatForm(),
        ...aggregateEvents(events),
        recordedAt: selectedDate,
      });
    }

    logger.info("[MultipleAthleteStats.tsx::handleSubmit]", { forms });
    mutate({ forms });
  };

  return (
    <div className="team-stats w-full sm:w-lg items-center">
      <ConfirmDialog />
      <div className="header w-full">
        <h1>Team Stats Entry</h1>
        <p>
          Enter stats for multiple team members at once. Select the date the
          game was played and the athletes that you would like to stat.
        </p>
      </div>

      <div className="team-stats-inner flex flex-col gap-4 mt-4">
        <div className="date-picker card-container">
          <h3 className="mb-2">Game Date</h3>
          <div>
            <DatePicker
              selectedDate={selectedDate}
              changeDate={handleChangeDate}
            />
          </div>
        </div>
        <div className="athlete-selector card-container flex flex-col gap-2">
          <h3>Player List</h3>
          <AthleteSelector
            selectedAthletes={selectedAthletes}
            handleSelectAthlete={handleSelectAthlete}
          />
          {selectedAthletes.size > 0 && (
            <div className="athlete-list mt-4">
              {isPending ? (
                <div className="flex gap-4">
                  <Loader className="animate-spin" />
                  Adding stats...
                </div>
              ) : (
                <ul className="flex flex-col gap-2">
                  {[...selectedAthletes].map((athlete) => {
                    const events = eventsByAthlete.get(athlete.id) ?? [];
                    return (
                      <li
                        className="flex gap-2 items-center w-full"
                        key={athlete.id}
                      >
                        <StatDialog
                          athlete={athlete}
                          trigger={
                            <Button
                              variant="secondary"
                              size="lg"
                              className="w-full justify-between rounded-lg"
                            >
                              <span className="text-wrap">{athlete.name}</span>
                              <span className="text-xs text-muted-foreground">
                                {events.length}{" "}
                                {events.length === 1 ? "stat" : "stats"}
                              </span>
                            </Button>
                          }
                          events={events}
                          onEventsChange={(next) =>
                            setAthleteEvents(athlete.id, next)
                          }
                        />
                      </li>
                    );
                  })}
                </ul>
              )}
              {statError && (
                <Alert variant="destructive" className="mt-4 flex justify-start">
                  <AlertCircleIcon />
                  <AlertTitle className="px-1">{statError.message}</AlertTitle>
                </Alert>
              )}
              <div className="submit flex justify-end mt-4">
                <Button onClick={handleSubmit} disabled={isPending}>
                  Submit All
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GameLog;
