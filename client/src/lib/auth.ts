import type {
  LoginPayload,
  User,
  RegisterPayload,
} from "@/features/auth/types/Auth";
import { api } from "@/lib/api";

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
