import { Button } from "../../../components/ui/button.tsx";
import { Label } from "../../../components/ui/label.tsx";
import { Input } from "../../../components/ui/input.tsx";
import { STAT_LABEL_INDEX } from "@/constants";
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
import { Alert, AlertTitle } from "../../../components/ui/alert.tsx";
import { AlertCircleIcon, Loader } from "lucide-react";
import { ChevronDownIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { Athlete } from "@/features/athletes/types/Athlete.ts";
import type { NewStat, StatCategory } from "@/features/stats/types/Stat.ts";

interface athleteStatFormProps {
  athlete: Athlete;
  form: NewStat;
  statError: Error | null;
  isPending: boolean;
  handleChange: <C extends StatCategory>(
    category: C,
    key: string,
    value: number,
    id: string,
  ) => void;
  handleChangeDate: (date: Date) => void;
}

const AthleteStatForm = (props: athleteStatFormProps) => {
  const {
    athlete,
    form,
    statError: error,
    isPending,
    handleChange,
    handleChangeDate,
  } = props;

  const categories = Object.keys(STAT_LABEL_INDEX) as StatCategory[];

  if (isPending)
    return (
      <div className="flex gap-4">
        <Loader className="animate-spin" />
        Adding stats...
      </div>
    );
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="secondary"
          size="lg"
          className="w-full justify-start rounded-lg "
        >
          <p className="text-wrap">{athlete.name}</p>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-11/12 flex flex-col overflow-hidden ">
        <DialogHeader className="sticky">
          <DialogTitle>
            <p>{athlete.name}&apos;s Stats</p>
          </DialogTitle>
          <DialogDescription>
            Enter new stats here. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <div className="overflow-y-auto space-y-4 p-4">
          <div className="flex flex-col gap-3">
            <Label htmlFor="date" className="px-1">
              Date
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  disabled
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
                    handleChangeDate(date!);
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>
          <form id="statForm" onSubmit={(e) => e.preventDefault()}>
            {categories.map((category) => (
              <fieldset key={category} className="border p-4 rounded-md ">
                <legend className="font-bold capitalize">{category}</legend>

                <div className="grid grid-cols-2 gap-4 mt-2">
                  {STAT_LABEL_INDEX[category].map(({ key, label }) => (
                    <Label key={key} className="flex flex-col">
                      <span className="text-sm">{label}</span>
                      <Input
                        type="number"
                        value={
                          form[category][key as keyof NewStat[keyof NewStat]]
                        }
                        onChange={(e) =>
                          handleChange(
                            category,
                            key,
                            Number(e.target.value),
                            athlete.id,
                          )
                        }
                        className="border rounded p-2"
                      />
                    </Label>
                  ))}
                </div>
              </fieldset>
            ))}
          </form>
        </div>

        {error && (
          <Alert variant="destructive" className="flex justify-start ">
            <AlertCircleIcon />
            <AlertTitle className="px-1">{error.message}</AlertTitle>
          </Alert>
        )}
        <DialogFooter>
          <DialogClose asChild>
            <Button form="statForm">Save and close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AthleteStatForm;
