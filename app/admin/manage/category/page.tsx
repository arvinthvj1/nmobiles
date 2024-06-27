"use client";
import React, { useEffect, useState } from "react";
import CustomTable from "@/components/customTable";
import { fetchData } from "@/app/fe-handlers/requestHandlers";
import { useRouter } from 'next/navigation';
import { Button } from "@nextui-org/button";


export default function Category() {
  const router = useRouter();
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
        { 
          name: "Category Name",
          uid: "categoryName", 
          type: "text" , 
        },
        { 
          name: "THUMB IMAGE", 
          uid: "bannerImage", 
          type: "image", 
          template: (item:any) => {
            return item.bannerImage ? `${window.location.origin}/api/aws/readS3?bucketName=nmobiles&key=${item.bannerImage}` : null;
          }
        },
        { 
          name: "EDIT", 
          uid: "edit", 
          type: "button",
          color:"primary",
          variant:"ghost",
          template: (item:any) => {
            return `Edit`;
          },
          clickHandler: (item:any) => {
            let catId = item.id
            router.push('/admin/manage/category/edit/'+catId);

          }
        },
        { 
          name: "ACTIONS", 
          uid: "actions", 
          type: "button",
          color:"danger" ,
          variant:"ghost",
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

  return tableData.columns.length ? [<Button color="primary" onClick={()=>{
    router.push('/admin/manage/category/add');
  }}>
 Add new
</Button>,<CustomTable columns={tableData.columns} data={tableData.data} />]: <></>;
}
