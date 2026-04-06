"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { verifyEmailAction } from "@/app/actions";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("Sincronizando enlace de verificación...");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Token de acceso no detectado.");
      return;
    }

    async function verify() {
      const result = await verifyEmailAction(token as string);
      if (result.ok) {
        setStatus("success");
      } else {
        setStatus("error");
      }
      setMessage(result.message ?? "Error en la validación del protocolo.");
    }

    verify();
  }, [token]);

  return (
    <main className="flex min-h-[80vh] items-center justify-center p-6 bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="w-full max-w-md bg-surface-low border border-white/5 p-12 rounded-lg relative overflow-hidden animate-rise">
        <div className={cn(
          "absolute top-0 left-0 w-1 h-full shadow-[0_0_20px_white/20]",
          status === "loading" ? "bg-primary" : status === "success" ? "bg-primary" : "bg-destructive"
        )} />

        <div className="flex flex-col items-center text-center">
          <div className="mb-10 group">
            {status === "loading" && <Loader2 className="size-16 animate-spin text-primary opacity-50" />}
            {status === "success" && (
              <div className="size-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:scale-110 transition-transform shadow-[0_0_30px_rgba(161,250,255,0.2)]">
                 <CheckCircle2 className="size-8" />
              </div>
            )}
            {status === "error" && (
              <div className="size-16 rounded-full bg-destructive/10 border border-destructive/20 flex items-center justify-center text-destructive group-hover:scale-110 transition-transform">
                 <XCircle className="size-8" />
              </div>
            )}
          </div>

          <h1 className="text-[10px] font-mono font-bold uppercase tracking-[0.5em] text-muted-foreground mb-4">
            {status === "loading" ? "VERIFICANDO IDENTIDAD" : status === "success" ? "IDENTIDAD CONFIRMADA" : "FALLO DE SISTEMA"}
          </h1>

          <p className="text-xl font-display font-bold text-foreground uppercase tracking-tight mb-10 leading-snug">
            {message}
          </p>

          <Button asChild className="w-full h-14 neon-gradient font-display font-bold uppercase tracking-widest text-xs border-none text-primary-foreground shadow-[0_0_20px_rgba(161,250,255,0.15)] active:scale-95 transition-all">
            <Link href="/acceder">
              {status === "success" ? "Acceder al Nexo" : "Volver al Acceso"}
            </Link>
          </Button>

          <div className="mt-12 flex items-center gap-4 opacity-20">
             <div className="h-px bg-white/20 w-8" />
             <span className="font-mono text-[9px] uppercase tracking-widest">Protocolo_ES // NEON_CORE</span>
             <div className="h-px bg-white/20 w-8" />
          </div>
        </div>
      </div>
    </main>
  );
}
