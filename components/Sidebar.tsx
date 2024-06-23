import Image from "next/image";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { MoreVertical, User2 } from "lucide-react";
import { currentUser } from "@/lib/auth";

export default async function Sidebar() {
  const user = await currentUser();
  console.log("this", user);

  return (
    <div className="sticky top-0 left-0 md:flex h-screen flex-col justify-between border-r border-r-secondary min-w-[16rem] hidden">
      <div className="">
        <Link href="/admin">
          <Image src={"/logo.png"} alt="logo" width={60} height={60} />
        </Link>
        <Link href={"/home"}>Store</Link>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center justify-between">
          <Avatar className="size-6">
            <AvatarImage src={user?.image || ""} alt="user-img" />
            <AvatarFallback className="p-1">
              <User2 />
            </AvatarFallback>
          </Avatar>
          <MoreVertical />
        </DropdownMenuTrigger>
        <DropdownMenuContent></DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
