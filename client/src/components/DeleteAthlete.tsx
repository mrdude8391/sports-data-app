import { Button } from "./ui/button";
import * as sportsDataService from "../services/sportsDataService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";

interface deleteAthleteProps {
  id: string;
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
    if (id) mutate(id);
  };

  return (
    <>
      <Button className="ml-3 " variant="destructive" onClick={handleClick}>
        <Trash2 />
      </Button>
    </>
  );
};

export default DeleteAthlete;
