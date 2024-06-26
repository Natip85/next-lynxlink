"use client";
import React from "react";
import { Button } from "../ui/button";
import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
export default function Social() {
  const onClick = (provider: "google" | "github") => {
    signIn(provider, {
      callbackUrl: "/products",
    });
  };
  return (
    <div className="flex items-center w-full gap-x-2">
      <Button
        onClick={() => onClick("google")}
        variant={"outline"}
        size={"lg"}
        className="w-full"
      >
        <FcGoogle className="size-5" />
      </Button>
      <Button
        onClick={() => onClick("github")}
        variant={"outline"}
        size={"lg"}
        className="w-full"
      >
        <FaGithub className="size-5" />
      </Button>
    </div>
  );
}
