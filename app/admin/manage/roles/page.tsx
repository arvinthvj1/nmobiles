import CustomTable from "@/components/customTable";
import { Button } from "@nextui-org/button";
import React from "react";
import AddIcon from '@mui/icons-material/Add';
export default function AddRole() {
  return (
    <div>
      <div className="flex justify-between align-center mb-5">
        <h1>Roles</h1>
        <Button color="success" startContent={<AddIcon/>}>
          Add new
        </Button>
      </div>
      <CustomTable />
    </div>
  );
}
