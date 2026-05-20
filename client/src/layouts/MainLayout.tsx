import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
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
