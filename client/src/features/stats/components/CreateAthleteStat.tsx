import { Button } from "../../../components/ui/button";
import { Label } from "../../../components/ui/label";
import { Input } from "../../../components/ui/input";
import { Calendar } from "@/components/ui/calendar";
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
import { Alert, AlertTitle } from "../../../components/ui/alert";
import { AlertCircleIcon, ChevronDownIcon, Loader } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  DEFAULT_STAT_FORM,
  type NewStat,
  type NewStatPayload,
  type StatCategory,
  type StatFieldKey,
  type StatFields,
} from "../types/Stat";
import { useState } from "react";
import type { Athlete } from "@/features/athletes/types/Athlete";
import useConfirmBlankStatForm from "../hooks/useConfirmBlankStatForm";
import { logger } from "@/lib/logger";
import { useCreateStat } from "../hooks/useCreateStat";
import { STAT_LABEL_INDEX } from "@/constants";
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
          <Button variant="default" size="lg">
            Add New Game Stats
          </Button>
        </DialogTrigger>

        <DialogContent className="max-h-11/12 flex flex-col">
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
