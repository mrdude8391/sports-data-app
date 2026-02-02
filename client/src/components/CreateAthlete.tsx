import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "./ui/button";
import { useState } from "react";
import * as sportsDataService from "@/services/sportsDataService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AthletePayload } from "@/types/Athlete";
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

const CreateAthlete = () => {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [height, setHeight] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const queryClient = useQueryClient();

  const { isPending, error, mutate } = useMutation({
    mutationFn: sportsDataService.createAthlete,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["athletes"] });
      setName("");
      setAge("");
      setHeight("");
      setIsDialogOpen(false);
      console.log("New athlete submit success");
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const athlete: AthletePayload = {
      name: name,
      age: Number(age),
      height: Number(height),
    };
    mutate(athlete);
  };
  return (
    <div>
      <Dialog open={isDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="default" onClick={() => setIsDialogOpen(true)}>
            Add New Athlete
          </Button>
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
                  value={name}
                  placeholder="Name"
                  required
                  onChange={(e) => {
                    setName(e.target.value);
                  }}
                ></Input>
              </div>
              <div className="grid gap-3">
                <Label htmlFor="age">Age</Label>
                <Input
                  type="number"
                  id="age"
                  value={age}
                  placeholder="Age"
                  required
                  onChange={(e) => {
                    setAge(e.target.value);
                  }}
                ></Input>
              </div>
              <div className="grid gap-3">
                <Label htmlFor="height">Height</Label>
                <Input
                  type="number"
                  id="height"
                  value={height}
                  placeholder="Height"
                  required
                  onChange={(e) => {
                    setHeight(e.target.value);
                  }}
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
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
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
