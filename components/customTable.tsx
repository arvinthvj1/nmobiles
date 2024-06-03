"use client";
import React from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  User,
  Chip,
  Tooltip,
} from "@nextui-org/react";

const statusColorMap = {
  active: "success",
  paused: "danger",
  vacation: "warning",
};

const renderCell = (item, columnKey) => {
  if (!item || !columnKey) return null;

  const cellValue = item[columnKey];

  switch (columnKey) {
    case "categoryName":
      return cellValue;
    case "slug":
      return cellValue;
    case "status":
      return (
        <Chip className="capitalize" color={statusColorMap[item.status]} size="sm" variant="flat">
          {cellValue}
        </Chip>
      );
    case "actions":
      return (
        <div className="relative flex items-center gap-2">
          <Tooltip content="Details">
            <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
              {/* <EyeIcon /> */}
            </span>
          </Tooltip>
          <Tooltip content="Edit">
            <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
              {/* <EditIcon /> */}
            </span>
          </Tooltip>
          <Tooltip color="danger" content="Delete">
            <span className="text-lg text-danger cursor-pointer active:opacity-50">
              {/* <DeleteIcon /> */}
            </span>
          </Tooltip>
        </div>
      );
    default:
      return cellValue;
  }
};

export default function CustomTable({ columns, data }) {
  debugger
  return (
    <Table aria-label="Example table with custom cells">
      <TableHeader columns={columns}>
        {(column) => (
          <TableColumn key={column.uid} align={column.uid === "actions" ? "center" : "start"}>
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody items={data}>
        {(item) => (
          <TableRow key={item.id || item._id}>
            {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
