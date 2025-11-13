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
    <div className="relative flex gap-3 items-center lg:hidden">
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
        className={`fixed bottom-0 left-0 top-11 mt-3 w-full h-full bg-neutral-900 shadow-md transform ${
          isOpen ? "opacity-100  translate-y-0.5" : "opacity-0 translate-y-full"
        } transition-opacity duration-300`}
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
                <Button variant="secondary" onClick={logout}>
                  Logout
                </Button>
              ) : (
                <Button variant="secondary">
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
