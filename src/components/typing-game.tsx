"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import {
  ArrowLeft,
  Bolt,
  Clock3,
  Keyboard,
  RotateCcw,
  Timer,
  TriangleAlert,
  Volume2,
  Trophy,
  TrendingUp,
} from "lucide-react";
import { saveAttemptAction } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { buildLevelResult, type LevelTarget, type LevelResult } from "@/lib/typing";
import { formatDuration, formatPercentage, cn } from "@/lib/utils";

type TypingGameProps = {
  levelSlug: string;
  title: string;
  description: string;
  targetText: string;
  target: LevelTarget;
  isAuthenticated: boolean;
  userName?: string;
  history: Array<{
    id: string;
    wpm: number;
    accuracy: number;
    stars: number;
    passed: boolean;
    createdAt: Date;
  }>;
  nextLevelSlug?: string;
};

function renderCharacter(char: string) {
  return char === " " ? "\u00A0" : char;
}

export function TypingGame({
  levelSlug,
  title,
  description,
  targetText,
  target,
  isAuthenticated,
  userName = "Pilot",
  history,
  nextLevelSlug,
}: TypingGameProps) {
  const [typedText, setTypedText] = useState("");
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [elapsedPreviewMs, setElapsedPreviewMs] = useState(0);
  const [finishedResult, setFinishedResult] = useState<LevelResult | null>(null);
  const [isFocused, setIsFocused] = useState(true);
  const [isPending, startTransition] = useTransition();
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!startedAt || finishedResult) return;
    const intervalId = window.setInterval(() => {
      setElapsedPreviewMs(Date.now() - startedAt);
    }, 250);
    return () => window.clearInterval(intervalId);
  }, [finishedResult, startedAt]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const progress = useMemo(() => {
    return targetText.length === 0 ? 0 : Math.min(100, (typedText.length / targetText.length) * 100);
  }, [targetText.length, typedText.length]);

  const currentMetrics = useMemo(() => {
    if (!startedAt) return null;
    return buildLevelResult(levelSlug, targetText, typedText, elapsedPreviewMs, target);
  }, [elapsedPreviewMs, levelSlug, startedAt, target, targetText, typedText]);

  const liveStats = useMemo(() => {
    let correct = 0;
    let errors = 0;
    for (let i = 0; i < typedText.length; i++) {
      if (typedText[i] === targetText[i]) correct++;
      else errors++;
    }
    return { correct, errors };
  }, [targetText, typedText]);

  return (
    <div className="flex min-h-screen flex-col font-sans bg-background text-foreground selection:bg-primary/30 selection:text-primary">
      {/* Top Instrument Bar */}
      <nav className="w-full sticky top-0 bg-surface-low/80 backdrop-blur-md z-50 border-b border-white/5">
        <div className="flex justify-between items-center px-8 py-4 max-w-full mx-auto">
          <div className="flex items-center gap-6">
            <Link href="/retos" className="text-muted-foreground hover:text-primary transition-colors active:scale-95 duration-100">
              <ArrowLeft className="size-5" />
            </Link>
            <div className="font-display text-xl font-extrabold tracking-tighter text-primary uppercase">
              NEON_TERMINAL <span className="text-muted-foreground font-mono text-[10px] ml-2 tracking-widest font-normal opacity-50 uppercase">Instancia: {levelSlug}</span>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-8 font-display text-xs font-bold uppercase tracking-widest">
             <div className="flex items-center gap-2 text-primary border-b-2 border-primary pb-1">
                <Bolt className="size-4" />
                En vivo
             </div>
             <div className="text-muted-foreground hover:text-primary transition-all cursor-pointer">
                Ranking global
             </div>
          </div>
          <div className="flex items-center gap-4">
             <button className="p-2 rounded-md bg-surface-highest text-primary hover:shadow-[0_0_10px_rgba(161,250,255,0.2)] transition-all">
                <Keyboard className="size-5" />
             </button>
          </div>
        </div>
      </nav>

      <main className="grow flex flex-col items-center justify-center px-8 py-12 relative">
        {/* Stats Dashboard */}
        <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-8 mb-20 animate-rise">
           <StatCard 
             label="Velocidad (PPM)" 
             value={currentMetrics?.wpm ?? 0} 
             color="primary" 
             icon={<TrendingUp className="size-4" />}
             glowColor="#a1faff"
           />
           <StatCard 
             label="Precisión (%)" 
             value={formatPercentage(currentMetrics?.accuracy ?? 100).replace("%", "")} 
             unit="%" 
             color="secondary" 
             glowColor="#c47fff"
           />
           <StatCard 
             label="Tiempo transcurrido" 
             value={formatDuration(elapsedPreviewMs)} 
             color="tertiary" 
             icon={<Clock3 className="size-4" />}
             glowColor="#ff59e3"
           />
        </div>

        {/* Typing Instrument Canvas */}
        <div className="w-full max-w-5xl relative group animate-rise" style={{ animationDelay: "100ms" }}>
           <div 
             className={cn(
               "bg-surface-lowest border-b-2 border-primary/10 p-4 sm:p-8 md:p-12 rounded-lg backdrop-blur-md transition-all duration-300 relative shadow-sm",
               !isFocused && !finishedResult && "opacity-40 grayscale blur-[2px]",
               isFocused && "border-primary/30 shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
             )}
             onClick={() => inputRef.current?.focus()}
           >
             {/* Character Stream */}
             <div className="font-mono text-lg sm:text-2xl md:text-4xl lg:text-5xl leading-relaxed tracking-normal select-none relative z-10 wrap-break-word">
                {targetText.split("").map((char, index) => {
                  const typedChar = typedText[index];
                  const isActive = index === typedText.length && !finishedResult;
                  
                  let charClassName = "transition-all duration-75";
                  if (typedChar === undefined) {
                    charClassName += " text-foreground/10";
                  } else if (typedChar === char) {
                    charClassName += " text-primary";
                  } else {
                    charClassName += " text-destructive-foreground bg-destructive/80 px-1 rounded-sm";
                  }

                  return (
                    <span key={index} className={cn(charClassName, isActive && "typing-caret")}>
                      {renderCharacter(char)}
                    </span>
                  );
                })}
             </div>

             {/* Focus Overlay */}
             {!isFocused && !finishedResult && (
               <div className="absolute inset-0 z-20 flex items-center justify-center bg-background/20 backdrop-blur-sm cursor-pointer">
                  <div className="bg-surface-high p-6 rounded border border-white/10 flex flex-col items-center gap-4 animate-in zoom-in-95 font-display text-xs font-bold tracking-[0.3em] uppercase">
                    <div className="size-12 rounded-full bg-primary/20 flex items-center justify-center text-primary animate-pulse shadow-glow">
                      <Bolt className="size-6" />
                    </div>
                    Haz clic para sincronizar la terminal
                  </div>
               </div>
             )}
           </div>

           {/* Hidden Input */}
           <textarea
              ref={inputRef}
              className="absolute inset-0 w-full h-full opacity-0 cursor-default pointer-events-none"
              value={typedText}
              spellCheck={false}
              autoFocus
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              onChange={(e) => {
                if (finishedResult) return;
                const startedNow = startedAt ?? Date.now();
                if (!startedAt) setStartedAt(startedNow);

                const val = e.target.value.slice(0, targetText.length);
                setTypedText(val);

                if (val.length >= targetText.length) {
                  const elapsed = Date.now() - startedNow;
                  const result = buildLevelResult(levelSlug, targetText, val, elapsed, target);
                  setFinishedResult(result);
                  startTransition(async () => {
                    await saveAttemptAction({ levelSlug, typedText: val, elapsedMs: elapsed });
                  });
                }
              }}
           />

           {/* Key-Cap Hints */}
           <div className="absolute -bottom-10 right-0 flex gap-6">
              <KeyHint chip="ESC" action="Reiniciar" onClick={() => {
                 setTypedText("");
                 setStartedAt(null);
                 setElapsedPreviewMs(0);
                 setFinishedResult(null);
                 inputRef.current?.focus();
              }} />
              <KeyHint chip="CTRL+R" action="Siguiente misión" href="/retos" />
           </div>
        </div>
      </main>

      {/* Results Overlay */}
      {finishedResult && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-background/40 backdrop-blur-xl p-8 animate-in fade-in duration-500">
           <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-8 animate-in zoom-in-95 duration-500">
              {/* Performance Analysis */}
              <div className="bg-surface-low rounded-lg p-12 border border-white/5 relative overflow-hidden shadow-2xl">
                 <div className="absolute top-0 left-0 w-1 h-full bg-primary shadow-[0_0_20px_#a1faff]"></div>
                 
                 <div className="flex justify-between items-start mb-16">
                    <div>
                      <h2 className="text-secondary font-display font-bold text-xs tracking-[0.4em] mb-2 uppercase">¡Protocolo completado!</h2>
                      <p className="text-5xl font-display font-extrabold tracking-tight text-foreground uppercase">{title}</p>
                    </div>
                    <div className="text-6xl font-display font-black text-primary shadow-glow">
                       {finishedResult.stars} <span className="text-2xl align-top">★</span>
                    </div>
                 </div>

                 <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-16">
                    <ResultStat label="PPM final" value={finishedResult.wpm} color="primary" />
                    <ResultStat label="Precisión" value={`${formatPercentage(finishedResult.accuracy)}`} color="secondary" />
                    <ResultStat label="Correctas" value={liveStats.correct} />
                    <ResultStat label="Errores" value={finishedResult.errorCount} color="tertiary" />
                 </div>

                 <div className="flex flex-wrap gap-4 pt-12 border-t border-white/5">
                    <Button 
                      className="neon-gradient h-14 px-10 font-display font-bold uppercase tracking-widest text-xs rounded-md shadow-[0_0_30px_rgba(161,250,255,0.2)] border-none text-primary-foreground active:scale-95"
                      onClick={() => {
                        setTypedText("");
                        setStartedAt(null);
                        setElapsedPreviewMs(0);
                        setFinishedResult(null);
                        inputRef.current?.focus();
                      }}
                    >
                      Volver a intentar
                    </Button>
                    {nextLevelSlug && finishedResult.passed && (
                      <Button asChild className="h-14 px-10 font-display font-bold uppercase tracking-widest text-xs rounded-md bg-primary/10 text-primary hover:bg-primary/20 transition-all active:scale-95 border border-primary/20">
                        <Link href={`/retos/${nextLevelSlug}`}>Siguiente módulo</Link>
                      </Button>
                    )}
                    <Button variant="ghost" asChild className="h-14 px-10 rounded-md font-display font-bold uppercase tracking-widest text-xs text-muted-foreground hover:text-foreground">
                      <Link href="/retos">Volver al panel</Link>
                    </Button>
                 </div>
              </div>

              {/* Sidebar/History */}
              <div className="space-y-8">
                 <div className="bg-surface-highest p-10 rounded-lg border border-white/5 shadow-sm">
                    <h3 className="font-display font-bold text-xs tracking-[0.3em] mb-8 flex items-center gap-3 uppercase">
                       <Trophy className="size-4 text-secondary" />
                       Historial de intentos
                    </h3>
                    <div className="space-y-6">
                       {history.length > 0 ? history.slice(0, 3).map((h, i) => (
                         <div key={i} className="flex justify-between items-center bg-surface-low/50 p-4 rounded border border-white/5 transition-colors hover:border-primary/20">
                            <div className="font-mono text-[10px] text-muted-foreground uppercase">Intento {i + 1}</div>
                            <div className="text-right">
                               <p className="font-display font-bold text-foreground">{h.wpm} PPM</p>
                               <p className="text-[10px] font-mono text-secondary px-1 uppercase">{formatPercentage(h.accuracy)} Precisión</p>
                            </div>
                         </div>
                       )) : (
                         <div className="text-center py-8 border border-dashed border-white/10 rounded">
                            <p className="text-xs font-mono text-muted-foreground uppercase">No hay datos históricos.</p>
                         </div>
                       )}
                    </div>
                 </div>

                 <div className="bg-primary/5 p-8 rounded-lg border border-primary/20">
                    <p className="font-mono text-[9px] tracking-[0.3em] text-primary mb-3 font-extrabold leading-none uppercase">Análisis táctico</p>
                    <p className="text-sm font-sans text-muted-foreground leading-relaxed">
                       Tu precisión es el puente entre la intención y la ejecución. En este módulo, mantuviste un pico de <span className="text-primary font-bold">{finishedResult.wpm} PPM</span>.
                    </p>
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* Ambient Visuals */}
      <div className="fixed top-1/4 -left-64 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="fixed bottom-1/4 -right-64 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[120px] pointer-events-none"></div>
    </div>
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
    <div className="bg-surface-low p-6 rounded-md flex flex-col items-start relative overflow-hidden group border border-white/5 shadow-xl">
      <div className={cn("absolute top-0 left-0 w-1 h-full transition-all group-hover:w-1.5", bgColors[color])} style={{ boxShadow: `0 0 15px ${glowColor}` }}></div>
      <div className="flex justify-between items-center w-full mb-3">
         <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">{label}</span>
         <div className={cn("opacity-20", colors[color])}>{icon}</div>
      </div>
      <div className="flex items-baseline gap-2">
        <span className={cn("font-display text-5xl font-black tracking-tighter", colors[color])}>{value}</span>
        {unit && <span className="text-muted-foreground font-mono text-xl font-bold">{unit}</span>}
      </div>
    </div>
  );
}

function ResultStat({ label, value, color = "muted-foreground" }: { label: string; value: string | number; color?: string }) {
  const colors: Record<string, string> = {
    primary: "text-primary shadow-primary",
    secondary: "text-secondary shadow-secondary",
    tertiary: "text-tertiary shadow-tertiary",
    "muted-foreground": "text-muted-foreground",
  };

  return (
    <div className="space-y-3">
      <p className="text-[10px] font-display font-bold tracking-[0.3em] text-muted-foreground uppercase">{label}</p>
      <p className={cn("text-4xl font-display font-black tracking-tighter", colors[color])}>{value}</p>
    </div>
  );
}

function KeyHint({ chip, action, href, onClick }: { chip: string; action: string; href?: string; onClick?: () => void }) {
  const content = (
    <div className="bg-surface-highest/50 px-4 py-2 rounded-md border border-white/10 flex items-center gap-3 hover:border-primary/40 hover:bg-surface-highest transition-all cursor-pointer group">
      <span className="font-mono text-[10px] font-bold text-primary tracking-widest">{chip}</span>
      <span className="text-[10px] font-display font-bold text-muted-foreground uppercase tracking-widest group-hover:text-foreground">{action}</span>
    </div>
  );

  if (href) return <Link href={href}>{content}</Link>;
  return <div onClick={onClick}>{content}</div>;
}
