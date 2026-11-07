import { useQuery } from "@tanstack/react-query";
import { getAthleteWithStats } from "../api/statsApi";
import type { AthleteStatResponse } from "../types/Stat";

interface UseAthleteStatsProps {
  athleteId: string;
}

const initialData = {
  athlete: {
    id: "",
    name: "",
    age: 0,
    height: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  stats: [],
};

export const useAthleteStats = (props: UseAthleteStatsProps) => {
  const { athleteId } = props;
  return useQuery<AthleteStatResponse>({
    queryKey: ["stats", athleteId],
    queryFn: () => getAthleteWithStats(athleteId!),
    enabled: !!athleteId,
    initialData: initialData,
  });
};
