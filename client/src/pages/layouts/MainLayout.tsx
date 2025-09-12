import React from "react";
import { Link, Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <div className="flex flex-col h-screen items-center justify-between">
      <header className="flex w-full justify-between ">
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/login">Login</Link>
        <Link to="/profile">Profile</Link>
        <Link to="/athletes">Athletes</Link>
      </header>

      <div>
        <Outlet />
      </div>

      <footer className="flex justify-center w-full bg-gray-100">Footer</footer>
    </div>
  );
};

export default MainLayout;
