import { Image } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import DeleteAthlete from "./DeleteAthlete";
import type { Athlete } from "@/types/Athlete";

interface AthleteCardProps {
  imageSrc: string;
  athlete: Athlete;
  isEdit: boolean;
}

const AthleteCard = (props: AthleteCardProps) => {
  const { imageSrc, athlete, isEdit } = props;
  return (
    <div className="w-full flex items-center justify-between gap-3 border-1 rounded-lg">
      <Link
        to={`/athletes/${athlete._id}/stats`}
        className="flex items-center w-full justify-start rounded-lg px-3 py-3 gap-3 hover:bg-stone-200"
      >
        <img
          src={imageSrc}
          height={48}
          width={48}
          className="border-1 rounded-full flex-shrink-0"
        />
        <p>{athlete.name}</p>
      </Link>
      {isEdit && <DeleteAthlete id={athlete._id} />}
    </div>
  );
};

export default AthleteCard;
