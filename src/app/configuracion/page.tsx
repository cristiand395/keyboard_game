import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";
import { getCachedSession } from "@/lib/auth";
import { SettingsForm } from "@/components/settings-form";
import { Settings as SettingsIcon, Sliders } from "lucide-react";

export default async function ConfiguracionPage() {
  const session = await getCachedSession();

  if (!session?.user?.id) {
    redirect("/acceder");
  }

  const [dbUser] = await db.select({ avatar: users.avatar }).from(users).where(eq(users.id, session.user.id));

  return (
    <main className="grow flex flex-col items-center px-8 py-16 max-w-7xl mx-auto w-full">
      {/* Header Section */}
      <section className="w-full mb-16 animate-rise">
        <div className="flex items-center gap-3 text-secondary mb-4">
          <SettingsIcon className="size-5" />
          <span className="font-display text-[10px] font-bold uppercase tracking-[0.4em]">Configuración</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-display font-extrabold tracking-tight text-foreground uppercase mb-4">
          Control de <span className="text-secondary italic">Cuenta</span>
        </h1>
        <p className="text-muted-foreground max-w-2xl font-sans text-lg leading-relaxed">
          Anulaciones operativas para el usuario <span className="text-foreground font-bold">@{session.user.name || "Piloto"}</span>. Despliega cambios a las instancias globales del perfil.
        </p>
      </section>

      <div className="w-full animate-rise" style={{ animationDelay: "150ms" }}>
        <SettingsForm
          user={{
            name: session.user.name,
            email: session.user.email,
            avatar: dbUser?.avatar,
          }}
        />
      </div>

      {/* System Integrity Map */}
      <div className="w-full mt-24 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 opacity-30">
         <div className="flex items-center gap-4 font-mono text-[9px] uppercase tracking-widest">
            <span className="flex items-center gap-2"><div className="size-1 bg-secondary rounded-full" /> Conexión_Segura</span>
            <span className="flex items-center gap-2"><div className="size-1 bg-primary rounded-full" /> Sesión_Válida</span>
         </div>
         <div className="font-mono text-[9px] uppercase tracking-widest">
            Protocolo_v4 // NEON_TERMINAL_ES
         </div>
      </div>
    </main>
  );
}
