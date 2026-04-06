import Link from "next/link";
import { ArrowRight, Bolt, History, Terminal as TerminalIcon, TrendingUp, Trophy } from "lucide-react";
import { getTracksWithLevels } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export default async function HomePage() {
  const tracks = await getTracksWithLevels();

  return (
    <main className="grow">
      {/* Hero Section */}
      <section className="relative w-full h-[600px] flex items-center justify-center overflow-hidden px-8 border-b border-white/5">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-linear-to-b from-transparent to-background z-10"></div>
          <div 
            className="w-full h-full bg-[url('https://images.unsplash.com/photo-1587829741301-dc798b83aca2?auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center opacity-10"
            aria-hidden="true"
          />
        </div>
        
        <div className="relative z-20 text-center space-y-8 animate-rise">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary font-mono text-[10px] tracking-widest leading-none">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            Sistema en línea
          </div>
          <h1 className="text-6xl md:text-8xl font-display font-extrabold tracking-tighter text-foreground leading-[0.9]">
            Domina tu <br />
            <span className="text-primary drop-shadow-[0_0_15px_rgba(161,250,255,0.4)]">velocidad</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground font-sans max-w-2xl mx-auto">
            La herramienta preferida por los entusiastas de la mecanografía. Practica, compite y mejora tu rendimiento día a día.
          </p>
          <div className="pt-4 flex justify-center gap-4">
            <Button asChild size="lg" className="neon-gradient text-primary-foreground font-display font-bold px-10 h-14 rounded-md shadow-[0_0_30px_rgba(161,250,255,0.2)] hover:shadow-[0_0_40px_rgba(161,250,255,0.4)] active:scale-95 transition-all group border-none text-[10px] tracking-widest uppercase">
              <Link href="/retos" className="flex items-center gap-3">
                Comenzar Desafío
                <Bolt className="size-5 fill-current group-hover:animate-pulse" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Dashboard Layout: Bento Grid */}
      <section className="max-w-7xl mx-auto px-8 py-24">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Profile Overview Widget */}
          <div className="md:col-span-8 bg-surface-low rounded-lg p-10 flex flex-col justify-between border border-white/5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-primary/10 transition-colors" />
            
            <div className="flex justify-between items-start mb-12">
              <div>
                <h2 className="text-xs font-display text-secondary tracking-[0.3em] font-bold mb-2">Estado actual</h2>
                <p className="text-4xl font-display font-bold text-foreground tracking-tight">Rendimiento personal</p>
              </div>
              <div className="bg-surface-highest px-4 py-2 rounded-md border border-primary/20">
                <span className="text-[10px] font-mono font-bold text-primary tracking-widest uppercase">Rango: Maestro Nivel III</span>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-12 mb-12">
              <Stat value="142" unit="PPM" label="Velocidad máxima" color="primary" />
              <Stat value="99.4" unit="%" label="Precisión media" color="secondary" />
              <Stat value="24" unit="DÍAS" label="Racha diaria" color="tertiary" />
            </div>

            {/* Simulated Graph */}
            <div className="h-32 w-full mt-auto relative flex items-end justify-between gap-1">
              {[0.5, 0.7, 0.4, 0.8, 0.6, 0.9, 1].map((h, i) => (
                <div 
                  key={i}
                  className={cn(
                    "w-full rounded-t-sm transition-all duration-500",
                    i === 6 ? "bg-primary shadow-[0_0_15px_#a1faff]" : "bg-primary/10 hover:bg-primary/20"
                  )}
                  style={{ height: `${h * 100}%` }}
                />
              ))}
              <div className="absolute -bottom-8 w-full flex justify-between text-[10px] font-mono text-muted-foreground font-bold tracking-widest uppercase">
                <span>Lun</span><span>Mar</span><span>Mié</span><span>Jue</span><span>Vie</span><span>Sáb</span><span>Dom</span>
              </div>
            </div>
          </div>

          {/* Recent Activity Mini Widget */}
          <div className="md:col-span-4 bg-surface-highest rounded-lg p-10 border border-white/5 space-y-10">
            <h3 className="text-xs font-display text-foreground font-bold tracking-[0.3em] flex items-center gap-3 uppercase">
              <History className="size-4 text-primary" />
              Actividad reciente
            </h3>
            <div className="space-y-8">
              <ActivityItem icon={<TerminalIcon />} title="Lógica de Programación" detail="hace 12 mins • 138 PPM" color="tertiary" />
              <ActivityItem icon={<Bolt />} title="Hooks de React" detail="hace 2 horas • 125 PPM" color="secondary" opacity={60} />
              <ActivityItem icon={<Trophy />} title="Leyendas Épicas" detail="Ayer • 145 PPM" color="primary" opacity={40} />
            </div>
            <Button variant="outline" className="w-full py-6 rounded-md text-[10px] font-display font-bold border-border hover:bg-surface-high transition-all tracking-[0.2em] h-auto uppercase">
              Ver historial completo
            </Button>
          </div>

          {/* Challenges Section Header */}
          <div className="md:col-span-12 mt-20 mb-4">
            <div className="flex justify-between items-end">
              <div>
                <h2 className="text-xs font-display text-primary font-bold tracking-[0.3em] mb-2 uppercase">Próximos pasos</h2>
                <p className="text-5xl font-display font-bold text-foreground tracking-tight">Desafíos disponibles</p>
              </div>
              <div className="flex gap-3">
                <ArrowButton direction="left" />
                <ArrowButton direction="right" />
              </div>
            </div>
          </div>

          {/* Dynamic Challenge Cards */}
          {tracks.map((track) => (
            <div key={track.id} className="md:col-span-4 group cursor-pointer">
              <Link href={`/retos/${track.id}`}>
                <div className="bg-surface-low p-8 rounded-lg border border-white/5 transition-all duration-500 group-hover:border-primary/40 group-hover:-translate-y-1 relative overflow-hidden h-full flex flex-col shadow-sm">
                  {/* Decorative corner glow */}
                  <div className="absolute top-0 right-0 w-16 h-16 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors" />
                  
                  <div className="mb-8 flex justify-between items-start">
                    <div className="w-14 h-14 rounded-md bg-primary/5 flex items-center justify-center text-primary border border-primary/10 group-hover:border-primary/30 transition-all shadow-glow">
                      <TerminalIcon className="size-7" />
                    </div>
                    <span className="text-[9px] font-mono bg-primary/10 text-primary border border-primary/20 px-3 py-1 rounded font-bold tracking-widest leading-none uppercase">
                      {track.levels.length} Niveles
                    </span>
                  </div>
                  
                  <h4 className="text-2xl font-display font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                    {track.title}
                  </h4>
                  <p className="text-sm text-muted-foreground mb-8 font-sans leading-relaxed grow">
                    {track.description || "Mejora tu precisión y velocidad con ejercicios adaptados a tu nivel."}
                  </p>
                  
                  <div className="flex items-center justify-between mt-auto pt-6 border-t border-white/5">
                    <span className="text-[10px] font-mono font-bold text-muted-foreground tracking-widest uppercase">Modo: Estándar</span>
                    <span className="text-[10px] font-display font-bold text-primary group-hover:underline tracking-widest uppercase">Comenzar</span>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Terminal Instance Preview */}
      <section className="max-w-7xl mx-auto px-8 pb-32">
        <div className="bg-surface-lowest border border-white/5 rounded-lg p-16 relative overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)]">
          <div className="absolute top-0 right-0 p-6 flex gap-3">
            <div className="size-2.5 rounded-full bg-primary/30" />
            <div className="size-2.5 rounded-full bg-secondary/30" />
            <div className="size-2.5 rounded-full bg-tertiary/30" />
          </div>
          
          <div className="space-y-10 relative z-10">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="h-[2px] w-8 bg-primary animate-pulse" />
                <span className="text-primary font-mono text-[10px] font-bold tracking-[0.3em] uppercase">Terminal activa</span>
              </div>
              <div className="text-4xl md:text-6xl font-mono text-muted-foreground/30 leading-relaxed tracking-tight max-w-5xl">
                <span className="text-foreground">El rápido zorro marrón salta sobre</span> el perro perezoso. Una prueba funcional para medir tu velocidad. Estado: <span className="text-primary/40">conectado</span>.
                <span className="inline-block w-4 h-14 bg-primary align-middle ml-2 animate-pulse shadow-[0_0_15px_#a1faff]" />
              </div>
            </div>
            
            <div className="flex flex-wrap gap-4 pt-10">
              <KeyCap chip="ESC" action="Reiniciar" />
              <KeyCap chip="TAB" action="Repetir" />
              <KeyCap chip="CMD + K" action="Buscar" />
            </div>
          </div>
          
          {/* Backlight effect */}
          <div className="absolute inset-0 bg-linear-to-tr from-primary/5 via-transparent to-transparent pointer-events-none" />
        </div>
      </section>
    </main>
  );
}

function ArrowButton({ direction }: { direction: "left" | "right" }) {
  return (
    <Button variant="outline" size="sm" className="rounded-md border-border hover:border-primary hover:text-primary transition-all">
      <ArrowRight className={cn("size-4", direction === "left" && "rotate-180")} />
    </Button>
  );
}

function Stat({ value, unit, label, color }: { value: string; unit: string; label: string; color: string }) {
  const colors: Record<string, string> = {
    primary: "text-primary shadow-primary",
    secondary: "text-secondary shadow-secondary",
    tertiary: "text-tertiary shadow-tertiary",
  };
  
  return (
    <div className="space-y-2">
      <p className="text-muted-foreground text-[10px] font-display font-bold tracking-[0.3em] uppercase">{label}</p>
      <div className="flex items-baseline gap-2">
        <span className={cn("text-6xl font-display font-extrabold tracking-tighter drop-shadow-sm", colors[color])}>{value}</span>
        <span className="text-muted-foreground font-mono font-bold text-sm tracking-widest uppercase">{unit}</span>
      </div>
    </div>
  );
}

function ActivityItem({ icon, title, detail, color, opacity = 100 }: { icon: ReactNode; title: string; detail: string; color: string; opacity?: number }) {
  const bgColors: Record<string, string> = {
    primary: "bg-primary/10 text-primary border-primary/20",
    secondary: "bg-secondary/10 text-secondary border-secondary/20",
    tertiary: "bg-tertiary/10 text-tertiary border-tertiary/20",
  };

  return (
    <div className={cn("flex items-center gap-5 transition-opacity", opacity !== 100 && `opacity-${opacity}`)}>
      <div className={cn("w-12 h-12 rounded bg-surface-low border flex items-center justify-center transition-all group-hover:scale-110 shadow-sm", bgColors[color])}>
        {icon}
      </div>
      <div>
        <p className="text-lg font-bold text-foreground font-display tracking-tight leading-none mb-1">{title}</p>
        <p className="text-[10px] font-mono text-muted-foreground font-bold tracking-tight uppercase">{detail}</p>
      </div>
    </div>
  );
}

function KeyCap({ chip, action }: { chip: string; action: string }) {
  return (
    <div className="px-5 py-2.5 bg-surface-high/40 rounded-md border border-white/5 flex items-center gap-3 hover:border-primary/30 transition-colors shadow-sm">
      <span className="font-mono text-[10px] font-bold text-primary tracking-widest leading-none">{chip}</span>
      <span className="text-[10px] font-display font-bold text-muted-foreground tracking-[0.2em] leading-none uppercase">{action}</span>
    </div>
  );
}
