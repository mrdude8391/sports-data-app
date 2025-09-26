import React from "react";
import { Button } from "./ui/button";
import * as sportsDataService from "../services/sportsDataService";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface deleteAthleteProps {
  id?: string;
}

const DeleteAthlete = (props: deleteAthleteProps) => {
  const { id } = props;

  const queryClient = useQueryClient();

  const { isPending, error, mutate } = useMutation({
    mutationFn: sportsDataService.deleteAthlete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["athletes"] });
    },
  });

  if (isPending) return <p>...Deleting</p>;
  if (error) return <p>{error.message}</p>;
  const handleClick = () => {
    console.log(id);
    if (id) mutate(id);
  };

  return (
    <>
      <Button variant="destructive" onClick={handleClick}>
        Delete
      </Button>
    </>
  );
};

export default DeleteAthlete;
