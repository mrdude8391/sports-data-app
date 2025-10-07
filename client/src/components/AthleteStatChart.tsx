import type { Stat } from "@/types/Stat";

interface AthleteStatChartProps {
  stats: Stat[];
}

const AthleteStatChart = (props: AthleteStatChartProps) => {
  const { stats } = props;
  return <div>AthleteStatChart</div>;
};

export default AthleteStatChart;
