import { Image } from "lucide-react";
import React from "react";

interface AthleteCardProps {
  imageSrc: string;
  athlete: string;
}

const AthleteCard = (props: AthleteCardProps) => {
  const { imageSrc, athlete } = props;
  return (
    <div className="flex w-full gap-5 items-center border-1 rounded-lg px-5 py-2">
      <img
        src={imageSrc}
        height={48}
        width={48}
        className="border-1 rounded-full p-2"
      />
      <div className="px-3 py-1 border-1 rounded-lg">{athlete}</div>
    </div>
  );
};

export default AthleteCard;
