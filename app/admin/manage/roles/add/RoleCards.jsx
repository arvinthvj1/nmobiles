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
  Button,
  Input,
} from "@nextui-org/react";
import {fetchData} from "../../../../fe-handlers/requestHandlers.js"
export default function RoleCards({ triggerSubmit }) {
  const [allData, setAllData] = useState([]);
  const [roleName, setRoleName] = useState('');
  const [settingsGrouped, setSettingsGrouped] = useState({});
  const changeDataStructure = (data) => {
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
    return result;
    debugger;
  };
  const triggerState = () => {
    const changedState = JSON.parse(JSON.stringify(settingsGrouped));
    setSettingsGrouped(changedState);
  };
  const handleSelectAll = (checkedState, dataToSelect) => {
    Object.keys(dataToSelect).map((e) => {
      dataToSelect[e].map((q) => {
        q.selected = checkedState;
      });
    });
    triggerState();
  };

  const getAllPermissons =async()=>{
    const data  = await fetchData("permissons", [
      {
        $match: {} // Match all documents
      }
    ]);
    changeDataStructure(data);
    setAllData(data);
  }
  useEffect(() => {
    getAllPermissons();
  }, []);

  return (
    <div>
      <Input
        key={"outside"}
        type="text"
        label="Name"
        onChange={(e)=>{
          setRoleName(e.target.value)
        }}
        className="mb-5"
        labelPlacement={"outside"}
        placeholder="Enter role name"
       />
      {Object.keys(settingsGrouped).map((eachGroup) => {
        return (
          <Card className="max-w-full mb-5">
            <CardHeader className="flex gap-3">
              <p className="text-md">{eachGroup}</p>
              <Switch
                size="sm"
                color="primary"
                className="capitalize h-2"
                onChange={(e) => {
                  handleSelectAll(e.target.checked, settingsGrouped[eachGroup]);
                }}
              ></Switch>
            </CardHeader>
            <Divider />
            <CardBody>
              <div className="">
                {Object.keys(settingsGrouped[eachGroup]).map((eachItem) => {
                  return (
                    <>
                      <p className="text-md">{eachItem.toUpperCase()}</p>
                      <div className="flex gap-3 flex-wrap mb-5">
                        {settingsGrouped[eachGroup][eachItem].map(
                          (eachItemInGroup, index) => {
                            return (
                              <Switch
                                size="sm"
                                isSelected={Boolean(eachItemInGroup.selected)}
                                color={
                                  eachItemInGroup.action == "delete"
                                    ? "danger"
                                    : "primary"
                                }
                                className="capitalize"
                                onChange={(e) => {
                                  eachItemInGroup.selected = e.target.checked;
                                  triggerState();
                                }}
                              >
                                {eachItemInGroup.action}
                              </Switch>
                            );
                          }
                        )}
                      </div>
                    </>
                  );
                })}
              </div>
            </CardBody>
          </Card>
        );
      })}
      <div>
        <Button onClick={()=>{
          triggerSubmit(settingsGrouped,roleName)
        }} color="primary">Submit</Button>
      </div>
    </div>
  );
}
