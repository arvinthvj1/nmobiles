"use client";
import React, { useEffect, useState } from "react";
import CustomTable from "@/components/customTable";
import { fetchData } from "@/app/fe-handlers/requestHandlers";

const getAllCategories = async () => {
  debugger
  const data = await fetchData("categories", [
    {
      $match: {},
    },
  ]);
  return {
    columns: [
      { name: "Category Name", uid: "categoryName" },
      { name: "Slug", uid: "slug" },
      { name: "STATUS", uid: "status" },
      { name: "ACTIONS", uid: "actions" },
    ],
    data: data,
  };
};

export default function Category() {
  const [tableData, setTableData] = useState({ columns: [], data: [] });

  useEffect(() => {
    debugger
    const fetchCategories = async () => {
      const result = await getAllCategories();
      if (result) {
        setTableData({ columns: result.columns, data: result.data });
      }
    };
    fetchCategories();
  }, []);

  return tableData.columns.length ? <CustomTable columns={tableData.columns} data={tableData.data} />: <></>;
}
