import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { Link } from "react-router-dom";

const Home = () => {
  const { isLoggedIn } = useAuth();
  return (
    <div className="flex flex-col w-full h-svh items-center justify-start">
      {isLoggedIn ? (
        <div className="card-container sm:w-2xl flex flex-col gap-4 justify-center">
          <h1>Welcome back to your volleyball tracker</h1>

          <Link key="Login" to="/athletes">
            <Button variant="secondary">Go to athletes</Button>
          </Link>
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
