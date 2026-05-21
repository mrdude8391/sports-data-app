import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "../../../components/ui/button";
import { useState } from "react";
import type { NewAthlete } from "@/features/athletes/types/Athlete";
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
import { useCreateAthlete } from "../api/createAthlete";

type AthleteFormState = {
  name: string;
  age: string;
  height: string;
};

const initialState: AthleteFormState = {
  name: "",
  age: "",
  height: "",
};

const CreateAthlete = () => {
  // Improvements: Can consider adding custom FormField.tsx component
  const [form, setForm] = useState<AthleteFormState>(initialState);
  const [isDialogOpen, setIsDialogOpen] = useState(false); // Is required so the dialog will stay open until the new athlete is successfully created.
  const resetForm = () => setForm(initialState);

  const { isPending, error, mutate } = useCreateAthlete({
    mutationConfig: {
      onSuccess: () => {
        resetForm();
        setIsDialogOpen(false);
      },
    },
  });

  const handleChange =
    // A curried function, when the onchange event is triggered, onChange{handleChange('name')(e)}
    // can think of the element just adds/calls (e)=>{} to whatever you put in it.
    (field: keyof AthleteFormState) =>
      (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm((prev) => ({
          ...prev,
          [field]: e.target.value,
        }));
      };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const athlete: NewAthlete = {
      name: form.name.trim(),
      age: Number(form.age),
      height: Number(form.height),
    };
    mutate(athlete);
  };
  return (
    <div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="default">Add New Athlete</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create Athlete</DialogTitle>
            <DialogDescription>
              Create and add a new athlete here. Click save when you&apos;re
              done.
            </DialogDescription>
          </DialogHeader>
          <form id="athleteForm" onSubmit={handleSubmit}>
            <div className="grid gap-3">
              <div className="grid gap-3">
                <Label htmlFor="name">Name</Label>
                <Input
                  type="text"
                  id="name"
                  value={form.name}
                  placeholder="Name"
                  required
                  onChange={handleChange("name")}
                ></Input>
              </div>
              <div className="grid gap-3">
                <Label htmlFor="age">Age</Label>
                <Input
                  type="number"
                  id="age"
                  value={form.age}
                  placeholder="Age"
                  required
                  onChange={handleChange("age")}
                ></Input>
              </div>
              <div className="grid gap-3">
                <Label htmlFor="height">Height</Label>
                <Input
                  type="number"
                  id="height"
                  value={form.height}
                  placeholder="Height"
                  required
                  onChange={handleChange("height")}
                ></Input>
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
            <Button type="submit" form="athleteForm" disabled={isPending}>
              {isPending ? (
                <Loader className="animate-spin" />
              ) : (
                <p>Save New Athlete</p>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CreateAthlete;
