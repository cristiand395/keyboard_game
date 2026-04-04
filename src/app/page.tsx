import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight, ChartNoAxesCombined, Flame, Trophy } from "lucide-react";
import { getTracksWithLevels } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function HomePage() {
  const tracks = await getTracksWithLevels();
  const totalLevels = tracks.reduce((sum, track) => sum + track.levels.length, 0);

  return (
    <main className="shell pb-16">
      <section className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
        <div className="animate-rise space-y-6">
          <Badge>juego de mecanografia para pc</Badge>
          <h1 className="max-w-3xl text-5xl font-bold tracking-tight text-slate-950 md:text-6xl">
            Mecanografia con tutoriales, niveles y progreso real desde la primera sesion
          </h1>
          <p className="max-w-2xl text-lg text-muted-foreground">
            KeySprint mezcla practica guiada, postura correcta, estrellas y estadisticas para ayudarte a
            construir una tecnica limpia antes de buscar velocidad.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href="/retos">
                Empezar a jugar
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/tutoriales">Ver tutoriales</Link>
            </Button>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <Stat value={`${totalLevels}+`} label="niveles iniciales" />
            <Stat value="3" label="tutoriales guiados" />
            <Stat value="100%" label="centrado en teclado fisico" />
          </div>
        </div>
        <Card className="relative overflow-hidden">
          <CardContent className="space-y-4 p-8">
            <div className="absolute inset-x-10 top-6 h-32 rounded-full bg-cyan-200/40 blur-3xl" />
            <div className="relative rounded-[28px] border border-slate-200 bg-slate-950 p-6 text-slate-100">
              <div className="mb-6 flex gap-2">
                <span className="size-3 rounded-full bg-rose-400" />
                <span className="size-3 rounded-full bg-amber-300" />
                <span className="size-3 rounded-full bg-emerald-400" />
              </div>
              <p className="text-sm text-slate-400">Modo sesion</p>
              <p className="mt-4 font-mono text-xl leading-9 text-cyan-100">la practica diaria mejora el ritmo</p>
              <div className="mt-6 grid grid-cols-3 gap-3">
                <MiniMetric label="WPM" value="36" />
                <MiniMetric label="ACC" value="97%" />
                <MiniMetric label="Estrellas" value="2" />
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <Feature icon={<Flame className="size-5" />} title="Ritmo limpio" text="Feedback inmediato y medible." />
              <Feature
                icon={<ChartNoAxesCombined className="size-5" />}
                title="Progreso"
                text="Seguimiento de mejores marcas y precision."
              />
              <Feature icon={<Trophy className="size-5" />} title="Estrellas" text="Desbloqueo progresivo por nivel." />
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-[24px] border border-white/70 bg-white/70 p-4">
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
}

function MiniMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white/5 p-3">
      <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{label}</p>
      <p className="mt-1 text-lg font-semibold text-white">{value}</p>
    </div>
  );
}

function Feature({
  icon,
  title,
  text,
}: {
  icon: ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-[24px] border border-border bg-white/70 p-4">
      <div className="mb-2 inline-flex size-10 items-center justify-center rounded-2xl bg-secondary text-primary">
        {icon}
      </div>
      <p className="font-semibold">{title}</p>
      <p className="mt-1 text-sm text-muted-foreground">{text}</p>
    </div>
  );
}
