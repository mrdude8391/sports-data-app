"use client";
import {
  Table,
  TableBody,
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
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useState } from "react";
import {
  STAT_LABELS_INDEX,
  type Stat,
  type StatCategoryName,
} from "@/types/Stat";

import PaginationComponent from "./PaginationComponent";

interface AthleteStatTableProps {
  stats: Stat[];
}

const AthleteStatTable = (props: AthleteStatTableProps) => {
  const { stats } = props;

  const [columns, setColumns] = useState<any>([]);

  const table = useReactTable({
    data: stats,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (originalRow) => originalRow.id!,
    getPaginationRowModel: getPaginationRowModel(),
  });

  const handleStatCategorySelectChange = (category: StatCategoryName) => {
    // Get fields of selected stat category
    const labels = STAT_LABELS_INDEX[category];
    // Set the columns of the tanstack table
    setColumns(() => {
      const dateCol = {
        accessorKey: "recordedAt",
        header: "Date",
        cell: (info: { getValue: () => string | number | Date }) => {
          const date = new Date(info.getValue());
          return date.toLocaleDateString("en-UB");
        },
      };
      const statCols = Object.entries(labels).map(([stat, label]: any) => ({
        accessorKey: category + "." + stat,
        header: label,
      }));
      return [dateCol, ...statCols];
    });
    // Perform any other actions with the selected statCategory here
  };
  return (
    <div className="card-container flex flex-col gap-4 py-4">
      <h1>Stats by category</h1>
      <Select onValueChange={handleStatCategorySelectChange}>
        <SelectTrigger className="w-48">
          <SelectValue placeholder="Select a category" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {Object.entries(STAT_LABELS_INDEX).map(([category, _]) => (
              <SelectItem
                key={category}
                value={category}
                className="capitalize"
              >
                <p className="capitalize">{category}</p>
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <PaginationComponent table={table}></PaginationComponent>
    </div>
  );
};

export default AthleteStatTable;
