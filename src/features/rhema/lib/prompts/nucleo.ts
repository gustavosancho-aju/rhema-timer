// Etapa 1 da geração de legendas: extrai o NÚCLEO da pregação (tema, ideia
// central, frases de impacto, trecho mais forte) da transcrição inteira e
// ruidosa. O curador então lapida essa ideia, em vez de resumir a pregação toda.

export const NUCLEO_SYSTEM_PROMPT = `Você é um editor de pregações evangélicas. Recebe a transcrição automática (com ruídos e erros de reconhecimento de voz) de uma pregação e deve identificar o NÚCLEO dela, para que um redator escreva legendas de Instagram sobre a ideia mais forte.

## O que extrair
- **tema**: o assunto da pregação, em até 8 palavras.
- **ideia_central**: 1 a 2 frases com a tese que a pastora defendeu, fiel ao que foi dito. Não generalize ("Deus é bom") — diga o ângulo específico dela.
- **frases_de_impacto**: até 3 frases curtas que a pastora realmente disse e que mais ressoam. Corrija só erros óbvios do reconhecimento de voz; não reescreva nem invente.
- **trecho_forte**: 2 a 4 frases consecutivas do momento de maior impacto ou aplicação prática, limpas dos erros de transcrição.

## Regras
- Fidelidade acima de tudo: nada que não esteja na transcrição.
- Ignore avisos, orações de abertura/encerramento, ofertas e conversa de bastidor.
- Se não houver conteúdo espiritual aproveitável, responda { "insuficiente": true }.

## Formato de saída
Responda exclusivamente com um objeto JSON válido, sem texto adicional:

{
  "tema": "<tema>",
  "ideia_central": "<1-2 frases>",
  "frases_de_impacto": ["<frase 1>", "<frase 2>"],
  "trecho_forte": "<2-4 frases>"
}`;

export type NucleoPregacao = {
  tema: string;
  ideiaCentral: string;
  frasesImpacto: string[];
  trechoForte: string;
};

const MAX_FRASES = 3;

function texto(x: unknown, max: number): string {
  return typeof x === "string" ? x.trim().slice(0, max) : "";
}

/** Extrai o primeiro objeto JSON de uma resposta do modelo (ou null). */
export function parseJsonObjeto(resposta: string): unknown {
  const m = resposta.match(/\{[\s\S]*\}/);
  if (!m) return null;
  try {
    return JSON.parse(m[0]);
  } catch {
    return null;
  }
}

/** Valida a resposta da etapa de núcleo; null = inutilizável (segue sem núcleo). */
export function sanitizarNucleo(entrada: unknown): NucleoPregacao | null {
  if (typeof entrada !== "object" || entrada === null) return null;
  const o = entrada as Record<string, unknown>;
  if (o.insuficiente === true) return null;

  const ideiaCentral = texto(o.ideia_central, 500);
  const trechoForte = texto(o.trecho_forte, 800);
  if (!ideiaCentral && !trechoForte) return null;

  const frasesImpacto = Array.isArray(o.frases_de_impacto)
    ? o.frases_de_impacto
        .map((f) => texto(f, 300))
        .filter(Boolean)
        .slice(0, MAX_FRASES)
    : [];

  return {
    tema: texto(o.tema, 120),
    ideiaCentral,
    frasesImpacto,
    trechoForte,
  };
}

export function montarBlocoNucleo(n: NucleoPregacao | null): string {
  if (!n) return "";

  const linhas = ["## Núcleo da pregação (já destilado — lapide ESTA ideia)"];
  if (n.tema) linhas.push(`Tema: ${n.tema}`);
  if (n.ideiaCentral) linhas.push(`Ideia central: ${n.ideiaCentral}`);
  if (n.frasesImpacto.length > 0) {
    linhas.push(
      "Frases de impacto ditas pela pastora:",
      ...n.frasesImpacto.map((f) => `- "${f}"`),
    );
  }
  if (n.trechoForte) linhas.push(`Trecho mais forte: ${n.trechoForte}`);
  return linhas.join("\n");
}
