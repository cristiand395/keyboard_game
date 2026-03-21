import Link from "next/link";
import { getAllTutorials } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function TutorialsPage() {
  const tutorials = getAllTutorials();

  return (
    <main className="shell space-y-8 pb-16">
      <section className="space-y-3">
        <Badge>tutoriales</Badge>
        <h1 className="text-4xl font-bold tracking-tight">Guia visual para construir una tecnica limpia</h1>
        <p className="max-w-2xl text-muted-foreground">
          Estas guias estan pensadas para teclado español y para reforzar postura, fila guia y control del ritmo.
        </p>
      </section>
      <div className="grid gap-5 lg:grid-cols-3">
        {tutorials.map((tutorial) => (
          <Card key={tutorial.slug}>
            <CardHeader>
              <Badge>{tutorial.eyebrow}</Badge>
              <CardTitle>{tutorial.title}</CardTitle>
              <CardDescription>{tutorial.summary}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link href={`/tutoriales/${tutorial.slug}`}>Abrir tutorial</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
}

