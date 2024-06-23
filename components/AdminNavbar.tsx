import Link from "next/link";
import MaxWidthWrapper from "./MaxWidthWrapper";
import Image from "next/image";
import { ModeToggle } from "./theme-toggle";

export default function AdminNavbar() {
  return (
    <div className="sticky z-50 top-0 inset-x-0 h-16">
      <header className="relative border-b border-secondary">
        <MaxWidthWrapper>
          <div className="flex h-16 items-center">
            <div>fdfdfgd</div>
            <div>
              <ModeToggle />
            </div>
          </div>
        </MaxWidthWrapper>
      </header>
    </div>
  );
}
