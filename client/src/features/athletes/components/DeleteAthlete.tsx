import { Button } from "../../../components/ui/button";
import { Trash2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteAthlete } from "../api/athletesApi";

interface deleteAthleteProps {
  id: string;
}

const DeleteAthlete = (props: deleteAthleteProps) => {
  const { id } = props;
  const queryClient = useQueryClient();

  const { isPending, error, mutate } = useMutation({
    mutationFn: deleteAthlete,
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
