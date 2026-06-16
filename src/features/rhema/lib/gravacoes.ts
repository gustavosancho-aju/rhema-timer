import { and, desc, eq, isNotNull } from "drizzle-orm";
import { nanoid } from "nanoid";
import { getDb } from "@/shared/lib/db";
import {
  gravacoes,
  type CultoTipo,
  type Gravacao,
  type LegendaJson,
  type NewGravacao,
} from "./gravacoes-schema";

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

export async function listGravacoes(opts?: {
  cultoTipo?: CultoTipo;
  limit?: number;
}): Promise<Gravacao[]> {
  const limit = opts?.limit ?? 20;
  const where = opts?.cultoTipo
    ? eq(gravacoes.cultoTipo, opts.cultoTipo)
    : undefined;
  return getDb()
    .select()
    .from(gravacoes)
    .where(where)
    .orderBy(desc(gravacoes.createdAt))
    .limit(limit);
}

export async function createGravacao(input: {
  cultoTipo: CultoTipo;
  legendas: LegendaJson[];
  duracaoMs?: number;
  escolhidaIdx?: number | null;
}): Promise<Gravacao> {
  const data: NewGravacao = {
    id: nanoid(12),
    cultoTipo: input.cultoTipo,
    legendas: input.legendas,
    duracaoMs: input.duracaoMs ?? 0,
    escolhidaIdx: input.escolhidaIdx ?? null,
  };
  const [row] = await getDb().insert(gravacoes).values(data).returning();
  return row;
}

/** Marca qual legenda foi escolhida (ou null para limpar a escolha). */
export async function setEscolhida(
  id: string,
  escolhidaIdx: number | null,
): Promise<Gravacao | undefined> {
  const [row] = await getDb()
    .update(gravacoes)
    .set({ escolhidaIdx })
    .where(eq(gravacoes.id, id))
    .returning();
  return row;
}

/** Última gravação de um culto que já tem legenda escolhida (para o post final). */
export async function getUltimaEscolhida(
  cultoTipo: CultoTipo,
): Promise<Gravacao | undefined> {
  const rows = await getDb()
    .select()
    .from(gravacoes)
    .where(
      and(
        eq(gravacoes.cultoTipo, cultoTipo),
        isNotNull(gravacoes.escolhidaIdx),
      ),
    )
    .orderBy(desc(gravacoes.createdAt))
    .limit(1);
  return rows[0];
}
