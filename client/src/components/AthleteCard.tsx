import { Image } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import DeleteAthlete from "./DeleteAthlete";
import type { Athlete } from "@/types/Athlete";

interface AthleteCardProps {
  imageSrc: string;
  athlete: Athlete;
}

const AthleteCard = (props: AthleteCardProps) => {
  const { imageSrc, athlete } = props;
  return (
    <div className="w-full flex items-center justify-between gap-3 rounded-lg ">
      <Link
        to={`/athletes/${athlete._id}/stats`}
        className="flex items-center w-full justify-start rounded-lg px-3 py-3 gap-3 hover:bg-accent dark:hover:bg-accent/50"
      >
        <img
          src={imageSrc}
          height={48}
          width={48}
          className="border-1 rounded-full bg-white flex-shrink-0"
        />
        <p>{athlete.name}</p>
      </Link>
    </div>
  );
};

export default AthleteCard;
