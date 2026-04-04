"use client";

import { useActionState, useState, useEffect } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { User, ChevronDown, LogOut, ChartNoAxesCombined, Settings } from "lucide-react";

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
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 rounded-full border border-slate-100 bg-white px-2 py-1.5 pr-4 shadow-sm transition-all hover:bg-slate-50 hover:shadow-md active:scale-95"
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-linear-to-br from-indigo-500 to-cyan-500 text-white">
          <User className="size-4" />
        </div>
        <div className="text-left">
          <p className="text-xs font-bold leading-tight text-slate-800">
            {user.name ?? user.email?.split("@")[0]}
          </p>
          <p className="text-[10px] text-slate-400">Ver cuenta</p>
        </div>
        <ChevronDown 
          className={`size-3 text-slate-300 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} 
        />
      </button>

      {isOpen && (
        <>
          {/* Overlay to close the menu */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)} 
          />
          
          <div className="absolute right-0 top-full z-50 mt-2 w-52 animate-in fade-in slide-in-from-top-2 overflow-hidden rounded-[24px] border border-slate-100 bg-white p-2 shadow-2xl ring-1 ring-slate-950/5 duration-200">
            <Link
              href="/progreso"
              onClick={() => setIsOpen(false)}
              className="group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-700 transition-all hover:bg-slate-50 hover:text-indigo-600"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-50 transition-colors group-hover:bg-indigo-100">
                <ChartNoAxesCombined className="size-4" />
              </div>
              Mi Progreso
            </Link>

            <Link
              href="/configuracion"
              onClick={() => setIsOpen(false)}
              className="group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-700 transition-all hover:bg-slate-50 hover:text-indigo-600"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-50 transition-colors group-hover:bg-indigo-100">
                <Settings className="size-4" />
              </div>
              Configuración
            </Link>
            
            <div className="my-1 border-t border-slate-50" />
            
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-rose-600 transition-all hover:bg-rose-50"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-50 transition-colors group-hover:bg-rose-100">
                <LogOut className="size-4" />
              </div>
              Cerrar Sesión
            </button>
          </div>
        </>
      )}
    </div>
  );
}
