import Link from "next/link";
import { LockKeyhole, Play } from "lucide-react";
import { getTracksWithLevels } from "@/lib/data";
import { getCachedSession } from "@/lib/auth";
import { getProgressForUser } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function PlayPage() {
  const [tracks, session] = await Promise.all([getTracksWithLevels(), getCachedSession()]);
  const progress = session?.user?.id ? await getProgressForUser(session.user.id) : [];
  const unlockedSlugs = new Set(progress.map((entry) => entry.levelSlug));

  return (
    <main className="shell space-y-8 pb-16">
      <section className="space-y-3">
        <Badge>niveles</Badge>
        <h1 className="text-4xl font-bold tracking-tight">Elige tu siguiente reto</h1>
        <p className="max-w-2xl text-muted-foreground">
          Los primeros niveles quedan accesibles en abierto. Cuando guardes resultados, el siguiente nivel se
          desbloquea automaticamente al superar el actual.
        </p>
      </section>

      {tracks.map((track) => (
        <Card key={track.id}>
          <CardHeader>
            <CardTitle>{track.title}</CardTitle>
            <CardDescription>{track.description}</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {track.levels.map((level, index) => {
              const isUnlocked =
                index === 0 || unlockedSlugs.has(level.slug) || unlockedSlugs.has(track.levels[index - 1]?.slug ?? "");

              return (
                <div key={level.id} className="rounded-[24px] border border-border bg-white/70 p-5">
                  <div className="flex items-center justify-between">
                    <Badge>Nivel {level.order}</Badge>
                    {isUnlocked ? <Play className="size-4 text-primary" /> : <LockKeyhole className="size-4 text-slate-400" />}
                  </div>
                  <h2 className="mt-4 text-xl font-semibold">{level.title}</h2>
                  <p className="mt-2 text-sm text-muted-foreground">{level.description}</p>
                  <p className="mt-4 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                    Accuracy {level.target.minAccuracy}% · Oro {level.target.goldWpm} WPM
                  </p>
                  <Button asChild className="mt-5 w-full" variant={isUnlocked ? "default" : "outline"}>
                    <Link href={`/retos/${level.slug}`}>{isUnlocked ? "Jugar nivel" : "Ver detalle"}</Link>
                  </Button>
                </div>
              );
            })}
          </CardContent>
        </Card>
      ))}
    </main>
  );
}
