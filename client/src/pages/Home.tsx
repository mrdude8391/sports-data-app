import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { Link } from "react-router-dom";

const Home = () => {
  const { isLoggedIn } = useAuth();
  return (
    <div>
      {isLoggedIn ? (
        <div>Logged in home</div>
      ) : (
        <div className="flex flex-col gap-3">
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
