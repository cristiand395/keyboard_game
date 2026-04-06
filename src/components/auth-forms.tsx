"use client";

import { useActionState, useState, useMemo } from "react";
import { loginUserAction, registerUserAction } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signIn } from "next-auth/react";
import { Chrome, Check, X, ShieldCheck, Terminal as TerminalIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const initialState = { ok: false, message: "" };

/**
 * Componente auxiliar para mostrar cada regla de validación
 */
function ValidationRule({ met, text }: { met: boolean; text: string }) {
  return (
    <div className={cn(
      "flex items-center gap-2 font-mono text-[9px] uppercase tracking-widest transition-all",
       met ? "text-primary font-bold" : "text-muted-foreground/40"
    )}>
      {met ? <Check className="size-3" /> : <TerminalIcon className="size-3 opacity-20" />}
      <span>{text}</span>
    </div>
  );
}

export function RegisterForm() {
  const [state, action, isPending] = useActionState(registerUserAction, initialState);
  const [password, setPassword] = useState("");

  // Reglas de validación en tiempo real
  const rules = useMemo(() => ({
    length: password.length >= 8,
    hasLetter: /[a-zA-Z]/.test(password),
    hasNumber: /[0-9]/.test(password),
  }), [password]);

  const isPasswordValid = rules.length && rules.hasLetter && rules.hasNumber;

  return (
    <form action={action} className="space-y-6">
      <div className="space-y-2">
        <label className="font-mono text-[9px] uppercase tracking-[0.3em] text-muted-foreground ml-1">Alias_Usuario</label>
        <Input 
          name="name" 
          placeholder="ej. NeoTypist" 
          className="bg-surface-highest/50 border-white/5 focus:border-primary/50 focus:ring-0 rounded-none h-12 font-sans transition-all"
        />
      </div>

      <div className="space-y-2">
        <label className="font-mono text-[9px] uppercase tracking-[0.3em] text-muted-foreground ml-1">Canal_Comunicación</label>
        <Input 
          name="email" 
          type="email" 
          placeholder="piloto@neon-net.io" 
          required 
          className="bg-surface-highest/50 border-white/5 focus:border-primary/50 focus:ring-0 rounded-none h-12 font-sans transition-all"
        />
      </div>
      
      <div className="space-y-3">
        <label className="font-mono text-[9px] uppercase tracking-[0.3em] text-muted-foreground ml-1 flex justify-between">
          Clave_Seguridad
          <ShieldCheck className={cn("size-3 transition-colors", isPasswordValid ? "text-primary" : "text-muted-foreground/30")} />
        </label>
        <Input 
          name="password" 
          type="password" 
          placeholder="••••••••" 
          value={password}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
          required 
          className="bg-surface-highest/50 border-white/5 focus:border-primary/50 focus:ring-0 rounded-none h-12 font-mono transition-all"
        />
        
        {/* Indicadores de validación visual */}
        <div className="flex flex-col gap-2 p-3 bg-surface-highest/30 border border-white/5">
          <ValidationRule met={rules.length} text="MÍN_8_CARACTERES" />
          <ValidationRule met={rules.hasLetter} text="LETRA_REQUERIDA" />
          <ValidationRule met={rules.hasNumber} text="NÚMERO_REQUERIDO" />
        </div>
      </div>

      <Button 
        className="w-full h-12 neon-gradient font-display font-bold uppercase tracking-[0.2em] text-[10px] rounded-none shadow-[0_0_20px_rgba(161,250,255,0.1)] hover:shadow-[0_0_30px_rgba(161,250,255,0.25)] transition-all active:scale-[0.98]" 
        type="submit" 
        disabled={isPending || !isPasswordValid}
      >
        {isPending ? "INICIALIZANDO..." : "CREAR IDENTIDAD"}
      </Button>

      {state.message ? (
        <div className={cn(
          "p-4 border font-mono text-[10px] uppercase tracking-widest",
          state.ok 
            ? "border-primary/20 bg-primary/5 text-primary" 
            : "border-destructive/20 bg-destructive/5 text-destructive"
        )}>
          {state.message}
        </div>
      ) : null}
      
      <div className="relative my-10">
        <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-white/5" /></div>
        <div className="relative flex justify-center text-[10px] font-mono uppercase tracking-[0.4em]"><span className="bg-surface-low px-4 text-muted-foreground/30">Autenticación_Externa</span></div>
      </div>

      <Button 
        variant="outline" 
        className="w-full h-12 gap-3 border-white/5 bg-transparent hover:bg-surface-highest hover:border-primary/30 transition-all font-display font-bold uppercase tracking-widest text-[10px] rounded-none" 
        type="button"
        onClick={() => signIn("google", { callbackUrl: "/progreso" })}
      >
        <Chrome className="size-4" />
        Conectar Enlace Google
      </Button>
    </form>
  );
}

export function LoginForm() {
  const [state, action, isPending] = useActionState(loginUserAction, initialState);

  return (
    <form action={action} className="space-y-6">
      <div className="space-y-2">
        <label className="font-mono text-[9px] uppercase tracking-[0.3em] text-muted-foreground ml-1">Canal_Comunicación</label>
        <Input 
          name="email" 
          type="email" 
          placeholder="piloto@neon-net.io" 
          required 
          className="bg-surface-highest/50 border-white/5 focus:border-secondary/50 focus:ring-0 rounded-none h-12 font-sans transition-all"
        />
      </div>

      <div className="space-y-2">
        <label className="font-mono text-[9px] uppercase tracking-[0.3em] text-muted-foreground ml-1">Clave_Seguridad</label>
        <Input 
          name="password" 
          type="password" 
          placeholder="••••••••" 
          required 
          className="bg-surface-highest/50 border-white/5 focus:border-secondary/50 focus:ring-0 rounded-none h-12 font-mono transition-all"
        />
      </div>

      <Button 
        className="w-full h-12 bg-secondary text-secondary-foreground hover:bg-secondary/90 font-display font-bold uppercase tracking-[0.2em] text-[10px] rounded-none shadow-[0_0_20px_rgba(196,127,255,0.1)] transition-all active:scale-[0.98]" 
        type="submit" 
        disabled={isPending}
      >
        {isPending ? "AUTENTICANDO..." : "REANUDAR_ENLACE"}
      </Button>

      {state.message ? (
        <div className={cn(
          "p-4 border font-mono text-[10px] uppercase tracking-widest",
          state.ok 
            ? "border-primary/20 bg-primary/5 text-primary" 
            : "border-destructive/20 bg-destructive/5 text-destructive"
        )}>
          {state.message}
        </div>
      ) : null}

      <div className="relative my-10">
        <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-white/5" /></div>
        <div className="relative flex justify-center text-[10px] font-mono uppercase tracking-[0.4em]"><span className="bg-surface-high px-4 text-muted-foreground/30">Autenticación_Externa</span></div>
      </div>

      <Button 
        variant="outline" 
        className="w-full h-12 gap-3 border-white/5 bg-transparent hover:bg-surface-highest hover:border-secondary/30 transition-all font-display font-bold uppercase tracking-widest text-[10px] rounded-none" 
        type="button"
        onClick={() => signIn("google", { callbackUrl: "/progreso" })}
      >
        <Chrome className="size-4" />
        Conectar Enlace Google
      </Button>
    </form>
  );
}

