"use client";

import type { ReactNode } from "react";
import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import {
  BarChart2,
  Clock3,
  Crosshair,
  Keyboard,
  RotateCcw,
  Settings,
  Timer,
  TriangleAlert,
  Volume2,
} from "lucide-react";
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
  userName?: string;
  history: Array<{
    id: string;
    wpm: number;
    accuracy: number;
    stars: number;
    passed: boolean;
    createdAt: Date;
  }>;
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
  userName = "Cristian",
  history,
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
    <div className="flex min-h-screen flex-col font-sans">
      {/* Immersive Header */}
      <header className="flex items-center justify-between border-b border-slate-200 bg-white/80 px-6 py-3 backdrop-blur-md">
        <h2 className="text-lg font-semibold text-slate-700">{title}</h2>
        <div className="flex items-center gap-6 text-slate-400">
          <button
            onClick={() => {
              setTypedText("");
              setStartedAt(null);
              setElapsedPreviewMs(0);
              setFinishedResult(null);
              setServerMessage(null);
              inputRef.current?.focus();
            }}
            className="transition-colors hover:text-primary"
            title="Reiniciar"
          >
            <RotateCcw className="size-5" />
          </button>
          <Keyboard className="size-5 cursor-not-allowed opacity-30" />
          <Volume2 className="size-5 cursor-not-allowed opacity-30" />
          <BarChart2 className="size-5" />
          <Settings className="size-5 cursor-not-allowed opacity-30" />
        </div>
        <div className="font-semibold text-slate-700">{userName}</div>
      </header>

      <div className="relative flex flex-1 flex-col items-center justify-center overflow-hidden px-6 pt-12 pb-24">
        {/* Background Decorations */}
        <div className="pointer-events-none absolute bottom-12 left-12 opacity-40">
          <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="60" cy="60" r="60" fill="url(#paint0_radial_decoration)" />
            <defs>
              <radialGradient id="paint0_radial_decoration" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(60 60) rotate(90) scale(60)">
                <stop stopColor="#6366f1" stopOpacity="0.2" />
                <stop offset="1" stopColor="#6366f1" stopOpacity="0" />
              </radialGradient>
            </defs>
          </svg>
        </div>

        <div className="w-full max-w-6xl space-y-12">
          {/* Main Typing Surface */}
          <div
            className="group relative cursor-text"
            onClick={() => inputRef.current?.focus()}
          >
            {!startedAt && !finishedResult && (
              <div className="absolute -left-20 top-1/2 -translate-y-1/2 rounded-lg bg-indigo-500 px-3 py-6 text-[10px] font-bold leading-none tracking-widest text-white uppercase [writing-mode:vertical-lr]">
                START TYPING
              </div>
            )}

            <div className="relative z-10 font-mono text-[2.75rem] leading-[1.6] tracking-tight text-slate-400 md:text-[3.5rem]">
              <div className="whitespace-pre-wrap break-words">
                {targetText.split("").map((char, index) => {
                  const typedChar = typedText[index];
                  const isActive = index === typedText.length && !finishedResult;
                  let className = "transition-all duration-75";

                  if (typedChar === undefined) {
                    className += " text-slate-300";
                  } else if (typedChar === char) {
                    className += " text-slate-600";
                  } else {
                    className += " text-rose-500 bg-rose-50";
                  }

                  if (isActive) {
                    className += " border-b-4 border-indigo-500 ring-2 ring-indigo-500 ring-offset-4 rounded-sm";
                  }

                  return (
                    <span key={index} className={className}>
                      {renderCharacter(char)}
                    </span>
                  );
                })}
              </div>
            </div>

            <textarea
              ref={inputRef}
              className="absolute inset-0 h-full w-full resize-none opacity-0 outline-none"
              value={typedText}
              spellCheck={false}
              autoFocus
              onChange={(event) => {
                const startedNow = startedAt ?? Date.now();
                if (!startedAt) {
                  setStartedAt(startedNow);
                }

                const nextValue = event.target.value.slice(0, targetText.length);
                setTypedText(nextValue);

                if (nextValue.length >= targetText.length) {
                  const elapsedMs = Date.now() - startedNow;
                  const nextResult = buildLevelResult(levelSlug, targetText, nextValue, elapsedMs, target);
                  setFinishedResult(nextResult);

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
            />
          </div>

          {!finishedResult && startedAt && (
            <div className="flex items-center justify-center gap-12 font-mono text-sm tracking-widest text-slate-400 uppercase">
              <div className="flex flex-col items-center gap-1">
                <span className="text-[10px] opacity-60">Accuracy</span>
                <span className="text-xl font-bold text-slate-600">{formatPercentage(currentMetrics?.accuracy ?? 0)}</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <span className="text-[10px] opacity-60">WPM</span>
                <span className="text-xl font-bold text-slate-600">{currentMetrics?.wpm ?? 0}</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <span className="text-[10px] opacity-60">Time</span>
                <span className="text-xl font-bold text-slate-600">{formatDuration(elapsedPreviewMs)}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Result Overlay */}
      {finishedResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-indigo-950/20 p-6 backdrop-blur-xl animate-in fade-in zoom-in duration-300">
          <div className="grid w-full max-w-5xl gap-6 md:grid-cols-[1fr_350px]">
            <Card className="border-none shadow-2xl">
              <CardHeader className="border-b bg-slate-50/50 pb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl">Reto completado</CardTitle>
                    <CardDescription>{description}</CardDescription>
                  </div>
                  <div className="text-4xl font-black text-indigo-600">{finishedResult.stars} ⭐</div>
                </div>
              </CardHeader>
              <CardContent className="space-y-8 p-8">
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                  <BigMetric label="Velocidad (WPM)" value={String(finishedResult.wpm)} color="text-indigo-600" />
                  <BigMetric label="Precisión" value={formatPercentage(finishedResult.accuracy)} color="text-emerald-600" />
                  <BigMetric label="Correctos" value={String(liveStats.correctChars)} />
                  <BigMetric label="Errores" value={String(finishedResult.errorCount)} color="text-rose-600" />
                </div>

                <div className="flex flex-wrap gap-4 pt-6">
                  <Button
                    size="lg"
                    className="h-14 px-8 text-lg"
                    onClick={() => {
                      setTypedText("");
                      setStartedAt(null);
                      setElapsedPreviewMs(0);
                      setFinishedResult(null);
                      setServerMessage(null);
                      inputRef.current?.focus();
                    }}
                  >
                    Repetir Intento
                  </Button>
                  <Button variant="outline" size="lg" className="h-14 px-8 text-lg" asChild>
                    <a href="/retos">Ver otros retos</a>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card className="border-none shadow-xl">
                <CardHeader>
                  <CardTitle className="text-lg">Tu historial</CardTitle>
                </CardHeader>
                <CardContent className="px-2 pb-6">
                  {history.length === 0 ? (
                    <p className="px-4 text-sm text-muted-foreground">Primer intento registrado.</p>
                  ) : (
                    <div className="space-y-1">
                      {history.slice(0, 5).map((attempt) => (
                        <div key={attempt.id} className="flex items-center justify-between px-4 py-2 text-sm transition-colors hover:bg-slate-50">
                          <div className="flex flex-col font-mono">
                            <span className="font-bold">{attempt.wpm} WPM</span>
                            <span className="text-[10px] text-muted-foreground">{new Date(attempt.createdAt).toLocaleDateString()}</span>
                          </div>
                          <div className="text-right">
                            <span className="font-bold text-emerald-600">{formatPercentage(attempt.accuracy)}</span>
                            <div className="text-[10px]">{attempt.stars} ⭐</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              <div className="rounded-3xl bg-indigo-600 p-6 text-white shadow-xl">
                <p className="text-xs font-bold tracking-widest uppercase opacity-60">Objetivo Oro</p>
                <p className="mt-1 text-3xl font-black">{target.goldWpm} WPM</p>
                <p className="mt-4 text-sm leading-relaxed opacity-80">
                  La precisión es la clave de la velocidad. Mantén un ritmo estable.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function BigMetric({ label, value, color = "text-slate-900" }: { label: string; value: string; color?: string }) {
  return (
    <div className="space-y-1 font-mono">
      <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">{label}</p>
      <p className={`text-4xl font-black ${color}`}>{value}</p>
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
