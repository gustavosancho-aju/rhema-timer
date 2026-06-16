import { and, desc, eq, isNotNull } from "drizzle-orm";
import { nanoid } from "nanoid";
import { getDb } from "@/shared/lib/db";
import {
  gravacoes,
  type Gravacao,
  type NewGravacao,
} from "./gravacoes-schema";
import type { CultoTipo, LegendaJson } from "./gravacoes-types";

// Re-export client-safe helpers para conveniência (rotas/server).
export { CULTO_LABELS, CULTO_TIPOS, isCultoTipo } from "./gravacoes-types";

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

/** Textos das legendas escolhidas mais recentes (acervo para few-shot). */
export async function getLegendasEscolhidas(limit = 6): Promise<string[]> {
  const rows = await getDb()
    .select()
    .from(gravacoes)
    .where(isNotNull(gravacoes.escolhidaIdx))
    .orderBy(desc(gravacoes.createdAt))
    .limit(limit);
  return rows
    .map((g) =>
      g.escolhidaIdx != null ? g.legendas[g.escolhidaIdx]?.texto : null,
    )
    .filter((t): t is string => Boolean(t && t.trim()));
}

/** Texto da legenda escolhida de uma gravação (ou undefined). */
export function textoEscolhido(g: Gravacao): string | undefined {
  if (g.escolhidaIdx == null) return undefined;
  return g.legendas[g.escolhidaIdx]?.texto;
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
