import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <>
      <Navbar />
      <div className="flex flex-col w-lg min-h-screen justify-center items-center">
        <Outlet />
      </div>
      <Footer />
    </>
  );
};

export default MainLayout;
