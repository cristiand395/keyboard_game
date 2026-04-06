import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { getTutorialBySlug } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function TutorialDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tutorial = getTutorialBySlug(slug);

  if (!tutorial) {
    notFound();
  }

  return (
    <main className="shell pb-16">
      <Card className="overflow-hidden">
        <CardHeader className="gap-4 border-b border-border/70 bg-slate-50/70">
          <Badge className="font-mono text-primary bg-primary/10 border border-primary/20 tracking-widest leading-none">{tutorial.eyebrow}</Badge>
          <CardTitle className="text-4xl">{tutorial.title}</CardTitle>
          <p className="max-w-3xl text-muted-foreground">{tutorial.summary}</p>
        </CardHeader>
        <CardContent className="grid gap-8 p-8 lg:grid-cols-[1fr_0.9fr]">
          <section>
            <h2 className="text-2xl font-semibold">Puntos clave</h2>
            <ul className="mt-4 space-y-3">
              {tutorial.tips.map((tip) => (
                <li key={tip} className="rounded-[20px] border border-border bg-white/80 p-4 text-muted-foreground">
                  {tip}
                </li>
              ))}
            </ul>
          </section>
          <section className="space-y-6">
            <div className="rounded-[28px] bg-slate-950 p-6 text-white">
              <p className="text-sm uppercase tracking-[0.24em] text-cyan-200">ejercicios recomendados</p>
              <ul className="mt-4 space-y-3 text-sm text-slate-200">
                {tutorial.drills.map((drill) => (
                  <li key={drill}>{drill}</li>
                ))}
              </ul>
            </div>
            <Button asChild size="lg">
              <Link href="/retos">
                Ir a practicar
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </section>
        </CardContent>
      </Card>
    </main>
  );
}

