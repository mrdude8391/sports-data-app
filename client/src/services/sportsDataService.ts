import type { Athlete, NewAthlete } from "@/types/Athlete";
import type {
  AthleteStatResponse,
  NewStatPayload,
  Stat,
  StatForm,
} from "@/types/Stat";
import axios, { AxiosError } from "axios";
import type { LoginPayload, User, RegisterPayload } from "@/types/Auth";

export interface ApiError {
  message: string;
  error: string;
  status: number;
}

const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_URL,
});

let logoutCallback: () => void | null;

export const setLogoutCallback = (cb: () => void) => {
  logoutCallback = cb;
};

api.interceptors.request.use((config) => {
  const savedUser = localStorage.getItem("user");
  if (savedUser) {
    const user: User = JSON.parse(savedUser);
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError<ApiError>) => {
    if (error.response && error.status === 401) {
      // console.log("Error 401: Unauthorized token. Clearing local storage token")
      logoutCallback();
    }
    console.log(error);
    const normalizedError = {
      message: error.response?.data?.message ?? "Unknown error",
      error: error.response?.data?.error ?? "UNKNOWN_ERROR",
      status: error.response?.status,
    };

    return Promise.reject(normalizedError);
  },
);

export const test = async () => {
  try {
    const res = await api.get("/test");

    console.log("API Test Service", API_URL);
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
  try {
    // console.log("create stat", form)
    const { athleteId, statForm } = newStat;
    await api.post(`/athlete/${athleteId}/stats`, statForm);
  } catch (error: any) {
    throw new Error(error.response.data.detail);
  }
};

export const createStatsBatch = async ({
  forms,
}: {
  forms: Map<string, StatForm>;
}) => {
  try {
    // console.log("create stats batch")
    const payload = Array.from(forms.entries()).map(([id, form]) => ({
      athleteId: id,
      ...form,
    }));
    // Form.entries turns the map into an iterable tuple.
    // array from turns the iterator into an array of tuples
    // map generates an array of objects => callback function turns every tuple into an object.
    await api.post(`/athlete/stats`, payload);
  } catch (error: any) {
    throw new Error(error.response.data.detail);
  }
};

export const editStat = async (req: {
  statId: string;
  form: StatForm;
  date: Date;
}) => {
  try {
    // console.log("edit stat", req.form)
    const payload = { ...req.form, recordedAt: req.date };
    await api.patch(`/athlete/${req.statId}/stats`, payload);
  } catch (error: any) {
    throw new Error(error.response.data.detail);
  }
};

export const getAthleteWithStats = async (
  id: string,
): Promise<AthleteStatResponse> => {
  try {
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
  } catch (error: any) {
    if (error.status === 500) {
      throw new Error("There was an error retreiving the data");
    }
    throw new Error(error.response.data.detail);
  }
};

export const deleteStat = async (statId: string) => {
  try {
    // console.log("delete stat", statId)
    await api.delete(`/athlete/${statId}/stats`);
  } catch (error: any) {
    throw new Error(error.response.data.detail);
  }
};
