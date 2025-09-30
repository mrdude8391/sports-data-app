import AthleteCard from "@/components/AthleteCard";
import sampleImage from "../assets/circle-user-round.svg";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import * as sportsDataService from "../services/sportsDataService";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { user, isLoggedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) navigate("/login");
  }, []);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-5 items-center  rounded-lg px-5 py-2">
        <img height={48} width={48} src={sampleImage}></img>
        <div className="px-3 py-1 border-1 rounded-lg">{user?.username}</div>
      </div>
      <div className="flex flex-col gap-5 py-10 px-15 border-2 rounded-xl">
        <AthleteCard imageSrc={sampleImage} athlete="Player" />
      </div>
    </div>
  );
};

export default Profile;
