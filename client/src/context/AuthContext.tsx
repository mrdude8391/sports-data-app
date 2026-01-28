import type { AuthResponse } from "@/types/Auth";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useNavigate } from "react-router-dom";
import { setLogoutCallback } from "@/services/sportsDataService";

interface AuthContextType {
  user: AuthResponse | null;
  isLoggedIn: boolean;
  login: (user: AuthResponse) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthResponse | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  const login = (user: AuthResponse) => {
    localStorage.setItem("user", JSON.stringify(user));
    setUser(user);
    console.log("Set current user context", user);
    setIsLoggedIn(true);
  };

  const logout = () => {
    console.log("Logout Called");
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
    <AuthContext.Provider value={{ user, isLoggedIn, login, logout }}>
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
