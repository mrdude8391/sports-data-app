import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { Link } from "react-router-dom";

const Home = () => {
  const { isLoggedIn } = useAuth();
  return (
    <div className="flex flex-col w-full h-svh items-center justify-center">
      {isLoggedIn ? (
        <div className="card-container flex justify-center">
          <p>Logged in home</p>
        </div>
      ) : (
        <div className="card-container flex flex-col items-center gap-3">
          <p>! Logged in Home</p>
          <Link key="Login" to="/login">
            <Button>Click to login</Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Home;
