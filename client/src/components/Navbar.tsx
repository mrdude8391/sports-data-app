import { NAV_LINKS } from "@/constants";
import { useAuth } from "@/context/AuthContext";
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";

const Navbar = () => {
  // Nav bar links are configured in the NAV_LINKS list in the index.ts file

  const { user, isLoggedIn, login, logout } = useAuth();

  return (
    <>
      <nav className="sticky w-full bg-stone-200">
        <div className="max-container padding-container">
          <ul className="flex justify-between">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.key}
                to={link.href}
                className="flex items-center justify-center p-5"
              >
                {link.label}
              </Link>
            ))}
            {isLoggedIn && user && <Button onClick={logout}> Logout</Button>}
          </ul>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
