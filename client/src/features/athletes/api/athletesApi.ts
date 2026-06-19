import { api } from "@/lib/api";
import type {
  NewAthlete,
  Athlete,
  AthleteListResponse,
} from "../types/Athlete";

export const createAthlete = async (athlete: NewAthlete): Promise<Athlete> => {
  // console.log("Create athlete", athlete)
  const response = await api.post<Athlete>("/athlete/create", athlete);
  return response.data;
};

export const deleteAthlete = async (id: string) => {
  // console.log("Delete athlete", {id})
  await api.delete(`/athlete/${id}`);
};

// getAthlete API method
export const getAthletes = async ({
  pageParam,
}: {
  pageParam: string | null;
}): Promise<AthleteListResponse> => {
  console.log(pageParam);
  const response = await api.get<AthleteListResponse>(
    `/athlete/?cursor=${pageParam}&limit=1`,
  );
  console.log(response);
  return response.data;
};
