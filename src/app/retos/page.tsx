import Link from "next/link";
import { LockKeyhole, Play, Star } from "lucide-react";
import { getTracksWithLevels } from "@/lib/data";
import { getCachedSession } from "@/lib/auth";
import { getProgressForUser } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default async function PlayPage() {
  const [tracks, session] = await Promise.all([getTracksWithLevels(), getCachedSession()]);
  const progress = session?.user?.id ? await getProgressForUser(session.user.id) : [];
  const unlockedSlugs = new Set(progress.map((entry) => entry.levelSlug));

  return (
    <main className="grow flex flex-col items-center px-8 py-16 max-w-7xl mx-auto w-full">
      {/* Header Section */}
      <section className="w-full mb-16 animate-rise">
        <div className="flex items-center gap-3 text-primary mb-4">
          <Play className="size-5" />
          <span className="font-display text-[10px] font-bold tracking-[0.4em] uppercase">Práctica de velocidad</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-display font-extrabold tracking-tight text-foreground mb-6 uppercase">
          Nodos de <span className="text-primary italic">Desafío</span>
        </h1>
        <p className="text-muted-foreground max-w-2xl font-sans text-lg leading-relaxed">
          Los módulos iniciales están abiertos para calibración. Completa los requisitos de precisión para desbloquear instancias de mayor dificultad.
        </p>
      </section>

      {/* Tracks Container */}
      <div className="w-full space-y-24">
        {tracks.map((track) => (
          <div key={track.id} className="space-y-10 animate-rise" style={{ animationDelay: "100ms" }}>
            <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/5 pb-6">
               <div>
                  <h2 className="text-xs font-display text-primary font-bold tracking-[0.3em] mb-2 uppercase">{track.levels.length} Niveles</h2>
                  <p className="text-4xl font-display font-bold text-foreground tracking-tight uppercase">{track.title}</p>
               </div>
               <p className="text-sm text-muted-foreground font-sans max-w-md md:text-right mt-4 md:mt-0">
                  {track.description || "Entrenamiento especializado en lógica de entrada y eficiencia cinética."}
               </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {track.levels.map((level, index) => {
                const isUnlocked =
                  index === 0 || unlockedSlugs.has(level.slug) || unlockedSlugs.has(track.levels[index - 1]?.slug ?? "");

                const lp = progress.find((p) => p.levelSlug === level.slug);

                return (
                  <div 
                    key={level.id} 
                    className={cn(
                      "group bg-surface-low border border-white/5 rounded-lg p-8 flex flex-col hover:bg-surface-high transition-all relative overflow-hidden shadow-sm",
                      !isUnlocked && "opacity-50 grayscale pointer-events-none"
                    )}
                  >
                    {!isUnlocked && (
                      <div className="absolute inset-0 flex items-center justify-center bg-background/20 backdrop-blur-[2px] z-20">
                         <LockKeyhole className="size-8 text-white/20" />
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between mb-8">
                       <Badge className="font-mono text-primary bg-primary/10 border border-primary/20 tracking-widest leading-none uppercase">
                         Instancia {String(level.order).padStart(2, '0')}
                       </Badge>
                       {isUnlocked && <Play className="size-4 text-primary animate-pulse" />}
                    </div>

                    <h3 className="text-xl font-display font-bold text-foreground uppercase group-hover:text-primary transition-colors leading-tight mb-3 grow">
                      {level.title}
                    </h3>

                    <div className="mt-8 pt-6 border-t border-white/5 flex flex-col gap-4">
                      {lp ? (
                        <div className="flex justify-between items-end">
                          <div className="flex gap-1">
                            {[1, 2, 3].map((s) => (
                              <Star
                                key={s}
                                className={cn(
                                  "size-3 shadow-glow",
                                  s <= (lp.bestStars ?? 0) 
                                    ? "fill-primary text-primary" 
                                    : "fill-white/5 text-white/10"
                                )}
                              />
                            ))}
                          </div>
                          <div className="text-right">
                             <p className="text-[8px] font-mono text-muted-foreground tracking-widest mb-1 uppercase">Mejor marca</p>
                             <p className="text-sm font-display font-bold text-foreground uppercase">
                               {lp.bestWpm} <span className="text-[10px] text-primary">PPM</span>
                             </p>
                          </div>
                        </div>
                      ) : (
                        <div className="flex justify-between items-center opacity-30">
                          <div className="flex gap-1">
                             {[1, 2, 3].map(s => <Star key={s} className="size-3 fill-white/10 text-white/20" />)}
                          </div>
                          <p className="text-[9px] font-mono font-bold text-muted-foreground tracking-widest uppercase">Sin registros</p>
                        </div>
                      )}

                      <Button 
                        asChild 
                        className={cn(
                          "w-full h-11 rounded-md font-display font-bold uppercase tracking-widest text-[10px] transition-all active:scale-95",
                          lp && lp.bestStars > 0 
                            ? "bg-white/5 border border-white/10 text-foreground hover:bg-white/10 hover:border-primary/50" 
                            : "neon-gradient text-primary-foreground border-none"
                        )}
                      >
                        <Link href={`/retos/${level.slug}`}>
                          {lp && lp.bestStars > 0 ? "Repetir" : isUnlocked ? "Iniciar" : "Bloqueado"}
                        </Link>
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
