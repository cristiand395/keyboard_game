"use client";

import { useActionState, useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { updateUserNameAction } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Check, Settings } from "lucide-react";

interface SettingsFormProps {
  user: {
    name?: string | null;
    email?: string | null;
  };
}

export function SettingsForm({ user }: SettingsFormProps) {
  const router = useRouter();
  const { update } = useSession();
  const [state, action, isPending] = useActionState(updateUserNameAction, { ok: false, message: "" });
  const [newName, setNewName] = useState(user.name ?? "");
  const hasUpdatedSession = useRef(false);

  // Reset when a new attempt starts
  if (isPending && hasUpdatedSession.current) {
    hasUpdatedSession.current = false;
  }

  // Update session and local name once after success
  useEffect(() => {
    if (state.ok && !isPending && !hasUpdatedSession.current) {
       hasUpdatedSession.current = true;
       update({ name: newName }).then(() => {
          router.refresh();
       });
    }
  }, [state.ok, isPending, update, newName, router]);

  useEffect(() => {
    if (user.name) setNewName(user.name);
  }, [user.name]);

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_350px]">
      <div className="space-y-6">
        <Card className="overflow-hidden rounded-[32px] border border-slate-100 shadow-xl shadow-slate-200/50">
          <CardHeader className="border-b border-slate-50 bg-slate-50/50 p-8">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg">
                <User className="size-6" />
              </div>
              <div>
                <CardTitle className="text-xl">Perfil público</CardTitle>
                <CardDescription>Cómo te ven los demás en el ranking y retos.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-8">
            <form action={action} className="max-w-md space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold tracking-widest text-slate-400 uppercase">Nombre visible</label>
                <Input 
                  name="name" 
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Escribe tu nuevo nombre..."
                  className="h-12 rounded-2xl bg-slate-50 focus-visible:ring-indigo-500"
                  required
                />
                <p className="text-[11px] text-slate-400">Este nombre aparecerá en tus resultados compartidos.</p>
              </div>

              <div className="flex items-center gap-4 pt-2">
                <Button 
                  type="submit" 
                  disabled={isPending || (state.ok && newName === user.name)}
                  className="h-12 gap-2 rounded-2xl px-8 font-bold transition-all shadow-lg active:scale-95"
                >
                  {isPending ? "Guardando..." : state.ok ? "Nombre guardado" : "Guardar cambios"}
                  {state.ok && <Check className="size-4" />}
                </Button>
              </div>

              {state.message && (
                <div className={`rounded-xl p-3 text-sm font-medium border text-center transition-all ${
                  state.ok 
                    ? "bg-emerald-50 border-emerald-100 text-emerald-600" 
                    : "bg-rose-50 border-rose-100 text-rose-600"
                }`}>
                  {state.message}
                </div>
              )}
            </form>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <div className="rounded-[32px] bg-indigo-600 p-8 text-white shadow-xl shadow-indigo-200/50">
          <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-xl bg-white/20">
            <Settings className="size-5" />
          </div>
          <h3 className="text-lg font-bold">Ajustes de cuenta</h3>
          <p className="mt-2 text-sm leading-relaxed opacity-80">
            Estamos trabajando en añadir más opciones como cambio de avatar, temas visuales y ajustes de sonido.
          </p>
        </div>
        
        <Card className="rounded-[32px] border border-slate-100 bg-slate-50/50 p-6">
          <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400">Correo vinculado</h4>
          <p className="mt-2 text-sm font-medium text-slate-600">{user.email}</p>
        </Card>
      </div>
    </div>
  );
}
