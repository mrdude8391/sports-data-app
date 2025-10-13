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
import AthleteStatRadial from "@/components/AthleteStatRadar";

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

  if (isLoading) return <Loader className="animate-spin" />;
  if (error) return <p>{error.message}</p>;

  return (
    <div className="flex flex-col gap-6 w-full max-w-6xl py-3">
      <div>
        <p>{cachedAthlete?.name}</p>
        <p>Id {athleteId}</p>
      </div>
      <CreateAthleteStat />
      <AthleteStatRadial stats={stats!} />
      <AthleteStatChart stats={stats!} />
      <AthleteStatsList stats={stats!} />
    </div>
  );
};

export default AthleteStats;
