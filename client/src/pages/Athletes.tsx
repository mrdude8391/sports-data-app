import { EllipsisVertical, Loader } from "lucide-react";
import CreateAthlete from "@/features/athletes/components/CreateAthlete";
import * as sportsDataService from "../services/sportsDataService";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import AthleteList from "../features/athletes/components/AthleteList";
import { useQuery } from "@tanstack/react-query";

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

        <AthleteList isEdit={isEdit} athletes={athletes ?? []} />
      </div>
    </div>
  );
};

export default Athletes;
