import { STAT_FIELDS } from "@/constants";
import type { Stat } from "@/types/Stat";
import { Button } from "./ui/button";

import * as sportsDataService from "@/services/sportsDataService";
import DeleteAthleteStat from "./DeleteAthleteStat";

interface AthleteStatsListProps {
  stats: Stat[];
}

const AthleteStatsList = (props: AthleteStatsListProps) => {
  const { stats } = props;

  return (
    <div>
      {stats && stats.length > 0 ? (
        <ul>
          {stats?.map((stat, index) => (
            <li key={stat._id}>
              <h3 className="font-bold mb-2">
                Game {index + 1} (
                {new Date(stat.recordedAt).toLocaleDateString()})
              </h3>
              {Object.entries(STAT_FIELDS).map(([category, fields]) => (
                <div key={category} className="mb-2">
                  <h4 className="font-semibold capitalize">{category}</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {fields.map(({ key, label }) => (
                      <div key={key} className="flex justify-between">
                        <span>{label}</span>
                        <span>{(stat as any)[category][key]}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              <div>
                <DeleteAthleteStat statId={stat._id} />
              </div>
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
