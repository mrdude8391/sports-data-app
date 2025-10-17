import { NAV_LINKS } from "@/constants";
import { useAuth } from "@/context/AuthContext";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { BurgerMenu } from "./BurgerMenu";

const Navbar = () => {
  // Nav bar links are configured in the NAV_LINKS list in the index.ts file
  const [isOpen, setIsOpen] = useState(false);
  const closeMenu = () => setIsOpen(false);
  const { user, isLoggedIn, logout } = useAuth();

  return (
    <>
      <nav className="sticky w-full top-0 left-0 z-30 bg-white shadow-sm ">
        <div className="flex items-center justify-between max-container padding-container z-30 py-1">
          <Link to="/" onClick={closeMenu}>
            <p className=" transition-all hover:font-bold py-3 px-3">
              Athlete App
            </p>
          </Link>
          <ul className="hidden lg:flex h-full gap-12 ">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.key}
                to={link.href}
                className="flex items-center justify-center transition-all hover:font-bold"
              >
                {link.label}
              </Link>
            ))}
            {isLoggedIn && user && <Button onClick={logout}> Logout</Button>}
          </ul>
          <BurgerMenu isOpen={isOpen} setIsOpen={setIsOpen} />
        </div>
      </nav>
    </>
  );
};

export default Navbar;
