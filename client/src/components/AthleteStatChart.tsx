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
import { STAT_FIELDS, STAT_INDEX } from "@/constants";

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

  const capitalize = (str: string) => {
    if (str == undefined || str.length === 0) return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const handleValueChange = (value: any) => {
    setData(value);
    // Perform any other actions with the selected value here
  };

  return (
    <div className="flex flex-col">
      <Select onValueChange={handleValueChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select a stat" />
        </SelectTrigger>
        <SelectContent>
          {STAT_INDEX.map(({ category, fields }) => (
            <SelectGroup key={category}>
              <SelectLabel>{capitalize(category)}</SelectLabel>
              {fields.map(({ key, label }) => (
                <SelectItem
                  key={key}
                  value={category.toLowerCase() + "." + key}
                >
                  {label}
                </SelectItem>
              ))}
            </SelectGroup>
          ))}
        </SelectContent>
      </Select>
      <LineChart width={600} height={300} data={stats}>
        <XAxis
          dataKey="recordedAt"
          tickFormatter={(date) => new Date(date).toLocaleDateString("en-UB")}
        />
        <YAxis />
        <Tooltip
          labelFormatter={(date) => new Date(date).toLocaleDateString("en-UB")}
          formatter={(value, name: string) => {
            const [category, field] = name.split(".");
            return [value, capitalize(field)];
          }}
        />
        <Legend
          formatter={(value) => {
            const [category, field] = value.split(".");
            return `${capitalize(category)} - ${capitalize(field)}`;
          }}
        />
        <Line type="monotone" dataKey={data} />
      </LineChart>
    </div>
  );
};

export default AthleteStatChart;
