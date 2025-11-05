import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as sportsDataService from "@/services/sportsDataService";
import { STAT_INDEX } from "@/constants";
import type { StatCategory, StatFieldKey, StatForm } from "@/types/Stat";
import { initialStatForm } from "@/types/Stat";
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

// const initialForm: StatForm = Object.fromEntries(
//   STAT_INDEX.map(({ category, fields }) => [
//     category,
//     Object.fromEntries(fields.map((f) => [f.key, 0])),
//   ])
// );

const CreateAthleteStat = () => {
  const { athleteId } = useParams<{ athleteId: string }>();

  const [form, setForm] = useState<StatForm>(initialStatForm);
  const [open, setOpen] = React.useState(false);

  const queryClient = useQueryClient();

  const { isPending, error, mutate } = useMutation({
    mutationFn: sportsDataService.createStat,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["stats"] });
      setForm(initialStatForm);
    },
  });

  const handleChange = <C extends StatCategory, K extends StatFieldKey<C>>(
    category: C,
    key: K,
    value: number
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (athleteId && form != initialStatForm) {
      mutate({ athleteId, form: form, date: form.recordedAt });
    }
  };

  if (isPending) return <div>pending</div>;
  return (
    <div>
      <Dialog>
        <form id="statForm" className="space-y-6" onSubmit={handleSubmit}>
          <DialogTrigger asChild>
            <Button variant="default" size="lg">
              Add New Game Stats
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-11/12 flex flex-col overflow-hidden ">
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
                      {form.recordedAt
                        ? form.recordedAt.toLocaleDateString()
                        : "Select date"}
                      <ChevronDownIcon />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-auto overflow-hidden p-0"
                    align="start"
                  >
                    <Calendar
                      mode="single"
                      selected={form.recordedAt}
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
                        setForm((prev) => ({ ...prev, recordedAt: merged }));
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
                        <span className="text-sm">{label}</span>
                        <Input
                          type="number"
                          value={
                            form[category as StatCategory][
                              key as StatFieldKey<StatCategory>
                            ]
                          }
                          onChange={(e) =>
                            handleChange(
                              category as StatCategory,
                              key as any,
                              Number(e.target.value)
                            )
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

export default CreateAthleteStat;
