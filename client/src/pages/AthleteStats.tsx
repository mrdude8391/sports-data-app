import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import * as sportsDataService from "@/services/sportsDataService";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ChevronDownIcon, Loader } from "lucide-react";
import type { AthleteStatResponse } from "@/types/Stat";
import AthleteStatsList from "@/components/AthleteStatsList";
import CreateAthleteStat from "@/components/CreateAthleteStat";
import AthleteStatChart from "@/components/AthleteStatChart";
import AthleteStatRadial from "@/components/AthleteStatRadar";
import AthleteStatTable from "@/components/AthleteStatTable";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import type { DateRange } from "react-day-picker";

const AthleteStats = () => {
  const { athleteId } = useParams<{ athleteId: string }>();

  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<DateRange | undefined>();

  const {
    data: res,
    isLoading,
    error,
  } = useQuery<AthleteStatResponse>({
    queryKey: ["stats", athleteId],
    queryFn: () => sportsDataService.getStats(athleteId!),
    enabled: !!athleteId,
  });
  const filteredStats = res
    ? res.stats.filter((stat) => {
        if (date && date.from && date.to) {
          const recordedAt = new Date(stat.recordedAt);
          return recordedAt >= date?.from && recordedAt <= date?.to;
        }
      })
    : undefined;

  if (isLoading) return <Loader className="animate-spin" />;
  if (error) return <p>{error.message}</p>;

  return (
    <>
      {res && res.stats.length > 0 ? (
        <div className="flex flex-col gap-6 w-full max-w-6xl py-3">
          <div className="card-container w-full">
            <h1>{res.athlete.name}</h1>
            <p>Age {res.athlete.age}</p>
            <p>Height {res.athlete.height}</p>
          </div>
          <AthleteStatRadial
            stats={
              filteredStats && filteredStats.length > 0
                ? filteredStats
                : res?.stats!
            }
          />

          <CreateAthleteStat />

          <div className="card-container w-full flex flex-col gap-4">
            <h3>Select Date Range</h3>
            {/* <p>
              Selected Date{" "}
              {date && date.from && date.to
                ? `${date.from.toLocaleDateString()}  ${date.to.toLocaleDateString()}`
                : ""}
            </p> */}
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  id="date"
                  className="w-48 justify-between font-normal"
                >
                  {date && date.from && date.to
                    ? `${date.from.toLocaleDateString()}  ${date.to.toLocaleDateString()}`
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

          <AthleteStatChart
            stats={
              filteredStats && filteredStats.length > 0
                ? filteredStats
                : res?.stats!
            }
          />
          <AthleteStatTable
            stats={
              filteredStats && filteredStats.length > 0
                ? filteredStats
                : res?.stats!
            }
          />
          <AthleteStatsList
            stats={
              filteredStats && filteredStats.length > 0
                ? filteredStats
                : res?.stats!
            }
          />
        </div>
      ) : (
        <div>
          <p>No Stats</p>
        </div>
      )}
    </>
  );
};

export default AthleteStats;
