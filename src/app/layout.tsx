import type { Metadata } from "next";
import { Header } from "@/components/header";
import { Providers } from "@/components/providers";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "KeySprint | Juego de mecanografia",
  description:
    "Practica mecanografia con niveles, tutoriales, estadisticas y progreso guardado.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" data-scroll-behavior="smooth">
      <body>
        <Providers>
          <Header />
          {children}
        </Providers>
      </body>
    </html>
  );
}

