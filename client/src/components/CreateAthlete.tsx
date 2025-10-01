import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "./ui/button";
import { useState } from "react";
import * as sportsDataService from "@/services/sportsDataService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Athlete } from "@/types/Athlete";
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

const CreateAthlete = () => {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [height, setHeight] = useState("");

  const queryClient = useQueryClient();

  const { isPending, error, mutate } = useMutation({
    mutationFn: sportsDataService.createAthlete,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["athletes"] });
      setName("");
      setAge("");
      setHeight("");
    },
  });

  if (isPending) return <div>pending</div>;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const athlete: Athlete = {
      name: name,
      age: Number(age),
      height: Number(height),
    };
    mutate(athlete);
  };
  return (
    <div>
      <Dialog>
        <form id="athleteForm" onSubmit={handleSubmit}>
          <DialogTrigger asChild>
            <Button variant="outline">Add New Athlete</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create Athlete</DialogTitle>
              <DialogDescription>
                Create and add a new athlete here. Click save when you&apos;re
                done.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4">
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
              <Button type="submit" form="athleteForm">
                Save New Athlete
              </Button>
            </DialogFooter>
          </DialogContent>
        </form>
      </Dialog>
    </div>
  );
};

export default CreateAthlete;
