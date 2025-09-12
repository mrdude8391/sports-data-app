import AthleteCard from "@/components/AthleteCard";
import React from "react";

const Athletes = () => {
  return (
    <div className="flex flex-col gap-5">
      <AthleteCard imageSrc="" athlete="" />
      <div className="min-w-lg min-h-10 border-2"></div>
    </div>
  );
};

export default Athletes;
