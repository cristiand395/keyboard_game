import Link from "next/link";
import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getCachedSession } from "@/lib/auth";
import { getDashboardSummary, getProgressForUser } from "@/lib/data";
import { formatPercentage } from "@/lib/utils";

export default async function ProgressPage() {
  const session = await getCachedSession();

  if (!session?.user?.id) {
    redirect("/acceder");
  }

  const [summary, progress] = await Promise.all([
    getDashboardSummary(session.user.id),
    getProgressForUser(session.user.id),
  ]);

  return (
    <main className="shell space-y-8 pb-16">
      <section className="space-y-3">
        <Badge>dashboard</Badge>
        <h1 className="text-4xl font-bold tracking-tight">Tu progreso</h1>
        <p className="max-w-2xl text-muted-foreground">
          Aqui ves tus mejores marcas, niveles completados y la traccion que llevas en el MVP.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <DashboardMetric label="Niveles completados" value={String(summary.completedLevels)} />
        <DashboardMetric label="Estrellas totales" value={String(summary.totalStars)} />
        <DashboardMetric label="Mejor WPM" value={String(summary.bestWpm)} />
        <DashboardMetric label="Mejor precision" value={formatPercentage(summary.bestAccuracy)} />
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Resumen por nivel</CardTitle>
          <CardDescription>Tu mejor resultado consolidado vive aqui.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {progress.length === 0 ? (
            <div className="rounded-[24px] border border-dashed border-border bg-white/50 p-6">
              <p className="text-muted-foreground">Todavia no hay niveles guardados. Vamos a por el primero.</p>
              <Button asChild className="mt-4">
                <Link href="/jugar">Jugar ahora</Link>
              </Button>
            </div>
          ) : (
            progress.map((entry) => (
              <div
                key={entry.levelSlug}
                className="grid gap-3 rounded-[24px] border border-border bg-white/70 p-4 md:grid-cols-[1.4fr_0.6fr_0.6fr_0.6fr_auto]"
              >
                <div>
                  <p className="font-semibold">{entry.title}</p>
                  <p className="text-sm text-muted-foreground">Nivel {entry.order}</p>
                </div>
                <MetricItem label="WPM" value={String(entry.bestWpm)} />
                <MetricItem label="Accuracy" value={formatPercentage(entry.bestAccuracy)} />
                <MetricItem label="Stars" value={String(entry.bestStars)} />
                <Button asChild variant="outline">
                  <Link href={`/jugar/${entry.levelSlug}`}>Reintentar</Link>
                </Button>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </main>
  );
}

function DashboardMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[24px] border border-border bg-white/70 p-5">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-3 text-3xl font-semibold tracking-tight">{value}</p>
    </div>
  );
}

function MetricItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{label}</p>
      <p className="mt-2 text-lg font-semibold">{value}</p>
    </div>
  );
}

