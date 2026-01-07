import { DatePicker } from "@/components/shared/DatePicker";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import * as sportsDataService from "../services/sportsDataService";
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
import CreateAthleteStat from "@/components/CreateAthleteStat";

const GameLog = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const [selectedAthletes, setSelectedAthletes] = useState(new Set<Athlete>());

  const handleSelectAthlete = (athlete: Athlete) => {
    // console.log("selected", athlete._id);
    if (selectedAthletes.has(athlete)) {
      setSelectedAthletes((prev) => {
        const newSet = new Set<Athlete>(prev);
        newSet.delete(athlete);
        return newSet;
      });
    } else {
      setSelectedAthletes((prev) => new Set<Athlete>(prev).add(athlete));
    }
    console.log(selectedAthletes);
  };

  const handleChangeDate = (newDate: Date) => {
    setSelectedDate(newDate);
  };

  return (
    <div className="card-container flex flex-col gap-4">
      <h1>Game Stats Entry</h1>
      <div>
        <div>Selected Date: {selectedDate.toLocaleDateString("en-US")}</div>
        <DatePicker
          selectedDate={selectedDate}
          changeDate={handleChangeDate}
        ></DatePicker>
      </div>
      <div>
        <h3>Athlete Selector</h3>
        <AthleteSelector
          selectedAthletes={selectedAthletes}
          handleSelectAthlete={handleSelectAthlete}
        />
      </div>
      <div>
        <h3>Selected Athletes List</h3>
        <ul>
          {[...selectedAthletes].map((a) => (
            <li>
              <p>{a.name}</p>
              <CreateAthleteStat athleteId={a._id}></CreateAthleteStat>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default GameLog;

{
  /* Athlete Selector */
}

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
          <ul className="flex flex-col gap-2">
            {athletes && athletes.length > 0 ? (
              athletes.map((athlete) => (
                <li
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
