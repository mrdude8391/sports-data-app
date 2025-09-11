import React from "react";
import { Link, Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <div className="flex flex-col h-screen items-center justify-between">
      <header className="flex  gap-1">
        Header
        <Link to="/">Home</Link>
        <Link to="/about">about</Link>
        <Link to="/login">login</Link>
      </header>

      <div>
        <Outlet />
      </div>

      <footer>Footer</footer>
    </div>
  );
};

export default MainLayout;
