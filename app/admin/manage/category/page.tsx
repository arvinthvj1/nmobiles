"use client";
import React, { useEffect, useState } from "react";
import CustomTable from "@/components/customTable";
import { fetchData } from "@/app/fe-handlers/requestHandlers";

const getAllCategories = async () => {
  const data = await fetchData("categories", [
    {
      $match: {
        categoryName: { $exists: true }
      }
    }
  ]
  );
  return {
    columns: [
      { name: "Category Name", uid: "categoryName", type: "text" },
      { name: "THUMB IMAGE", uid: "bannerImage", type: "image" },
      { name: "EDIT", uid: "edit", type: "button" },
      { name: "ACTIONS", uid: "actions", type: "button" },
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
