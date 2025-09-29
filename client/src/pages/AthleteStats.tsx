import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import * as sportsDataService from "@/services/sportsDataService";
import { useQuery } from "@tanstack/react-query";
import { Loader } from "lucide-react";
import type { Stat } from "@/types/Stat";
import AthleteStatsList from "@/components/AthleteStatsList";
import CreateAthleteStat from "@/components/CreateAthleteStat";

const AthleteStats = () => {
  const { athleteId } = useParams<{ athleteId: string }>();

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
    <div>
      AthleteStats
      <div>{athleteId}</div>
      <CreateAthleteStat />
      <AthleteStatsList stats={stats!} />
    </div>
  );
};

export default AthleteStats;
