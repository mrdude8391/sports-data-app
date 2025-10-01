import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as sportsDataService from "@/services/sportsDataService";
import { STAT_FIELDS } from "@/constants";
import type { StatForm } from "@/types/Stat";
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

const initialForm: StatForm = Object.fromEntries(
  Object.entries(STAT_FIELDS).map(([category, fields]) => [
    category,
    Object.fromEntries(fields.map((f) => [f.key, 0])),
  ])
);

const CreateAthleteStat = () => {
  const { athleteId } = useParams<{ athleteId: string }>();

  const [form, setForm] = useState<StatForm>(initialForm);

  const queryClient = useQueryClient();

  const { isPending, error, mutate } = useMutation({
    mutationFn: sportsDataService.createStat,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["stats"] });
      setForm(initialForm);
    },
  });

  const handleChange = (category: string, key: string, value: number) => {
    setForm((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value,
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (athleteId && form != initialForm) {
      console.log(form);
      mutate({ athleteId, data: form });
    }
  };

  if (isPending) return <div>pending</div>;
  return (
    <div>
      <Dialog>
        <form id="statForm" className="space-y-6" onSubmit={handleSubmit}>
          <DialogTrigger asChild>
            <Button variant="outline">Add New Game Stats</Button>
          </DialogTrigger>
          <DialogContent className="max-h-11/12 flex flex-col overflow-hidden">
            <DialogHeader className="sticky">
              <DialogTitle>Create New Stats</DialogTitle>
              <DialogDescription>
                Add a new stats here. Click save when you&apos;re done.
              </DialogDescription>
            </DialogHeader>
            <div className="overflow-y-auto space-y-4 p-4">
              {Object.entries(STAT_FIELDS).map(([category, fields]) => (
                <fieldset key={category} className="border p-4 rounded-md ">
                  <legend className="font-bold capitalize">{category}</legend>

                  <div className="grid grid-cols-2 gap-4 mt-2">
                    {fields.map(({ key, label }) => (
                      <Label key={key} className="flex flex-col">
                        <span className="text-sm text-gray-700">{label}</span>
                        <Input
                          type="number"
                          value={form[category][key]}
                          onChange={(e) =>
                            handleChange(category, key, Number(e.target.value))
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
