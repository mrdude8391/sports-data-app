import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as sportsDataService from "@/services/sportsDataService";

const CreateAthleteStat = () => {
  const [type, setType] = useState("");
  const [value, setValue] = useState("");
  const { athleteId } = useParams<{ athleteId: string }>();

  const queryClient = useQueryClient();

  const { isPending, error, mutate } = useMutation({
    mutationFn: sportsDataService.createStat,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["stats"] });
      setType("");
      setValue("");
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (athleteId) {
      const stat = {
        athleteId: athleteId,
        type: type,
        value: value,
      };
      mutate(stat);
    }
  };
  return (
    <div>
      <form id="statForm" onSubmit={handleSubmit}>
        <Label htmlFor="type">Type</Label>
        <Input
          required
          id="type"
          onChange={(e) => setType(e.target.value)}
        ></Input>
        <Label htmlFor="value">Value</Label>
        <Input
          required
          id="value"
          onChange={(e) => setValue(e.target.value)}
        ></Input>
      </form>
      <Button type="submit" form="statForm">
        Create Stat
      </Button>
    </div>
  );
};

export default CreateAthleteStat;
