import type {
  LoginPayload,
  RegisterPayload,
  User,
} from "@/features/auth/types/Auth";
import { setLogoutCallback } from "@/lib/api";
import { login, register } from "@/lib/auth";
import {
  useMutation,
  type UseMutationResult,
  useQueryClient,
} from "@tanstack/react-query";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useNavigate } from "react-router-dom";
import { logger } from "@/lib/logger";

interface AuthProviderType {
  user: User | null;
  logout: () => void;
  useLogin: () => UseMutationResult<User, Error, LoginPayload, unknown>;
  useRegister: () => UseMutationResult<User, Error, RegisterPayload, unknown>;
}

export const AuthContext = createContext<AuthProviderType | null>(null);

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();
  const queryclient = useQueryClient();

  const useLogin = () =>
    useMutation({
      mutationFn: login,
      onSuccess: (user) => {
        logger.info("Login Successful.");
        localStorage.setItem("user", JSON.stringify(user));
        setUser(user);
        logger.info("Set current user context", user);
        navigate("/athletes");
      },
    });

  const useRegister = () =>
    useMutation({
      mutationFn: register,
      onSuccess: (user) => {
        logger.info("Register Successful.");
        localStorage.setItem("user", JSON.stringify(user));
        setUser(user);
        logger.info("Set current user context", user);
        navigate("/profile");
      },
    });

  const logout = () => {
    logger.info("Client Logged Out.");
    localStorage.clear();
    setUser(null);
    queryclient.clear();
    navigate("/login");
  };

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      const user = JSON.parse(savedUser);
      setUser(user);
    } else {
      setUser(null);
    }

    setLogoutCallback(logout);
  }, []);

  return (
    <AuthContext.Provider value={{ user, useLogin, logout, useRegister }}>
      {children}
    </AuthContext.Provider>
  );
};
export default AuthProvider;

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
