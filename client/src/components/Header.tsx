import React from "react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="flex w-full justify-between ">
      <div className="items-center justify-center">
        <Link to="/">Home</Link>
      </div>
      <Link to="/about">About</Link>
      <Link to="/login">Login</Link>
      <Link to="/profile">Profile</Link>
      <Link to="/athletes">Athletes</Link>
    </header>
  );
};

export default Header;
