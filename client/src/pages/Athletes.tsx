import AthleteCard from "@/components/AthleteCard";
import type { Athlete } from "@/types/Athlete";
import * as sportsDataService from "../services/sportsDataService";
import sampleImage from "../assets/circle-user-round.svg";
import { Loader } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import CreateAthlete from "@/components/CreateAthlete";
const Athletes = () => {
  const {
    data: athletes,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["athletes"],
    queryFn: sportsDataService.getAthletes,
  });

  if (isLoading) return <Loader className="animate-spin" />;
  if (error) return <p>... No Athletes Found</p>;

  return (
    <div className="flex flex-col gap-5">
      <CreateAthlete></CreateAthlete>
      {athletes && athletes.length > 0 ? (
        athletes.map((a: Athlete) => (
          <div key={a._id} className="flex flex-row gap-4 items-center">
            <AthleteCard imageSrc={sampleImage} athlete={a} />
          </div>
        ))
      ) : (
        <p>No Athletes</p>
      )}
    </div>
  );
};

export default Athletes;
