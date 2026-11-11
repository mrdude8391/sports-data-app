import { Alert, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { DialogClose, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import {
  AlertCircleIcon,
  ArrowLeftIcon,
  ChevronDownIcon,
  Loader,
  Undo2Icon,
} from "lucide-react";
import { useMemo, useState } from "react";
import {
  type NewStatPayload,
  type StatCategory,
  createEmptyStatForm,
} from "../types/Stat";
import useConfirmBlankStatForm from "../hooks/useConfirmBlankStatForm";
import type { Athlete } from "@/features/athletes/types/Athlete";
import { useCreateStat } from "../hooks/useCreateStat";
import { logger } from "@/lib/logger";
import {
  type ActionButton,
  type ActionTone,
  type StatEvent,
  aggregateEvents,
  CATEGORY_ORDER,
  getActions,
  getSummary,
  STAT_CONFIG,
} from "../config/statConfig";

const TONE_CLASSES: Record<ActionTone, string> = {
  good: "bg-green-600 text-white hover:bg-green-700",
  bad: "bg-red-600 text-white hover:bg-red-700",
  neutral: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
};

const StatForm = (props: { athleteId: string; athlete: Athlete }) => {
  // I see my athlete do a skill.
  // I tap on the skill they did.
  // I tap the result of the skill they did.
  // After the game I total all the skill results up.

  const { athleteId, athlete } = props;
  const [recordedAt, setRecordedAt] = useState<Date>(() => new Date());
  const [events, setEvents] = useState<StatEvent[]>([]);
  const [active, setActive] = useState<StatCategory | null>(null);

  const totals = useMemo(() => aggregateEvents(events), [events]);
  const lastEvent = events.at(-1);

  // custom hook to handle when a user tries to create a blank stat form
  const { confirm, ConfirmDialog, changeAlertAthleteName } =
    useConfirmBlankStatForm();

  const resetForm = () => {
    setEvents([]);
    setRecordedAt(new Date());
    setActive(null);
  };

  const undo = () => setEvents((ev) => ev.slice(0, -1));

  const { isPending, error, mutate } = useCreateStat({ athleteId, resetForm });

  // Tap 2: record the action and jump straight back to the category grid.
  const record = (category: StatCategory, action: ActionButton) => {
    const label = `${STAT_CONFIG[category].label} – ${action.label}`;
    setEvents((ev) => [...ev, { category, action: action.id, label }]);
    setActive(null);
  };

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
    setRecordedAt(merged);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const submit = () => {
      const newStat: NewStatPayload = {
        athleteId,
        statForm: { ...createEmptyStatForm(), ...totals, recordedAt },
      };
      mutate(newStat);
    };
    try {
      if (events.length === 0) {
        changeAlertAthleteName(athlete.name);
        const shouldContinue = await confirm();
        if (!shouldContinue) return;
      }
      submit();
    } catch (error) {
      logger.error("[StatForm.tsx]", error);
    }
  };

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
      <form id="statForm" className="overflow-y-auto" onSubmit={handleSubmit}>
        <div className="space-y-4 p-4">
          {/* Date Picker */}
          <div className="flex flex-col gap-3">
            <Label htmlFor="date" className="px-1">
              Date
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  id="date"
                  className="w-48 justify-between font-normal"
                >
                  {recordedAt.toLocaleDateString()}
                  <ChevronDownIcon />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-auto overflow-hidden p-0"
                align="start"
              >
                <Calendar
                  mode="single"
                  selected={recordedAt}
                  captionLayout="dropdown"
                  onSelect={handleChangeDate}
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
          {active === null ? (
            // Tap 1: category
            <div className="grid grid-cols-2 gap-3">
              {CATEGORY_ORDER.map((category) => (
                <Button
                  key={category}
                  type="button"
                  variant="outline"
                  className="h-20 flex-col gap-1"
                  onClick={() => setActive(category)}
                >
                  <span className="text-base font-semibold">
                    {STAT_CONFIG[category].label}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {getSummary(category, totals)}
                  </span>
                </Button>
              ))}
            </div>
          ) : (
            // Tap 2: result
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">{STAT_CONFIG[active].label}</h3>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setActive(null)}
                >
                  <ArrowLeftIcon /> Back
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {getActions(active).map((action) => (
                  <Button
                    key={action.id}
                    type="button"
                    className={cn(
                      "h-20 text-lg font-semibold",
                      TONE_CLASSES[action.tone],
                    )}
                    onClick={() => record(active, action)}
                  >
                    {action.label}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      </form>
      {error && (
        <Alert variant="destructive" className="flex justify-start">
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
