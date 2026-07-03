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
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";

import PaginationComponent from "../../../components/PaginationComponent";
import { STAT_LABEL_INDEX } from "@/constants";
import type { Stat, StatCategory } from "../types/Stat";

interface AthleteStatTableProps {
  stats: Stat[];
}

const AthleteStatTable = (props: AthleteStatTableProps) => {
  const { stats } = props;
  // const [columns, setColumns] = useState<TableColumn[]>([]);

  const [category, setCategory] = useState<StatCategory>("attack");
  const dateCol: ColumnDef<Stat> = {
    accessorKey: "recordedAt",
    header: "Date",
    cell: (info) => {
      const date = new Date(info.getValue<Date>());
      return date.toLocaleDateString("en-UB");
    },
  };

  const columns = useMemo<ColumnDef<Stat>[]>(() => {
    const statCols: ColumnDef<Stat>[] = STAT_LABEL_INDEX[category].map(
      ({ key, label }) => ({
        accessorKey: category + "." + key,
        // accessorFn: (row) => row[category][key as keyof Stat[keyof Stat]],
        header: label,
      }),
    );

    return [dateCol, ...statCols];
  }, [category]);

  const table = useReactTable({
    data: stats,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (originalRow) => originalRow.id!,
    getPaginationRowModel: getPaginationRowModel(),
  });

  // const handleStatCategorySelectChange = (selectValue: string) => {
  //   const category = selectValue as StatCategory;
  //   // Get labels of selected stat category
  //   // const fields: any = STAT_INDEX.find((s) => s.category === category)!.fields;
  //   const labels = STAT_LABEL_INDEX[category];
  //   // Set the columns of the tanstack table
  //   setColumns(() => {
  //     const dateCol = {
  //       accessorKey: "recordedAt",
  //       header: "Date",
  //       cell: (props: { getValue: () => string | number | Date }) => {
  //         const date = new Date(props.getValue());
  //         return date.toLocaleDateString("en-UB");
  //       },
  //     };
  //     const statCols: TableColumn[] = labels.map(({ key, label }) => ({
  //       accessorKey: category + "." + key,
  //       header: label,
  //     }));
  //     return [dateCol, ...statCols];
  //   });
  //   // Perform any other actions with the selected statCategory here
  // };
  return (
    <div className="card-container flex flex-col gap-4 py-4">
      <h1>Stats by category</h1>
      <Select
        onValueChange={(value: string) => {
          const newCategory = value as StatCategory;
          setCategory(newCategory);
        }}
      >
        <SelectTrigger className="w-48">
          <SelectValue placeholder="Select a category" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {Object.keys(STAT_LABEL_INDEX).map((categoryKey) => (
              <SelectItem
                key={categoryKey}
                value={categoryKey}
                className="capitalize"
              >
                <p className="capitalize">{categoryKey}</p>
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
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
                  </TableHead>
                ))}
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
