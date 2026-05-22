import { Button } from "../../../components/ui/button";
import { Trash2 } from "lucide-react";
import { useDeleteAthlete } from "../api/deleteAthlete";

interface deleteAthleteProps {
  id: string;
}

const DeleteAthlete = (props: deleteAthleteProps) => {
  const { id } = props;

  const { isPending, error, mutate } = useDeleteAthlete();

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
