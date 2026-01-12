import { DatePicker } from "@/components/shared/DatePicker";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import * as sportsDataService from "../../services/sportsDataService";
import type { Athlete } from "@/types/Athlete";
import {
  initialStatForm,
  type StatCategory,
  type StatFieldKey,
  type StatForm,
} from "@/types/Stat";
import AthleteSelector from "./components/AthleteSelector";
import AthleteStatForm from "./components/AthleteStatForm";

const GameLog = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const [selectedAthletes, setSelectedAthletes] = useState(new Set<Athlete>());
  const [forms, setForms] = useState<Map<string, StatForm>>(
    new Map<string, StatForm>()
  );
  // if i use a dictionary, i can have the ids : form
  // add the new form whenver an athlete is added to the selection list
  // update the form by getting the form object through the dictionary

  const queryClient = useQueryClient();

  const handleSelectAthlete = (athlete: Athlete) => {
    // console.log("selected", athlete._id);
    if (selectedAthletes.has(athlete)) {
      // delete already selected athlete
      setSelectedAthletes((prev) => {
        const newSet = new Set<Athlete>(prev);
        newSet.delete(athlete);
        return newSet;
      });
      // delete from from dictionary
      setForms((prev) => {
        const newMap = new Map<string, StatForm>(prev);
        newMap.delete(athlete._id);
        return newMap;
      });
    } else {
      // add new athlete
      setSelectedAthletes((prev) => new Set<Athlete>(prev).add(athlete));
      // add form to form dictionary
      setForms((prev) => prev.set(athlete._id, initialStatForm));
    }
  };

  const handleChangeDate = (selectedDate: Date) => {
    setSelectedDate(selectedDate);
    const now = new Date();
    const newDate = new Date(selectedDate!);
    newDate.setHours(
      now.getHours(),
      now.getMinutes(),
      now.getSeconds(),
      now.getMilliseconds()
    );
    setForms((prev) => {
      const newMap = new Map<string, StatForm>(prev);
      for (const [key, value] of newMap) {
        newMap.set(key, { ...value, recordedAt: newDate });
      }
      return newMap;
    });
  };

  const handleChange = <C extends StatCategory, K extends StatFieldKey<C>>(
    category: C,
    key: K,
    value: number,
    id: string
  ) => {
    const createUpdatedCategory = () => {
      const form = forms.get(id)!;
      const updatedCategory = {
        ...form![category],
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
        ...form,
        [category]: updatedCategory,
      };
    };
    const updatedForm = createUpdatedCategory();
    setForms((prev) => {
      const newMap = new Map<string, StatForm>(prev);
      newMap.set(id, updatedForm);
      return newMap;
    });
  };

  const {
    isPending,
    error: statError,
    mutate,
  } = useMutation({
    mutationFn: sportsDataService.createStat,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["stats"] });
      setForms(new Map<string, StatForm>());
    },
  });

  const handleSubmit = async () => {};

  return (
    <div className="multi-stat-container card-container min-w-3xl flex flex-col gap-4 items-center">
      <div className="multi-stat-inner">
        <h1>Game Stats Entry</h1>
        <div>
          <div>Selected Date: {selectedDate.toLocaleDateString("en-US")}</div>
          <DatePicker
            selectedDate={selectedDate}
            changeDate={handleChangeDate}
          ></DatePicker>
        </div>
        <div>
          <h3>Athletes Selector</h3>
          <AthleteSelector
            selectedAthletes={selectedAthletes}
            handleSelectAthlete={handleSelectAthlete}
          />
        </div>
        <div>
          <h3>Selected Athletes List</h3>
          <ul className="flex flex-col gap-2">
            {[...selectedAthletes].map((athlete) => (
              <li className="flex gap-2 items-center " key={athlete._id}>
                <AthleteStatForm
                  athlete={athlete}
                  form={forms.get(athlete._id)!}
                  isPending={isPending}
                  handleSubmit={handleSubmit}
                  statError={statError}
                  handleChange={handleChange}
                  handleChangeDate={handleChangeDate}
                ></AthleteStatForm>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default GameLog;
