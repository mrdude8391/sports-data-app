import AthleteCard from "@/components/AthleteCard";
import type { Athlete } from "@/types/Athlete";
import * as sportsDataService from "../services/sportsDataService";
import sampleImage from "../assets/circle-user-round.svg";
import { EllipsisVertical, Loader } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import CreateAthlete from "@/components/CreateAthlete";
import DeleteAthlete from "@/components/DeleteAthlete";
import { useState } from "react";
import { Button } from "@/components/ui/button";
const Athletes = () => {
  const [isEdit, setIsEdit] = useState(false);
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
    <div className="sm:w-lg flex flex-col gap-5">
      <div className="flex justify-between">
        <CreateAthlete />
        <Button variant="outline" onClick={() => setIsEdit(!isEdit)}>
          <EllipsisVertical />
        </Button>
      </div>

      {athletes && athletes.length > 0 ? (
        athletes.map((a: Athlete) => (
          <div key={a._id} className="flex w-full flex-row gap-4 items-center">
            <div className="w-full ">
              <AthleteCard imageSrc={sampleImage} athlete={a} />{" "}
            </div>
            {isEdit && (
              <div>
                <DeleteAthlete id={a._id} />
              </div>
            )}
          </div>
        ))
      ) : (
        <p>No Athletes</p>
      )}
    </div>
  );
};

export default Athletes;
