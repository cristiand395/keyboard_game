"use client";

import { useActionState, useState, useEffect } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { User, ChevronDown, LogOut, ChartNoAxesCombined, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface UserMenuProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export function UserMenu({ user }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <Button
        variant="ghost"
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-12 items-center gap-4 px-2 py-2 group hover:bg-white/5 transition-all active:scale-95 cursor-pointer rounded-md border border-white/5"
      >
        <div className="flex h-8 w-8 items-center justify-center rounded bg-primary/10 text-primary border border-primary/20 shadow-[0_0_10px_rgba(161,250,255,0.1)] group-hover:scale-105 transition-transform">
          <User className="size-4" />
        </div>
        <div className="text-left hidden sm:block">
          <p className="text-[10px] font-display font-bold uppercase tracking-widest text-foreground leading-none mb-1">
            {user.name ?? user.email?.split("@")[0]}
          </p>
          <p className="text-[9px] font-mono text-muted-foreground uppercase tracking-widest opacity-50">Instancia_Activa</p>
        </div>
        <ChevronDown 
          className={cn("size-3 text-muted-foreground transition-transform duration-500", isOpen && "rotate-180")} 
        />
      </Button>

      {isOpen && (
        <>
          {/* Overlay to close the menu */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)} 
          />
          
          <div className="absolute right-0 top-full z-50 mt-4 w-64 animate-in fade-in slide-in-from-top-2 zoom-in-95 bg-surface-highest border border-white/10 p-2 shadow-[0_20px_50px_rgba(0,0,0,0.5)] duration-200 rounded-lg overflow-hidden">
            <div className="px-4 py-4 mb-2 border-b border-white/5">
               <p className="text-[10px] font-mono text-primary font-bold uppercase tracking-[0.3em] mb-1">Perfil_Usuario</p>
               <p className="text-xs font-sans text-muted-foreground truncate">{user.email}</p>
            </div>

            <Link
              href="/progreso"
              onClick={() => setIsOpen(false)}
              className="group flex w-full items-center gap-4 px-4 py-3 text-[10px] font-display font-bold uppercase tracking-widest text-muted-foreground transition-all hover:bg-primary/10 hover:text-primary rounded-md"
            >
              <ChartNoAxesCombined className="size-4 opacity-50 group-hover:opacity-100" />
              Análisis_Misión
            </Link>

            <Link
              href="/configuracion"
              onClick={() => setIsOpen(false)}
              className="group flex w-full items-center gap-4 px-4 py-3 text-[10px] font-display font-bold uppercase tracking-widest text-muted-foreground transition-all hover:bg-primary/10 hover:text-primary rounded-md"
            >
              <Settings className="size-4 opacity-50 group-hover:opacity-100" />
              Config_Sistema
            </Link>
            
            <div className="my-2 border-t border-white/5" />
            
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="group flex w-full cursor-pointer items-center gap-4 px-4 py-3 text-[10px] font-display font-bold uppercase tracking-widest text-destructive transition-all hover:bg-destructive/10 rounded-md"
            >
              <LogOut className="size-4 opacity-50 group-hover:opacity-100" />
              Desconectar
            </button>
          </div>
        </>
      )}
    </div>
  );
}
