import { Button } from "./ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as sportsDataService from "@/services/sportsDataService";

interface DeleteAthleteStatProps {
  statId?: string;
}

const DeleteAthleteStat = (props: DeleteAthleteStatProps) => {
  const queryClient = useQueryClient();

  const { isPending, error, mutate } = useMutation({
    mutationFn: sportsDataService.deleteStat,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stats"] });
    },
  });
  const { statId } = props;

  const handleDelete = () => {
    if (statId) mutate(statId);
  };

  if (isPending) return <p>...Deleting</p>;
  if (error) return <p>{error.message}</p>;

  return (
    <div>
      <Button size="sm" onClick={handleDelete} variant="destructive">
        Delete Stat
      </Button>
    </div>
  );
};

export default DeleteAthleteStat;
