"use client";

import type { ReactNode } from "react";
import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { Clock3, Crosshair, Timer, TriangleAlert } from "lucide-react";
import { saveAttemptAction } from "@/app/actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { buildLevelResult, type LevelTarget, type LevelResult } from "@/lib/typing";
import { formatDuration, formatPercentage } from "@/lib/utils";

type TypingGameProps = {
  levelSlug: string;
  title: string;
  description: string;
  targetText: string;
  target: LevelTarget;
  isAuthenticated: boolean;
};

type KeyboardKey = {
  label: string;
  code: string;
  shiftedLabel?: string;
  wide?: boolean;
  extraWide?: boolean;
  space?: boolean;
  align?: "left" | "center" | "right";
};

const keyboardRows: KeyboardKey[][] = [
  [
    { label: "º", shiftedLabel: "ª", code: "Backquote" },
    { label: "1", shiftedLabel: "!", code: "Digit1" },
    { label: "2", shiftedLabel: "\"", code: "Digit2" },
    { label: "3", shiftedLabel: "·", code: "Digit3" },
    { label: "4", shiftedLabel: "$", code: "Digit4" },
    { label: "5", shiftedLabel: "%", code: "Digit5" },
    { label: "6", shiftedLabel: "&", code: "Digit6" },
    { label: "7", shiftedLabel: "/", code: "Digit7" },
    { label: "8", shiftedLabel: "(", code: "Digit8" },
    { label: "9", shiftedLabel: ")", code: "Digit9" },
    { label: "0", shiftedLabel: "=", code: "Digit0" },
    { label: "'", shiftedLabel: "?", code: "Minus" },
    { label: "¡", shiftedLabel: "¿", code: "Equal" },
    { label: "Borrar", code: "Backspace", wide: true, align: "right" },
  ],
  [
    { label: "Tab", code: "Tab", wide: true, align: "left" },
    { label: "Q", code: "KeyQ" },
    { label: "W", code: "KeyW" },
    { label: "E", code: "KeyE" },
    { label: "R", code: "KeyR" },
    { label: "T", code: "KeyT" },
    { label: "Y", code: "KeyY" },
    { label: "U", code: "KeyU" },
    { label: "I", code: "KeyI" },
    { label: "O", code: "KeyO" },
    { label: "P", code: "KeyP" },
    { label: "`", shiftedLabel: "^", code: "BracketLeft" },
    { label: "+", shiftedLabel: "*", code: "BracketRight" },
    { label: "Intro", code: "Enter", wide: true, align: "right" },
  ],
  [
    { label: "Bloq Mayús", code: "CapsLock", wide: true, align: "left" },
    { label: "A", code: "KeyA" },
    { label: "S", code: "KeyS" },
    { label: "D", code: "KeyD" },
    { label: "F", code: "KeyF" },
    { label: "G", code: "KeyG" },
    { label: "H", code: "KeyH" },
    { label: "J", code: "KeyJ" },
    { label: "K", code: "KeyK" },
    { label: "L", code: "KeyL" },
    { label: "Ñ", code: "Semicolon" },
    { label: "´", shiftedLabel: "¨", code: "Quote" },
    { label: "Ç", shiftedLabel: "}", code: "Backslash" },
  ],
  [
    { label: "Mayús", code: "ShiftLeft", extraWide: true, align: "left" },
    { label: "<", shiftedLabel: ">", code: "IntlBackslash" },
    { label: "Z", code: "KeyZ" },
    { label: "X", code: "KeyX" },
    { label: "C", code: "KeyC" },
    { label: "V", code: "KeyV" },
    { label: "B", code: "KeyB" },
    { label: "N", code: "KeyN" },
    { label: "M", code: "KeyM" },
    { label: ",", shiftedLabel: ";", code: "Comma" },
    { label: ".", shiftedLabel: ":", code: "Period" },
    { label: "-", shiftedLabel: "_", code: "Slash" },
    { label: "Mayús", code: "ShiftRight", extraWide: true, align: "right" },
  ],
  [
    { label: "Ctrl", code: "ControlLeft", wide: true, align: "left" },
    { label: "Fn", code: "Fn", wide: true, align: "center" },
    { label: "Alt", code: "AltLeft", wide: true },
    { label: "Espacio", code: "Space", extraWide: true, align: "center", space: true },
    { label: "Alt Gr", code: "AltRight", wide: true },
    { label: "Ctrl", code: "ControlRight", wide: true, align: "right" },
  ],
];

function renderCharacter(char: string) {
  return char === " " ? "\u00A0" : char;
}

function getRealtimeStatus(targetText: string, typedText: string) {
  const safeTyped = typedText.slice(0, targetText.length);
  let correctChars = 0;
  let errorCount = 0;

  for (let index = 0; index < safeTyped.length; index += 1) {
    if (safeTyped[index] === targetText[index]) {
      correctChars += 1;
    } else {
      errorCount += 1;
    }
  }

  return {
    correctChars,
    errorCount,
    remainingChars: Math.max(0, targetText.length - safeTyped.length),
  };
}

function getActiveIndex(targetText: string, typedText: string) {
  return Math.min(typedText.length, Math.max(0, targetText.length - 1));
}

function getFocusWindow(targetText: string, typedText: string) {
  const activeIndex = getActiveIndex(targetText, typedText);
  const windowRadius = 54;
  let start = Math.max(0, activeIndex - windowRadius);
  let end = Math.min(targetText.length, activeIndex + windowRadius);

  while (start > 0 && targetText[start] !== " ") {
    start -= 1;
  }

  while (end < targetText.length && targetText[end] !== " ") {
    end += 1;
  }

  return {
    activeIndex,
    start,
    end,
    text: targetText.slice(start, end),
  };
}

function getExpectedKeyCodes(char: string | undefined) {
  if (!char) {
    return [] as string[];
  }

  const isUppercaseLetter = /^[A-ZÁÉÍÓÚÜÑ]$/.test(char);
  const normalized = char.toLowerCase();
  const keys: string[] = [];

  if (normalized === " ") keys.push("Space");
  else if (/^[a-z]$/.test(normalized)) keys.push(`Key${normalized.toUpperCase()}`);
  else if (normalized === "ñ") keys.push("Semicolon");
  else if (normalized === ",") keys.push("Comma");
  else if (normalized === ".") keys.push("Period");
  else if (normalized === ":") keys.push("IntlRo", "ShiftRight");
  else if (normalized === ";") keys.push("Slash", "ShiftRight");
  else if (normalized === "-") keys.push("Slash");
  else if (normalized === "_") keys.push("Slash", "ShiftRight");
  else if (normalized === "'") keys.push("Minus");
  else if (normalized === "?") keys.push("Minus", "ShiftRight");
  else if (normalized === "¡") keys.push("Equal");
  else if (normalized === "¿") keys.push("Equal", "ShiftRight");
  else if (normalized === "+") keys.push("BracketRight");
  else if (normalized === "*") keys.push("BracketRight", "ShiftRight");
  else if (normalized === "´") keys.push("Quote");
  else if (normalized === "¨") keys.push("Quote", "ShiftRight");

  if (isUppercaseLetter && keys.length > 0 && !keys.includes("ShiftRight")) {
    keys.push("ShiftRight");
  }

  return keys;
}

function renderTargetText(targetText: string, typedText: string, startOffset = 0) {
  const activeIndex = getActiveIndex(targetText, typedText);

  return targetText.split("").map((char, index) => {
    const absoluteIndex = startOffset + index;
    const typedChar = typedText[index];
    const isActive = absoluteIndex === activeIndex && typedText.length < startOffset + targetText.length;
    let className =
      "rounded-md px-0.5 py-1 text-slate-500 transition-colors duration-150";

    if (typedChar === undefined) {
      className = `${className} text-slate-400`;
    } else if (typedChar === char) {
      className = `${className} bg-emerald-100/70 text-emerald-700`;
    } else {
      className = `${className} bg-rose-100 text-rose-700`;
    }

    if (isActive) {
      className = `${className} typing-caret bg-cyan-100/70 text-slate-900`;
    }

    return (
      <span key={`${char}-${index}`} className={className}>
        {renderCharacter(char)}
      </span>
    );
  });
}

export function TypingGame({
  levelSlug,
  title,
  description,
  targetText,
  target,
  isAuthenticated,
}: TypingGameProps) {
  const [typedText, setTypedText] = useState("");
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [elapsedPreviewMs, setElapsedPreviewMs] = useState(0);
  const [finishedResult, setFinishedResult] = useState<LevelResult | null>(null);
  const [serverMessage, setServerMessage] = useState<string | null>(null);
  const [pressedKeyCode, setPressedKeyCode] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const clearPressedKeyTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (!startedAt || finishedResult) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setElapsedPreviewMs(Date.now() - startedAt);
    }, 250);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [finishedResult, startedAt]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    return () => {
      if (clearPressedKeyTimeoutRef.current) {
        window.clearTimeout(clearPressedKeyTimeoutRef.current);
      }
    };
  }, []);

  const progress = useMemo(() => {
    return targetText.length === 0 ? 0 : Math.min(100, (typedText.length / targetText.length) * 100);
  }, [targetText.length, typedText.length]);

  const liveStats = useMemo(() => getRealtimeStatus(targetText, typedText), [targetText, typedText]);
  const focusWindow = useMemo(() => getFocusWindow(targetText, typedText), [targetText, typedText]);
  const expectedKeyCodes = useMemo(
    () => getExpectedKeyCodes(targetText[typedText.length]),
    [targetText, typedText.length],
  );

  const currentMetrics = useMemo(() => {
    if (!startedAt) {
      return null;
    }

    return buildLevelResult(levelSlug, targetText, typedText, elapsedPreviewMs, target);
  }, [elapsedPreviewMs, levelSlug, startedAt, target, targetText, typedText]);

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden">
        <CardHeader>
          <div className="flex flex-wrap items-center gap-3">
            <Badge>{title}</Badge>
            <span className="text-sm text-muted-foreground">{description}</span>
          </div>
          <CardTitle className="text-3xl">Escribe siguiendo el texto y corrige tu ritmo en tiempo real</CardTitle>
          <CardDescription>
            Cada letra cambia al instante segun acierto o error. El cronometro corre desde la primera pulsacion.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid gap-3 md:grid-cols-4">
            <MetricChip icon={<Timer className="size-4" />} label="Tiempo" value={formatDuration((finishedResult ?? currentMetrics)?.elapsedMs ?? 0)} />
            <MetricChip icon={<Crosshair className="size-4" />} label="Precision" value={formatPercentage((finishedResult ?? currentMetrics)?.accuracy ?? 0)} />
            <MetricChip icon={<Clock3 className="size-4" />} label="WPM" value={String((finishedResult ?? currentMetrics)?.wpm ?? 0)} />
            <MetricChip icon={<TriangleAlert className="size-4" />} label="Errores" value={String(liveStats.errorCount)} />
          </div>
          <Progress value={progress} />
          <div
            className="relative overflow-hidden rounded-[32px] border border-slate-200 bg-[linear-gradient(180deg,rgba(240,245,255,0.95),rgba(232,238,250,0.95))] p-6 md:p-8"
            onClick={() => inputRef.current?.focus()}
          >
            <div className="pointer-events-none absolute right-8 top-6 hidden rounded-full bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 md:block">
              clic para seguir escribiendo
            </div>
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div className="rounded-full bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                linea de enfoque
              </div>
              <div className="text-sm text-slate-500">
                {typedText.length}/{targetText.length} caracteres
              </div>
            </div>
            <div className="typing-focus-line relative max-w-5xl overflow-hidden rounded-[28px] border border-white/60 bg-white/40 px-4 py-5 md:px-6 md:py-6">
              <div className="typing-surface whitespace-pre-wrap break-words font-mono text-[2rem] leading-[1.95] tracking-[0.08em] text-slate-700 md:text-[3rem] md:leading-[1.85]">
                {renderTargetText(focusWindow.text, typedText.slice(focusWindow.start, focusWindow.end), focusWindow.start)}
              </div>
            </div>
            <textarea
              ref={inputRef}
              className="pointer-events-none absolute inset-0 h-full w-full resize-none opacity-0 outline-none"
              value={typedText}
              spellCheck={false}
              autoCapitalize="none"
              autoCorrect="off"
              aria-label="Campo de mecanografia"
              placeholder="Empieza a escribir aqui..."
              onChange={(event) => {
                const startedNow = startedAt ?? Date.now();
                if (!startedAt) {
                  setStartedAt(startedNow);
                  setElapsedPreviewMs(0);
                }

                const nextValue = event.target.value.slice(0, targetText.length);
                setTypedText(nextValue);

                if (nextValue.length >= targetText.length) {
                  const elapsedMs = Date.now() - startedNow;
                  const nextResult = buildLevelResult(levelSlug, targetText, nextValue, elapsedMs, target);
                  setFinishedResult(nextResult);
                  setElapsedPreviewMs(elapsedMs);

                  startTransition(async () => {
                    const response = await saveAttemptAction({
                      levelSlug,
                      typedText: nextValue,
                      elapsedMs,
                    });
                    setServerMessage(response.message ?? null);
                  });
                }
              }}
              onKeyDown={(event) => {
                setPressedKeyCode(event.code);

                if (clearPressedKeyTimeoutRef.current) {
                  window.clearTimeout(clearPressedKeyTimeoutRef.current);
                }

                clearPressedKeyTimeoutRef.current = window.setTimeout(() => {
                  setPressedKeyCode(null);
                }, 180);
              }}
            />
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <LiveStat label="Caracteres correctos" value={String(liveStats.correctChars)} />
            <LiveStat label="Caracteres pendientes" value={String(liveStats.remainingChars)} />
            <LiveStat label="Estado" value={finishedResult ? (finishedResult.passed ? "Completado" : "Reintentar") : "En curso"} />
          </div>
          <TypingKeyboard expectedKeyCodes={expectedKeyCodes} pressedKeyCode={pressedKeyCode} />
          <div className="flex flex-wrap gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setTypedText("");
                setStartedAt(null);
                setElapsedPreviewMs(0);
                setFinishedResult(null);
                setServerMessage(null);
                inputRef.current?.focus();
              }}
            >
              Reiniciar intento
            </Button>
            {!isAuthenticated ? (
              <p className="self-center text-sm text-muted-foreground">
                Puedes jugar ya. Registra tu cuenta para guardar estrellas y progreso.
              </p>
            ) : null}
          </div>
        </CardContent>
      </Card>

      {finishedResult ? (
        <Card>
          <CardHeader>
            <CardTitle>Panel del intento</CardTitle>
            <CardDescription>Busca una cadencia estable: primero precisión, luego velocidad.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid gap-3 md:grid-cols-4">
              <Metric label="Precision" value={formatPercentage(finishedResult.accuracy)} />
              <Metric label="WPM" value={String(finishedResult.wpm)} />
              <Metric label="Errores" value={String(finishedResult.errorCount)} />
              <Metric label="Tiempo" value={formatDuration(finishedResult.elapsedMs)} />
            </div>
            <div className="rounded-[24px] bg-secondary p-4">
              <p className="text-sm font-semibold">Objetivos del nivel</p>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                <li>Accuracy minima: {target.minAccuracy}%</li>
                <li>Bronce: {target.bronzeWpm} WPM</li>
                <li>Plata: {target.silverWpm} WPM</li>
                <li>Oro: {target.goldWpm} WPM</li>
              </ul>
            </div>
            <div className="rounded-[24px] border border-emerald-200 bg-emerald-50 p-4">
              <p className="font-semibold">
                Resultado: {finishedResult.stars} estrella{finishedResult.stars === 1 ? "" : "s"}
              </p>
              <p className="mt-1 text-sm text-emerald-800">
                {finishedResult.passed
                  ? "Nivel superado. Si estas dentro, tu progreso queda consolidado."
                  : "Aun no alcanza el minimo. Ajusta el ritmo y vuelve a intentarlo."}
              </p>
            </div>
            {serverMessage ? <p className="text-sm text-muted-foreground">{serverMessage}</p> : null}
            {isPending ? <p className="text-sm text-muted-foreground">Guardando resultado...</p> : null}
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}

function TypingKeyboard({
  expectedKeyCodes,
  pressedKeyCode,
}: {
  expectedKeyCodes: string[];
  pressedKeyCode: string | null;
}) {
  return (
    <div className="rounded-[28px] border border-border bg-[linear-gradient(180deg,rgba(248,250,252,0.95),rgba(234,239,247,0.95))] p-4 md:p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-semibold text-slate-700">Teclado visual</p>
        <div className="flex flex-wrap gap-2 text-xs text-slate-500">
          <span className="rounded-full bg-cyan-100 px-3 py-1">siguiente tecla</span>
          <span className="rounded-full bg-emerald-100 px-3 py-1">tecla pulsada</span>
        </div>
      </div>
      <div className="space-y-2">
        {keyboardRows.map((row, rowIndex) => (
          <div
            key={`row-${rowIndex}`}
            className={[
              "flex flex-wrap gap-2 space-between",
              rowIndex === 1 ? "ml-3" : "",
              rowIndex === 2 ? "ml-6" : "",
              rowIndex === 3 ? "ml-8" : "",
              rowIndex === 4 ? "ml-2" : "",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            {row.map((keyItem) => {
              const isExpected = expectedKeyCodes.includes(keyItem.code);
              const isPressed = pressedKeyCode === keyItem.code;

              return (
                <div
                  key={keyItem.code}
                  className={[
                    "flex min-h-12 flex-col justify-between rounded-2xl border border-slate-400/70 bg-white/80 px-3 py-2 text-slate-600 transition-all",
                    keyItem.space
                      ? "min-w-[18rem] flex-1"
                      : keyItem.extraWide
                        ? "min-w-32"
                        : keyItem.wide
                          ? "min-w-20"
                          : "min-w-12",
                    isExpected
                      ? "border-cyan-500 bg-cyan-500 text-white shadow-[0_10px_30px_rgba(14,165,233,0.35)]"
                      : "",
                    isPressed
                      ? "border-emerald-500 bg-emerald-500 text-white shadow-[0_10px_30px_rgba(16,185,129,0.35)]"
                      : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  <span
                    className={[
                      "text-[10px] uppercase tracking-[0.16em]",
                      isExpected || isPressed ? "text-white/80" : "text-slate-400",
                      keyItem.align === "right" ? "text-right" : keyItem.align === "center" ? "text-center" : "text-left",
                    ].join(" ")}
                  >
                    {keyItem.shiftedLabel ?? "\u00A0"}
                  </span>
                  <span
                    className={[
                      "text-sm font-semibold md:text-base",
                      keyItem.align === "right" ? "text-right" : keyItem.align === "center" ? "text-center" : "text-left",
                    ].join(" ")}
                  >
                    {keyItem.label}
                  </span>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

function MetricChip({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-[22px] border border-border bg-white/80 px-4 py-3">
      <div className="flex size-10 items-center justify-center rounded-2xl bg-secondary text-primary">{icon}</div>
      <div>
        <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{label}</p>
        <p className="text-lg font-semibold">{value}</p>
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[24px] border border-border bg-white/70 p-4">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-2 text-2xl font-semibold tracking-tight">{value}</p>
    </div>
  );
}

function LiveStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[22px] border border-border/80 bg-slate-50/80 px-4 py-3">
      <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{label}</p>
      <p className="mt-2 text-lg font-semibold text-slate-800">{value}</p>
    </div>
  );
}
