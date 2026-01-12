import * as sportsDataService from "../../../services/sportsDataService";
import { Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import type { Athlete } from "@/types/Athlete";
import CreateAthlete from "@/components/CreateAthlete";
import { useQuery } from "@tanstack/react-query";

const AthleteSelector = (athleteSelectorProps: {
  selectedAthletes: Set<Athlete>;
  handleSelectAthlete: (athlete: Athlete) => void;
}) => {
  const { selectedAthletes, handleSelectAthlete } = athleteSelectorProps;
  const {
    data: athletes,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["athletes"],
    queryFn: sportsDataService.getAthletes,
  });

  if (isLoading) return <Loader className="animate-spin" />;
  if (error) return <p>... No Athletes Found</p>;
  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">Add players</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Athletes to Game</DialogTitle>
            <DialogDescription>
              Select the athletes that played this game that you need to add
              stats for.
            </DialogDescription>
          </DialogHeader>
          <CreateAthlete></CreateAthlete>
          <ul className="flex flex-col gap-2">
            {athletes && athletes.length > 0 ? (
              athletes.map((athlete) => (
                <li
                  key={athlete._id}
                  className={`px-2 rounded cursor-pointer 
                      ${
                        selectedAthletes.has(athlete)
                          ? "bg-accent hover:bg-accent/80"
                          : "hover:bg-accent/50"
                      }
                    `}
                  onClick={() => handleSelectAthlete(athlete)}
                >
                  <p>{athlete.name}</p>
                </li>
              ))
            ) : (
              <div>No Athletes Found</div>
            )}
          </ul>
          <DialogFooter>
            <DialogClose asChild>
              <Button>Save Changes</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AthleteSelector;
