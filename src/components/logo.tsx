import { Terminal } from "lucide-react";

export function Logo() {
  return (
    <div className="flex items-center gap-3 group">
      <div className="flex size-10 items-center justify-center rounded-md bg-surface-highest text-primary shadow-[0_0_15px_rgba(161,250,255,0.2)] group-hover:shadow-[0_0_20px_rgba(161,250,255,0.4)] transition-all">
        <Terminal className="size-5" />
      </div>
      <div>
        <p className="font-display text-lg font-extrabold tracking-tighter uppercase text-primary">
          NEON_TERMINAL
        </p>
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground leading-none">
          Instruments
        </p>
      </div>
    </div>
  );
}

