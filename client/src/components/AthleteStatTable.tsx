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
import { useState, type ChangeEvent } from "react";
import { STAT_INDEX } from "@/constants";
import type { Stat } from "@/types/Stat";
import { Input } from "./ui/input";

interface AthleteStatTableProps {
  stats: Stat[];
}

const AthleteStatTable = (props: AthleteStatTableProps) => {
  const { stats } = props;
  const [selectedStatCategory, setSelectedStatCategory] = useState([]);
  const [select, setSelect] = useState("");

  const [page, setPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const firstStatIdx = page * itemsPerPage;
  const lastStatIdx = firstStatIdx + itemsPerPage;
  const currentStats = stats.slice(firstStatIdx, lastStatIdx);

  const totalPages = Math.ceil(stats.length / itemsPerPage);

  const handlePageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const num = Number(value);
    if (!num) return;
    if (num > totalPages) {
      setPage(totalPages - 1);
      return;
    }
    if (num < 0) {
      setPage(1);
      return;
    }
    setPage(num - 1);
  };

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
          <PaginationItem hidden={page < 2}>
            <PaginationEllipsis />
          </PaginationItem>
          <PaginationItem hidden={lastStatIdx < stats.length}>
            <PaginationLink
              className="cursor-pointer"
              onClick={() => setPage((prev) => prev - 2)}
            >
              {page - 1}
            </PaginationLink>
          </PaginationItem>
          <PaginationItem hidden={page === 0}>
            <PaginationLink
              className="cursor-pointer"
              onClick={() => setPage((prev) => prev - 1)}
            >
              {page}
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink isActive={true}>
              <Input
                type="tel"
                inputMode="numeric"
                placeholder={`${page + 1}`}
                onChange={handlePageChange}
                value={page + 1}
                onClick={(e: any) => (e.target.value = "")}
                onKeyDown={(e: any) => {
                  if (e.key === "Backspace") {
                    e.target.value = "";
                  }
                }}
              ></Input>
            </PaginationLink>
          </PaginationItem>
          <PaginationItem hidden={lastStatIdx > stats.length}>
            <PaginationLink
              className="cursor-pointer"
              onClick={() => setPage((prev) => prev + 1)}
            >
              {page + 2}
            </PaginationLink>
          </PaginationItem>
          <PaginationItem hidden={page !== 0}>
            <PaginationLink
              className="cursor-pointer"
              onClick={() => setPage((prev) => prev + 2)}
            >
              {page + 3}
            </PaginationLink>
          </PaginationItem>
          <PaginationItem hidden={page > totalPages - 3}>
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
