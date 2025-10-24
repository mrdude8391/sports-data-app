import { NAV_LINKS } from "@/constants";
import React from "react";
import { useState } from "react";
import X_IMAGE from "@/assets/x.svg";
import MENU_IMAGE from "@/assets/menu.svg";
import { Link } from "react-router-dom";
import { Menu, SunMoon, X } from "lucide-react";
import { Button } from "./ui/button";
import { useTheme } from "@/context/ThemeProvider";

interface BurgerMenuProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export const BurgerMenu = ({ isOpen, setIsOpen }: BurgerMenuProps) => {
  const { flipTheme } = useTheme();
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
          // <img
          //   src={X_IMAGE}
          //   alt="x"
          //   width={24}
          //   height={24}
          //   className="inline-block cursor-pointer"
          // ></img>
          <X className="size-5 inline-block cursor-pointer" />
        ) : (
          // <img
          //   src={MENU_IMAGE}
          //   alt="menu"
          //   width={24}
          //   height={24}
          //   className="inline-block cursor-pointer"
          // ></img>
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
          <nav className="py-4 ">
            <ul className=" space-y-4 flex items-center justify-end flex-col p-2">
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
