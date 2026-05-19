import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { STAT_LABEL_INDEX } from "@/constants";
import { type StatCategory, type StatForm } from "@/types/Stat";
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
import { AlertCircleIcon, Loader } from "lucide-react";
import { ChevronDownIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface createAthleteStatProps {
  athleteId: string;
  form: StatForm;
  handleSubmit: () => void;
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

const CreateAthleteStat = (props: createAthleteStatProps) => {
  const {
    athleteId,
    form,
    handleSubmit,
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
    <div>
      <Dialog>
        <form
          id="statForm"
          className="space-y-6"
          onSubmit={(e) => e.preventDefault()}
        >
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
                            form[category][
                              key as keyof StatForm[keyof StatForm]
                            ]
                          }
                          onChange={(e) =>
                            handleChange(
                              category,
                              key,
                              Number(e.target.value),
                              athleteId,
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
              <Alert variant="destructive" className="flex justify-start ">
                <AlertCircleIcon />
                <AlertTitle className="px-1">{error.message}</AlertTitle>
              </Alert>
            )}
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit" form="statForm" onClick={handleSubmit}>
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
