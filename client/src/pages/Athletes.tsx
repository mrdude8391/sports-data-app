import { EllipsisVertical, Loader } from "lucide-react";
import CreateAthlete from "@/features/athletes/components/CreateAthlete";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import AthleteList from "../features/athletes/components/AthleteList";
import { useAthletes } from "@/features/athletes/api/getAthletes";

const Athletes = () => {
  const [isEdit, setIsEdit] = useState(false);

  const { data: athletes, isLoading, error } = useAthletes();

  if (isLoading) return <Loader className="animate-spin" />;
  if (error) return <p>Error Loading Athletes</p>;

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
