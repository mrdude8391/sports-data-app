import { NAV_LINKS } from "@/constants";
import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
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
          </ul>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
