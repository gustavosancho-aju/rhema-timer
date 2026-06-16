// Histórico das últimas gravações (apenas as legendas geradas).
// Persistido em localStorage, limitado às MAX_GRAVACOES mais recentes.

export type Direcionamento = "emotiva" | "reflexiva" | "biblica";

export interface Legenda {
  texto: string;
  direcionamento: Direcionamento;
  justificativa: string;
}

export interface GravacaoSalva {
  id: string;
  salvaEm: number; // timestamp (Date.now)
  duracaoMs: number; // duração da gravação
  legendas: Legenda[];
}

export const STORAGE_KEY = "rhema.gravacoes";
export const MAX_GRAVACOES = 4;

/**
 * Adiciona uma gravação ao histórico (função pura). A mais recente fica no
 * topo e o histórico nunca passa de MAX_GRAVACOES — as mais antigas saem.
 */
export function adicionarGravacao(
  historico: GravacaoSalva[],
  nova: GravacaoSalva,
): GravacaoSalva[] {
  return [nova, ...historico].slice(0, MAX_GRAVACOES);
}

/** Lê e valida o histórico do localStorage (seguro no servidor/SSR). */
export function carregarHistorico(): GravacaoSalva[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter(
        (g): g is GravacaoSalva =>
          g &&
          typeof g.id === "string" &&
          typeof g.salvaEm === "number" &&
          Array.isArray(g.legendas),
      )
      .slice(0, MAX_GRAVACOES);
  } catch {
    return [];
  }
}

/** Grava o histórico no localStorage (já aplicando o limite). */
export function salvarHistorico(historico: GravacaoSalva[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(historico.slice(0, MAX_GRAVACOES)),
    );
  } catch {
    /* localStorage cheio ou indisponível — ignora */
  }
}
