import { redirect } from "next/navigation";
import { LoginForm, RegisterForm } from "@/components/auth-forms";
import { getCachedSession } from "@/lib/auth";
import { ShieldAlert, UserPlus, Fingerprint } from "lucide-react";

export default async function SignInPage() {
  const session = await getCachedSession();

  if (session?.user) {
    redirect("/progreso");
  }

  return (
    <main className="grow flex flex-col items-center justify-center px-8 py-20 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="w-full max-w-6xl grid gap-12 lg:grid-cols-2 relative z-10 animate-rise">
        {/* Registration Wing */}
        <div className="bg-surface-low border border-white/5 rounded-lg p-10 flex flex-col items-start hover:border-primary/20 transition-all duration-500">
          <div className="flex items-center gap-3 text-primary mb-8">
            <UserPlus className="size-5" />
            <span className="font-display text-[10px] font-bold uppercase tracking-[0.4em]">Protocolo:Inicializar_Usuario</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-display font-black text-foreground uppercase mb-4 leading-tight">
            Nueva <span className="text-primary italic">Identidad</span>
          </h2>
          <p className="text-muted-foreground font-sans text-sm leading-relaxed mb-10 max-w-sm">
            Establece un enlace permanente para guardar datos de sesión, estrellas de misión y analítica cinética.
          </p>

          <div className="w-full">
            <RegisterForm />
          </div>
        </div>

        {/* Login Wing */}
        <div className="bg-surface-high border border-white/5 rounded-lg p-10 flex flex-col items-start hover:border-secondary/20 transition-all duration-500">
          <div className="flex items-center gap-3 text-secondary mb-8">
            <Fingerprint className="size-5" />
            <span className="font-display text-[10px] font-bold uppercase tracking-[0.4em]">Protocolo:Reanudar_Sesión</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-display font-black text-foreground uppercase mb-4 leading-tight">
            Acceso de <span className="text-secondary italic">Enlace</span>
          </h2>
          <p className="text-muted-foreground font-sans text-sm leading-relaxed mb-10 max-w-sm">
            Autentica credenciales existentes para sincronizar registros de rendimiento en instancias distribuidas.
          </p>

          <div className="w-full">
            <LoginForm />
          </div>
        </div>
      </div>

      {/* Security Footer */}
      <div className="mt-16 flex items-center gap-3 opacity-30 font-mono text-[9px] uppercase tracking-widest">
        <ShieldAlert className="size-3" />
        Cifrado TLS 1.3 // Autenticación Extremo a Extremo Activa
      </div>
    </main>
  );
}

