import type { Metadata } from "next";
import { Header } from "@/components/header";
import { Providers } from "@/components/providers";
import { Space_Grotesk, Manrope, JetBrains_Mono } from "next/font/google";
import "@/app/globals.css";
import { cn } from "@/lib/utils";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-sans",
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "KeySprint | Juego de mecanografía",
  description:
    "Practica mecanografía con niveles, tutoriales, estadísticas y progreso guardado.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={cn(spaceGrotesk.variable, manrope.variable, jetBrainsMono.variable)} data-scroll-behavior="smooth" suppressHydrationWarning>
      <body className="antialiased min-h-screen">
        <Providers>
          <Header />
          {children}
        </Providers>
      </body>
    </html>
  );
}

