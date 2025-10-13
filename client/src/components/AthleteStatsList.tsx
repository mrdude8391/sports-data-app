import { STAT_FIELDS, STAT_INDEX } from "@/constants";
import type { Stat } from "@/types/Stat";
import { Button } from "./ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import * as sportsDataService from "@/services/sportsDataService";
import DeleteAthleteStat from "./DeleteAthleteStat";
import { useState } from "react";

interface AthleteStatsListProps {
  stats: Stat[];
}

const AthleteStatsList = (props: AthleteStatsListProps) => {
  const { stats } = props;

  const [data, setData] = useState([]);
  const [select, setSelect] = useState("");

  const capitalize = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const handleValueChange = (value: string) => {
    const selection: any = STAT_INDEX.find((s) => s.category === value)?.fields;
    setData(selection);
    setSelect(value);
    // Perform any other actions with the selected value here
  };

  return (
    <div>
      {/* {stats && stats.length > 0 ? (
        <ul>
          {stats?.map((stat, index) => (
            <li key={stat._id}>
              <h3 className="font-bold mb-2">
                Game {index + 1} (
                {new Date(stat.recordedAt).toLocaleDateString()})
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-5 gap-x-10">
                {STAT_INDEX.map(({ category, fields }) => (
                  <div key={category} className="mb-2">
                    <h4 className="font-semibold capitalize">
                      {capitalize(category)}
                    </h4>
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
              </div>

              <div>
                <DeleteAthleteStat statId={stat._id} />
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No Stats</p>
      )} */}
      <Select onValueChange={handleValueChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select a category" />
        </SelectTrigger>
        <SelectContent>
          {STAT_INDEX.map(({ category, fields }) => (
            <SelectGroup key={category}>
              <SelectItem key={category} value={category}>
                {capitalize(category)}
              </SelectItem>
            </SelectGroup>
          ))}
        </SelectContent>
      </Select>
      <Table className="min-w-full divide-y divide-gray-200 text-sm">
        <TableCaption>List of stats</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            {data.map(({ key, label }) => (
              <TableHead>{label}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {stats?.map((stat) => (
            <TableRow key={stat._id}>
              <TableCell>
                {stat.recordedAt.toLocaleDateString("en-UB")}
              </TableCell>
              {data.map(({ key, label }) => (
                <TableCell>{(stat as any)[select][key]}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {stats && stats.length > 0 ? (
        <ul>
          {stats?.map((stat, index) => (
            <li key={stat._id}>
              <h3 className="font-bold mb-2">
                Game {index + 1} (
                {new Date(stat.recordedAt).toLocaleDateString()})
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-5 gap-x-10">
                {STAT_INDEX.map(({ category, fields }) => (
                  <div key={category} className="mb-2">
                    <h4 className="font-semibold capitalize">
                      {capitalize(category)}
                    </h4>
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
              </div>

              <div>
                <DeleteAthleteStat statId={stat._id} />
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No Stats</p>
      )}{" "}
    </div>
  );
};

export default AthleteStatsList;
