import Link from "next/link";
import { getCachedSession, signOut } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";

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
          <Button asChild variant="ghost" size="sm">
            <Link href="/progreso">Progreso</Link>
          </Button>
        </nav>
        <div className="flex items-center gap-3">
          {session?.user ? (
            <>
              <div className="hidden text-right sm:block">
                <p className="text-sm font-semibold">{session.user.name ?? session.user.email}</p>
              </div>
              <form
                action={async () => {
                  "use server";
                  await signOut({ redirectTo: "/" });
                }}
              >
                <Button size="sm" variant="outline" type="submit">
                  Salir
                </Button>
              </form>
            </>
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

