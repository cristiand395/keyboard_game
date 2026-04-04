import { redirect } from "next/navigation";
import { getCachedSession } from "@/lib/auth";
import { Badge } from "@/components/ui/badge";
import { SettingsForm } from "@/components/settings-form";

export default async function ConfiguracionPage() {
  const session = await getCachedSession();

  if (!session?.user?.id) {
    redirect("/acceder");
  }

  return (
    <main className="shell space-y-8 pb-16">
      <section className="space-y-3">
        <Badge>configuración de cuenta</Badge>
        <h1 className="text-4xl font-bold tracking-tight text-slate-950">Tu perfil en KeySprint</h1>
        <p className="max-w-2xl text-lg text-muted-foreground">
          Personaliza tu experiencia de juego y cómo te ven los demás competidores.
        </p>
      </section>

      <SettingsForm 
        user={{ 
          name: session.user.name, 
          email: session.user.email 
        }} 
      />
    </main>
  );
}
