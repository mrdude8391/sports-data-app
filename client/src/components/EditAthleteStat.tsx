import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as sportsDataService from "@/services/sportsDataService";
import { STAT_INDEX } from "@/constants";
import type { Stat, StatForm } from "@/types/Stat";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Alert, AlertTitle } from "./ui/alert";
import { AlertCircleIcon } from "lucide-react";
import * as React from "react";
import { ChevronDownIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const initialForm: StatForm = Object.fromEntries(
  STAT_INDEX.map(({ category, fields }) => [
    category,
    Object.fromEntries(fields.map((f) => [f.key, 0])),
  ])
);

interface EditAthleteStatProps {
  stat: Stat;
}

const EditAthleteStat = (props: EditAthleteStatProps) => {
  const { stat } = props;
  const { athleteId } = useParams<{ athleteId: string }>();

  const [form, setForm] = useState<StatForm>(initialForm);
  const [open, setOpen] = React.useState(false);
  const [date, setDate] = React.useState<Date | undefined>(new Date());

  const queryClient = useQueryClient();

  const { isPending, error, mutate } = useMutation({
    mutationFn: sportsDataService.createStat,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["stats"] });
    },
  });

  useEffect(() => {
    if (stat) {
      console.log(stat);
      const prevStats = Object.fromEntries(
        STAT_INDEX.map(({ category, fields }) => [
          category,
          Object.fromEntries(
            fields.map((f) => [f.key, (stat as any)[category][f.key]])
          ),
        ])
      );

      console.log(prevStats);
      setForm(prevStats);
    }
  }, []);

  const handleChange = (category: string, key: string, value: number) => {
    setForm((prev) => {
      const updatedCategory = {
        ...prev[category],
        [key]: value,
      };

      // Auto-calculate hitting percentage
      if (
        category === "attack" &&
        (key === "kills" || key === "total" || key === "errors")
      ) {
        const kills = key === "kills" ? value : updatedCategory.kills;
        const total = key === "total" ? value : updatedCategory.total;
        const errors = key === "errors" ? value : updatedCategory.errors;
        const percentage = total > 0 ? (kills - errors) / total : 0;
        updatedCategory.percentage = Math.round(percentage * 1000) / 1000;
      }

      // Auto-calculate serving percentage
      if (
        category === "serving" &&
        (key === "attempts" || key === "errors" || key === "ratingTotal")
      ) {
        const attempts = key === "attempts" ? value : updatedCategory.attempts;
        const errors = key === "errors" ? value : updatedCategory.errors;
        const ratingTotal =
          key === "ratingTotal" ? value : updatedCategory.ratingTotal;
        const percentage = attempts > 0 ? (attempts - errors) / attempts : 0;
        const rating = attempts > 0 ? ratingTotal / attempts : 0;

        updatedCategory.rating = Math.round(rating * 10) / 10;
        updatedCategory.percentage = Math.round(percentage * 1000) / 1000;
      }

      // Auto-calculate receiving rating
      if (
        category === "receiving" &&
        (key === "ratingTotal" || key === "attempts")
      ) {
        const attempts = key === "attempts" ? value : updatedCategory.attempts;
        const ratingTotal =
          key === "ratingTotal" ? value : updatedCategory.ratingTotal;
        const rating = attempts > 0 ? ratingTotal / attempts : 0;

        updatedCategory.rating = Math.round(rating * 10) / 10;
      }

      // Auto-calculate defense rating
      if (
        category === "defense" &&
        (key === "ratingTotal" || key === "attempts")
      ) {
        const attempts = key === "attempts" ? value : updatedCategory.attempts;
        const ratingTotal =
          key === "ratingTotal" ? value : updatedCategory.ratingTotal;
        const rating = attempts > 0 ? ratingTotal / attempts : 0;

        updatedCategory.rating = Math.round(rating * 10) / 10;
      }

      return {
        ...prev,
        [category]: updatedCategory,
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (athleteId && form != initialForm && date) {
      console.log(form, date);
      mutate({ athleteId, data: form, recordDate: date });
    }
  };

  if (isPending) return <div>pending</div>;
  return (
    <div>
      <Dialog>
        <form id="statForm" className="space-y-6" onSubmit={handleSubmit}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              Edit
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-11/12 flex flex-col overflow-hidden">
            <DialogHeader className="sticky">
              <DialogTitle>Create New Stats</DialogTitle>
              <DialogDescription>
                Add a new stats here. Click save when you&apos;re done.
              </DialogDescription>
            </DialogHeader>
            <div className="overflow-y-auto space-y-4 p-4">
              <div className="flex flex-col gap-3">
                <Label htmlFor="date" className="px-1">
                  Date
                </Label>
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      id="date"
                      className="w-48 justify-between font-normal"
                    >
                      {date ? date.toLocaleDateString() : "Select date"}
                      <ChevronDownIcon />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-auto overflow-hidden p-0"
                    align="start"
                  >
                    <Calendar
                      mode="single"
                      selected={date}
                      captionLayout="dropdown"
                      onSelect={(date) => {
                        const now = new Date();
                        const merged = new Date(date!);
                        merged.setHours(
                          now.getHours(),
                          now.getMinutes(),
                          now.getSeconds(),
                          now.getMilliseconds()
                        );

                        setDate(merged);
                        setOpen(false);
                      }}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              {STAT_INDEX.map(({ category, fields }) => (
                <fieldset key={category} className="border p-4 rounded-md ">
                  <legend className="font-bold capitalize">{category}</legend>

                  <div className="grid grid-cols-2 gap-4 mt-2">
                    {fields.map(({ key, label }) => (
                      <Label key={key} className="flex flex-col">
                        <span className="text-sm text-gray-700">{label}</span>
                        <Input
                          type="number"
                          value={form[category][key]}
                          onChange={(e) =>
                            handleChange(category, key, Number(e.target.value))
                          }
                          className="border rounded p-2"
                        />
                      </Label>
                    ))}
                  </div>
                </fieldset>
              ))}

              {/* <pre>{JSON.stringify(form, null, 2)}</pre> */}
            </div>

            {error && (
              <Alert
                variant="destructive"
                className="flex justify-between items-center"
              >
                <AlertCircleIcon />
                <AlertTitle className="text-center">{error.message}</AlertTitle>
              </Alert>
            )}
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit" form="statForm">
                Save New Stats
              </Button>
            </DialogFooter>
          </DialogContent>
        </form>
      </Dialog>
      <form></form>
    </div>
  );
};

export default EditAthleteStat;
