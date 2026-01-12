import { Button } from "../../../components/ui/button";
import { Label } from "../../../components/ui/label";
import { Input } from "../../../components/ui/input";
import { STAT_INDEX } from "@/constants";
import type { StatCategory, StatFieldKey, StatForm } from "@/types/Stat";
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
import type { Athlete } from "@/types/Athlete.ts";

interface athleteStatFormProps {
  athlete: Athlete;
  form: StatForm;
  statError: Error | null;
  isPending: boolean;
  handleChange: <C extends StatCategory, K extends StatFieldKey<C>>(
    category: C,
    key: K,
    value: number,
    id: string
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

  if (isPending)
    return (
      <div className="flex gap-4">
        <Loader className="animate-spin" />
        Adding stats...
      </div>
    );
  return (
    <div>
      <Dialog>
        <form
          id="statForm"
          className="space-y-6"
          onSubmit={(e) => e.preventDefault()}
        >
          <DialogTrigger asChild>
            <Button variant="default" size="lg">
              <p>{athlete.name}</p>
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
                              Number(e.target.value),
                              athlete._id
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
                <Button form="statForm">Save</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </form>
      </Dialog>
      <form></form>
    </div>
  );
};

export default AthleteStatForm;
