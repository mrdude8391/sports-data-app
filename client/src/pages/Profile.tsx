import AthleteCard from "@/components/AthleteCard";
import { Image } from "lucide-react";
import sampleImage from "../assets/sampleImage.png";
import React from "react";

const Profile = () => {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-5 items-center  rounded-lg px-5 py-2">
        <img height={48} width={48} src={sampleImage}></img>
        <div className="px-3 py-1 border-1 rounded-lg">My Profile Data</div>
      </div>
      <div className="flex flex-col gap-5 py-10 px-15 border-2 rounded-xl">
        <AthleteCard imageSrc={sampleImage} athlete="Micaa" />
        <AthleteCard imageSrc={sampleImage} athlete="Gage" />
        <AthleteCard imageSrc={sampleImage} athlete="Joe" />
      </div>
    </div>
  );
};

export default Profile;
