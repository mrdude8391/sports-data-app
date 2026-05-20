import { loginApi } from "@/features/auth/api/login";
import type { LoginPayload, User } from "@/features/auth/types/Auth";
import { setLogoutCallback } from "@/lib/api";
import { useMutation, type UseMutationResult } from "@tanstack/react-query";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useNavigate } from "react-router-dom";

interface AuthProviderType {
  user: User | null;
  isLoggedIn: boolean;
  logout: () => void;
  useLogin: () => UseMutationResult<User, Error, LoginPayload, unknown>;
}

export const AuthContext = createContext<AuthProviderType | null>(null);

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  const useLogin = () =>
    useMutation({
      mutationFn: loginApi,
      onSuccess: (user) => {
        console.log("Login Successful");
        localStorage.setItem("user", JSON.stringify(user));
        setUser(user);
        console.log("Set current user context", user);
        setIsLoggedIn(true);
        navigate("/athletes");
      },
    });

  const logout = () => {
    console.log("Client Logout");
    localStorage.clear();
    setUser(null);
    setIsLoggedIn(false);
    navigate("/login");
  };

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      const user = JSON.parse(savedUser);
      setIsLoggedIn(true);
      setUser(user);
    }

    setLogoutCallback(logout);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, useLogin, logout }}>
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
