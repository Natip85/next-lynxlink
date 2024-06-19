import Image from "next/image";
import Link from "next/link";
import React from "react";

interface HeaderProps {
  label: string;
}

export default function Header({ label }: HeaderProps) {
  return (
    <div className="w-full flex flex-col gap-y-4 items-center justify-center">
      <h1 className="text-6xl font-semibold ">
        <Link href={"/"} className="flex items-center gap-3">
          {" "}
          <Image src={"/logo.png"} alt="logo" width={80} height={80} /> lynxLink
        </Link>
      </h1>
      <p className="text-muted-foreground text-sm">{label}</p>
    </div>
  );
}
