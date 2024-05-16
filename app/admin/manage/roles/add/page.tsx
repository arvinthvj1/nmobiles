"use client"
import CustomTable from "@/components/customTable";
import { Button } from "@nextui-org/button";
import React from "react";
import ListIcon from "@mui/icons-material/List";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  Link,
  Image,
  Input,
} from "@nextui-org/react";
import RoleCards from "./RoleCards";
import { addData } from "@/app/fe-handlers/requestHandlers";

function AddForm({triggerSubmit}) {
  return (
    <Card className="max-w-full">
      <CardHeader className="flex gap-3">
      <p className="text-md">Add New</p>
      </CardHeader>
      <Divider />
      <CardBody>
      
       <RoleCards triggerSubmit={triggerSubmit}/>
      </CardBody>
      <Divider />
    </Card>
  );
}

export default function AddRole() {
  const handleSubmit=(data:any,roleName:any)=>{
    debugger

    addData("roles", {
      role : roleName,
      permsions : data
  })
  }
  return (
    <div>
      <div className="flex justify-between align-center mb-5">
        <h1>Roles</h1>
        <Button color="primary" startContent={<ListIcon />}>
          View All
        </Button>
      </div>
      <AddForm triggerSubmit={handleSubmit}/>
    </div>
  );
}
