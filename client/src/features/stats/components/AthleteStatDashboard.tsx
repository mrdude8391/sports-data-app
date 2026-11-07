import { useMemo, useState } from "react";
import type { Stat } from "../types/Stat";
import AthleteStatsList from "@/features/stats/components/AthleteStatsList";
import { ChevronDownIcon } from "lucide-react";
import AthleteStatChart from "@/features/stats/components/AthleteStatChart";
import AthleteStatTable from "@/features/stats/components/AthleteStatTable";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import type { DateRange } from "react-day-picker";
interface AthleteStatsDashboardProps {
  stats: Stat[];
  athleteId: string;
}

const AthleteStatDashboard = (props: AthleteStatsDashboardProps) => {
  const { stats, athleteId } = props;

  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<DateRange | undefined>();
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
  if (stats.length == 0)
    return (
      <>
        <div className="card-container w-full">
          <p>No stats to display.</p>
        </div>
      </>
    );
  return (
    <>
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
          <PopoverContent className="w-auto overflow-hidden p-0" align="start">
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
    </>
  );
};

export default AthleteStatDashboard;
