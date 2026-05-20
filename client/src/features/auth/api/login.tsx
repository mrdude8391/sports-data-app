import { api } from "@/lib/api";
import type { LoginPayload, User } from "../types/Auth";

export const loginApi = async (loginInfo: LoginPayload): Promise<User> => {
  const response = await api.post<User>("/auth/login", loginInfo);
  return response.data;
};
