import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ChevronDownIcon, Loader } from "lucide-react";

import AthleteStatsList from "@/features/stats/components/AthleteStatsList";
import CreateAthleteStat from "@/features/stats/components/CreateAthleteStat";
import AthleteStatChart from "@/features/stats/components/AthleteStatChart";
import AthleteStatRadial from "@/features/stats/components/AthleteStatRadar";
import AthleteStatTable from "@/features/stats/components/AthleteStatTable";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import type { DateRange } from "react-day-picker";
import {
  type AthleteStatResponse,
  type Stat,
} from "../features/stats/types/Stat";
import { getAthleteWithStats } from "@/features/stats/api/statsApi";

type AthleteStatsParams = {
  athleteId: string;
};

const AthleteStats = () => {
  const { athleteId } = useParams<AthleteStatsParams>();

  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<DateRange | undefined>();

  const {
    data: { athlete, stats },
    isLoading,
    isFetching,
    error,
  } = useQuery<AthleteStatResponse>({
    queryKey: ["stats", athleteId],
    queryFn: () => getAthleteWithStats(athleteId!),
    enabled: !!athleteId,
    initialData: {
      athlete: {
        id: "",
        name: "",
        age: 0,
        height: 0,
      },
      stats: [],
    },
  });

  const filteredStats = useMemo<Stat[]>(() => {
    if (stats && !date) {
      return stats;
    } else {
      return stats.filter((stat) => {
        if (date && date.from && date.to) {
          const recordedAt = new Date(stat.recordedAt);
          return recordedAt >= date.from && recordedAt <= date.to;
        }
      });
    }
  }, [date, stats]);

  if (isFetching && athlete.name == "")
    return <Loader className="animate-spin" />;
  if (isLoading) return <Loader className="animate-spin" />;
  if (error) return <p>Error: No athlete exists {error.message}</p>;
  if (!athleteId) return <p>Error: No athlete exists</p>;
  if (stats.length == 0)
    return (
      <div className="flex flex-col gap-6 w-full max-w-6xl py-3">
        <div className="card-container w-full grid sm:grid-cols-2">
          <div className="px-2 flex flex-col">
            <h1>{athlete.name}</h1>
            <p className="text-foreground/80">Age: {athlete.age}</p>
            <p className="text-foreground/80">Height: {athlete.height} cm</p>
          </div>
          <AthleteStatRadial stats={filteredStats} />
        </div>
        <CreateAthleteStat
          athleteId={athleteId}
          athlete={athlete}
        ></CreateAthleteStat>
        <p>No Stats</p>
      </div>
    );

  return (
    <>
      <div className="w-full max-w-6xl ">
        <div className="flex flex-col gap-6 w-full max-w-6xl py-3">
          <div className="card-container w-full grid sm:grid-cols-2">
            <div className="px-2 flex flex-col">
              <h1>{athlete.name}</h1>
              <p className="text-foreground/80">Age: {athlete.age}</p>
              <p className="text-foreground/80">Height: {athlete.height} cm</p>
            </div>
            <AthleteStatRadial stats={filteredStats} />
          </div>
          <CreateAthleteStat
            athleteId={athleteId!}
            athlete={athlete}
          ></CreateAthleteStat>

          <div className="card-container w-full flex flex-col gap-4">
            <h3>Select Date Range</h3>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  id="date"
                  className="w-56 justify-between font-normal"
                >
                  {date && date.from && date.to
                    ? `${date.from.toLocaleDateString()} - ${date.to.toLocaleDateString()}`
                    : "Select date"}
                  <ChevronDownIcon />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-auto overflow-hidden p-0"
                align="start"
              >
                <Calendar
                  mode="range"
                  selected={date}
                  captionLayout="dropdown"
                  onSelect={(date) => {
                    setDate(date);
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>

          <AthleteStatChart stats={filteredStats} />
          <AthleteStatTable stats={filteredStats} />
          <AthleteStatsList stats={filteredStats} athleteId={athleteId} />
        </div>
      </div>
    </>
  );
};

export default AthleteStats;
