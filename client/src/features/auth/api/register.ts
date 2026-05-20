import { api } from "@/lib/api";
import type { RegisterPayload, User } from "../types/Auth";

export const register = async (
  registerInfo: RegisterPayload,
): Promise<User> => {
  const response = await api.post<User>("/auth/register", registerInfo);
  return response.data;
};
