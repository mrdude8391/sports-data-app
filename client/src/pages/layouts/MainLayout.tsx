import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <>
      <Navbar />
      <div className="flex flex-col w-full max-w-screen min-h-screen justify-center items-center p-10">
        <Outlet />
      </div>
      <Footer />
    </>
  );
};

export default MainLayout;
