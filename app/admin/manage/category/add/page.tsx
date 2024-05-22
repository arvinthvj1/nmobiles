"use client";
import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  Link,
  Image,
  Input,
  Select,
  SelectItem,
  Button,
} from "@nextui-org/react";
import { fetchData } from "@/app/fe-handlers/requestHandlers";
const field_type_data = [
  {
    label: "Select",
    value: "select",
  },
];
export default function App() {
  const [data, setData] = useState([]);
  const [productFieldGroup, setProductFieldGroup] = useState([{}]);

  const getAllCategories = async () => {
    const data = await fetchData("categories", [
      {
        $match: {},
      },
    ]);
    setData(data);
  };

  useEffect(() => {
    getAllCategories();
  }, []);

  return (
    <Card className="max-w-full">
      <CardHeader className="flex gap-3">Add</CardHeader>
      <Divider />
      <CardBody>
        <Input
          type="text"
          labelPlacement="outside"
          label="Category Name"
          variant="bordered"
          placeholder="Type category name"
          // defaultValue="junior2nextui.org"
          isInvalid={false}
          errorMessage="Please enter a valid email"
          className="max-w-full"
        />
        <Input
          type="text"
          label="URL slug"
          placeholder="Auto filled from category name"
          variant="bordered"
          labelPlacement="outside"
          // defaultValue="junior2nextui.org"
          isInvalid={false}
          errorMessage="Please enter a valid email"
          className="max-w-full"
        />
        <Input
          type="number"
          label="Priority"
          labelPlacement="outside"
          placeholder="Enter the priority"
          variant="bordered"
          // defaultValue="junior2nextui.org"
          isInvalid={false}
          errorMessage="Please enter a valid email"
          className="max-w-full"
        />
        <Select
          labelPlacement={"outside"}
          label="Parent Category"
          placeholder="select a parent category"
          className="max-w-full"
        >
          {data.map((animal) => (
            <SelectItem key={animal?.value} value={animal?.value}>
              {animal?.label}
            </SelectItem>
          ))}
        </Select>

        {productFieldGroup.map((e, i) => {
          return (
              <Card className="max-w-full">
                <CardBody>
                <div className="product-fields-group flex gap-3 align-top">
                  <Input
                    type="text"
                    labelPlacement="outside"
                    label="Field Label"
                    variant="bordered"
                    placeholder="Type category name"
                    // defaultValue="junior2nextui.org"
                    isInvalid={false}
                    errorMessage="Please enter a valid email"
                    className="w-48"
                  />
                  <Select
                    labelPlacement={"outside"}
                    label="Parent Category"
                    placeholder="select a parent category"
                    className="w-48"
                  >
                    {field_type_data.map((type): any => (
                      <SelectItem key={type?.label} value={type?.value}>
                        {type?.label}
                      </SelectItem>
                    ))}
                  </Select>
                  <Select
                    labelPlacement={"outside"}
                    label="Parent Category"
                    placeholder="select a parent category"
                    className="w-48"
                  >
                    {field_type_data.map((type): any => (
                      <SelectItem key={type?.label} value={type?.value}>
                        {type?.label}
                      </SelectItem>
                    ))}
                  </Select>
                  <Input
                    type="text"
                    labelPlacement="outside"
                    label="Field Label"
                    variant="bordered"
                    placeholder="Type category name"
                    // defaultValue="junior2nextui.org"
                    isInvalid={false}
                    errorMessage="Please enter a valid email"
                    className="w-48"
                  />
                  <Button color="danger" className="absolute right-0 top-0" onClick={()=>{
                     setProductFieldGroup((prev)=>  prev.length==1 ? prev : prev.filter((data,dataIndex)=> dataIndex !=i))
                  }}>
                        x
                    </Button>
                    </div>
                    
                </CardBody>
              </Card>
          
          );
        })}
      <Button color="primary" className="w-40" onClick={()=>{
         setProductFieldGroup((prev)=>([...prev,{}]))
      }}>
        Add more
      </Button>

      </CardBody>
      <Divider />
      <CardFooter></CardFooter>
    </Card>
  );
}
