import { useState } from "react";
import { useParams } from "react-router-dom";
import * as sportsDataService from "@/services/sportsDataService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ChevronDownIcon, Loader } from "lucide-react";
import {
  initialStatForm,
  type AthleteStatResponse,
  type StatCategory,
  type StatFieldKey,
  type StatForm,
} from "@/types/Stat";
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
import useConfirmBlank from "@/hooks/useConfirmBlank";

const AthleteStats = () => {
  const { athleteId } = useParams<{ athleteId: string }>();

  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<DateRange | undefined>();
  const [form, setForm] = useState<StatForm>(initialStatForm);

  const { confirm, ConfirmDialog, changeAlertAthleteName } = useConfirmBlank();

  const queryClient = useQueryClient();

  const {
    data: res,
    isLoading,
    error,
  } = useQuery<AthleteStatResponse>({
    queryKey: ["stats", athleteId],
    queryFn: () => sportsDataService.getStats(athleteId!),
    enabled: !!athleteId,
  });

  const {
    isPending,
    error: statError,
    mutate,
  } = useMutation({
    mutationFn: sportsDataService.createStat,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["stats"] });
      setForm(initialStatForm);
    },
  });

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

  const handleChange = <C extends StatCategory, K extends StatFieldKey<C>>(
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
    if (res?.athlete && athleteId && form === initialStatForm) {
      changeAlertAthleteName(res.athlete.name);
      const shouldContinue = await confirm();
      // this async await means that the method handle submit will wait for confirm() to finish
      // go read confirm
      if (!shouldContinue) return;
      mutate({ athleteId, form: form, date: form.recordedAt });
    }
  };

  const filteredStats = res
    ? res.stats.filter((stat) => {
        if (date && date.from && date.to) {
          const recordedAt = new Date(stat.recordedAt);
          return recordedAt >= date?.from && recordedAt <= date?.to;
        }
      })
    : undefined;

  if (isLoading) return <Loader className="animate-spin" />;
  if (error) return <p>Error: No athlete exists {error.message}</p>;

  return (
    <>
      {res && (
        <div className="w-full max-w-6xl ">
          <ConfirmDialog />
          {res.stats.length > 0 ? (
            <div className="flex flex-col gap-6 w-full max-w-6xl py-3">
              <div className="card-container w-full grid sm:grid-cols-2">
                <div className="px-2 flex flex-col">
                  <h1>{res.athlete.name}</h1>
                  <p className="text-foreground/80">Age: {res.athlete.age}</p>
                  <p className="text-foreground/80">
                    Height: {res.athlete.height} cm
                  </p>
                </div>
                <AthleteStatRadial
                  stats={
                    filteredStats && filteredStats.length > 0
                      ? filteredStats
                      : res?.stats!
                  }
                />
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
                      className="w-56 justify-between font-normal"
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
            <div className="flex flex-col gap-6 w-full max-w-6xl py-3">
              <div className="card-container w-full grid sm:grid-cols-2">
                <div className="px-2 flex flex-col">
                  <h1>{res.athlete.name}</h1>
                  <p className="text-foreground/80">Age: {res.athlete.age}</p>
                  <p className="text-foreground/80">
                    Height: {res.athlete.height} cm
                  </p>
                </div>
                <AthleteStatRadial
                  stats={
                    filteredStats && filteredStats.length > 0
                      ? filteredStats
                      : res?.stats!
                  }
                />
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
          )}
        </div>
      )}
    </>
  );
};

export default AthleteStats;
