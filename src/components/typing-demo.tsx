"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const TARGET = "El veloz zorro marrón salta sobre el perro perezoso.";

// [charIndex, wrongChar] — posiciones donde se simula un error
const MISTAKE_MAP = new Map<number, string>([
  [10, "a"],
  [24, "k"],
  [41, "i"],
]);

type TypedChar = { char: string; correct: boolean };
type ScriptStep =
  | { op: "add"; char: string; correct: boolean }
  | { op: "del" }
  | { op: "clear" };

function buildScript(): { step: ScriptStep; delay: number }[] {
  const script: { step: ScriptStep; delay: number }[] = [];

  for (let i = 0; i < TARGET.length; i++) {
    const wrongChar = MISTAKE_MAP.get(i);
    if (wrongChar) {
      script.push({ step: { op: "add", char: wrongChar, correct: false }, delay: 70 + Math.random() * 50 });
      script.push({ step: { op: "del" }, delay: 450 });
      script.push({ step: { op: "add", char: TARGET[i], correct: true }, delay: 120 });
    } else {
      script.push({ step: { op: "add", char: TARGET[i], correct: true }, delay: 55 + Math.random() * 70 });
    }
  }

  script.push({ step: { op: "clear" }, delay: 3000 });
  return script;
}

export function TypingDemo() {
  const [typed, setTyped] = useState<TypedChar[]>([]);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    let script = buildScript();
    let step = 0;

    function tick() {
      if (step >= script.length) {
        script = buildScript();
        step = 0;
      }

      const { step: s, delay } = script[step];
      step++;

      timeoutId = setTimeout(() => {
        switch (s.op) {
          case "add":
            setTyped((prev) => [...prev, { char: s.char, correct: s.correct }]);
            break;
          case "del":
            setTyped((prev) => prev.slice(0, -1));
            break;
          case "clear":
            setTyped([]);
            break;
        }
        tick();
      }, delay);
    }

    timeoutId = setTimeout(tick, 800);
    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <div className="md:col-span-12">
      <div className="bg-surface-lowest border border-white/5 rounded-lg p-6 sm:p-8 md:p-12 relative overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.3)]">
        <div className="absolute top-0 right-0 p-6 flex gap-3">
          <div className="size-2.5 rounded-full bg-primary/30" />
          <div className="size-2.5 rounded-full bg-secondary/30" />
          <div className="size-2.5 rounded-full bg-tertiary/30" />
        </div>

        <div className="flex items-center gap-3 mb-8">
          <div className="h-[2px] w-8 bg-primary animate-pulse" />
          <span className="text-primary font-mono text-[10px] font-bold tracking-[0.3em] uppercase">
            Demo
          </span>
        </div>

        <div className="font-mono text-lg sm:text-2xl md:text-4xl lg:text-5xl leading-relaxed tracking-normal select-none wrap-break-word">
          {TARGET.split("").map((char, index) => {
            const typedChar = typed[index];
            const isActive = index === typed.length;

            let charClassName = "transition-all duration-75";
            if (typedChar === undefined) {
              charClassName += " text-foreground/10";
            } else if (typedChar.correct) {
              charClassName += " text-primary";
            } else {
              charClassName +=
                " text-destructive-foreground bg-destructive/80 px-1 rounded-sm";
            }

            return (
              <span
                key={index}
                className={cn(charClassName, isActive && "typing-caret")}
              >
                {char === " " ? "\u00A0" : char}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}
