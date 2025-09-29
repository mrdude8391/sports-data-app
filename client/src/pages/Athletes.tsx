import AthleteCard from "@/components/AthleteCard";
import { useEffect, useState } from "react";
import type { Athlete } from "@/types/Athlete";
import * as sportsDataService from "../services/sportsDataService";
import sampleImage from "../assets/circle-user-round.svg";
import { useAuth } from "@/context/AuthContext";
import { Loader } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import CreateAthlete from "@/components/CreateAthlete";
import DeleteAthlete from "@/components/DeleteAthlete";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Athletes = () => {
  // const [athletes, setAthletes] = useState<Athlete[]>([]);
  // const [loading, setLoading] = useState(true);

  // const { isLoggedIn } = useAuth();

  // const fetchAthletes = async () => {
  //   try {
  //     setLoading(true);
  //     const athletes = await sportsDataService.getAthletes();
  //     // setAthletes(res);
  //     return athletes
  //   } catch (error) {
  //     console.log(error)
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // useEffect(() => {
  //   fetchAthletes();
  //   console.log("fetch athletes", athletes);
  // }, []);

  //  return (
  //   <div className="flex flex-col gap-5">
  //     {isLoggedIn ? (
  //       loading ? (
  //         <Loader className="animate-spin" />
  //       ) : (
  //         athletes.map((athlete) => (
  //           <AthleteCard
  //             key={athlete._id}
  //             imageSrc={sampleImage}
  //             athlete={athlete.name}
  //           />
  //         ))
  //       )
  //     ) : (
  //       <AthleteCard imageSrc={sampleImage} athlete="No user logged in" />
  //     )}

  //     <div className="min-w-lg min-h-10 border-2"></div>
  //   </div>
  // );

  const {
    data: athletes,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["athletes"],
    queryFn: sportsDataService.getAthletes,
  });

  if (isLoading) return <Loader className="animate-spin" />;
  if (error)
    return <AthleteCard imageSrc={sampleImage} athlete="No user logged in" />;

  return (
    <div className="flex flex-col gap-5">
      <CreateAthlete></CreateAthlete>
      {athletes &&
        athletes.map((a: Athlete) => (
          <div key={a._id} className="flex flex-row">
            <AthleteCard imageSrc={sampleImage} athlete={a.name} />
            <Link to={`/athletes/${a._id}/stats`}>
              <Button>View Stats</Button>
            </Link>
            <DeleteAthlete id={a._id} />
          </div>
        ))}
    </div>
  );
};

export default Athletes;
