import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeProvider";
import { Link } from "react-router-dom";
import { test } from "../services/sportsDataService";
import { useState } from "react";

const Home = () => {
  const { isLoggedIn } = useAuth();
  const { theme } = useTheme();

  const [status, setStatus] = useState<number | null>(null);
  return (
    <div className="flex flex-col w-full h-svh items-center justify-start">
      <div className="card-container sm:w-2xl flex flex-col gap-4 justify-center">
        <h1>Api Test</h1>

        <Button
          variant={theme == "dark" ? "secondary" : "default"}
          onClick={async () => {
            try {
              const res = await test();
              console.log("Home test button response", res);
              setStatus(res.status);
            } catch (error: any) {
              console.log(error);
            }
          }}
        >
          Test
        </Button>
        {status && <div>{status}</div>}
      </div>
      {isLoggedIn ? (
        <div className="card-container sm:w-2xl flex flex-col gap-4 justify-center">
          <h1>Welcome to your volleyball tracker!</h1>

          <Link key="Login" to="/athletes">
            <Button variant={theme == "dark" ? "secondary" : "default"}>
              Go to athletes
            </Button>
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
