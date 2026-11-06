import { api } from "@/lib/api";
import type {
  NewAthlete,
  Athlete,
  AthleteListResponse,
  GetAthletePageParams,
} from "../types/Athlete";
import { logger } from "@/lib/logger";

export const createAthlete = async (athlete: NewAthlete): Promise<Athlete> => {
  logger.debug("[athletesAPI.ts::createAthlete]", athlete);
  const response = await api.post<Athlete>("/athlete/create", athlete);
  return response.data;
};

export const deleteAthlete = async (id: string) => {
  logger.debug("[athletesAPI.ts::deleteAthlete]", { id });
  await api.delete(`/athlete/${id}`);
};

export const getAthletesPaginated = async ({
  pageParam,
}: {
  pageParam: GetAthletePageParams;
}): Promise<AthleteListResponse> => {
  const { cursor, limit } = pageParam;
  logger.debug("[athletesAPI.ts::GetAthletePageParams]", { cursor });
  const params = cursor
    ? `?limit=${limit}&cursor=${cursor}`
    : `?limit=${limit}`;
  const response = await api.get<AthleteListResponse>(`/athlete/${params}`);
  logger.debug("[athletesAPI.ts::GetAthletePageParams]", { response });
  return response.data;
};

export const getAthletes = async (): Promise<Athlete[]> => {
  const response = await api.get<Athlete[]>("/athlete/all");
  return response.data;
};
