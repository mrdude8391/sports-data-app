import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { Athlete } from "@/features/athletes/types/Athlete";
import StatForm from "./StatForm";

interface createAthleteStatProps {
  athleteId: string;
  athlete: Athlete;
}

const CreateAthleteStat = (props: createAthleteStatProps) => {
  const { athleteId, athlete } = props;

  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <div className="flex flex-col">
            <Button variant="default" size="xl">
              Add New Game Stats
            </Button>
          </div>
        </DialogTrigger>

        <DialogContent className="max-h-11/12  flex flex-col">
          <DialogHeader>
            <DialogTitle>Create New Stats</DialogTitle>
            <DialogDescription>
              Add a new stats here. Click save when you&apos;re done.
            </DialogDescription>
          </DialogHeader>

          <StatForm athleteId={athleteId} athlete={athlete}></StatForm>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CreateAthleteStat;
