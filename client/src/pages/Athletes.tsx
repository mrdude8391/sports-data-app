import AthleteCard from "@/components/AthleteCard";
import { useEffect, useState } from "react";
import type { Athlete } from "@/types/Athlete";
import * as sportsDataService from "../services/sportsDataService";
import sampleImage from "../assets/circle-user-round.svg";
import { useAuth } from "@/context/AuthContext";
import { Loader } from "lucide-react";

const Athletes = () => {
  const [athletes, setAthletes] = useState<Athlete[]>([]);
  const [loading, setLoading] = useState(true);

  const { isLoggedIn } = useAuth();

  useEffect(() => {
    const fetchAthletes = async () => {
      try {
        setLoading(true);
        const res = await sportsDataService.getAthletes();
        setAthletes(res);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };
    fetchAthletes();
    console.log("fetch athletes", athletes);
  }, []);
  return (
    <div className="flex flex-col gap-5">
      {isLoggedIn ? (
        loading ? (
          <Loader className="animate-spin" />
        ) : (
          athletes.map((athlete) => (
            <AthleteCard
              key={athlete._id}
              imageSrc={sampleImage}
              athlete={athlete.name}
            />
          ))
        )
      ) : (
        <AthleteCard imageSrc={sampleImage} athlete="No user logged in" />
      )}

      <div className="min-w-lg min-h-10 border-2"></div>
    </div>
  );
};

export default Athletes;
