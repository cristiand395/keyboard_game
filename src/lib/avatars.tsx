import type { SVGProps } from "react";

type SvgProps = SVGProps<SVGSVGElement>;

const base: SvgProps = {
  viewBox: "0 0 40 40",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "1.5",
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

function Core(props: SvgProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="20" cy="20" r="16" />
      <circle cx="20" cy="20" r="5" />
      <line x1="20" y1="4" x2="20" y2="15" />
      <line x1="20" y1="25" x2="20" y2="36" />
      <line x1="4" y1="20" x2="15" y2="20" />
      <line x1="25" y1="20" x2="36" y2="20" />
    </svg>
  );
}

function Bot(props: SvgProps) {
  return (
    <svg {...base} {...props}>
      <rect x="7" y="13" width="26" height="20" rx="3" />
      <rect x="12" y="18" width="5" height="5" rx="1" />
      <rect x="23" y="18" width="5" height="5" rx="1" />
      <line x1="14" y1="28" x2="26" y2="28" />
      <line x1="20" y1="7" x2="20" y2="13" />
      <circle cx="20" cy="6" r="2" />
    </svg>
  );
}

function Ghost(props: SvgProps) {
  return (
    <svg {...base} {...props}>
      <path d="M9 23 Q9 7 20 7 Q31 7 31 23 L31 33 Q28 30 25 33 Q22 30 20 33 Q18 30 15 33 Q12 30 9 33 Z" />
      <circle cx="15" cy="19" r="2.5" fill="currentColor" stroke="none" />
      <circle cx="25" cy="19" r="2.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

function Visor(props: SvgProps) {
  return (
    <svg {...base} {...props}>
      <path d="M8 28 Q8 7 20 7 Q32 7 32 28 L32 32 Q26 35 20 35 Q14 35 8 32 Z" />
      <line x1="8" y1="20" x2="32" y2="20" />
    </svg>
  );
}

function Ring(props: SvgProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="20" cy="20" r="16" />
      <circle cx="20" cy="20" r="10" />
      <circle cx="20" cy="20" r="4" />
    </svg>
  );
}

function Hex(props: SvgProps) {
  return (
    <svg {...base} {...props}>
      <polygon points="36,20 28,34 12,34 4,20 12,6 28,6" />
      <circle cx="15" cy="19" r="2.5" fill="currentColor" stroke="none" />
      <circle cx="25" cy="19" r="2.5" fill="currentColor" stroke="none" />
      <line x1="15" y1="26" x2="25" y2="26" />
    </svg>
  );
}

function Pixel(props: SvgProps) {
  return (
    <svg {...base} {...props}>
      <rect x="5" y="5" width="30" height="30" rx="2" />
      <rect x="10" y="13" width="7" height="6" fill="currentColor" stroke="none" />
      <rect x="23" y="13" width="7" height="6" fill="currentColor" stroke="none" />
      <rect x="10" y="23" width="20" height="5" fill="currentColor" stroke="none" />
    </svg>
  );
}

function Nova(props: SvgProps) {
  return (
    <svg {...base} {...props}>
      <polygon points="20,4 24,13 34,12 28,20 34,28 24,27 20,36 16,27 6,28 12,20 6,12 16,13" />
    </svg>
  );
}

function Mask(props: SvgProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="20" cy="20" r="16" />
      <rect x="4" y="15" width="32" height="10" rx="2" />
    </svg>
  );
}

function Cipher(props: SvgProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="20" cy="20" r="16" />
      <polyline points="15,13 9,20 15,27" />
      <polyline points="25,13 31,20 25,27" />
    </svg>
  );
}

function Void(props: SvgProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="20" cy="20" r="16" />
      <circle cx="20" cy="20" r="4" />
      <line x1="11" y1="29" x2="29" y2="11" />
    </svg>
  );
}

function Grid(props: SvgProps) {
  return (
    <svg {...base} {...props}>
      <rect x="5" y="5" width="30" height="30" rx="2" />
      <line x1="5" y1="15" x2="35" y2="15" />
      <line x1="5" y1="25" x2="35" y2="25" />
      <line x1="15" y1="5" x2="15" y2="35" />
      <line x1="25" y1="5" x2="25" y2="35" />
      <rect x="6" y="6" width="8" height="8" fill="currentColor" stroke="none" />
      <rect x="26" y="6" width="8" height="8" fill="currentColor" stroke="none" />
      <rect x="16" y="26" width="8" height="8" fill="currentColor" stroke="none" />
    </svg>
  );
}

export interface AvatarDef {
  id: string;
  name: string;
  component: (props: SvgProps) => React.ReactElement;
}

export const AVATARS: AvatarDef[] = [
  { id: "core",   name: "Core",   component: Core   },
  { id: "bot",    name: "Bot",    component: Bot    },
  { id: "ghost",  name: "Ghost",  component: Ghost  },
  { id: "visor",  name: "Visor",  component: Visor  },
  { id: "ring",   name: "Ring",   component: Ring   },
  { id: "hex",    name: "Hex",    component: Hex    },
  { id: "pixel",  name: "Pixel",  component: Pixel  },
  { id: "nova",   name: "Nova",   component: Nova   },
  { id: "mask",   name: "Mask",   component: Mask   },
  { id: "cipher", name: "Cipher", component: Cipher },
  { id: "void",   name: "Void",   component: Void   },
  { id: "grid",   name: "Grid",   component: Grid   },
];

export function getAvatar(id: string | null | undefined): AvatarDef {
  return AVATARS.find((a) => a.id === id) ?? AVATARS[0];
}
