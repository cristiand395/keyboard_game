"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import { ChevronDown, LogOut, ChartNoAxesCombined, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getAvatar } from "@/lib/avatars";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface UserMenuProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    avatar?: string | null;
  };
}

export function UserMenu({ user }: UserMenuProps) {
  const AvatarIcon = getAvatar(user.avatar).component;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-12 items-center gap-4 px-2 py-2 group hover:bg-white/5 transition-all active:scale-95 cursor-pointer rounded-md border border-white/5"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded bg-primary/10 text-primary border border-primary/20 shadow-[0_0_10px_rgba(161,250,255,0.1)] group-hover:scale-105 transition-transform">
            <AvatarIcon className="size-4" />
          </div>
          <p className="text-[10px] font-display font-bold uppercase tracking-widest text-foreground leading-none hidden sm:block">
            {user.name ?? user.email?.split("@")[0]}
          </p>
          <ChevronDown className="size-3 text-muted-foreground transition-transform duration-500" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel className="px-4 py-3">
          <p className="text-[10px] font-mono text-primary font-bold uppercase tracking-[0.3em] mb-1">Perfil</p>
          <p className="text-xs font-sans text-muted-foreground truncate font-normal">{user.email}</p>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link href="/progreso" className="gap-4 px-4 py-3 text-[10px] font-display font-bold uppercase tracking-widest cursor-pointer">
            <ChartNoAxesCombined className="size-4 opacity-50" />
            Análisis
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link href="/configuracion" className="gap-4 px-4 py-3 text-[10px] font-display font-bold uppercase tracking-widest cursor-pointer">
            <Settings className="size-4 opacity-50" />
            Configuración
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={() => signOut({ callbackUrl: "/" })}
          className="gap-4 px-4 py-3 text-[10px] font-display font-bold uppercase tracking-widest text-destructive focus:text-destructive cursor-pointer"
        >
          <LogOut className="size-4 opacity-50" />
          Desconectar
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
