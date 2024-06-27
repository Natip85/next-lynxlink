"use client";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { User2 } from "lucide-react";
import SignOutButton from "./SignOutButton";
interface UserAccountNavProps {
  user: any;
}
export default function UserAccountNav({ user }: UserAccountNavProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="overflow-visible">
        <Button variant="ghost" size="sm" className="relative">
          My account
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="bg-background" align="end">
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex items-center justify-between gap-3 leading-none">
            <Avatar className="size-6">
              <AvatarImage src={user.image || ""} alt="user-img" />
              <AvatarFallback className="p-1">
                <User2 />
              </AvatarFallback>
            </Avatar>
            <p className="font-medium text-sm">{user.email}</p>
          </div>
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link href="/sell">Seller Dashboard</Link>
        </DropdownMenuItem>
        <SignOutButton>Log out</SignOutButton>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
