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
    <div className="flex flex-col gap-2 w-full items-center border-1 rounded-lg px-5 py-2">
      <div className="flex w-full items-center justify-start rounded-lg px-5 py-2">
        <img
          src={imageSrc}
          height={48}
          width={48}
          className="border-1 rounded-full flex-shrink-0"
        />
        <div className="px-3 py-1 rounded-lg ">{athlete.name}</div>
      </div>
      <div className="flex w-full justify-between">
        <Link to={`/athletes/${athlete._id}/stats`}>
          <Button>View Stats</Button>
        </Link>
        <DeleteAthlete id={athlete._id} />
      </div>
    </div>
  );
};

export default AthleteCard;
