import { redirect } from "next/navigation";
import { LoginForm, RegisterForm } from "@/components/auth-forms";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getCachedSession } from "@/lib/auth";

export default async function SignInPage() {
  const session = await getCachedSession();

  if (session?.user) {
    redirect("/progreso");
  }

  return (
    <main className="shell pb-16">
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Crea tu cuenta</CardTitle>
            <CardDescription>Guarda estrellas, mejores tiempos y niveles completados.</CardDescription>
          </CardHeader>
          <CardContent>
            <RegisterForm />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Accede</CardTitle>
            <CardDescription>Retoma tu progreso donde lo dejaste.</CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

