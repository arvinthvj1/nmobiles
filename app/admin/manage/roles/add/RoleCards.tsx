"use client";
import React, { useEffect, useState } from "react";
import { rolePermission } from "./db.js";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  Link,
  Image,
  Switch,
} from "@nextui-org/react";

export default function RoleCards() {
  const [allData, setAllData] = useState([]);
  const [settingsGrouped, setSettingsGrouped] = useState({});
  const changeDataStructure = (data: any) => {
    const groupedByMainGroup = Object.groupBy(data, ({ main_group }) => {
        return main_group;
      });
      
      // Further group items within each main_group by group_name
      const result = Object.fromEntries(
        Object.entries(groupedByMainGroup).map(([mainGroup, items]) => {
          return [
            mainGroup,
            Object.groupBy(items, ({ group_name }) => group_name),
          ];
        })
      );
    setSettingsGrouped(result);
    debugger
  };
  useEffect(() => {
    if (rolePermission) {
      changeDataStructure(rolePermission);
      setAllData(rolePermission);
    }
  }, []);

  return (
    <div>
      {Object.keys(settingsGrouped).map((eachGroup: any) => {
        return (
          <Card className="max-w-full mb-5">
            <CardHeader className="flex gap-3">
              <p className="text-md">{eachGroup}</p>
            </CardHeader>
            <Divider />
            <CardBody>
            <div className="">
             {Object.keys(settingsGrouped[eachGroup]).map((eachItem:any)=>{
                return (
                    <>
                    <p className="text-md">{eachItem.toUpperCase()}</p>
                    <div className="flex gap-3 flex-wrap mb-5">
                    {settingsGrouped[eachGroup][eachItem].map((eachItemInGroup:any)=>{
                        return  <Switch size="sm" defaultSelected color="primary">{eachItemInGroup.name}</Switch>
                    })}
                    </div>
                    </>
                )
             })}
             </div>
            </CardBody>
          </Card>
        );
      })}
    </div>
  );
}
