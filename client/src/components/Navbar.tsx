import { NAV_LINKS_LOGGED_IN, NAV_LINKS_LOGGED_OUT } from "@/constants";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "./ui/button";
import { BurgerMenu } from "./BurgerMenu";
import { SunMoon, Volleyball } from "lucide-react";
import { useTheme } from "@/context/ThemeProvider";

const Navbar = () => {
  // Nav bar links are configured in the NAV_LINKS list in the index.ts file
  const [isOpen, setIsOpen] = useState(false);
  const closeMenu = () => setIsOpen(false);
  const { user, isLoggedIn, logout } = useAuth();
  const { flipTheme } = useTheme();
  let location = useLocation();
  const currentLocation = "/" + location.pathname.split("/")[1];

  return (
    <>
      <nav className="sticky w-full h-16 top-0 left-0 z-30 shadow-sm bg-background ">
        <div className="flex items-center h-full justify-between max-container padding-container z-30 py-2">
          <Link
            to="/"
            onClick={closeMenu}
            className="w-auto flex items-center py-3 px-3 font-semibold hover:font-bold"
          >
            <Volleyball className="size-5 mx-2" />
            Volleyball Tracker
          </Link>

          <ul className="hidden lg:flex h-full gap-6 items-center">
            {isLoggedIn && user
              ? NAV_LINKS_LOGGED_IN.map((link) => (
                  <li
                    key={link.key}
                    className={
                      currentLocation == link.href
                        ? "h-full flex items-center font-semibold border-b-2 border-primary "
                        : "h-full flex items-center"
                    }
                  >
                    <Link
                      key={link.key}
                      to={link.href}
                      className="nav-link-button"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))
              : NAV_LINKS_LOGGED_OUT.map((link) => (
                  <li
                    key={link.key}
                    className={
                      currentLocation == link.href
                        ? "h-full flex items-center font-semibold border-b-2 border-primary "
                        : "h-full flex items-center"
                    }
                  >
                    <Link to={link.href} className="nav-link-button">
                      {link.label}
                    </Link>
                  </li>
                ))}
            {isLoggedIn && user ? (
              <li>
                <Button onClick={logout}>Logout</Button>
              </li>
            ) : (
              <li>
                <Link key="Login" to="/login">
                  <Button>Login</Button>
                </Link>
              </li>
            )}
            <Button size="icon" variant="ghost" onClick={flipTheme}>
              <SunMoon className="size-5" />
            </Button>
          </ul>

          <BurgerMenu isOpen={isOpen} setIsOpen={setIsOpen} />
        </div>
      </nav>
    </>
  );
};

export default Navbar;
