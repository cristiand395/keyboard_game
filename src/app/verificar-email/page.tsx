"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { verifyEmailAction } from "@/app/actions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("Verificando tu cuenta...");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Falta el token de verificación.");
      return;
    }

    async function verify() {
      const result = await verifyEmailAction(token as string);
      if (result.ok) {
        setStatus("success");
      } else {
        setStatus("error");
      }
      setMessage(result.message ?? "Hubo un problema con la verificación.");
    }

    verify();
  }, [token]);

  return (
    <main className="flex min-h-[80vh] items-center justify-center p-6">
      <Card className="w-full max-w-md border-none shadow-2xl">
        <CardHeader className="text-center">
          <div className="flex justify-center pb-4">
            {status === "loading" && <Loader2 className="size-12 animate-spin text-indigo-500" />}
            {status === "success" && <CheckCircle2 className="size-12 text-emerald-500" />}
            {status === "error" && <XCircle className="size-12 text-rose-500" />}
          </div>
          <CardTitle className="text-2xl">
            {status === "loading" ? "Verificando..." : status === "success" ? "¡Verificado!" : "Error"}
          </CardTitle>
          <CardDescription className="text-lg mt-2">{message}</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center pt-4">
          <Button asChild size="lg" className="px-8">
            <Link href="/acceder">Ir al inicio de sesión</Link>
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
