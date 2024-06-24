"use client";
import React, { ReactNode } from "react";
import { DropdownMenuItem } from "../ui/dropdown-menu";
import { signOut } from "next-auth/react";

export default function SignOutButton({ children }: { children: ReactNode }) {
  return (
    <DropdownMenuItem
      variant="destructive"
      onClick={() => signOut({ redirect: true, callbackUrl: "/" })}
      className="cursor-pointer flex items-center gap-3"
    >
      {children}
    </DropdownMenuItem>
  );
}
