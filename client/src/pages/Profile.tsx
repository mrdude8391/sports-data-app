import AthleteCard from "@/components/AthleteCard";
import sampleImage from "../assets/circle-user-round.svg";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import * as sportsDataService from "../services/sportsDataService";

const Profile = () => {
  // const [username, setUsername] = useState("");

  const { user, login } = useAuth();

  // const getProfile = async () => {
  //   try {
  //     console.log("get profile");
  //     if (user) {
  //       setUsername(user.username);
  //     } else {
  //       const tempUser = await sportsDataService.profile();
  //       if (tempUser) {
  //         login(tempUser);
  //         setUsername(tempUser.username);
  //       }
  //     }
  //   } catch (error: any) {
  //     console.log(error.message);
  //   }
  // };

  useEffect(() => {
    // getProfile();
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
