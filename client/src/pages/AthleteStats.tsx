import { useEffect } from "react";
import { useParams } from "react-router-dom";

const AthleteStats = () => {
  const { athleteId } = useParams<{ athleteId: string }>();

  const fetchStats = (id?: string) => {
    if (id) {
      console.log(id);
    }
  };

  useEffect(() => {
    fetchStats(athleteId);
  }, []);
  return (
    <div>
      AthleteStats
      <div>{athleteId}</div>
    </div>
  );
};

export default AthleteStats;
