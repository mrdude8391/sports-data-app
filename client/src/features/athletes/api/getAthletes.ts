import { api } from "@/lib/api";
import type { Athlete } from "../types/Athlete";
import { useQuery } from "@tanstack/react-query";

// getAthlete API method
export const getAthletes = async (): Promise<Athlete[]> => {
  const response = await api.get<Athlete[]>("/athlete/");
  return response.data;
};

// useGetAthlete hook using query
export const useAthletes = () => {
  return useQuery({
    queryKey: ["athletes"],
    queryFn: getAthletes,
  });
};
