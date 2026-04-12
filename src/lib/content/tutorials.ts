import type { TutorialPage } from "./index";

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
