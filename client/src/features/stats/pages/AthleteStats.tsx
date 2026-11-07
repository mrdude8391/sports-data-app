import { Loader } from "lucide-react";

import CreateAthleteStat from "@/features/stats/components/CreateAthleteStat";
import AthleteStatRadial from "@/features/stats/components/AthleteStatRadar";

import { useAthleteStats } from "../hooks/useAthleteStats";
import { useParams } from "react-router-dom";
import AthleteStatDashboard from "../components/AthleteStatDashboard";

type AthleteStatsParams = {
  athleteId: string;
};
export const getAthleteIdFromParams = () => {
  const { athleteId } = useParams<AthleteStatsParams>();
  return athleteId ?? "";
};

const AthleteStats = () => {
  const athleteId = getAthleteIdFromParams();

  const {
    data: { athlete, stats },
    isLoading,
    isFetching,
    error,
  } = useAthleteStats({ athleteId });

  if (isFetching && athlete.name == "")
    return <Loader className="animate-spin" />;

  if (isLoading) return <Loader className="animate-spin" />;

  if (error) return <p>Error: No athlete exists {error.message}</p>;

  if (!athleteId) return <p>Error: No athlete exists</p>;

  return (
    <>
      <div className="w-full max-w-6xl ">
        <div className="flex flex-col gap-6 w-full max-w-6xl py-3">
          <div className="card-container w-full grid sm:grid-cols-2">
            <div className="px-2 flex flex-col">
              <h1>{athlete.name}</h1>
              <p className="text-foreground/80">Age: {athlete.age}</p>
              <p className="text-foreground/80">Height: {athlete.height} cm</p>
            </div>
            <AthleteStatRadial stats={stats} />
          </div>
          <CreateAthleteStat
            athleteId={athleteId!}
            athlete={athlete}
          ></CreateAthleteStat>
          <AthleteStatDashboard stats={stats} athleteId={athleteId} />
        </div>
      </div>
    </>
  );
};

export default AthleteStats;
