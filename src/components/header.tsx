import Link from "next/link";
import { getCachedSession } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import { UserMenu } from "@/components/user-menu";

export async function Header() {
  const session = await getCachedSession();

  return (
    <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md">
      <div className="shell flex items-center justify-between gap-4 py-4">
        <Logo />
        <nav className="hidden items-center gap-6 md:flex">
          <Link
            href="/"
            className="font-display text-sm font-bold uppercase tracking-tight text-primary border-b-2 border-primary pb-0.5 transition-colors"
          >
            Inicio
          </Link>
          <Link
            href="/retos"
            className="font-display text-sm font-bold uppercase tracking-tight text-muted-foreground hover:text-primary transition-colors"
          >
            Retos
          </Link>
          <Link
            href="/tutoriales"
            className="font-display text-sm font-bold uppercase tracking-tight text-muted-foreground hover:text-primary transition-colors"
          >
            Tutoriales
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          {session?.user ? (
            <UserMenu user={session.user} />
          ) : (
            <Button asChild size="sm" className="neon-gradient font-display uppercase tracking-widest text-xs font-bold px-6 border-none text-primary-foreground shadow-[0_0_15px_rgba(161,250,255,0.3)] hover:shadow-[0_0_20px_rgba(161,250,255,0.5)] active:scale-95 transition-all">
              <Link href="/acceder">Iniciar sesión</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}

