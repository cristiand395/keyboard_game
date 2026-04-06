"use client";

import { useActionState, useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { updateUserNameAction } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User, Check, Settings, ShieldCheck, Mail } from "lucide-react";
import { cn } from "@/lib/utils";

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
    <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr]">
      {/* Primary Configuration Panel */}
      <div className="space-y-8">
        <div className="bg-surface-low border border-white/5 rounded-lg p-10 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1 h-full bg-secondary shadow-[0_0_20px_#c47fff]" />

          <div className="flex items-center gap-4 mb-12">
            <div className="size-12 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary border border-secondary/20">
              <User className="size-6" />
            </div>
            <div>
              <h3 className="text-2xl font-display font-black text-foreground uppercase tracking-tight">Identidad Pública</h3>
              <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest mt-1 opacity-50">Identificador Global</p>
            </div>
          </div>

          <form action={action} className="max-w-xl space-y-8">
            <div className="space-y-3">
              <label className="font-mono text-[9px] uppercase tracking-[0.3em] text-muted-foreground ml-1">Alias_Visible</label>
              <Input
                name="name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Asignar alias..."
                className="bg-surface-highest/50 border-white/5 focus:border-secondary/50 focus:ring-0 rounded-none h-14 font-sans text-lg transition-all"
                required
              />
              <p className="text-[10px] font-sans text-muted-foreground/60 px-1 italic">
                Este identificador se transmite a los nodos de ranking global e instancias de desafío.
              </p>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <Button
                type="submit"
                disabled={isPending || (state.ok && newName === user.name)}
                className="h-14 px-12 bg-secondary text-secondary-foreground hover:bg-secondary/90 font-display font-bold uppercase tracking-[0.2em] text-[10px] rounded-none shadow-[0_0_20px_rgba(196,127,255,0.1)] transition-all active:scale-[0.98]"
              >
                {isPending ? "SINCRONIZANDO..." : state.ok ? "IDENTIDAD BLOQUEADA" : "Actualizar"}
                {state.ok && <Check className="size-4 ml-2" />}
              </Button>

              {state.message && (
                <div className={cn(
                  "font-mono text-[9px] uppercase tracking-widest animate-in fade-in slide-in-from-left-2",
                  state.ok ? "text-primary" : "text-destructive"
                )}>
                  // {state.message}
                </div>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* Auxiliary Metadata & Stats */}
      <div className="space-y-8">
        <div className="bg-surface-highest p-10 rounded-lg border border-white/5">
          <div className="size-10 rounded-lg bg-white/5 flex items-center justify-center text-muted-foreground mb-6">
            <Settings className="size-5" />
          </div>
          <h3 className="font-display font-bold text-xs uppercase tracking-[0.3em] text-foreground mb-3">Opciones de Hub del Sistema</h3>
          <p className="text-sm font-sans text-muted-foreground leading-relaxed">
            Módulos periféricos para <span className="text-secondary font-bold">Avatares</span>, <span className="text-primary font-bold">Tematización</span> y <span className="text-tertiary font-bold">Feedback Háptico</span> están actualmente en calibración.
          </p>
        </div>

        <div className="bg-surface-low border border-white/5 rounded-lg p-8 group hover:border-primary/20 transition-all">
          <div className="flex items-center gap-4 mb-4">
            <div className="size-8 rounded bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
              <Mail className="size-4" />
            </div>
            <span className="font-display font-bold text-[10px] uppercase tracking-widest text-muted-foreground">Correo electrónico</span>
          </div>
          <p className="font-mono text-xs font-bold text-foreground truncate pl-12">{user.email}</p>
        </div>
      </div>
    </div>
  );
}
