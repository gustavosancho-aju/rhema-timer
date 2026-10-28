import type { VersiculoDetectado } from "@/shared/types";

// Versículos já verificados pelo detector bíblico, repassados ao curador para
// a legenda "bíblica" não depender de adivinhar a referência de novo.

export type VersiculoContexto = Pick<
  VersiculoDetectado,
  | "livro"
  | "capitulo"
  | "versiculo_inicio"
  | "versiculo_fim"
  | "texto_sugerido"
  | "confianca"
  | "tipo"
>;

export const MAX_VERSICULOS = 3;
const MAX_LIVRO = 40;
const MAX_TEXTO = 600;

export function formatarReferencia(v: VersiculoContexto): string {
  const fim = v.versiculo_fim !== v.versiculo_inicio ? `-${v.versiculo_fim}` : "";
  return `${v.livro} ${v.capitulo}:${v.versiculo_inicio}${fim}`;
}

function inteiroPositivo(x: unknown): number | null {
  return typeof x === "number" && Number.isInteger(x) && x > 0 ? x : null;
}

/**
 * Valida e normaliza o que o navegador enviou: o corpo da requisição é entrada
 * não confiável. Descarta itens malformados, remove duplicatas, prioriza
 * citação direta e maior confiança, e limita a MAX_VERSICULOS.
 */
export function sanitizarVersiculos(entrada: unknown): VersiculoContexto[] {
  if (!Array.isArray(entrada)) return [];

  const vistos = new Set<string>();
  const validos: VersiculoContexto[] = [];

  for (const item of entrada) {
    if (typeof item !== "object" || item === null) continue;
    const o = item as Record<string, unknown>;

    const livro = typeof o.livro === "string" ? o.livro.trim().slice(0, MAX_LIVRO) : "";
    const texto =
      typeof o.texto_sugerido === "string" ? o.texto_sugerido.trim().slice(0, MAX_TEXTO) : "";
    const capitulo = inteiroPositivo(o.capitulo);
    const inicio = inteiroPositivo(o.versiculo_inicio);
    const fim = inteiroPositivo(o.versiculo_fim);
    const confianca = typeof o.confianca === "number" ? o.confianca : NaN;
    const tipo = o.tipo === "citacao_direta" || o.tipo === "alusao" ? o.tipo : null;

    if (!livro || !texto || !capitulo || !inicio || !fim || !tipo) continue;
    if (!(confianca >= 0 && confianca <= 1)) continue;

    const v: VersiculoContexto = {
      livro,
      capitulo,
      versiculo_inicio: inicio,
      versiculo_fim: Math.max(fim, inicio),
      texto_sugerido: texto,
      confianca,
      tipo,
    };

    const ref = formatarReferencia(v);
    if (vistos.has(ref)) continue;
    vistos.add(ref);
    validos.push(v);
  }

  return validos
    .sort((a, b) => {
      if (a.tipo !== b.tipo) return a.tipo === "citacao_direta" ? -1 : 1;
      return b.confianca - a.confianca;
    })
    .slice(0, MAX_VERSICULOS);
}

/** Bloco do prompt do usuário com os versículos (ou a regra de não inventar). */
export function montarBlocoVersiculos(versiculos: VersiculoContexto[]): string {
  if (versiculos.length === 0) {
    return `## Versículos
Nenhum versículo foi detectado automaticamente nesta pregação. Só cite referência bíblica (livro, capítulo, versículo) se a pastora a disser de forma explícita na transcrição — nunca invente. Sem referência segura, ancore a legenda "bíblica" no princípio ou na figura bíblica que ela mencionou, sem número de versículo.`;
  }

  const lista = versiculos
    .map((v) => {
      const tipo = v.tipo === "citacao_direta" ? "citação direta" : "alusão";
      const pct = Math.round(v.confianca * 100);
      return `- ${formatarReferencia(v)} (${tipo}, confiança ${pct}%): "${v.texto_sugerido}"`;
    })
    .join("\n");

  return `## Versículos citados na pregação (verificados pelo detector bíblico)
${lista}

Regras para a legenda "bíblica":
- Ancore-a em UM destes versículos, com a referência exata e o texto exatamente como está acima (não reescreva nem "corrija" a redação).
- Não cite nenhum outro versículo além dos listados ou dos que a pastora disse de forma explícita.`;
}
