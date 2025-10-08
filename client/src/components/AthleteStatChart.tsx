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
        <SelectTrigger className="w-[280px]">
          <SelectValue placeholder="Select a timezone" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>North America</SelectLabel>
            <SelectItem value="est">Eastern Standard Time (EST)</SelectItem>
            <SelectItem value="cst">Central Standard Time (CST)</SelectItem>
            <SelectItem value="mst">Mountain Standard Time (MST)</SelectItem>
            <SelectItem value="pst">Pacific Standard Time (PST)</SelectItem>
            <SelectItem value="akst">Alaska Standard Time (AKST)</SelectItem>
            <SelectItem value="hst">Hawaii Standard Time (HST)</SelectItem>
          </SelectGroup>
          <SelectGroup>
            <SelectLabel>Europe & Africa</SelectLabel>
            <SelectItem value="gmt">Greenwich Mean Time (GMT)</SelectItem>
            <SelectItem value="cet">Central European Time (CET)</SelectItem>
            <SelectItem value="eet">Eastern European Time (EET)</SelectItem>
            <SelectItem value="west">
              Western European Summer Time (WEST)
            </SelectItem>
            <SelectItem value="cat">Central Africa Time (CAT)</SelectItem>
            <SelectItem value="eat">East Africa Time (EAT)</SelectItem>
          </SelectGroup>
          <SelectGroup>
            <SelectLabel>Asia</SelectLabel>
            <SelectItem value="msk">Moscow Time (MSK)</SelectItem>
            <SelectItem value="ist">India Standard Time (IST)</SelectItem>
            <SelectItem value="cst_china">China Standard Time (CST)</SelectItem>
            <SelectItem value="jst">Japan Standard Time (JST)</SelectItem>
            <SelectItem value="kst">Korea Standard Time (KST)</SelectItem>
            <SelectItem value="ist_indonesia">
              Indonesia Central Standard Time (WITA)
            </SelectItem>
          </SelectGroup>
          <SelectGroup>
            <SelectLabel>Australia & Pacific</SelectLabel>
            <SelectItem value="awst">
              Australian Western Standard Time (AWST)
            </SelectItem>
            <SelectItem value="acst">
              Australian Central Standard Time (ACST)
            </SelectItem>
            <SelectItem value="aest">
              Australian Eastern Standard Time (AEST)
            </SelectItem>
            <SelectItem value="nzst">
              New Zealand Standard Time (NZST)
            </SelectItem>
            <SelectItem value="fjt">Fiji Time (FJT)</SelectItem>
          </SelectGroup>
          <SelectGroup>
            <SelectLabel>South America</SelectLabel>
            <SelectItem value="art">Argentina Time (ART)</SelectItem>
            <SelectItem value="bot">Bolivia Time (BOT)</SelectItem>
            <SelectItem value="brt">Brasilia Time (BRT)</SelectItem>
            <SelectItem value="clt">Chile Standard Time (CLT)</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
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
