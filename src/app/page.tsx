import Link from "next/link";
import { ArrowRight, Bolt, Terminal as TerminalIcon } from "lucide-react";
import { getTracksWithLevels } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { TypingDemo } from "@/components/typing-demo";

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
          <h1 className="text-6xl md:text-8xl font-display font-extrabold tracking-tighter text-foreground leading-[0.9]">
            Domina tu <br />
            <span className="text-primary drop-shadow-[0_0_15px_rgba(161,250,255,0.4)]">velocidad</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground font-sans max-w-2xl mx-auto">
            Entrena tu velocidad al teclado. Practica solo o reta a tus amigos a superarte.
          </p>
          <div className="pt-4 flex justify-center gap-4">
            <Button asChild size="lg" className="neon-gradient text-primary-foreground font-display font-bold px-10 h-14 rounded-md shadow-[0_0_30px_rgba(161,250,255,0.2)] hover:shadow-[0_0_40px_rgba(161,250,255,0.4)] active:scale-95 transition-all group border-none text-[10px] tracking-widest uppercase">
              <Link href="/retos" className="flex items-center gap-3">
                Comenzar Retos
                <Bolt className="size-5 fill-current group-hover:animate-pulse" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Dashboard Layout: Bento Grid */}
      <section className="max-w-7xl mx-auto px-8 py-24">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Typing Demo */}
          <TypingDemo />

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
              <Link href={`/retos/${track.levels[0].slug}`}>
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
