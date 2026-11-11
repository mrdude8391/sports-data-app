import { DatePicker } from "@/components/DatePicker";
import { Button, buttonVariants } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { VariantProps } from "class-variance-authority";
import { ArrowLeftIcon, Undo2Icon } from "lucide-react";
import { useMemo, useState } from "react";
import type { StatCategory } from "../types/Stat";
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

// Each result tone maps to a shadcn Button variant, so hover, focus ring,
// disabled and dark-mode styles all come from the shared button component.
const TONE_VARIANT: Record<
  ActionTone,
  NonNullable<VariantProps<typeof buttonVariants>["variant"]>
> = {
  good: "success",
  bad: "destructive",
  neutral: "outline",
};

// Lifts a button off the dialog: card surface + border + shadow, with a
// slightly deeper shadow on hover and a small press-down on click.
const RAISED =
  "bg-card dark:bg-card border shadow-sm hover:shadow-md active:translate-y-px active:shadow-xs";

export type StatFormProps = {
  /** The taps recorded so far. The page owns this list. */
  events: StatEvent[];
  /** Called with the new list after every tap or undo. */
  onEventsChange: (events: StatEvent[]) => void;
  /** Pass both to show a date picker at the top of the form. */
  date?: Date;
  onDateChange?: (date: Date) => void;
};

/**
 * Two-tap stat entry: pick a category, then pick the result.
 * Controlled: it only keeps UI state (which category is open),
 * so the same form works for one athlete or many.
 */
const StatForm = ({
  events,
  onEventsChange,
  date,
  onDateChange,
}: StatFormProps) => {
  const [active, setActive] = useState<StatCategory | null>(null);

  const totals = useMemo(() => aggregateEvents(events), [events]);
  const lastEvent = events.at(-1);

  // Tap 2: record the action and jump straight back to the category grid.
  const record = (category: StatCategory, action: ActionButton) => {
    const label = `${STAT_CONFIG[category].label} – ${action.label}`;
    onEventsChange([...events, { category, action: action.id, label }]);
    setActive(null);
  };

  const undo = () => onEventsChange(events.slice(0, -1));

  return (
    <div className="space-y-4">
      {date && onDateChange && (
        <div className="flex items-center gap-4">
          <Label htmlFor="date">Date</Label>
          <DatePicker selectedDate={date} changeDate={onDateChange} />
        </div>
      )}

      {/* Last action + Undo */}
      <div className="flex items-center justify-between rounded-md border px-3 py-2 text-sm">
        <span className="truncate">
          {lastEvent ? `Last: ${lastEvent.label}` : "Tap a category to start"}
          <span className="ml-2 text-muted-foreground">({events.length})</span>
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

      {active === null ? (
        // Tap 1: category
        <div className="grid grid-cols-2 gap-3">
          {CATEGORY_ORDER.map((category) => (
            <Button
              key={category}
              type="button"
              variant="outline"
              className={cn("h-20 flex-col gap-1", RAISED)}
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
                variant={TONE_VARIANT[action.tone]}
                size="xl"
                className={cn(
                  "h-20 text-lg font-semibold shadow-sm hover:shadow-md active:translate-y-px active:shadow-xs",
                  action.tone === "neutral" && RAISED,
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
  );
};

export default StatForm;
