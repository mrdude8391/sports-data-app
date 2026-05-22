import { api } from "@/lib/api";
import type { NewAthlete, Athlete } from "../types/Athlete";

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
export const getAthletes = async (): Promise<Athlete[]> => {
  const response = await api.get<Athlete[]>("/athlete/");
  return response.data;
};
