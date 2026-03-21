"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
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

function renderTargetText(targetText: string, typedText: string) {
  return targetText.split("").map((char, index) => {
    let className = "text-slate-400";
    if (typedText[index] === undefined) {
      className = "text-slate-400";
    } else if (typedText[index] === char) {
      className = "text-emerald-600";
    } else {
      className = "bg-rose-100 text-rose-700";
    }

    return (
      <span key={`${char}-${index}`} className={className}>
        {char}
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
  const [isPending, startTransition] = useTransition();

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

  const progress = useMemo(() => {
    return targetText.length === 0 ? 0 : Math.min(100, (typedText.length / targetText.length) * 100);
  }, [targetText.length, typedText.length]);

  const currentMetrics = useMemo(() => {
    if (!startedAt) {
      return null;
    }

    return buildLevelResult(levelSlug, targetText, typedText, elapsedPreviewMs, target);
  }, [elapsedPreviewMs, levelSlug, startedAt, target, targetText, typedText]);

  return (
    <div className="grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
      <Card className="overflow-hidden">
        <CardHeader>
          <div className="flex flex-wrap items-center gap-3">
            <Badge>{title}</Badge>
            <span className="text-sm text-muted-foreground">{description}</span>
          </div>
          <CardTitle className="text-3xl">Entra en ritmo y termina el texto sin mirar el teclado</CardTitle>
          <CardDescription>
            El resultado final se calcula en cliente y, si tienes cuenta, se guarda con una Server Action.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="soft-grid rounded-[24px] border border-border/70 bg-slate-50/90 p-6 text-xl leading-9 tracking-wide">
            {renderTargetText(targetText, typedText)}
          </div>
          <Progress value={progress} />
          <textarea
            className="min-h-40 w-full rounded-[24px] border border-border bg-white/90 p-4 text-base outline-none transition focus-visible:ring-2 focus-visible:ring-ring"
            value={typedText}
            placeholder="Empieza a escribir aqui..."
            onChange={(event) => {
              if (!startedAt) {
                const startedNow = Date.now();
                setStartedAt(startedNow);
                setElapsedPreviewMs(0);
              }

              const nextValue = event.target.value;
              setTypedText(nextValue);

              if (nextValue.trim().length >= targetText.trim().length && startedAt) {
                const elapsedMs = Date.now() - startedAt;
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
          />
          <div className="flex flex-wrap gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setTypedText("");
                setStartedAt(null);
                setElapsedPreviewMs(0);
                setFinishedResult(null);
                setServerMessage(null);
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

      <Card>
        <CardHeader>
          <CardTitle>Panel del intento</CardTitle>
          <CardDescription>Precision antes que velocidad. El oro llega cuando el ritmo se vuelve estable.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid grid-cols-2 gap-3">
            <Metric label="Precision" value={formatPercentage((finishedResult ?? currentMetrics)?.accuracy ?? 0)} />
            <Metric label="WPM" value={String((finishedResult ?? currentMetrics)?.wpm ?? 0)} />
            <Metric label="Errores" value={String((finishedResult ?? currentMetrics)?.errorCount ?? 0)} />
            <Metric label="Tiempo" value={formatDuration((finishedResult ?? currentMetrics)?.elapsedMs ?? 0)} />
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
          {finishedResult ? (
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
          ) : null}
          {serverMessage ? <p className="text-sm text-muted-foreground">{serverMessage}</p> : null}
          {isPending ? <p className="text-sm text-muted-foreground">Guardando resultado...</p> : null}
        </CardContent>
      </Card>
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
