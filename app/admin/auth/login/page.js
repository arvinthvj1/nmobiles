// components/AdminLogin.js
"use client";
import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardBody, Image } from "@nextui-org/react";
import { Input } from "@nextui-org/input";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { Button } from "@nextui-org/button";
import GoogleIcon from '@mui/icons-material/Google';
import { Divider } from "@nextui-org/divider";
import { auth, provider, signInWithPopup, onAuthStateChanged } from "../../../../pages/api/firebase/index";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export default function AdminLogin() {
  const [isVisible, setIsVisible] = useState(false);
  const [user, setUser] = useState(null);
  const router = useRouter();

  const toggleVisibility = () => setIsVisible(!isVisible);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      debugger
      if (user) {
        setUser(user);
        Cookies.set("token", user.accessToken, { expires: 1 }); // Set cookie for 1 day
        router.push("/manage/categories");
      }
    });
  }, [router]);

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      setUser(user);
      Cookies.set("token", user.accessToken, { expires: 1 });
      router.push("manage/categories");
    } catch (error) {
      console.error("Error during sign-in:", error);
    }
  };

  return (
    <Card className="py-4 gap-3">
      <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
        <Image
          alt="Logo"
          className="object-cover rounded-xl"
          src="/path/to/logo.png"
          width={270}
        />
      </CardHeader>
      <CardBody className="overflow-visible py-2 gap-5">
        <Input
          type="email"
          label="Email"
          variant="bordered"
          placeholder="Enter your email"
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
        <Divider />
        <Button onClick={handleGoogleSignIn}>
          <GoogleIcon />
          Login with Google
        </Button>
      </CardBody>
    </Card>
  );
}
