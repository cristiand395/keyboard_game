import Link from "next/link";
import { LockKeyhole, Play, Star } from "lucide-react";
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

              const lp = progress.find((p) => p.levelSlug === level.slug);

              return (
                <div key={level.id} className="group relative flex flex-col rounded-[32px] border border-border bg-white/50 p-6 transition-all hover:bg-white hover:shadow-xl">
                  <div className="flex items-center justify-between">
                    <Badge className="rounded-full px-3 py-1 font-mono text-[10px] tracking-widest uppercase">Nivel {level.order}</Badge>
                    {isUnlocked ? <Play className="size-4 text-primary" /> : <LockKeyhole className="size-4 text-slate-300" />}
                  </div>
                  <h2 className="mt-5 text-xl font-bold tracking-tight text-slate-900">{level.title}</h2>
                  <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-slate-500">{level.description}</p>
                  
                  <div className="mt-8 flex h-10 items-center justify-between border-t border-slate-50 pt-4">
                    {lp ? (
                      <>
                        <div className="flex gap-1">
                          {[1, 2, 3].map((s) => (
                            <Star
                              key={s}
                              className={`size-4 ${
                                s <= (lp.bestStars ?? 0) 
                                  ? "fill-amber-400 text-amber-400" 
                                  : "fill-slate-100 text-slate-200"
                              }`}
                            />
                          ))}
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] tracking-tighter text-slate-300 uppercase">Mejor puntaje</p>
                          <p className="text-sm font-bold text-slate-700">
                            {lp.bestWpm} WPM · {lp.bestAccuracy}%
                          </p>
                        </div>
                      </>
                    ) : (
                      // Espacio vacío si no hay progreso recorded
                      <div className="flex w-full items-center justify-between opacity-50">
                        <div className="flex gap-1">
                           {[1, 2, 3].map(s => <Star key={s} className="size-4 fill-slate-50 text-slate-100" />)}
                        </div>
                        <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Sin intentos</p>
                      </div>
                    )}
                  </div>

                  <Button asChild className="mt-6 w-full rounded-2xl font-bold" variant={isUnlocked ? "default" : "outline"}>
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
