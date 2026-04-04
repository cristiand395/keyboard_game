import Link from "next/link";
import { getCachedSession, signOut } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import { UserMenu } from "@/components/user-menu";

export async function Header() {
  const session = await getCachedSession();

  return (
    <header className="shell py-5">
      <div className="panel flex items-center justify-between gap-4 px-5 py-4">
        <Logo />
        <nav className="hidden items-center gap-2 md:flex">
          <Button asChild variant="ghost" size="sm">
            <Link href="/">Inicio</Link>
          </Button>
          <Button asChild variant="ghost" size="sm">
            <Link href="/retos">Retos</Link>
          </Button>
          <Button asChild variant="ghost" size="sm">
            <Link href="/tutoriales">Tutoriales</Link>
          </Button>
        </nav>
        <div className="flex items-center gap-3">
          {session?.user ? (
            <UserMenu user={session.user} />
          ) : (
            <Button asChild size="sm">
              <Link href="/acceder">Iniciar sesión</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}

