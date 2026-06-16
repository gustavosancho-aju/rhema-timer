// Tipos e constantes client-safe da feature gravações (sem Drizzle/DB).
// Importável tanto por componentes de cliente quanto por código de servidor.

export type CultoTipo = "sozo" | "familia" | "quarta";

export type Direcionamento = "emotiva" | "reflexiva" | "biblica";

export interface LegendaJson {
  texto: string;
  direcionamento: Direcionamento;
  justificativa: string;
}

// Gravação como o cliente a recebe (createdAt vira string ISO no JSON).
export interface GravacaoCliente {
  id: string;
  cultoTipo: CultoTipo;
  legendas: LegendaJson[];
  escolhidaIdx: number | null;
  duracaoMs: number;
  createdAt: string;
}

export const CULTO_TIPOS: CultoTipo[] = ["sozo", "familia", "quarta"];

export const CULTO_LABELS: Record<CultoTipo, string> = {
  sozo: "Sozo",
  familia: "Culto da Família",
  quarta: "Culto de Quarta",
};

/** Type guard puro — valida o tipo de culto recebido. */
export function isCultoTipo(value: unknown): value is CultoTipo {
  return typeof value === "string" && CULTO_TIPOS.includes(value as CultoTipo);
}
