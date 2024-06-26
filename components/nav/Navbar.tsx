import React from "react";
import MaxWidthWrapper from "../MaxWidthWrapper";
import Link from "next/link";
import { Button, buttonVariants } from "../ui/button";
import Cart from "../Cart";
import MobileNav from "./MobileNav";
import NavItems from "./NavItems";
import Image from "next/image";
import { currentUser } from "@/lib/auth";
import UserAccountNav from "../auth/UserAccountNav";
import LoginButton from "../auth/LoginButton";
import { UserRole } from "@prisma/client";
import NavbarModeToggle from "../NavbarModeToggle";

export default async function Navbar() {
  const user = await currentUser();

  return (
    <div className="bg-background sticky z-50 top-0 inset-x-0 h-16">
      <header className="relative">
        <MaxWidthWrapper>
          <div className="border-b border-secondary">
            <div className="flex h-16 items-center">
              <MobileNav />

              <div className="ml-4 flex lg:ml-0">
                <Link href="/">
                  <Image
                    src={"/logo.png"}
                    alt="logo"
                    width={60}
                    height={60}
                    priority
                  />
                </Link>
              </div>

              <div className="hidden z-50 lg:ml-8 lg:block lg:self-stretch">
                <NavItems />
              </div>

              <div className="ml-auto flex items-center gap-3">
                <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-end lg:space-x-6">
                  {user ? null : (
                    <LoginButton asChild>
                      <Button variant={"ghost"}> Sign in</Button>
                    </LoginButton>
                  )}
                  {user ? null : (
                    <span className="h-6 w-px bg-gray-200" aria-hidden="true" />
                  )}
                  {user ? (
                    <UserAccountNav user={user} />
                  ) : (
                    <Link
                      href="/auth/register"
                      className={buttonVariants({
                        variant: "default",
                      })}
                    >
                      Start free trial
                    </Link>
                  )}
                  {user ? (
                    <span className="h-6 w-px bg-gray-200" aria-hidden="true" />
                  ) : null}
                  {user ? null : (
                    <div className="flex lg:ml-6">
                      <span
                        className="h-6 w-px bg-gray-200"
                        aria-hidden="true"
                      />
                    </div>
                  )}
                  <div className="ml-4 flow-root lg:ml-6">
                    <Cart />
                  </div>
                </div>

                <div>
                  <NavbarModeToggle />
                </div>
                {user?.role === UserRole.ADMIN && (
                  <Link
                    href={"/admin"}
                    className={buttonVariants({ variant: "outline" })}
                  >
                    Go to admin
                  </Link>
                )}
              </div>
            </div>
          </div>
        </MaxWidthWrapper>
      </header>
    </div>
  );
}
