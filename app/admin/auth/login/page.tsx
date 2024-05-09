"use client";
import React from "react";
import { Card, CardHeader, CardBody ,Image} from "@nextui-org/react";
import { Input } from "@nextui-org/input";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import Link from "next/link";
import { Button } from "@nextui-org/button";
import GoogleIcon from '@mui/icons-material/Google';
import settings from "../../../../pages/db/settings";
import {Divider} from "@nextui-org/divider";
export default function AdminLogin() {

  const [isVisible, setIsVisible] = React.useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);

  return (
    <Card className="py-4 gap-3">
      <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
	  <Image
          alt={settings.login.name}
          className="object-cover rounded-xl"
          src={settings.login.logo}
          width={270}
        />
	  </CardHeader>
      <CardBody className="overflow-visible py-2 gap-5">
        <Input
          type="email"
          label="Email"
          variant="bordered"
          defaultValue="junior2nextui.org"
          isInvalid={false}
          errorMessage="Please enter a valid email"
          className="max-w-xs"
        />
        <Input
          label="Password"
          variant="bordered"
          placeholder="Enter your password"
          endContent={
            <button
              className="focus:outline-none"
              type="button"
              onClick={toggleVisibility}
            >
              {isVisible ? (
                <VisibilityIcon className="text-2xl text-default-400 pointer-events-none" />
              ) : (
                <VisibilityOffIcon className="text-2xl text-default-400 pointer-events-none" />
              )}
            </button>
          }
          type={isVisible ? "text" : "password"}
          className="max-w-xs"
        />
		  <Button color="primary">
			Login
		  </Button>
      <Divider/>
		  <Button >
       
			<GoogleIcon/>
			Login with Google
		  </Button>
      </CardBody>
    </Card>
  );
}
