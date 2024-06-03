"use client";
import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  Select,
  SelectItem,
  Button,
  Input,
} from "@nextui-org/react";
import { addData, fetchData } from "@/app/fe-handlers/requestHandlers";
import { Formik, Form, Field, FieldArray, ErrorMessage } from "formik";
import * as Yup from "yup";
import TextEditor from "../../../../../components/TextEditor";

const field_type_data = [
  {
    label: "sample field type",
    value: "sample field type",
  },
];

const validationSchema = Yup.object({
  categoryName: Yup.string().required("Category Name is required"),
  urlSlug: Yup.string().required("URL Slug is required"),
  priority: Yup.number().required("Priority is required").min(1),
  parentCategory: Yup.string().required("Parent Category is required"),
  productFields: Yup.array().of(
    Yup.object().shape({
      fieldLabel: Yup.string().required("Field Label is required"),
      fieldType: Yup.string().required("Field Type is required"),
    })
  ),
  metaKeywords: Yup.string(),
  metaTitle: Yup.string().required("Meta Title is required"),
  metaDesc: Yup.string().required("Meta description is required"),
  bannerImage: Yup.mixed().required("Banner Image is required"),
  thumbnailImage: Yup.mixed().required("Thumbnail Image is required"),
});

export default function App() {
  const [data, setData] = useState<any>([]);
  const [metaTitleEdited, setMetaTitleEdited] = useState(false);
  const [metaDescEdited, setMetaDescEdited] = useState(false);
  const [metaKeywordsEdited, setMetaKeywordsEdited] = useState(false);

  const getAllCategories = async () => {
    const data = await fetchData("categories", [
      {
        $match: {},
      },
    ]);
    setData(data.map(({ categoryName }: any) => ({ label: categoryName, value: categoryName })));
  };

  useEffect(() => {
    getAllCategories();
  }, []);

  const convertToSlug = (title: any) => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  };

  const uploadFileToS3 = async (file, fieldName, setFieldValue) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/aws/createS3", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        debugger
        setFieldValue(fieldName, `${window.location.origin}/api/aws/readS3?bucketName=nmobiles&key=${data.data.Key}`);
        alert('File uploaded successfully');
      } else {
        const error = await response.json();
        alert('File upload failed');
        console.error(error);
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Error uploading file');
    }
  };

  return (
    <Formik
      initialValues={{
        categoryName: "",
        urlSlug: "",
        priority: "",
        parentCategory: "",
        productFields: [{ fieldLabel: "", fieldType: "" }],
        metaKeywords: "",
        metaTitle: "",
        metaDesc: "",
        bannerImage: null,
        thumbnailImage: null,
      }}
      validationSchema={validationSchema}
      onSubmit={(values) => {
        console.log(values);
        addData("categories", values);
      }}
    >
      {({ values, setFieldValue, handleChange }) => {
        useEffect(() => {
          const titleToSlug = convertToSlug(values.categoryName);
          setFieldValue("urlSlug", titleToSlug);
          if (!metaTitleEdited) {
            setFieldValue("metaTitle", values.categoryName);
          }
          if (!metaDescEdited) {
            setFieldValue("metaDesc", values.categoryName);
          }
          if (!metaKeywordsEdited) {
            setFieldValue("metaKeywords", values.categoryName);
          }
        }, [
          values.categoryName,
          setFieldValue,
          metaTitleEdited,
          metaDescEdited,
          metaKeywordsEdited,
        ]);

        return (
          <Form>
            <Card className="max-w-full mb-4">
              <CardHeader className="flex gap-3">Add</CardHeader>
              <Divider />
              <CardBody>
                <Field
                  name="categoryName"
                  as={Input}
                  type="text"
                  labelPlacement="outside"
                  label="Category Name"
                  variant="bordered"
                  placeholder="Type category name"
                  className="max-w-full mb-4"
                />
                <ErrorMessage
                  name="categoryName"
                  component="div"
                  className="text-red-500"
                />

                <Field
                  name="urlSlug"
                  as={Input}
                  type="text"
                  label="URL slug"
                  placeholder="Auto filled from category name"
                  variant="bordered"
                  labelPlacement="outside"
                  className="max-w-full mb-4"
                  readOnly
                />
                <ErrorMessage
                  name="urlSlug"
                  component="div"
                  className="text-red-500"
                />

                <Field
                  name="priority"
                  as={Input}
                  type="number"
                  label="Priority"
                  labelPlacement="outside"
                  placeholder="Enter the priority"
                  variant="bordered"
                  className="max-w-full mb-4"
                />
                <ErrorMessage
                  name="priority"
                  component="div"
                  className="text-red-500"
                />

                <Field
                  name="parentCategory"
                  as={Select}
                  labelPlacement={"outside"}
                  label="Parent Category"
                  placeholder="select a parent category"
                  className="max-w-full mb-4"
                >
                  {data.map((category) => (
                    <SelectItem key={category?.value} value={category?.value}>
                      {category?.label}
                    </SelectItem>
                  ))}
                </Field>
                <ErrorMessage
                  name="parentCategory"
                  component="div"
                  className="text-red-500"
                />

                <FieldArray name="productFields">
                  {({ remove, push }) => (
                    <>
                      {values.productFields.map((field, index) => (
                        <Card key={index} className="max-w-full mb-4">
                          <CardBody>
                            <div className="product-fields-group flex gap-3 align-top">
                              <Field
                                name={`productFields.${index}.fieldLabel`}
                                as={Input}
                                type="text"
                                labelPlacement="outside"
                                label="Field Label"
                                variant="bordered"
                                placeholder="Type field label"
                                className="w-48"
                              />
                              <ErrorMessage
                                name={`productFields.${index}.fieldLabel`}
                                component="div"
                                className="text-red-500"
                              />

                              <Field
                                name={`productFields.${index}.fieldType`}
                                as={Select}
                                labelPlacement={"outside"}
                                label="Field Type"
                                placeholder="select a field type"
                                className="w-48"
                              >
                                {field_type_data.map((type) => (
                                  <SelectItem
                                    key={type?.label}
                                    value={type?.value}
                                  >
                                    {type?.label}
                                  </SelectItem>
                                ))}
                              </Field>
                              <ErrorMessage
                                name={`productFields.${index}.fieldType`}
                                component="div"
                                className="text-red-500"
                              />

                              <Button
                                color="danger"
                                className="absolute right-0 top-0"
                                onClick={() => remove(index)}
                              >
                                x
                              </Button>
                            </div>
                          </CardBody>
                        </Card>
                      ))}
                      <Button
                        color="primary"
                        className="w-40"
                        onClick={() => push({ fieldLabel: "", fieldType: "" })}
                      >
                        Add more
                      </Button>
                    </>
                  )}
                </FieldArray>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2" htmlFor="bannerImage">
                    Banner Image
                    <span className="text-gray-500 ml-2">(1272px x 300px, Resolution 72px, Only .jpg, Max 2MB)</span>
                  </label>
                  <input
                    id="bannerImage"
                    name="bannerImage"
                    type="file"
                    accept=".jpg"
                    className="w-full"
                    onChange={(event) => {
                      const file = event.currentTarget.files[0];
                      uploadFileToS3(file, "bannerImage", setFieldValue);
                    }}
                  />
                  <ErrorMessage
                    name="bannerImage"
                    component="div"
                    className="text-red-500"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2" htmlFor="thumbnailImage">
                    Thumbnail Image
                    <span className="text-gray-500 ml-2">(250px x 100px, Resolution 72px, Only .jpg, Max 2MB)</span>
                  </label>
                  <input
                    id="thumbnailImage"
                    name="thumbnailImage"
                    type="file"
                    accept=".jpg"
                    className="w-full"
                    onChange={(event) => {
                      const file = event.currentTarget.files[0];
                      uploadFileToS3(file, "thumbnailImage", setFieldValue);
                    }}
                  />
                  <ErrorMessage
                    name="thumbnailImage"
                    component="div"
                    className="text-red-500"
                  />
                </div>

                <Field
                  name="metaTitle"
                  as={Input}
                  type="text"
                  labelPlacement="outside"
                  label="Meta Title"
                  variant="bordered"
                  placeholder="Type Meta Title"
                  className="max-w-full mb-4"
                  onChange={(e) => {
                    setMetaTitleEdited(true);
                    handleChange(e);
                  }}
                />
                <ErrorMessage
                  name="metaTitle"
                  component="div"
                  className="text-red-500"
                />
                <Field
                  name="metaDesc"
                  as={Input}
                  type="text"
                  labelPlacement="outside"
                  label="Meta Description"
                  variant="bordered"
                  placeholder="Type Meta Description"
                  className="max-w-full mb-4"
                  onChange={(e) => {
                    setMetaDescEdited(true);
                    handleChange(e);
                  }}
                />
                <ErrorMessage
                  name="metaDesc"
                  component="div"
                  className="text-red-500"
                />
                <Field
                  name="metaKeywords"
                  as={Input}
                  type="text"
                  labelPlacement="outside"
                  label="Meta Keywords"
                  variant="bordered"
                  placeholder="Type Meta Keywords"
                  className="max-w-full mb-4"
                  onChange={(e) => {
                    setMetaKeywordsEdited(true);
                    handleChange(e);
                  }}
                />
                <ErrorMessage
                  name="metaKeywords"
                  component="div"
                  className="text-red-500"
                />
                <TextEditor />
              </CardBody>
              <Divider />
              <CardFooter>
                <Button type="submit" color="primary" className="w-full">
                  Submit
                </Button>
              </CardFooter>
            </Card>
          </Form>
        );
      }}
    </Formik>
  );
}
