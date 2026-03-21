"use client";

import { useActionState } from "react";
import { loginUserAction, registerUserAction } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const initialState = { ok: false, message: "" };

export function RegisterForm() {
  const [state, action, isPending] = useActionState(registerUserAction, initialState);

  return (
    <form action={action} className="space-y-4">
      <Input name="name" placeholder="Tu nombre" />
      <Input name="email" type="email" placeholder="tu@email.com" required />
      <Input name="password" type="password" placeholder="Minimo 8 caracteres" required minLength={8} />
      <Button className="w-full" type="submit" disabled={isPending}>
        Crear cuenta
      </Button>
      {state.message ? <p className="text-sm text-muted-foreground">{state.message}</p> : null}
    </form>
  );
}

export function LoginForm() {
  const [state, action, isPending] = useActionState(loginUserAction, initialState);

  return (
    <form action={action} className="space-y-4">
      <Input name="email" type="email" placeholder="tu@email.com" required />
      <Input name="password" type="password" placeholder="Tu clave" required />
      <Button className="w-full" type="submit" disabled={isPending}>
        Entrar
      </Button>
      {state.message ? <p className="text-sm text-muted-foreground">{state.message}</p> : null}
    </form>
  );
}

