import { NAV_LINKS } from "@/constants";
import React from "react";
import { useState } from "react";
import X_IMAGE from "@/assets/x.svg";
import MENU_IMAGE from "@/assets/menu.svg";
import { Link } from "react-router-dom";

interface BurgerMenuProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export const BurgerMenu = ({ isOpen, setIsOpen }: BurgerMenuProps) => {
  return (
    <div className="relative lg:hidden">
      {/* menu button */}
      <button
        className="inline-block cursor-pointer lg:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? (
          <img
            src={X_IMAGE}
            alt="x"
            width={24}
            height={24}
            className="inline-block cursor-pointer"
          ></img>
        ) : (
          <img
            src={MENU_IMAGE}
            alt="menu"
            width={24}
            height={24}
            className="inline-block cursor-pointer"
          ></img>
        )}
      </button>

      {/* menu */}
      <div
        className={`fixed bottom-0 left-0 top-18 mt-3 w-full h-full bg-black shadow-md transform ${
          isOpen ? "opacity-100  translate-y-0.5" : "opacity-0 translate-y-full"
        } transition-opacity duration-300`}
      >
        {isOpen && (
          <nav className="py-4 ">
            <ul className="shadow-lg space-y-4 flex items-center justify-end flex-col p-2">
              {NAV_LINKS.map((link) => (
                <Link
                  to={link.href}
                  key={link.key}
                  className=" text-white hover:font-bold"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </ul>
          </nav>
        )}
      </div>
    </div>
  );
};
