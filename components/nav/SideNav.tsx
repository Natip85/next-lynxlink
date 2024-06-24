"use client";
import { SIDENAV_ITEMS, SideNavItem } from "@/constants";
import { ChevronDown, LogOut, MoreHorizontal, User2 } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { SidebarModeToggle } from "../SidebarModeToggle";
import SignOutButton from "../auth/SignOutButton";
import { useCurrentUser } from "@/hooks/use-current-User";
import Image from "next/image";

const SideNav = () => {
  const user = useCurrentUser();
  return (
    <div className="md:w-60 bg-background h-screen flex-1 fixed border-r border-secondary hidden md:flex">
      <div className="flex flex-col space-y-6 w-full py-5">
        <Link
          href="/admin"
          className="flex flex-row space-x-3 items-center justify-center md:justify-start md:px-6  bg-background h-12 w-full"
        >
          <div className="flex justify-center">
            <Image
              src={"/logo.png"}
              alt="logo"
              width={70}
              height={70}
              priority
            />
          </div>
        </Link>

        <div className="flex flex-1 flex-col space-y-2 md:px-6 ">
          {SIDENAV_ITEMS.map((item, idx) => {
            return <MenuItem key={idx} item={item} />;
          })}
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
              <SignOutButton>
                <LogOut />
                Log out{" "}
              </SignOutButton>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};

export default SideNav;

const MenuItem = ({ item }: { item: SideNavItem }) => {
  const pathname = usePathname();
  const [subMenuOpen, setSubMenuOpen] = useState(false);
  const toggleSubMenu = () => {
    setSubMenuOpen(!subMenuOpen);
  };

  return (
    <div className="">
      {item.submenu ? (
        <>
          <button
            onClick={toggleSubMenu}
            className={`flex flex-row items-center p-2 rounded-lg  w-full justify-between hover:bg-secondary ${
              pathname.includes(item.path) ? "bg-secondary" : ""
            }`}
          >
            <div className="flex flex-row space-x-4 items-center">
              {item.icon}
              <span className="font-semibold text-xl  flex">
                <Link href={item.path}>{item.title}</Link>
              </span>
            </div>

            <div className={`${subMenuOpen ? "rotate-180" : ""} flex`}>
              <ChevronDown />{" "}
            </div>
          </button>

          {subMenuOpen && (
            <div className="my-2 ml-12 flex flex-col space-y-4">
              {item.submenuItems?.map((subItem, idx) => {
                return (
                  <Link
                    key={idx}
                    href={subItem.path}
                    className={`${
                      subItem.path === pathname ? "font-bold bg-secondary" : ""
                    } hover:bg-secondary p-1.5 rounded-md`}
                  >
                    <span>{subItem.title}</span>
                  </Link>
                );
              })}
            </div>
          )}
        </>
      ) : (
        <Link
          href={item.path}
          className={`flex flex-row space-x-4 items-center p-2 rounded-lg hover:bg-secondary ${
            item.path === pathname ? "bg-secondary" : ""
          }`}
        >
          {item.icon}
          <span className="font-semibold text-xl flex">{item.title}</span>
        </Link>
      )}
    </div>
  );
};
