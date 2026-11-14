import { Button } from "../../../components/ui/button";
import { useDeleteStat } from "../hooks/useDeleteStat";

interface DeleteAthleteStatProps {
  statId?: string;
}

const DeleteAthleteStat = (props: DeleteAthleteStatProps) => {
  const { statId } = props;

  const { isPending, error, mutate } = useDeleteStat();

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
