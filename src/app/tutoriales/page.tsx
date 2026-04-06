import Link from "next/link";
import { getAllTutorials } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { BookOpen, ChevronRight, Terminal } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function TutorialsPage() {
  const tutorials = getAllTutorials();

  return (
    <main className="grow flex flex-col items-center px-8 py-16 max-w-7xl mx-auto w-full">
      {/* Header Section */}
      <section className="w-full mb-16 animate-rise text-center md:text-left">
        <div className="flex items-center justify-center md:justify-start gap-3 text-secondary mb-4">
          <BookOpen className="size-5" />
          <span className="font-display text-[10px] font-bold uppercase tracking-[0.4em]">Índice_Módulos_Educativos</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-display font-extrabold tracking-tight text-foreground uppercase mb-6">
          Mejora de <span className="text-secondary italic">Habilidades</span>
        </h1>
        <p className="text-muted-foreground max-w-2xl font-sans text-lg leading-relaxed mx-auto md:mx-0">
          Masterclasses curadas para precisión de alta velocidad. Optimizado para teclados <span className="text-foreground font-bold">QWERTY_ES</span> y eficiencia ergonómica.
        </p>
      </section>

      {/* Tutorials Grid */}
      <div className="w-full grid gap-6 lg:grid-cols-3 animate-rise" style={{ animationDelay: "150ms" }}>
        {tutorials.map((tutorial, index) => (
          <div 
            key={tutorial.slug}
            className="group bg-surface-low border border-white/5 rounded-lg p-8 flex flex-col hover:bg-surface-high hover:border-secondary/30 transition-all relative overflow-hidden"
          >
            {/* Background Accent */}
            <div className="absolute -top-10 -right-10 size-32 bg-secondary/5 rounded-full blur-3xl group-hover:bg-secondary/10 transition-all" />
            
            <div className="mb-8">
              <Badge className="font-mono text-secondary bg-secondary/10 border border-secondary/20 tracking-widest leading-none mb-4">
                <Terminal className="size-3 mr-2" />
                {tutorial.eyebrow}
              </Badge>
              <h2 className="text-2xl font-display font-black text-foreground uppercase group-hover:text-secondary transition-colors mb-4 leading-tight">
                {tutorial.title}
              </h2>
              <p className="text-sm text-muted-foreground font-sans leading-relaxed grow">
                {tutorial.summary}
              </p>
            </div>

            <div className="mt-auto pt-8 border-t border-white/5 flex items-center justify-between">
               <div className="flex flex-col">
                  <span className="text-[9px] font-mono text-muted-foreground uppercase tracking-widest opacity-50">Tiempo_Estimado</span>
                  <span className="text-xs font-display font-bold uppercase text-foreground">05:00 Min</span>
               </div>
               <Button asChild variant="ghost" className="p-0 h-10 w-10 rounded bg-white/5 border border-white/10 hover:border-secondary/50 group-hover:bg-secondary group-hover:text-secondary-foreground transition-all active:scale-95">
                 <Link href={`/tutoriales/${tutorial.slug}`} aria-label={`Ir a ${tutorial.title}`}>
                   <ChevronRight className="size-5" />
                 </Link>
               </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Footer System Status */}
      <div className="w-full mt-24 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 opacity-30">
         <div className="flex items-center gap-4 font-mono text-[9px] uppercase tracking-widest">
            <span className="flex items-center gap-2"><div className="size-1 bg-primary rounded-full" /> Sistema_Calibrado</span>
            <span className="flex items-center gap-2"><div className="size-1 bg-secondary rounded-full" /> Módulos_Activos</span>
         </div>
         <div className="font-mono text-[9px] uppercase tracking-widest">
            v4.0.2 // NEON_TERMINAL_ES
         </div>
      </div>
    </main>
  );
}

