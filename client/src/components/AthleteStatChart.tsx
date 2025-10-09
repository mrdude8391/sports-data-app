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

  const [data, setData] = useState("");

  //   const convertStats = (stats: Stat[]) => {
  //     const data = stats.map((stat) => {});
  //     return data;
  //   };

  const handleValueChange = (value: any) => {
    setData(value);
    // Perform any other actions with the selected value here
  };

  return (
    <div className="flex flex-col">
      <p>{data}</p>
      <Select onValueChange={handleValueChange} value={data}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select a bitch" />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(STAT_FIELDS).map(([category, field]) => (
            <SelectGroup key={category}>
              <SelectLabel>{category}</SelectLabel>
              {field.map(({ key, label }) => (
                <SelectItem key={key} value={category + "." + key}>
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
        <Line type="monotone" dataKey={data} />
      </LineChart>
    </div>
  );
};

export default AthleteStatChart;
