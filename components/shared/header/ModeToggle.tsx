"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "next-themes";
import { SunIcon, MoonIcon, SunMoon } from "lucide-react";
import CONTENT_PAGE from "@/lib/content-page";

type ModeToggleProps = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  modal?: boolean;
};

export default function ModeToggle({
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  modal: controlledModal,
}: ModeToggleProps = {}) {
  const [mounted, setMounted] = useState(false);
  const [internalOpen, setInternalOpen] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const { theme, setTheme } = useTheme();
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = controlledOnOpenChange || setInternalOpen;

  useEffect(() => {
    setMounted(true);
    setIsTouchDevice("ontouchstart" in window || navigator.maxTouchPoints > 0);
  }, []);

  if (!mounted) return null;

  const modal = controlledModal !== undefined ? controlledModal : isTouchDevice;

  return (
    <DropdownMenu open={open} onOpenChange={setOpen} modal={modal}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative overflow-visible outline-none focus:!outline-none focus-visible:!outline-none focus:!ring-0 focus-visible:!ring-0 focus-visible:!ring-offset-0 active:!outline-none"
          data-testid="theme-toggle"
        >
          {theme === "system" ? (
            <SunMoon data-testid="sun-moon-icon" />
          ) : theme === "dark" ? (
            <MoonIcon data-testid="moon-icon" />
          ) : (
            <SunIcon data-testid="sun-icon" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent data-testid="theme-options">
        <DropdownMenuLabel>
          {CONTENT_PAGE.COMPONENT.MODE_TOGGLE.appearance}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem
          checked={theme === "light"}
          onClick={() => setTheme("light")}
        >
          {CONTENT_PAGE.COMPONENT.MODE_TOGGLE.light}
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={theme === "dark"}
          onClick={() => setTheme("dark")}
        >
          {CONTENT_PAGE.COMPONENT.MODE_TOGGLE.dark}
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={theme === "system"}
          onClick={() => setTheme("system")}
        >
          {CONTENT_PAGE.COMPONENT.MODE_TOGGLE.system}
        </DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
