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
import { Button } from "@/components/ui/button";

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
      // athelte is not currently in map
      // add new athlete
      setSelectedAthletes((prev) => new Set<Athlete>(prev).add(athlete));
      // add form to form dictionary
      // need to update the selected date from the default if the selected date is not default.
      const newForm = initialStatForm;
      newForm.recordedAt = selectedDate;
      setForms((prev) => prev.set(athlete._id, newForm));
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
    mutationFn: sportsDataService.createStatsBatch,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["statsBatch"] });
      setForms(new Map<string, StatForm>());
      setSelectedAthletes(new Set<Athlete>());
    },
  });

  const handleSubmit = async () => {
    if (forms.size != 0) {
      console.log("handle submit", forms);
      mutate({ forms });
    }
  };

  return (
    <div className="team-stats w-full sm:w-lg items-center">
      <div className="header w-full">
        <h1>Team Stats Entry</h1>
        <p>
          Enter stats for multiple team memebers at once. Select the date the
          game was played and the athletes that you would like to stat.
        </p>
      </div>

      <div className="team-stats-inner flex flex-col gap-4 mt-4">
        <div className="date-picker card-container ">
          {/* <h3>Game Date: {selectedDate.toLocaleDateString("en-US")}</h3> */}
          <h3 className="mb-2">Game Date</h3>
          <div>
            <DatePicker
              selectedDate={selectedDate}
              changeDate={handleChangeDate}
            ></DatePicker>
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
              <ul className="flex flex-col gap-2">
                {[...selectedAthletes].map((athlete) => {
                  // just to validate that the form exists for the selected athlete
                  const form = forms.get(athlete._id);
                  if (!form) return;
                  return (
                    <li
                      className="flex gap-2 items-center w-full "
                      key={athlete._id}
                    >
                      <AthleteStatForm
                        athlete={athlete}
                        form={form}
                        isPending={isPending}
                        statError={statError}
                        handleChange={handleChange}
                        handleChangeDate={handleChangeDate}
                      ></AthleteStatForm>
                    </li>
                  );
                })}
              </ul>
              <div className="submit flex justify-end mt-4">
                <Button onClick={handleSubmit} className="">
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
