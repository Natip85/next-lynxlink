import Image from "next/image";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { MoreHorizontal, User2 } from "lucide-react";
import { currentUser } from "@/lib/auth";
import NavbarModeToggle from "./NavbarModeToggle";
import { SidebarModeToggle } from "./SidebarModeToggle";

export default async function Sidebar() {
  const user = await currentUser();

  return (
    <div className="sticky top-0 left-0 md:flex h-screen flex-col justify-between border-r border-r-secondary min-w-[16rem] hidden px-2 pb-6">
      <div className="">
        <Link href="/admin">
          <Image src={"/logo.png"} alt="logo" width={60} height={60} />
        </Link>
        <Link href={"/home"}>Store</Link>
      </div>
      <div>
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center justify-between gap-3 hover:bg-secondary w-full px-2 py-1 rounded-md">
            <Avatar className="size-6">
              <AvatarImage src={user?.image || ""} alt="user-img" />
              <AvatarFallback className="p-1">
                <User2 />
              </AvatarFallback>
            </Avatar>
            <span className="truncate text-sm font-medium text-muted-foreground">
              {user?.email}
            </span>
            <MoreHorizontal className="size-5" />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="min-w-[14rem]">
            <SidebarModeToggle />
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
