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

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useState } from "react";
import { STAT_INDEX } from "@/constants";
import type { Stat } from "@/types/Stat";

interface AthleteStatTableProps {
  stats: Stat[];
}

const AthleteStatTable = (props: AthleteStatTableProps) => {
  const { stats } = props;
  const [selectedStatCategory, setSelectedStatCategory] = useState([]);
  const [select, setSelect] = useState("");

  const [page, setPage] = useState(0);
  const [count, setCount] = useState(10);

  const firstStatIdx = page * count;
  const lastStatIdx = firstStatIdx + count;
  const currentStats = stats.slice(firstStatIdx, lastStatIdx);

  const capitalize = (str: string) => {
    if (str == undefined || str.length === 0) return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const handleValueChange = (value: string) => {
    const selection: any = STAT_INDEX.find((s) => s.category === value)?.fields;
    setSelectedStatCategory(selection);
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
          <TableCaption>Select a category to display table</TableCaption>
        ) : (
          <TableCaption>Stat table by category</TableCaption>
        )}

        {select !== "" && (
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              {selectedStatCategory.map(({ key, label }) => (
                <TableHead key={key}>{label}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
        )}
        {select !== "" && (
          <TableBody>
            {currentStats?.map((stat) => (
              <TableRow key={stat._id}>
                <TableCell>
                  {stat.recordedAt.toLocaleDateString("en-UB")}
                </TableCell>
                {selectedStatCategory.map(({ key, label }) => (
                  <TableCell key={key}>{(stat as any)[select][key]}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        )}
      </Table>
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              className={
                page === 0 ? "cursor-not-allowed opacity-20" : "cursor-pointer"
              }
              onClick={() =>
                setPage((prev) => {
                  if (prev > 0) {
                    return prev - 1;
                  }
                  return 0;
                })
              }
            />
          </PaginationItem>
          <PaginationItem hidden={lastStatIdx < stats.length}>
            <PaginationLink>{page - 1}</PaginationLink>
          </PaginationItem>
          <PaginationItem hidden={page === 0}>
            <PaginationLink>{page}</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink isActive={true}>{page + 1}</PaginationLink>
          </PaginationItem>
          <PaginationItem hidden={lastStatIdx > stats.length}>
            <PaginationLink>{page + 2}</PaginationLink>
          </PaginationItem>
          <PaginationItem hidden={page !== 0}>
            <PaginationLink>{page + 3}</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext
              className={
                lastStatIdx > stats.length
                  ? "cursor-not-allowed opacity-20"
                  : "cursor-pointer"
              }
              onClick={() =>
                setPage((prev) => {
                  if (lastStatIdx < stats.length) return prev + 1;
                  return prev;
                })
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default AthleteStatTable;
