"use client";
import React, { useEffect, useState } from "react";
import AddOrEdit from "../../add/page";
import { fetchData } from "@/app/fe-handlers/requestHandlers";

const Edit = ({ params }: any) => {
  const [editData, setEditData] = useState([]);

  const getEditData = async (editId: any) => {
    const data = await fetchData("categories", [
      {
        $match: {
          id: Number(editId),
        },
      },
    ]);
    setEditData(data[0]);
  };

  useEffect(() => {
    return () => {
      getEditData(params.id);
    };
  }, [params]);

  return Object.keys(editData).length ? <AddOrEdit editData={editData} /> : "Loading ...";
};

export default Edit;
