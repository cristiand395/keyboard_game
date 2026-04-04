"use client";

import { useActionState, useState, useMemo } from "react";
import { loginUserAction, registerUserAction } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signIn } from "next-auth/react";
import { Chrome, Check, X } from "lucide-react";

const initialState = { ok: false, message: "" };

/**
 * Componente auxiliar para mostrar cada regla de validación
 */
function ValidationRule({ met, text }: { met: boolean; text: string }) {
  return (
    <div className={`flex items-center gap-2 text-xs transition-colors ${met ? "text-emerald-600 font-medium" : "text-slate-400"}`}>
      {met ? <Check className="size-3" /> : <X className="size-3 opacity-50" />}
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
    <form action={action} className="space-y-4">
      <Input name="name" placeholder="Tu nombre" />
      <Input name="email" type="email" placeholder="tu@email.com" required />
      
      <div className="space-y-2">
        <Input 
          name="password" 
          type="password" 
          placeholder="Contraseña segura" 
          value={password}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
          required 
        />
        
        {/* Indicadores de validación visual */}
        <div className="flex flex-col gap-1.5 px-1 py-1">
          <ValidationRule met={rules.length} text="Mínimo 8 caracteres" />
          <ValidationRule met={rules.hasLetter} text="Al menos una letra" />
          <ValidationRule met={rules.hasNumber} text="Al menos un número" />
        </div>
      </div>

      <Button 
        className="w-full font-semibold transition-all" 
        type="submit" 
        disabled={isPending || !isPasswordValid}
      >
        {isPending ? "Creando..." : "Crear cuenta"}
      </Button>
      {state.message ? <p className="text-sm text-center text-indigo-600 bg-indigo-50 p-3 rounded-xl border border-indigo-100">{state.message}</p> : null}
      
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-slate-200" /></div>
        <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-slate-400">O también</span></div>
      </div>

      <Button 
        variant="outline" 
        className="w-full gap-2 border-slate-200 hover:bg-slate-50 transition-all font-semibold" 
        type="button"
        onClick={() => signIn("google", { callbackUrl: "/progreso" })}
      >
        <Chrome className="size-4" />
        Continuar con Google
      </Button>
    </form>
  );
}

export function LoginForm() {
  const [state, action, isPending] = useActionState(loginUserAction, initialState);

  return (
    <form action={action} className="space-y-4">
      <Input name="email" type="email" placeholder="tu@email.com" required />
      <Input name="password" type="password" placeholder="Tu clave" required />
      <Button className="w-full font-semibold" type="submit" disabled={isPending}>
        {isPending ? "Entrando..." : "Entrar"}
      </Button>
      {state.message ? <p className="text-sm text-center text-rose-600 bg-rose-50 p-3 rounded-xl border border-rose-100">{state.message}</p> : null}

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-slate-200" /></div>
        <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-slate-400">O entra con</span></div>
      </div>

      <Button 
        variant="outline" 
        className="w-full gap-2 border-slate-200 hover:bg-slate-50 transition-all font-semibold" 
        type="button"
        onClick={() => signIn("google", { callbackUrl: "/progreso" })}
      >
        <Chrome className="size-4" />
        Google
      </Button>
    </form>
  );
}

