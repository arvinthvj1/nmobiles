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
  Spinner,
} from "@nextui-org/react";
import { addData, fetchData } from "@/app/fe-handlers/requestHandlers";
import { Formik, Form, Field, FieldArray, ErrorMessage } from "formik";
import * as Yup from "yup";
import TextEditor from "../../../../../components/TextEditor";
import Toast from "@/components/toaster";
import { useRouter } from 'next/navigation'
import CloseIcon from '@mui/icons-material/Close';
const field_type_data = [
  {
    label: "Select",
    value: "select",
  },
  {
    label: "Multi-Select",
    value: "multi-select",
  },
];
const field_type_req = [
  {
    label: "Required",
    value: "required",
  },
  {
    label: "Not Required",
    value: "not-required",
  },
];
const validationSchema = Yup.object({
  brandName: Yup.string().required("brand Name is required"),
  urlSlug: Yup.string().required("URL Slug is required"),
  metaKeywords: Yup.string(),
  metaTitle: Yup.string().required("Meta Title is required"),
  metaDesc: Yup.string().required("Meta description is required"),
});

export default function AddOrEdit({editData = {}}:any) {
  debugger
  const router = useRouter();
  const [metaTitleEdited, setMetaTitleEdited] = useState(false);
  const [metaDescEdited, setMetaDescEdited] = useState(false);
  const [metaKeywordsEdited, setMetaKeywordsEdited] = useState(false);
  const [toastMessage, setToastMessage] =  useState({type : "", message: ""});
  const [isSubmitting, setIsSubmitting] = useState("none");



  

  const convertToSlug = (title: any) => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  };

  const uploadFileToS3 = async (file:any) => {
    const formData = new FormData();
    formData.append("file", file);
    const filename = file.name;
    const parts = filename.split(".");
    const extension = parts.pop(); // Remove the last element (which is the extension)
    
    const timestamp = new Date().getTime();
    const newFilename = `${parts.join(".")}_${timestamp}.${extension}`;
    
    try {
      const response = await fetch("/api/aws/createS3", {
        method: "POST",
        body: file,
        headers: {
          'Content-Disposition': `attachment; filename="${newFilename}"`,
          'folderName': 'brand' 
        },
      });
  
      if (response.ok) {
        const data = await response.json();
        return data.data.Key;
      } else {
        const error = await response.json();
        console.error(error);
        return null;
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      return null;
    }
  };
  
  const handleSubmit = async (values:any, { setSubmitting }:any) => {
    console.log(values);
    setIsSubmitting("flex");
  
    const { bannerImage, thumbnailImage } = values;
  
    
    try{
      let bannerImageUrl = null;
      let thumbnailImageUrl = null;
        if (bannerImage) {
          bannerImageUrl = await uploadFileToS3(bannerImage);
        }
      
        if (thumbnailImage) {
          thumbnailImageUrl = await uploadFileToS3(thumbnailImage);
        }
      
        // Update values with image URLs
        const updatedValues = {
          ...values,
          bannerImage: bannerImageUrl,
          thumbnailImage: thumbnailImageUrl,
        };
      
        await addData("brand", updatedValues);
        setToastMessage({message : `Submitted Successfully !`, type : "success"});
        setTimeout(() => {
          router.push(window.location.href.replace("add", ""))
        }, 3000);
    }catch(err){
      setIsSubmitting("none");
      setToastMessage({message : JSON.stringify(err), type : "error"});
    }
    
  };
  async function deleteFile(filename: string) {
    try {
      const response = await fetch(`/api/aws/createS3?filename=${encodeURIComponent(filename)}`, {
        method: 'DELETE',
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete file');
      }
  
      const data = await response.json();
      console.log('File deleted successfully:', data);
    } catch (error :any) {
      console.error('Error deleting file:', error.message);
    }
  }
  
  
  return (
    [<Toast  toastObj={toastMessage}/>,
      <Spinner style={{
        background: '#ffffff9e',
        position: 'absolute',
        zIndex: 111,
        display : isSubmitting,
        height: '100vh',
        width: '100vw',
        justifyContent: 'center',
        alignItems: 'center',
      }} label="Submitting..." color="warning" ></Spinner>,
      <Button color="primary" onClick={()=>{
        router.push('/admin/manage/brand/');
      }}>
      View All
    </Button>,
    <Formik
      initialValues={Object.keys(editData).length ? {
        brandName: editData.brandName || "",
        urlSlug: editData.urlSlug || "",
        metaKeywords: editData.metaKeywords || "",
        metaTitle:  editData.metaTitle || "",
        metaDesc: editData.metaDesc || "",
        bannerImage: editData.bannerImage || "",
        thumbnailImage: editData.thumbnailImage || "",
        content : editData.content || "" 
      } : {
        brandName: "",
        urlSlug: "",
        metaKeywords: "",
        metaTitle: "",
        metaDesc: "",
        bannerImage: null,
        thumbnailImage: null,
        content : ""
      }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ values, setFieldValue, handleChange }) => {
        const [bannerPreview, setBannerPreview] = useState(null);
        const [ thumbNailImagePreview, setThumbNailImagePreview] = useState(null);

        useEffect(() => {
          // debugger
          const titleToSlug = convertToSlug(values.brandName);
          setFieldValue("urlSlug", titleToSlug);
          if (!metaTitleEdited) {
            setFieldValue("metaTitle", values.brandName);
          }
          if (!metaDescEdited) {
            setFieldValue("metaDesc", values.brandName);
          }
          if (!metaKeywordsEdited) {
            setFieldValue("metaKeywords", values.brandName);
          }
         
        }, [
          values.brandName,
          setFieldValue,
          metaTitleEdited,
          metaDescEdited,
          metaKeywordsEdited,
        ]);

        useEffect(()=>{
          if(Object.keys(editData).length){
            setBannerPreview(`${window.location.origin}/api/aws/readS3?bucketName=nmobiles&key=${editData.bannerImage}`)
            setThumbNailImagePreview(`${window.location.origin}/api/aws/readS3?bucketName=nmobiles&key=${editData.thumbnailImage}`)
          }
        },[editData]);

        const handleFileChange = (event :any, fieldValue :any) => {
          const file = event.currentTarget.files[0];
          setFieldValue(fieldValue, file);
      
          // Create a preview of the selected file
          const reader = new FileReader();
          reader.onloadend = () => {
            // setBannerPreview(reader.result);
          };
          if (file) {
            reader.readAsDataURL(file);
          }
        };

        
        return (
          <Form>
            <Card className="max-w-full mb-4">
              <CardHeader className="flex gap-3">Add</CardHeader>
              <Divider />
              <CardBody>
                <Field
                  name="brandName"
                  as={Input}
                  type="text"
                  labelPlacement="outside"
                  label="brand Name"
                  variant="bordered"
                  placeholder="Type brand name"
                  className="max-w-full mb-4"
                />
                <ErrorMessage
                  name="brandName"
                  component="div"
                  className="text-red-500"
                />

                <Field
                  name="urlSlug"
                  as={Input}
                  type="text"
                  label="URL slug"
                  placeholder="Auto filled from brand name"
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

               

            
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2" htmlFor="bannerImage">
                    Banner Image
                    <span className="text-gray-500 ml-2">(1272px x 300px, Resolution 72px, Max 2MB)</span>
                  </label>
                  <input
                    id="bannerImage"
                    name="bannerImage"
                    type="file"
                    className="w-full"
                    onChange={(e)=>{
                      handleFileChange(e,"bannerImage")
                    }}
                  />
                  <ErrorMessage
                    name="bannerImage"
                    component="div"
                    className="text-red-500"
                  />
                  {bannerPreview && (
                    <div className="mt-4 flex items-end gap-3 ">
                    
                    <img src={bannerPreview} alt="Banner Preview" className="w-8" />
                    <Button onClick={()=>{
                      debugger
                      setBannerPreview(null)
                      deleteFile(editData?.bannerImage)
                    }} size="sm" color="danger" variant="bordered" startContent={<CloseIcon/>}>
                    Remove
                  </Button>
                  </div>
                  )}
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2" htmlFor="thumbnailImage">
                    Thumbnail Image
                    <span className="text-gray-500 ml-2">(250px x 100px, Resolution 72px, Max 2MB)</span>
                  </label>
                  <input
                    id="thumbnailImage"
                    name="thumbnailImage"
                    type="file"
                    className="w-full"
                    onChange={(e)=>{
                      handleFileChange(e,"thumbnailImage")
                    }}
                  />
                  <ErrorMessage
                    name="thumbnailImage"
                    component="div"
                    className="text-red-500"
                  />
                     {thumbNailImagePreview && (
                    <div className="mt-4 flex items-end gap-3 ">
                    
                      <img src={thumbNailImagePreview} alt="Thumbnail Preview" className="w-8" />
                      <Button onClick={()=>{

                      setThumbNailImagePreview(null);
                      deleteFile(editData?.bannerImage)
                    }} size="sm" color="danger" variant="bordered" startContent={<CloseIcon/>}>
                      Remove
                    </Button>
                    </div>
                  )}
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
                <TextEditor setTextAreaValue={((e :any)=>  {
                  // debugger
                  setFieldValue('content', e)
                })} value={values.content}/>
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
    </Formik>]
  );
}
