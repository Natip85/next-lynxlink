"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import LoginForm from "./LoginForm";

interface LoginButtonProps {
  children: React.ReactNode;
  mode?: "modal" | "redirect";
  asChild?: boolean;
  // open?: boolean;
  // setOpen?: () => React.Dispatch<React.SetStateAction<boolean>>;
}

export default function LoginButton({
  children,
  mode,
  asChild,
}: // open,
// setOpen,
LoginButtonProps) {
  const router = useRouter();
  const onClick = () => {
    console.log("LOGIN BUTN CLIKED");
    router.push("/auth/login");
  };

  if (mode === "modal") {
    return (
      <Dialog>
        <DialogTrigger asChild={asChild}>{children}</DialogTrigger>
        <DialogContent>
          <LoginForm />
        </DialogContent>
      </Dialog>
    );
  }
  return (
    <span onClick={onClick} className="cursor-pointer">
      {children}
    </span>
  );
}
