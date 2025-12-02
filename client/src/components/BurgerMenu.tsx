import { NAV_LINKS_LOGGED_IN, NAV_LINKS_LOGGED_OUT } from "@/constants";
import { Link } from "react-router-dom";
import { Menu, SunMoon, X } from "lucide-react";
import { Button } from "./ui/button";
import { useTheme } from "@/context/ThemeProvider";
import { useAuth } from "@/context/AuthContext";

interface BurgerMenuProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export const BurgerMenu = ({ isOpen, setIsOpen }: BurgerMenuProps) => {
  const { flipTheme } = useTheme();
  const { isLoggedIn, user, logout } = useAuth();

  return (
    <div className=" flex gap-3 items-center lg:hidden">
      <Button
        size="icon"
        variant="ghost"
        className="mt-0.5"
        onClick={flipTheme}
      >
        <SunMoon className="size-5" />
      </Button>
      {/* menu button */}
      <Button
        size="icon"
        variant="ghost"
        className="inline-block cursor-pointer lg:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? (
          <X className="size-5 inline-block cursor-pointer" />
        ) : (
          <Menu className="size-5 inline-block cursor-pointer" />
        )}
      </Button>

      {/* menu */}
      <div
        className={`absolute top-[97%] left-0 right-0 h-0 opacity-0 overflow-hidden bg-neutral-900 shadow-md transform transition-all duration-300
          ${isOpen ? "opacity-100 h-lvh max-h-lvh" : ""}`}
      >
        {isOpen && (
          <nav className="py-2 ">
            <ul className="space-y-2 flex items-center justify-end flex-col p-2">
              {isLoggedIn && user
                ? NAV_LINKS_LOGGED_IN.map((link) => (
                    <Link
                      to={link.href}
                      key={link.key}
                      className=" text-white hover:font-bold py-1 w-full text-center"
                      onClick={() => setIsOpen(false)}
                    >
                      {link.label}
                    </Link>
                  ))
                : NAV_LINKS_LOGGED_OUT.map((link) => (
                    <Link
                      to={link.href}
                      key={link.key}
                      className=" text-white hover:font-bold py-1 w-full text-center"
                      onClick={() => setIsOpen(false)}
                    >
                      {link.label}
                    </Link>
                  ))}
              {isLoggedIn && user ? (
                <Button
                  variant="secondary"
                  onClick={() => {
                    logout;
                    setIsOpen(false);
                  }}
                >
                  Logout
                </Button>
              ) : (
                <Button variant="secondary" onClick={() => setIsOpen(false)}>
                  <Link key="Login" to="/login">
                    Login
                  </Link>
                </Button>
              )}
            </ul>
          </nav>
        )}
      </div>
    </div>
  );
};
