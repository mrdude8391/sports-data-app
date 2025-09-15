import Footer from "@/components/Footer";
import Header from "@/components/Header";
import React from "react";
import { Link, Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <>
      <Header />
      <div className="flex flex-col w-lg h-screen justify-center items-center">
        <Outlet />
      </div>
      <Footer />
    </>
  );
};

export default MainLayout;
