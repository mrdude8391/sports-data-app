import { api } from "@/lib/api";
import type {
  NewAthlete,
  Athlete,
  AthleteListResponse,
  GetAthletePageParams,
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

export const getAthletesPaginated = async ({
  pageParam,
}: {
  pageParam: GetAthletePageParams;
}): Promise<AthleteListResponse> => {
  const { cursor } = pageParam;
  console.log("Cursor: ", cursor);
  const response = await api.get<AthleteListResponse>(
    `/athlete/?cursor=${cursor}&limit=1`,
  );
  console.log("getAthletesPaginated: ", response);
  return response.data;
};
