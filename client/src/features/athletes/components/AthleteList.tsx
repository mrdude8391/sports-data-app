import type { Athlete, AthleteListResponse } from "../types/Athlete";
import DeleteAthlete from "./DeleteAthlete";
import sampleImage from "../../../assets/circle-user-round.svg";
import AthleteListItem from "./AthleteListItem";
import React from "react";

interface AthleteListProps {
  isEdit: boolean;
  pages: AthleteListResponse[];
}

const AthleteList = (athleteListProps: AthleteListProps) => {
  const { isEdit, pages } = athleteListProps;

  return (
    <div className="flex flex-col gap-1 w-full">
      {pages && pages.length > 0 ? (
        <ul className="flex w-full flex-col items-center ">
          {pages.map((group, i) => (
            <React.Fragment key={i}>
              {group.athleteList.map((athlete: Athlete) => (
                <li
                  key={athlete.id}
                  className="w-full flex flex-row items-center "
                >
                  <AthleteListItem imageSrc={sampleImage} athlete={athlete} />
                  {isEdit && <DeleteAthlete id={athlete.id} />}
                </li>
              ))}
            </React.Fragment>
          ))}
        </ul>
      ) : (
        <p>No athletes yet. Please create your first athlete</p>
      )}

      {/* Athlete List implementation */}
      {/* 
        <div className="flex flex-col gap-1 w-full">
          {athletes && athletes.length > 0 ? (
            <ul className="flex w-full flex-col items-center ">
              {athletes.map((athlete: Athlete) => (
                <li key={athlete.id} className="w-full flex flex-row items-center ">
                  <AthleteListItem imageSrc={sampleImage} athlete={athlete} />
                  {isEdit && <DeleteAthlete id={athlete.id} />}
                </li>
              ))}
            </ul>
          ) : (
            <p>No Athletes</p>
          )}
        </div> 
      */}
    </div>
  );
};

export default AthleteList;
