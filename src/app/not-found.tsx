import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="shell pb-16">
      <div className="panel mx-auto max-w-2xl p-10 text-center">
        <p className="text-sm uppercase tracking-[0.24em] text-muted-foreground">404</p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight">La ruta no existe</h1>
        <p className="mt-4 text-muted-foreground">
          Puede que el contenido se haya movido o que el nivel aun no este publicado.
        </p>
        <Button asChild className="mt-6">
          <Link href="/">Volver al inicio</Link>
        </Button>
      </div>
    </main>
  );
}

