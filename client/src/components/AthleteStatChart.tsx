import type { Stat } from "@/types/Stat";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { STAT_INDEX } from "@/constants";

interface AthleteStatChartProps {
  stats: Stat[];
}

const AthleteStatChart = (props: AthleteStatChartProps) => {
  const { stats } = props;

  const [field, setField] = useState("");

  const capitalize = (str: string) => {
    if (str == undefined || str.length === 0) return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const handleStatFieldSelectChange = (field: string) => {
    setField(field);
    // Perform any other actions with the selected value here
  };

  return (
    <div className="card-container w-full flex flex-col gap-4">
      <h1>Stat Chart</h1>
      <Select onValueChange={handleStatFieldSelectChange}>
        <SelectTrigger className="w-48">
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
      <div className="w-full h-[200px] sm:h-[250px]">
        <ResponsiveContainer width="100%" height={200}>
          <LineChart
            data={stats}
            margin={{
              top: 5,
              right: 0,
              left: -20,
              bottom: 5,
            }}
          >
            <XAxis
              reversed
              dataKey="recordedAt"
              tickFormatter={(date) =>
                new Date(date).toLocaleDateString("en-UB")
              }
            />
            <ReferenceLine y={0} strokeDasharray="3 3" />

            <YAxis />
            <Tooltip
              labelStyle={{
                color: "oklch(0.145 0 0)",
              }}
              itemStyle={{ color: "oklch(0.49 0.22 264)" }}
              labelFormatter={(date) =>
                new Date(date).toLocaleDateString("en-UB")
              }
              formatter={(value, name: string) => {
                const [_, field] = name.split(".");
                return [value, capitalize(field)];
              }}
            />
            <Legend
              formatter={(value) => {
                const [category, field] = value.split(".");
                return `${capitalize(category)} - ${capitalize(field)}`;
              }}
            />
            <Line
              type="monotone"
              stroke="oklch(0.69 0.22 264)"
              fill="oklch(0.69 0.22 264)"
              dataKey={field}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AthleteStatChart;
