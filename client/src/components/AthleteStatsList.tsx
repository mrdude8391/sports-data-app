import type { Stat } from "@/types/Stat";
import React from "react";

interface AthleteStatsListProps {
  stats: Stat[];
}

const AthleteStatsList = (props: AthleteStatsListProps) => {
  const { stats } = props;
  return (
    <div>
      {stats && stats.length > 0 ? (
        <ul>
          {stats?.map((stat) => (
            <li key={stat._id}>
              {stat.type} : {stat.value} (recorded{" "}
              {new Date(stat.recordedAt).toLocaleDateString()})
            </li>
          ))}
        </ul>
      ) : (
        <p>No Stats</p>
      )}
    </div>
  );
};

export default AthleteStatsList;
