import type { UserResponse } from "@/types/User";
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
  user: UserResponse | null;
  isLoggedIn: boolean;
  login: (user: UserResponse) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserResponse | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const login = (user: UserResponse) => {
    localStorage.setItem("user", JSON.stringify(user));
    setUser(user);
    console.log("set user", user);
    setIsLoggedIn(true);
  };
  const navigate = useNavigate();

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
