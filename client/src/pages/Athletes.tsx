import AthleteCard from "@/components/AthleteCard";
import type { Athlete } from "@/types/Athlete";
import * as sportsDataService from "../services/sportsDataService";
import sampleImage from "../assets/circle-user-round.svg";
import { EllipsisVertical, Loader } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import CreateAthlete from "@/components/CreateAthlete";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import DeleteAthlete from "@/components/DeleteAthlete";

const Athletes = () => {
  const [isEdit, setIsEdit] = useState(false);

  return (
    <div className="flex flex-col gap-6 w-full sm:w-lg items-center">
      <div className="w-full">
        <h1>Athletes</h1>
      </div>
      <div className="card-container w-full flex flex-col gap-6">
        <div className="flex justify-between">
          <CreateAthlete />
          <Button variant="outline" onClick={() => setIsEdit(!isEdit)}>
            <EllipsisVertical />
          </Button>
        </div>

        <AthleteList isEdit={isEdit} />
      </div>
    </div>
  );
};

export default Athletes;

interface AthleteListProps {
  isEdit: boolean;
}

const AthleteList = (athleteListProps: AthleteListProps) => {
  const { isEdit } = athleteListProps;

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
    <div className="flex flex-col gap-1 w-full">
      {athletes && athletes.length > 0 ? (
        <ul className="flex w-full flex-col items-center ">
          {athletes.map((athlete: Athlete) => (
            <li key={athlete.id} className="w-full flex flex-row items-center ">
              <AthleteCard imageSrc={sampleImage} athlete={athlete} />
              {isEdit && <DeleteAthlete id={athlete.id} />}
            </li>
          ))}
        </ul>
      ) : (
        <p>No Athletes</p>
      )}
    </div>
  );
};
