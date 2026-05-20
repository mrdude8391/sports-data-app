import type { Athlete } from "../types/Athlete";
import AthleteCard from "./AthleteCard";
import DeleteAthlete from "./DeleteAthlete";
import sampleImage from "../../../assets/circle-user-round.svg";

interface AthleteListProps {
  isEdit: boolean;
  athletes: Athlete[];
}

const AthleteList = (athleteListProps: AthleteListProps) => {
  const { isEdit, athletes } = athleteListProps;

  return (
    <div className="flex flex-col gap-1 w-full">
      {athletes && athletes.length > 0 ? (
        <ul className="flex w-full flex-col items-center ">
          {athletes.map((athlete: Athlete) => (
            <li key={athlete.id} className="w-full flex flex-row items-center ">
              <AthleteCard imageSrc={sampleImage} athlete={athlete} />
              {isEdit && <DeleteAthlete id={athlete.id} />}
            </li>
          ))}
        </ul>
      ) : (
        <p>No Athletes</p>
      )}
    </div>
  );
};

export default AthleteList;
