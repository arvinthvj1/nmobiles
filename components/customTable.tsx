import React from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
} from "@nextui-org/react";

const CustomTable = ({ columns, data }: any) => {
  // Function to render cell content based on column definition
  const renderCellContent = (item: any, column: any) => {
    if (!item || !column) return null;

    const cellValue = item[column.uid];

    switch (column.type) {
      case "image":
        // Use template from column definition if provided, otherwise default
        const imgSrc = column.template ? column.template(item) : null;
        return imgSrc ? <img style={{ width: "16px" }} src={imgSrc} alt="Thumbnail" /> : <></>;
      case "button":
        // Use template from column definition if provided, otherwise default
        const buttonText = column.template ? column.template(item) : cellValue;
        return (
          <Button color={column.color} variant={column.variant} onClick={() => column.clickHandler && column.clickHandler(item)}>
            {buttonText}
          </Button>
        );
      default:
        return cellValue;
    }
  };

  return (
    <Table  aria-label="">
      <TableHeader columns={columns}>
        {(column: any) => (
          <TableColumn key={column.uid} align={column.uid === "actions" ? "center" : "start"}>
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody items={data}>
        {(item: any) => (
          <TableRow className="border" key={item.id || item._id}>
            {columns.map((column: any) => (
              <TableCell key={column.uid}>
                {renderCellContent(item, column)}
              </TableCell>
            ))}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default CustomTable;
