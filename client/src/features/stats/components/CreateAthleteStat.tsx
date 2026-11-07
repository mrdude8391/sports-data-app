import { Button } from "../../../components/ui/button";
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
import { Alert, AlertTitle } from "../../../components/ui/alert";
import { AlertCircleIcon, Loader } from "lucide-react";

import {
  DEFAULT_STAT_FORM,
  type NewStat,
  type NewStatPayload,
  type StatCategory,
  type StatFieldKey,
  type StatFields,
} from "../types/Stat";
import { useState } from "react";
import type { Athlete } from "@/features/athletes/types/Athlete";
import useConfirmBlankStatForm from "../hooks/useConfirmBlankStatForm";
import { logger } from "@/lib/logger";
import { useCreateStat } from "../hooks/useCreateStat";
import StatForm from "./StatForm";

interface createAthleteStatProps {
  athleteId: string;
  athlete: Athlete;
}

const CreateAthleteStat = (props: createAthleteStatProps) => {
  const { athleteId, athlete } = props;

  const [form, setForm] = useState<NewStat>(DEFAULT_STAT_FORM);

  // custom hook to handle when a user tries to create a blank stat form
  const { confirm, ConfirmDialog, changeAlertAthleteName } =
    useConfirmBlankStatForm();

  const resetForm = () => {
    setForm(DEFAULT_STAT_FORM);
  };

  const { isPending, error, mutate } = useCreateStat({ athleteId, resetForm });

  const handleChangeDate = (date: Date | undefined) => {
    if (!date) return;
    // this logic imports the hours etc into the selected date, otherwise if creating old stats, they will all be at 0:0 time causing errors with sorting.
    const now = new Date();
    const merged = new Date(date);
    merged.setHours(
      now.getHours(),
      now.getMinutes(),
      now.getSeconds(),
      now.getMilliseconds(),
    );
    setForm((prev) => ({ ...prev, recordedAt: merged }));
  };

  const updateStatFormFieldsByCategory = <
    C extends StatCategory,
    K extends StatFieldKey<C>,
  >(
    category: C,
    key: K,
    prevForm: NewStat,
    value: number,
  ) => {
    const updatedCategory = {
      ...prevForm[category],
      [key]: value,
    } as StatFields<C>;

    switch (category) {
      case "attack": {
        // Auto-calculate hitting percentage
        const attack = updatedCategory as NewStat["attack"];
        const kills = key === "kills" ? value : attack.kills;
        const total = key === "total" ? value : attack.total;
        const errors = key === "errors" ? value : attack.errors;
        const percentage = total > 0 ? (kills - errors) / total : 0;
        attack.percentage = Math.round(percentage * 1000) / 1000;
        break;
      }
      case "serving": {
        // Auto-calculate serving percentage
        const serving = updatedCategory as NewStat["serving"];
        const attempts = key === "attempts" ? value : serving.attempts;
        const errors = key === "errors" ? value : serving.errors;
        const ratingTotal = key === "ratingTotal" ? value : serving.ratingTotal;
        const percentage = attempts > 0 ? (attempts - errors) / attempts : 0;
        const rating = attempts > 0 ? ratingTotal / attempts : 0;

        serving.rating = Math.round(rating * 10) / 10;
        serving.percentage = Math.round(percentage * 1000) / 1000;
        break;
      }
      case "receiving": {
        // Auto-calculate receiving rating
        const receiving = updatedCategory as NewStat["receiving"];
        const attempts = key === "attempts" ? value : receiving.attempts;
        const ratingTotal =
          key === "ratingTotal" ? value : receiving.ratingTotal;
        const rating = attempts > 0 ? ratingTotal / attempts : 0;

        receiving.rating = Math.round(rating * 10) / 10;
        break;
      }
      case "defense": {
        // Auto-calculate defense rating
        const defense = updatedCategory as NewStat["defense"];
        const attempts = key === "attempts" ? value : defense.attempts;
        const ratingTotal = key === "ratingTotal" ? value : defense.ratingTotal;
        const rating = attempts > 0 ? ratingTotal / attempts : 0;

        defense.rating = Math.round(rating * 10) / 10;
        break;
      }
    }
    return updatedCategory;
  };

  const handleChange =
    <C extends StatCategory, K extends StatFieldKey<C>>(category: C, key: K) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.valueAsNumber;

      setForm((prevForm) => {
        const updatedCategory = updateStatFormFieldsByCategory(
          category,
          key,
          prevForm,
          value,
        );

        return {
          ...prevForm,
          [category]: updatedCategory,
        };
      });
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const submit = () => {
      const newStat: NewStatPayload = { athleteId, statForm: form };
      mutate(newStat);
    };
    try {
      if (form == DEFAULT_STAT_FORM) {
        changeAlertAthleteName(athlete.name);
        const shouldContinue = await confirm();
        // this async await means that the method handle submit will wait for confirm() to finish
        // go read confirm
        if (!shouldContinue) return;
        submit();
      } else {
        // form != initial form (user changed the form)
        submit();
      }
    } catch (error) {
      logger.error("[CreateAthleteStat.tsx]", error);
    }
  };

  if (!athleteId)
    return (
      <div className="flex gap-4">
        <Loader className="animate-spin" />
        No Athlete Id Found
      </div>
    );
  if (isPending)
    return (
      <div className="flex gap-4">
        <Loader className="animate-spin" />
        Adding stats...
      </div>
    );

  return (
    <div>
      <ConfirmDialog />
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="default" size="lg">
            Add New Game Stats
          </Button>
        </DialogTrigger>

        <DialogContent className="max-h-11/12 flex flex-col">
          <DialogHeader>
            <DialogTitle>Create New Stats</DialogTitle>
            <DialogDescription>
              Add a new stats here. Click save when you&apos;re done.
            </DialogDescription>
          </DialogHeader>

          <StatForm
            handleSubmit={handleSubmit}
            handleChange={handleChange}
            handleChangeDate={handleChangeDate}
            form={form}
          />

          {error && (
            <Alert variant="destructive" className="flex justify-start ">
              <AlertCircleIcon />
              <AlertTitle className="px-1">{error.message}</AlertTitle>
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
      </Dialog>
    </div>
  );
};

export default CreateAthleteStat;
