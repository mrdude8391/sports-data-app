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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const GameLog = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [athleteList, setAthleteList] = useState([]);

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
        {athleteList.length > 0 ? (
          <div>Athlete list exists</div>
        ) : (
          <div>No Athletes Selected</div>
        )}
        <h3>player list</h3>
        <AthleteSelector />
      </div>
    </div>
  );
};

export default GameLog;

const AthleteSelector = () => {
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
        <form>
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
            <ul>
              {athletes && athletes.length > 0 ? (
                athletes.map((athlete) => <li>{athlete.name}</li>)
              ) : (
                <div>No Athletes Found</div>
              )}
            </ul>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </DialogContent>
        </form>
      </Dialog>
    </div>
  );
};
