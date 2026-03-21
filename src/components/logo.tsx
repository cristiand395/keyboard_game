import { Keyboard } from "lucide-react";

export function Logo() {
  return (
    <div className="flex items-center gap-3">
      <div className="flex size-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-cyan-950/20">
        <Keyboard className="size-5" />
      </div>
      <div>
        <p className="font-display text-lg font-bold tracking-tight">KeySprint</p>
        <p className="text-xs text-muted-foreground">mecanografia con ritmo</p>
      </div>
    </div>
  );
}

