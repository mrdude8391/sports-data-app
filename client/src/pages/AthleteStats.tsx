import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import * as sportsDataService from "@/services/sportsDataService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
import useConfirmBlank from "@/features/stats/hooks/useConfirmBlankStatForm";
import {
  type StatForm,
  DEFAULT_STAT_FORM,
  type AthleteStatResponse,
  type Stat,
  type StatCategory,
  type StatLabel,
  type NewStatPayload,
} from "../features/stats/types/Stat";

type AthleteStatsParams = {
  athleteId: string;
};

const AthleteStats = () => {
  const { athleteId } = useParams<AthleteStatsParams>();

  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<DateRange | undefined>();
  const [form, setForm] = useState<StatForm>(DEFAULT_STAT_FORM);

  const { confirm, ConfirmDialog, changeAlertAthleteName } = useConfirmBlank();

  const queryClient = useQueryClient();

  const {
    data: { athlete, stats },
    isLoading,
    isFetching,
    error,
  } = useQuery<AthleteStatResponse>({
    queryKey: ["stats", athleteId],
    queryFn: () => sportsDataService.getAthleteWithStats(athleteId!),
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

  const {
    isPending,
    error: statError,
    mutate,
  } = useMutation({
    mutationFn: sportsDataService.createStat,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["stats", athleteId] });
      setForm(DEFAULT_STAT_FORM);
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

  const handleChangeDate = (date: Date) => {
    const now = new Date();
    const merged = new Date(date!);
    merged.setHours(
      now.getHours(),
      now.getMinutes(),
      now.getSeconds(),
      now.getMilliseconds(),
    );
    setForm((prev) => ({ ...prev, recordedAt: merged }));
  };

  const handleChange = <C extends StatCategory, K extends StatLabel["key"]>(
    category: C,
    key: K,
    value: number,
  ) => {
    setForm((prev) => {
      const updatedCategory = {
        ...prev[category],
        [key]: value,
      } as StatForm[C];

      // Auto-calculate hitting percentage
      if (
        (category === "attack" && key == "kills") ||
        key == "total" ||
        key == "errors"
      ) {
        const attack = updatedCategory as StatForm["attack"];
        const kills = key === "kills" ? value : attack.kills;
        const total = key === "total" ? value : attack.total;
        const errors = key === "errors" ? value : attack.errors;
        const percentage = total > 0 ? (kills - errors) / total : 0;
        attack.percentage = Math.round(percentage * 1000) / 1000;
      }

      // Auto-calculate serving percentage
      if (
        category === "serving" &&
        (key === "attempts" || key === "errors" || key === "ratingTotal")
      ) {
        const serving = updatedCategory as StatForm["serving"];
        const attempts = key === "attempts" ? value : serving.attempts;
        const errors = key === "errors" ? value : serving.errors;
        const ratingTotal = key === "ratingTotal" ? value : serving.ratingTotal;
        const percentage = attempts > 0 ? (attempts - errors) / attempts : 0;
        const rating = attempts > 0 ? ratingTotal / attempts : 0;

        serving.rating = Math.round(rating * 10) / 10;
        serving.percentage = Math.round(percentage * 1000) / 1000;
      }

      // Auto-calculate receiving rating
      if (
        category === "receiving" &&
        (key === "ratingTotal" || key === "attempts")
      ) {
        const receiving = updatedCategory as StatForm["receiving"];
        const attempts = key === "attempts" ? value : receiving.attempts;
        const ratingTotal =
          key === "ratingTotal" ? value : receiving.ratingTotal;
        const rating = attempts > 0 ? ratingTotal / attempts : 0;

        receiving.rating = Math.round(rating * 10) / 10;
      }

      // Auto-calculate defense rating
      if (
        category === "defense" &&
        (key === "ratingTotal" || key === "attempts")
      ) {
        const defense = updatedCategory as StatForm["defense"];
        const attempts = key === "attempts" ? value : defense.attempts;
        const ratingTotal = key === "ratingTotal" ? value : defense.ratingTotal;
        const rating = attempts > 0 ? ratingTotal / attempts : 0;

        defense.rating = Math.round(rating * 10) / 10;
      }

      return {
        ...prev,
        [category]: updatedCategory,
      };
    });
  };

  const handleSubmit = async () => {
    try {
      if (athlete && athleteId) {
        if (form === DEFAULT_STAT_FORM) {
          changeAlertAthleteName(athlete.name);
          const shouldContinue = await confirm();
          // this async await means that the method handle submit will wait for confirm() to finish
          // go read confirm
          if (!shouldContinue) return;
          const newStat: NewStatPayload = { athleteId, statForm: form };
          mutate(newStat);
        } else {
          // form != initial form (user changed the form)
          const newStat: NewStatPayload = { athleteId, statForm: form };
          mutate(newStat);
        }
      }
    } catch (error) {
      console.log("Athlete Stats", error);
    }
  };

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
          athleteId={athleteId!}
          form={form}
          isPending={isPending}
          handleSubmit={handleSubmit}
          statError={statError}
          handleChange={handleChange}
          handleChangeDate={handleChangeDate}
        ></CreateAthleteStat>
        <p>No Stats</p>
      </div>
    );

  return (
    <>
      <div className="w-full max-w-6xl ">
        <ConfirmDialog />
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
            form={form}
            isPending={isPending}
            handleSubmit={handleSubmit}
            statError={statError}
            handleChange={handleChange}
            handleChangeDate={handleChangeDate}
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
