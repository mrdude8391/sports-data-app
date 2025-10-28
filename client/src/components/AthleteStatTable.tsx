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
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { STAT_INDEX } from "@/constants";
import type { Stat } from "@/types/Stat";

interface AthleteStatTableProps {
  stats: Stat[];
}

const AthleteStatTable = (props: AthleteStatTableProps) => {
  const { stats } = props;
  const [data, setData] = useState([]);
  const [select, setSelect] = useState("");

  const capitalize = (str: string) => {
    if (str == undefined || str.length === 0) return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const handleValueChange = (value: string) => {
    const selection: any = STAT_INDEX.find((s) => s.category === value)?.fields;
    setData(selection);
    setSelect(value);
    // Perform any other actions with the selected value here
  };
  return (
    <div className="card-container flex flex-col gap-6">
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
                {capitalize(category)}
              </SelectItem>
            </SelectGroup>
          ))}
        </SelectContent>
      </Select>
      <Table className="min-w-full divide-y divide-gray-200 text-sm">
        {select == "" ? (
          <TableCaption>Select a category to display chart</TableCaption>
        ) : (
          <TableCaption>Stat table by category</TableCaption>
        )}

        {select !== "" && (
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              {data.map(({ key, label }) => (
                <TableHead key={key}>{label}</TableHead>
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
                  <TableCell key={key}>{(stat as any)[select][key]}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        )}
      </Table>
    </div>
  );
};

export default AthleteStatTable;
