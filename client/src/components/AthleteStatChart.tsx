import type { Stat } from "@/types/Stat";
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend } from "recharts";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import { STAT_FIELDS } from "@/constants";

interface AthleteStatChartProps {
  stats: Stat[];
}

const AthleteStatChart = (props: AthleteStatChartProps) => {
  const { stats } = props;

  //   const [data, setData] = useState([]);

  //   const convertStats = (stats: Stat[]) => {
  //     const data = stats.map((stat) => {});
  //     return data;
  //   };

  useEffect(() => {
    console.log(stats);
  }, []);

  return (
    <div className="flex flex-col">
      <Select>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select a bitch" />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(STAT_FIELDS).map(([category, field]) => (
            <SelectGroup key={category}>
              <SelectLabel>{category}</SelectLabel>
              {field.map(({ key, label }) => (
                <SelectItem key={key} value={label}>
                  {label}
                </SelectItem>
              ))}
            </SelectGroup>
          ))}
        </SelectContent>
      </Select>
      <LineChart width={600} height={300} data={stats}>
        <XAxis
          dataKey="createdAt"
          tickFormatter={(date) => new Date(date).toLocaleDateString("en-UB")}
        />
        <YAxis />
        <Tooltip
          labelFormatter={(date) => new Date(date).toLocaleDateString("en-UB")}
        />
        <Legend />
        <Line type="monotone" dataKey="attack.kills" />
      </LineChart>
    </div>
  );
};

export default AthleteStatChart;
