"use client";
import React, { useEffect, useState } from "react";
import CustomTable from "@/components/customTable";
import { fetchData } from "@/app/fe-handlers/requestHandlers";



export default function Category() {
  const [tableData, setTableData] = useState<any>({ columns: [], data: [] });

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
        { 
          name: "THUMB IMAGE", 
          uid: "bannerImage", 
          type: "image", 
          template: (item:any) => {
            return `${window.location.origin}/api/aws/readS3?bucketName=nmobiles&key=${item.bannerImage}`;
          }
        },
        { 
          name: "EDIT", 
          uid: "edit", 
          type: "button", 
          template: (item:any) => {
            return `Edit`;
          },
          clickHandler: (item:any) => {
            console.log(`Edit button clicked for item with id ${item.id}`);
          }
        },
        { 
          name: "ACTIONS", 
          uid: "actions", 
          type: "button",
          template: (item:any) => {
            return `Delete`;
          },
          clickHandler: (item:any) => {
            console.log(`Actions button clicked for item with id ${item.id}`);
          }
        },
      ],
      data: data,
    };
  };

  useEffect(() => {
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
