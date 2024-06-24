"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useState } from "react";

export function SidebarModeToggle({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const { setTheme, theme } = useTheme();
  const [defaultTheme, setDefaultTheme] = useState(theme);

  function handleToggle() {
    if (defaultTheme === "light") {
      setDefaultTheme("dark");
      setTheme("dark");
    }

    if (defaultTheme === "dark") {
      setDefaultTheme("light");
      setTheme("light");
    }
  }
  return (
    <div className={className} {...props}>
      <DropdownMenuItem
        onClick={handleToggle}
        className="flex items-center gap-3 w-full"
      >
        {defaultTheme === "light" ? (
          <>
            <Sun className="rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />{" "}
            Toggle theme
          </>
        ) : (
          <>
            <Moon className="rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />{" "}
            Toggle theme
          </>
        )}
      </DropdownMenuItem>
    </div>
  );
}
