import { NAV_LINKS } from "@/constants";
import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <>
      <footer className="bg-accent flex flex-col items-center justify-center pb-16 lg:pb-4 pt-4">
        <div className="max-container padding-container flex w-full flex-col gap-10">
          {/* Line break 
          <hr className="shadow" />
          
          */}

          {/* Footer Elements */}
          <div className="flex flex-col lg:flex-row w-full justify-between gap-8 text-foreground/90">
            {/* YMT logo link to home*/}
            <div className="flex flex-col items-start gap-2">
              <Link to="/">
                <div className="flex flex-row items-center gap-2">
                  <p className="text-lg transition-all hover:font-bold">
                    Volleyball Stat App
                  </p>
                </div>
              </Link>
              <p className="text-sm">
                © 2025 Volleyball Stat App. All rights reserved.
              </p>
            </div>

            {/* Navigation Menu */}
            <div className="flex flex-col gap-2 ">
              {/* <p className="font-bold mb-1">Menu</p> */}
              <ul className="h-full gap-3 flex ">
                {NAV_LINKS.map((link) => (
                  <Link
                    to={link.href}
                    key={link.key}
                    className="text-sm flex transition-all hover:font-bold"
                  >
                    {link.label}
                  </Link>
                ))}
              </ul>
            </div>

            {/* Contact Information
            <div className="flex flex-col gap-2">
              <p className="bold-18 font-[spartan] text-gray-10 mb-1">
                Contact
              </p>
              <div className="flex flex-col gap-2">
                <p>📞 </p>
                <p>📧 @outlook.com</p>
              </div>
            </div> */}
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
