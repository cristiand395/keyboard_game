import Link from "next/link";
import { redirect } from "next/navigation";
import { Bolt, History, Shield, TrendingUp, Trophy } from "lucide-react";
import { getCachedSession } from "@/lib/auth";
import { getDashboardSummary, getProgressForUser } from "@/lib/data";
import { formatPercentage, cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { ReactNode } from "react";

export default async function ProgressPage() {
  const session = await getCachedSession();

  if (!session?.user?.id) {
    redirect("/acceder");
  }

  const [summary, progress] = await Promise.all([
    getDashboardSummary(session.user.id),
    getProgressForUser(session.user.id),
  ]);

  return (
    <main className="grow flex flex-col items-center px-8 py-16 max-w-7xl mx-auto w-full">
      {/* Header Section */}
      <section className="w-full mb-16 animate-rise">
        <div className="flex items-center gap-3 text-primary mb-4">
          <Shield className="size-5" />
          <span className="font-display text-[10px] font-bold uppercase tracking-[0.4em]">Análisis</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-display font-extrabold tracking-tight text-foreground uppercase mb-4">
          Análisis de <span className="text-primary italic">Entrenamiento</span>
        </h1>
        <p className="text-muted-foreground max-w-2xl font-sans text-lg leading-relaxed">
          Registros de rendimiento operativo para <span className="text-foreground font-bold">@{session.user.name || "Piloto"}</span>. Sistemas calibrados para feedback de alta precisión.
        </p>
      </section>

      {/* Top Level Metrics */}
      <section className="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-16 animate-rise" style={{ animationDelay: "100ms" }}>
        <StatCard 
          label="Niveles Completados" 
          value={summary.completedLevels} 
          color="primary" 
          icon={<Bolt className="size-4" />}
          glowColor="#a1faff"
        />
        <StatCard 
          label="Estrellas Totales" 
          value={summary.totalStars} 
          unit="★"
          color="secondary" 
          icon={<Trophy className="size-4" />}
          glowColor="#c47fff"
        />
        <StatCard 
          label="Mejor PPM" 
          value={summary.bestWpm} 
          color="tertiary" 
          icon={<TrendingUp className="size-4" />}
          glowColor="#ff59e3"
        />
        <StatCard 
          label="Precisión Media" 
          value={formatPercentage(summary.bestAccuracy).replace("%", "")} 
          unit="%"
          color="primary" 
          icon={<History className="size-4" />}
          glowColor="#a1faff"
        />
      </section>

      {/* Level History Table */}
      <section className="w-full animate-rise" style={{ animationDelay: "200ms" }}>
        <div className="flex items-center justify-between mb-8">
           <h2 className="font-display text-xs font-bold uppercase tracking-[0.3em] text-muted-foreground flex items-center gap-3">
              <History className="size-4" />
              Archivo_Registros_Misión
           </h2>
        </div>

        <div className="grid gap-4">
          {progress.length === 0 ? (
            <div className="bg-surface-low rounded-lg border border-white/5 p-12 flex flex-col items-center justify-center text-center">
              <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-6 animate-pulse">
                <Bolt className="size-8" />
              </div>
              <h3 className="text-xl font-display font-bold text-foreground mb-2">Sin Datos Activos</h3>
              <p className="text-muted-foreground max-w-xs mb-8">El sistema está esperando el primer despliegue. Completa un módulo para iniciar el rastreo.</p>
              <Button asChild className="neon-gradient px-8 font-display font-bold uppercase tracking-widest text-[10px] rounded-md h-12">
                <Link href="/retos">Desplegar Ahora</Link>
              </Button>
            </div>
          ) : (
            progress.map((entry) => (
              <div
                key={entry.levelSlug}
                className="group bg-surface-low border border-white/5 rounded-lg p-6 flex flex-col md:flex-row md:items-center justify-between hover:border-primary/30 hover:bg-surface-high transition-all"
              >
                <div className="flex items-center gap-6 mb-4 md:mb-0 w-70 shrink-0">
                  <div className="size-12 shrink-0 rounded bg-primary/10 border border-primary/20 flex items-center justify-center font-display font-black text-xs text-primary group-hover:bg-primary/20 transition-colors">
                    {String(entry.order).padStart(2, '0')}
                  </div>
                  <h4 className="text-xl font-display font-bold text-foreground group-hover:text-primary transition-colors uppercase leading-none">
                    {entry.title}
                  </h4>
                </div>

                <div className="grid grid-cols-3 gap-8 md:gap-16 mr-8">
                  <MetricItem label="Velocidad Máx" value={`${entry.bestWpm} PPM`} color="text-primary" />
                  <MetricItem label="Precisión" value={formatPercentage(entry.bestAccuracy)} color="text-secondary" />
                  <MetricItem label="Rango" value={`${entry.bestStars} ⭐`} color="text-tertiary" />
                </div>

                <Button asChild variant="outline" className="border-primary/20 text-primary bg-transparent hover:bg-primary/10 hover:border-primary/50 rounded-md h-10 px-6 font-display font-bold uppercase tracking-widest text-[10px] transition-all">
                  <Link href={`/retos/${entry.levelSlug}`}>Reiniciar</Link>
                </Button>
              </div>
            ))
          )}
        </div>
      </section>
    </main>
  );
}

function StatCard({ label, value, unit, color, icon, glowColor }: { label: string; value: string | number; unit?: string; color: string; icon?: ReactNode; glowColor: string }) {
  const colors: Record<string, string> = {
    primary: "text-primary",
    secondary: "text-secondary",
    tertiary: "text-tertiary",
  };

  const bgColors: Record<string, string> = {
    primary: "bg-primary",
    secondary: "bg-secondary",
    tertiary: "bg-tertiary",
  };

  return (
    <div className="bg-surface-low p-6 rounded-md flex flex-col items-start relative overflow-hidden group border border-white/5 shadow-xl transition-all hover:bg-surface-high">
      <div className={cn("absolute top-0 left-0 w-1 h-full transition-all group-hover:w-1.5", bgColors[color])} style={{ boxShadow: `0 0 15px ${glowColor}` }}></div>
      <div className="flex justify-between items-center w-full mb-3 text-muted-foreground opacity-50">
         <span className="font-mono text-[9px] font-extrabold uppercase tracking-[0.2em]">{label}</span>
         <div className={cn(colors[color])}>{icon}</div>
      </div>
      <div className="flex items-baseline gap-2">
        <span className={cn("font-display text-5xl font-black tracking-tighter", colors[color])}>{value}</span>
        {unit && <span className="text-muted-foreground font-mono text-xl font-bold">{unit}</span>}
      </div>
    </div>
  );
}

function MetricItem({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div className="flex flex-col">
      <span className="text-[9px] font-mono text-muted-foreground uppercase tracking-widest mb-1 opacity-50">{label}</span>
      <span className={cn("text-lg font-display font-bold leading-none uppercase", color || "text-foreground")}>{value}</span>
    </div>
  );
}

