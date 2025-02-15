'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
} from '@/components/ui/dropdown-menu';
import { useTheme } from 'next-themes';
import { SunIcon, MoonIcon, SunMoon } from 'lucide-react';
import CONTENT_PAGE from '@/lib/content-page';

export default function ModeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="focus-visible:ring-0 focus-visible:ring-offset-0"
          data-testid="theme-toggle"
        >
          {theme === 'system' ? (
            <SunMoon data-testid="sun-moon-icon" />
          ) : theme === 'dark' ? (
            <MoonIcon data-testid="moon-icon" />
          ) : (
            <SunIcon data-testid="sun-icon" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent data-testid="theme-options">
        <DropdownMenuLabel>
          {CONTENT_PAGE.MODE_TOGGLE.appearance}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem
          checked={theme === 'light'}
          onClick={() => setTheme('light')}
        >
          {CONTENT_PAGE.MODE_TOGGLE.light}
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={theme === 'dark'}
          onClick={() => setTheme('dark')}
        >
          {CONTENT_PAGE.MODE_TOGGLE.dark}
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={theme === 'system'}
          onClick={() => setTheme('system')}
        >
          {CONTENT_PAGE.MODE_TOGGLE.system}
        </DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
