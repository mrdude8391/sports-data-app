import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import * as sportsDataService from "@/services/sportsDataService";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader } from "lucide-react";
import type { Stat } from "@/types/Stat";
import AthleteStatsList from "@/components/AthleteStatsList";
import CreateAthleteStat from "@/components/CreateAthleteStat";
import type { Athlete } from "@/types/Athlete";
import AthleteStatChart from "@/components/AthleteStatChart";

const AthleteStats = () => {
  const { athleteId } = useParams<{ athleteId: string }>();

  const queryClient = useQueryClient();

  // Try to read from cache
  const athletes = queryClient.getQueryData<Athlete[]>(["athletes"]);
  const cachedAthlete = athletes?.find((a) => a._id === athleteId);

  const {
    data: stats,
    isLoading,
    error,
  } = useQuery<Stat[]>({
    queryKey: ["stats"],
    queryFn: () => sportsDataService.getStats(athleteId!),
    enabled: !!athleteId,
  });

  if (stats) console.log(stats);

  if (isLoading) return <Loader className="animate-spin" />;
  if (error) return <p>{error.message}</p>;

  return (
    <div>
      <div>
        <p>{cachedAthlete?.name}</p>
        <p>Id {athleteId}</p>
      </div>
      <CreateAthleteStat />
      <AthleteStatChart stats={stats!} />
      <AthleteStatsList stats={stats!} />
    </div>
  );
};

export default AthleteStats;
