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

export const tutorials: TutorialPage[] = [
  {
    slug: "postura-correcta",
    eyebrow: "Base",
    title: "Postura correcta frente al teclado",
    summary:
      "Una base comoda evita tension y te ayuda a repetir movimientos rapidos con menos errores.",
    tips: [
      "Sientate con la espalda apoyada y los hombros relajados.",
      "Manten los codos cerca del cuerpo y en un angulo comodo.",
      "Situa la pantalla a la altura de los ojos para no inclinar el cuello.",
    ],
    drills: [
      "Respira y escribe una linea lenta sin despegar los hombros.",
      "Haz una pausa cada dos minutos para soltar munecas y dedos.",
    ],
  },
  {
    slug: "fila-guia",
    eyebrow: "Dedos",
    title: "La fila guia y la memoria muscular",
    summary:
      "Tus indices vuelven siempre a F y J. Desde ahi construyes velocidad con menos esfuerzo visual.",
    tips: [
      "Usa las marcas tactiles de F y J para regresar a la posicion base.",
      "No persigas las teclas con la vista; mira el texto y confia en la posicion.",
      "Cada dedo tiene una zona: evita cruzarlos salvo en casos muy concretos.",
    ],
    drills: [
      "Alterna asdf jklñ durante 60 segundos sin mirar el teclado.",
      "Escribe silabas cortas manteniendo siempre el retorno a la fila guia.",
    ],
  },
  {
    slug: "ritmo-y-precision",
    eyebrow: "Ritmo",
    title: "Ritmo antes que velocidad",
    summary:
      "Una cadencia estable te da precision y luego se convierte en velocidad real.",
    tips: [
      "Piensa en bloques de palabras, no en letras sueltas.",
      "Si fallas, reduce un poco el ritmo antes de volver a acelerar.",
      "La precision alta al principio crea una base mejor que ir demasiado rapido.",
    ],
    drills: [
      "Haz una pasada lenta buscando 98% de precision.",
      "Repite el mismo texto tres veces intentando mantener el mismo tempo.",
    ],
  },
];

export const levelSeeds: LevelSeed[] = [
  {
    slug: "fila-guia-1",
    trackSlug: "fundamentos",
    order: 1,
    title: "Fila guia I",
    description: "Activa la memoria base con letras centrales y ritmo uniforme.",
    body: "asdf jklñ asdf jklñ asa jkl asa jkl",
    minAccuracy: 92,
    bronzeWpm: 18,
    silverWpm: 28,
    goldWpm: 38,
    maxErrors: 8,
  },
  {
    slug: "palabras-cortas",
    trackSlug: "fundamentos",
    order: 2,
    title: "Palabras cortas",
    description: "Sube el ritmo manteniendo palabras faciles y controladas.",
    body: "casa sala lado dedo mesa dato rosa sopa luna",
    minAccuracy: 93,
    bronzeWpm: 20,
    silverWpm: 30,
    goldWpm: 40,
    maxErrors: 7,
  },
  {
    slug: "frases-fluidas",
    trackSlug: "fundamentos",
    order: 3,
    title: "Frases fluidas",
    description: "Conecta frases sencillas sin romper postura ni precision.",
    body: "la practica diaria mejora el ritmo y hace mas suave cada pulsacion",
    minAccuracy: 94,
    bronzeWpm: 22,
    silverWpm: 32,
    goldWpm: 44,
    maxErrors: 6,
  },
  {
    slug: "signos-y-espacios",
    trackSlug: "fundamentos",
    order: 4,
    title: "Signos y espacios",
    description: "Domina comas, puntos y pausas sin perder el compas.",
    body: "respira, escribe con calma, corrige poco y sigue el ritmo final.",
    minAccuracy: 95,
    bronzeWpm: 24,
    silverWpm: 34,
    goldWpm: 46,
    maxErrors: 6,
  },
];

