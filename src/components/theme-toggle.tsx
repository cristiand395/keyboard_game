"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="size-9 rounded bg-white/5 border border-white/10">
        <div className="size-4" />
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="size-9 rounded bg-white/5 border border-white/10 hover:bg-white/10 hover:border-primary/50 transition-all group"
      aria-label="Alternar tema"
    >
      {theme === "dark" ? (
        <Sun className="size-4 text-primary group-hover:scale-110 transition-transform" />
      ) : (
        <Moon className="size-4 text-primary group-hover:scale-110 transition-transform" />
      )}
    </Button>
  );
}
