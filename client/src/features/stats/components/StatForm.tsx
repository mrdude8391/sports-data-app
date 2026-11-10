import { Alert, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { DialogClose, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  AlertCircleIcon,
  ChevronDownIcon,
  Loader,
  Undo2Icon,
} from "lucide-react";
import { act, useState } from "react";
import {
  type NewStat,
  type NewStatPayload,
  type StatCategory,
  type StatFieldKey,
  type StatFields,
  DEFAULT_STAT_FORM,
} from "../types/Stat";
import useConfirmBlankStatForm from "../hooks/useConfirmBlankStatForm";
import type { Athlete } from "@/features/athletes/types/Athlete";
import { useCreateStat } from "../hooks/useCreateStat";
import { logger } from "@/lib/logger";
import { CATEGORY_ORDER, STAT_CONFIG } from "../config/statConfig";

const StatForm = (props: { athleteId: string; athlete: Athlete }) => {
  // I see my athlete do a skill.
  // I tap on the skill they did.
  // I tap the result of the skill they did.
  // After the game I total all the skill results up.

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

  type StatEvent = {
    category: StatCategory;
    action: string;
    label: string;
  };

  const [events, setEvents] = useState<StatEvent[]>([]);
  const [active, setActive] = useState<StatCategory | null>(null);

  const record = (category: StatCategory, action: string, label: string) => {
    setEvents((ev) => [...ev, { category, action, label }]);
    setActive(null);
  };

  const attackEvents = events.filter((e) => e.category === "attack");
  const receivingEvents = events.filter((e) => e.category === "receiving");

  const kills = attackEvents.filter((e) => e.action === "kill").length;
  const errors = attackEvents.filter((e) => e.action === "error").length;
  const total = attackEvents.filter((e) =>
    ["kill", "error"].includes(e.action),
  ).length;
  const pct = total > 0 ? (kills - errors) / total : 0;

  const undo = () => setEvents((ev) => ev.slice(0, -1));
  const lastEvent = events.at(-1);

  //  when the form is submitted the ui goes to pending, which closes the dialog.
  if (isPending)
    return (
      <div className="flex gap-4">
        <Loader className="animate-spin" />
        Adding stats...
      </div>
    );

  return (
    <>
      <ConfirmDialog />
      <form id="statForm" className="overflow-y-auto " onSubmit={handleSubmit}>
        {/* Stat Area */}
        <div className="space-y-4 p-4">
          {/* Date Picker */}
          <div className=" flex flex-col gap-3">
            <Label htmlFor="date" className="px-1">
              Date
            </Label>
            <Popover>
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
                    handleChangeDate(date);
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Last action + Undo */}
          <div className="flex items-center justify-between rounded-md border px-3 py-2 text-sm">
            <span className="truncate">
              {lastEvent
                ? `Last: ${lastEvent.label}`
                : "Tap a category to start"}
              <span className="ml-2 text-muted-foreground">
                ({events.length})
              </span>
            </span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={undo}
              disabled={!lastEvent}
            >
              <Undo2Icon /> Undo
            </Button>
          </div>

          {/* Entry Section */}
          <div className="stat-container">
            {active === null ? (
              CATEGORY_ORDER.map((cat) => (
                <Button key={cat} onClick={() => setActive(cat)}>
                  {STAT_CONFIG[cat].label}
                </Button>
              ))
            ) : (
              <div>
                {STAT_CONFIG[active].actions.map((a) => (
                  <Button
                    key={a.id}
                    onClick={() => record(active, a.id, active)}
                  >
                    {a.label}
                  </Button>
                ))}
                <Button key="back" onClick={() => setActive(null)}>
                  Back
                </Button>
              </div>
            )}
          </div>
        </div>
      </form>
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
    </>
  );
};

export default StatForm;
