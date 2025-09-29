import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "./ui/button";
import { useState } from "react";
import * as sportsDataService from "@/services/sportsDataService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Athlete } from "@/types/Athlete";

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
      {error && <div>{error.message}</div>}
      <form id="athleteForm" onSubmit={handleSubmit}>
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
        <Label htmlFor="age">age</Label>
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
        <Label htmlFor="height">height</Label>
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
      </form>
      <Button type="submit" form="athleteForm">
        Create Athlete
      </Button>
    </div>
  );
};

export default CreateAthlete;
