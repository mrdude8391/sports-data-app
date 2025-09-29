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
      {athletes && athletes.length > 0 ? (
        athletes.map((a: Athlete) => (
          <div key={a._id} className="flex flex-row">
            <AthleteCard imageSrc={sampleImage} athlete={a.name} />
            <Link to={`/athletes/${a._id}/stats`}>
              <Button>View Stats</Button>
            </Link>
            <DeleteAthlete id={a._id} />
          </div>
        ))
      ) : (
        <p>No Athletes</p>
      )}
    </div>
  );
};

export default Athletes;
