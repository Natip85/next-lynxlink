"use client";
import UseScroll from "@/hooks/use-scroll";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";
import React from "react";

export default function Header() {
  const scrolled = UseScroll(5);
  const selectedLayout = useSelectedLayoutSegment();
  return (
    <div
      className={cn(
        `sticky inset-x-0 top-0 z-30 w-full transition-all border-b border-secondary`,
        {
          "border-b border-secondary bg-background/75 backdrop-blur-lg":
            scrolled,
          "border-b border-secondary bg-background": selectedLayout,
        }
      )}
    >
      <div className="flex h-[60px] items-center justify-between px-4">
        <div className="flex items-center space-x-4">
          <Link
            href="/admin"
            className="flex flex-row space-x-3 items-center justify-center md:hidden"
          >
            <div className="flex justify-center">
              <Image
                src={"/logo.png"}
                alt="logo"
                width={60}
                height={60}
                priority
              />
            </div>
          </Link>
        </div>

        <div className="hidden md:block">
          <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center text-center">
            <span className="font-semibold text-sm">HQ</span>
          </div>
        </div>
      </div>
    </div>
  );
}
