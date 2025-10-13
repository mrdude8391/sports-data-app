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

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import * as sportsDataService from "@/services/sportsDataService";
import DeleteAthleteStat from "./DeleteAthleteStat";
import { useState } from "react";
import EditAthleteStat from "./EditAthleteStat";

interface AthleteStatsListProps {
  stats: Stat[];
}

const AthleteStatsList = (props: AthleteStatsListProps) => {
  const { stats } = props;

  const [data, setData] = useState([]);
  const [select, setSelect] = useState("");

  const handleValueChange = (value: string) => {
    const selection: any = STAT_INDEX.find((s) => s.category === value)?.fields;
    setData(selection);
    setSelect(value);
    // Perform any other actions with the selected value here
  };

  return (
    <div className="flex flex-col gap-6">
      <Select onValueChange={handleValueChange}>
        <SelectTrigger className="w-full text-2xl font-semibold py-6">
          <SelectValue
            className=""
            placeholder="Select a category to display chart"
          />
        </SelectTrigger>
        <SelectContent>
          {STAT_INDEX.map(({ category, fields }) => (
            <SelectGroup key={category}>
              <SelectItem
                key={category}
                value={category}
                className="capitalize"
              >
                {category}
              </SelectItem>
            </SelectGroup>
          ))}
        </SelectContent>
      </Select>
      <Table className="min-w-full divide-y divide-gray-200 text-sm">
        {select == "" ? (
          <TableCaption>Select a category to display chart</TableCaption>
        ) : (
          <TableCaption>List of stats</TableCaption>
        )}

        {select !== "" && (
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              {data.map(({ key, label }) => (
                <TableHead>{label}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
        )}
        {select !== "" && (
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
        )}
      </Table>

      {stats.length > 0 ? (
        <Accordion type="single" collapsible className="w-full">
          {stats.map((stat, index) => (
            <AccordionItem key={stat._id} value={`game-${index}`}>
              <AccordionTrigger>
                <div className="flex justify-between w-full">
                  <span>
                    Game {index + 1} —{" "}
                    {new Date(stat.recordedAt).toLocaleDateString()}
                  </span>
                  <div className="flex gap-2 "></div>
                </div>
              </AccordionTrigger>

              <AccordionContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 mt-2">
                  {STAT_INDEX.map(({ category, fields }) => (
                    <div key={category}>
                      <h4 className="font-semibold capitalize mb-1">
                        {category}
                      </h4>
                      <div className="grid grid-cols-2 gap-1 text-sm">
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
                <div className="flex justify-end pt-3 gap-3">
                  <EditAthleteStat stat={stat} />
                  <DeleteAthleteStat statId={stat._id} />
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      ) : (
        <p>No Stats</p>
      )}
    </div>
  );
};

export default AthleteStatsList;
