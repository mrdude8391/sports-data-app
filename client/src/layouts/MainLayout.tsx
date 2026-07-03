import Navbar from "@/components/layout/Navbar";
import { Footer } from "react-day-picker";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <>
      <Navbar />
      <div className="flex flex-col mx-auto my-4 padding-container w-full max-w-screen min-h-svh items-center">
        <Outlet />
      </div>
      <Footer />
    </>
  );
};

export default MainLayout;
