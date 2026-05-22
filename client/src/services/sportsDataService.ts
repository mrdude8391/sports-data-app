import type { Athlete, NewAthlete } from "@/features/athletes/types/Athlete";

import type {
  LoginPayload,
  User,
  RegisterPayload,
} from "@/features/auth/types/Auth";
import type {
  NewStatPayload,
  NewStat,
  AthleteStatResponse,
  Stat,
} from "@/features/stats/types/Stat";
import { api } from "@/lib/api";

export const test = async () => {
  try {
    const res = await api.get("/test");
    return res;
  } catch (error: any) {
    console.log("API Test Service", error);
    throw new Error(error.response?.data?.detail || "Test Failed");
  }
};

export const login = async (loginInfo: LoginPayload): Promise<User> => {
  const response = await api.post<User>("/auth/login", loginInfo);
  return response.data;
};

export const register = async (
  registerInfo: RegisterPayload,
): Promise<User> => {
  const response = await api.post<User>("/auth/register", registerInfo);
  return response.data;
};

export const profile = async (): Promise<User> => {
  const response = await api.get<User>("/auth/profile");
  return response.data;
};

export const getAthletes = async (): Promise<Athlete[]> => {
  const response = await api.get<Athlete[]>("/athlete/");
  return response.data;
};

export const createAthlete = async (athlete: NewAthlete): Promise<Athlete> => {
  // console.log("Create athlete", athlete)
  const response = await api.post<Athlete>("/athlete/create", athlete);
  return response.data;
};

export const deleteAthlete = async (id: string) => {
  // console.log("Delete athlete", {id})
  await api.delete(`/athlete/${id}`);
};

export const createStat = async (newStat: NewStatPayload) => {
  const { athleteId, statForm } = newStat;
  await api.post(`/athlete/${athleteId}/stats`, statForm);
};

export const createStatsBatch = async ({
  forms,
}: {
  forms: Map<string, NewStat>;
}) => {
  // console.log("create stats batch")
  const payload = Array.from(forms.entries()).map(([id, form]) => ({
    athleteId: id,
    ...form,
  }));
  // Form.entries turns the map into an iterable tuple.
  // array from turns the iterator into an array of tuples
  // map generates an array of objects => callback function turns every tuple into an object.
  await api.post(`/athlete/stats`, payload);
};

export const editStat = async (req: {
  statId: string;
  form: NewStat;
  date: Date;
}) => {
  const payload = { ...req.form, recordedAt: req.date };
  await api.patch(`/athlete/${req.statId}/stats`, payload);
};

export const getAthleteWithStats = async (
  id: string,
): Promise<AthleteStatResponse> => {
  // console.log("Get Stats for: ", id)
  // Need to add a check for ID to be mongodb ObjectID
  const { data } = await api.get<AthleteStatResponse>(`/athlete/${id}/stats`);
  const stats: Stat[] = data.stats.map((stat) => ({
    ...stat,
    recordedAt: new Date(stat.recordedAt),
    createdAt: new Date(stat.createdAt),
    updatedAt: new Date(stat.updatedAt),
  }));
  const athlete = data.athlete;

  return { athlete, stats };
};

export const deleteStat = async (statId: string) => {
  // console.log("delete stat", statId)
  await api.delete(`/athlete/${statId}/stats`);
};
