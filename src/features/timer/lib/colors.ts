export type TimerColor =
  | "white"
  | "red"
  | "green"
  | "blue"
  | "yellow"
  | "purple"
  | "pink"
  | "orange"
  | "teal"
  | "cyan"
  | "emerald"
  | "gray";

export const COLOR_MAP: Record<
  TimerColor,
  { dot: string; label: string }
> = {
  white: { dot: "bg-zinc-200", label: "Branco" },
  red: { dot: "bg-red-500", label: "Vermelho" },
  green: { dot: "bg-green-500", label: "Verde" },
  blue: { dot: "bg-blue-500", label: "Azul" },
  yellow: { dot: "bg-yellow-500", label: "Amarelo" },
  purple: { dot: "bg-purple-500", label: "Roxo" },
  pink: { dot: "bg-pink-500", label: "Rosa" },
  orange: { dot: "bg-orange-500", label: "Laranja" },
  teal: { dot: "bg-teal-500", label: "Teal" },
  cyan: { dot: "bg-cyan-500", label: "Ciano" },
  emerald: { dot: "bg-emerald-500", label: "Esmeralda" },
  gray: { dot: "bg-zinc-500", label: "Cinza" },
};

export const COLOR_LIST: TimerColor[] = Object.keys(COLOR_MAP) as TimerColor[];
