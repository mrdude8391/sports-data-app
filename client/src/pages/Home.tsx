import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { Link } from "react-router-dom";

const Home = () => {
  const { isLoggedIn } = useAuth();
  return (
    <div className="flex flex-col w-full h-svh items-center justify-start">
      {isLoggedIn ? (
        <div className="card-container sm:w-2xl flex flex-col gap-4 justify-center">
          <h1>Welcome to your volleyball tracker!</h1>

          <Link key="Login" to="/athletes">
            <Button variant="secondary">Go to athletes</Button>
          </Link>
        </div>
      ) : (
        <div className="card-container flex flex-col  gap-4">
          <h1>Welcome to your volleyball tracker!</h1>
          <p className="text-foreground/80">
            You are currently not logged in. Please login or sign up!
          </p>
          <div className="flex gap-4">
            <Link key="Login" to="/login">
              <Button>Login</Button>
            </Link>
            <Link key="Register" to="/register">
              <Button variant="secondary">Sign Up</Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
