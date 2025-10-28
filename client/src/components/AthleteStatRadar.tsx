import type { Stat } from "@/types/Stat";
import {
  Legend,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import type { StatCategory } from "@/types/Stat";

interface AthleteStatRadarProps {
  stats: Stat[];
}

const data = [
  {
    subject: "Math",
    A: 120,
    B: 110,
    fullMark: 150,
  },
  {
    subject: "Chinese",
    A: 98,
    B: 130,
    fullMark: 150,
  },
  {
    subject: "English",
    A: 86,
    B: 130,
    fullMark: 150,
  },
  {
    subject: "Geography",
    A: 99,
    B: 100,
    fullMark: 150,
  },
  {
    subject: "Physics",
    A: 85,
    B: 90,
    fullMark: 150,
  },
  {
    subject: "History",
    A: 65,
    B: 85,
    fullMark: 150,
  },
];

const AthleteStatRadar = (props: AthleteStatRadarProps) => {
  const { stats } = props;

  const normalize = (raw: number, min: number, max: number) => {
    return (raw - min) / (max - min);
  };

  const transformData = (stats: Stat[]) => {
    let attackPercentageTotal = 0;
    let settingAssistsTotal = 0;
    let settingErrorsTotal = 0;
    let servingPercentageTotal = 0;
    let receivingRatingTotal = 0;
    let defenseRatingTotal = 0;
    let blockingTotal = 0;
    let blockingAttempts = 0;

    let count = 0;
    stats.map((stat) => {
      attackPercentageTotal += stat.attack.percentage;
      settingAssistsTotal += stat.setting.assists;
      settingErrorsTotal += stat.setting.errors;
      servingPercentageTotal += stat.serving.percentage;
      receivingRatingTotal += stat.receiving.rating;
      defenseRatingTotal += stat.defense.rating;
      blockingTotal += stat.blocking.total;
      blockingAttempts += stat.blocking.attempts;
      count += 1;
    });

    const formatted = [
      {
        // chance of player scoring on attack
        category: "Attack",
        value: count
          ? Math.round((attackPercentageTotal / count) * 1000) / 10
          : 0,
      },
      {
        // chance of player serving without error
        category: "Serving",
        value: count
          ? Math.round((servingPercentageTotal / count) * 1000) / 10
          : 0,
      },
      {
        // rating of the players receiving out of 100
        category: "Receiving",
        value: count
          ? Math.round(
              normalize(receivingRatingTotal / count / 3, 0.333, 1) * 1000
            ) / 10
          : 0,
        // divide by 3 because 3 is a perfect pass, so we are taking the average pass rating total/ perfect pass
      },
      {
        // how often a players sets results in an assist vs an error
        category: "Setting",
        value: settingErrorsTotal
          ? Math.round((settingAssistsTotal / settingErrorsTotal) * 1000) / 10
          : 0,
      },
      {
        // rating of a players passes while on defense
        category: "Defense",
        value: count
          ? Math.round(
              normalize(defenseRatingTotal / count / 3, 0.333, 1) * 1000
            ) / 10
          : 0,
      },
      {
        // chances of the player getting a block
        category: "Blocking",
        value: blockingAttempts
          ? Math.round((blockingTotal / blockingAttempts) * 1000) / 10
          : 0,
      },
    ];

    return formatted;
  };

  const chartData = transformData(stats);

  return (
    <div className="card-container w-full">
      <ResponsiveContainer width={"100%"} height={350}>
        <RadarChart outerRadius={150} width={730} height={300} data={chartData}>
          <PolarGrid />
          <PolarAngleAxis dataKey={"category"} />
          <PolarRadiusAxis angle={30} domain={[0, 100]} />
          <Radar
            dataKey="value"
            stroke="#8884d8"
            fill="#8884d8"
            fillOpacity={0.6}
          />
          <Tooltip />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AthleteStatRadar;
