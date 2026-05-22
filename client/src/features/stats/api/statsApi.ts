import { api } from "@/lib/api";
import type {
  NewStatPayload,
  NewStat,
  AthleteStatResponse,
  Stat,
} from "../types/Stat";

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
