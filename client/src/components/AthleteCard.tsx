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
    <div className="flex flex-col gap-2 w-full items-center border-1 rounded-lg px-4 py-3">
      <div className="w-full ">
        <Link
          to={`/athletes/${athlete._id}/stats`}
          className="flex items-center justify-start rounded-lg px-3 py-2 hover:bg-stone-200"
        >
          <img
            src={imageSrc}
            height={48}
            width={48}
            className="border-1 rounded-full flex-shrink-0"
          />
          <div className="px-3 py-1 rounded-lg ">{athlete.name}</div>
        </Link>
      </div>
    </div>
  );
};

export default AthleteCard;
