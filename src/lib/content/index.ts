export type TutorialPage = {
  slug: string;
  title: string;
  eyebrow: string;
  summary: string;
  tips: string[];
  drills: string[];
};

export type LevelSeed = {
  slug: string;
  trackSlug: string;
  order: number;
  title: string;
  description: string;
  body: string;
  minAccuracy: number;
  bronzeWpm: number;
  silverWpm: number;
  goldWpm: number;
  maxErrors: number;
};

export type TrackSeed = {
  slug: string;
  title: string;
  description: string;
  order: number;
  isPublished: boolean;
};

import { fundamentosLevels } from "./fundamentos";
import { filaSuperiorLevels } from "./fila-superior-e-inferior";
import { mayusculasLevels } from "./mayusculas-y-shift";
import { tildesLevels } from "./tildes-y-acentos";
import { puntuacionLevels } from "./puntuacion-avanzada";
import { numerosLevels } from "./numeros-y-simbolos";
import { palabrasLargasLevels } from "./palabras-largas";
import { velocidadLevels } from "./velocidad-y-resistencia";
import { programacionLevels } from "./programacion";
import { textosRealesLevels } from "./textos-reales";
export { tutorials } from "./tutorials";

export const trackSeeds: TrackSeed[] = [
  {
    slug: "fundamentos",
    title: "Fundamentos",
    description: "Base técnica para ganar precisión, ritmo y soltura desde cero.",
    order: 1,
    isPublished: true,
  },
  {
    slug: "fila-superior-e-inferior",
    title: "Fila Superior e Inferior",
    description: "Extiende el dominio a las filas de arriba y abajo del teclado.",
    order: 2,
    isPublished: true,
  },
  {
    slug: "mayusculas-y-shift",
    title: "Mayúsculas y Shift",
    description: "Domina la combinación de Shift con todas las letras para escribir con soltura.",
    order: 3,
    isPublished: true,
  },
  {
    slug: "tildes-y-acentos",
    title: "Tildes y Acentos",
    description: "Entrena la acentuación correcta del español con palabras y frases que exigen precisión ortográfica.",
    order: 4,
    isPublished: true,
  },
  {
    slug: "puntuacion-avanzada",
    title: "Puntuación Avanzada",
    description: "Signos de interrogación, exclamación, comillas, paréntesis y demás signos del español.",
    order: 5,
    isPublished: true,
  },
  {
    slug: "numeros-y-simbolos",
    title: "Números y Símbolos",
    description: "Domina la fila de números y los símbolos asociados con Shift.",
    order: 6,
    isPublished: true,
  },
  {
    slug: "palabras-largas-y-vocabulario",
    title: "Palabras Largas y Vocabulario",
    description: "Practica con vocabulario extenso, palabras compuestas y refranes del español.",
    order: 7,
    isPublished: true,
  },
  {
    slug: "velocidad-y-resistencia",
    title: "Velocidad y Resistencia",
    description: "Textos largos y exigentes para desarrollar resistencia y velocidad sostenida.",
    order: 8,
    isPublished: true,
  },
  {
    slug: "programacion",
    title: "Programación",
    description: "Sintaxis de código: llaves, corchetes, operadores y estructuras comunes.",
    order: 9,
    isPublished: true,
  },
  {
    slug: "textos-reales",
    title: "Textos Reales",
    description: "Fragmentos literarios, periodísticos y técnicos del mundo real en español.",
    order: 10,
    isPublished: true,
  },
];

export const levelSeeds: LevelSeed[] = [
  ...fundamentosLevels,
  ...filaSuperiorLevels,
  ...mayusculasLevels,
  ...tildesLevels,
  ...puntuacionLevels,
  ...numerosLevels,
  ...palabrasLargasLevels,
  ...velocidadLevels,
  ...programacionLevels,
  ...textosRealesLevels,
];
