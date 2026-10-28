// Monta um bloco de exemplos para ensinar o estilo ao curador (aprendizado
// few-shot a partir das escolhas do líder): legendas aprovadas e, como
// contraste, as que ele preteriu no mesmo par.

const MAX_EXEMPLOS = 6;
const MAX_CONTRASTES = 3;

export type GravacaoParaExemplo = {
  legendas: { texto: string }[];
  escolhidaIdx: number | null;
};

export type ExemplosFewShot = {
  aprovadas: string[];
  preteridas: string[];
};

/**
 * Separa, das gravações mais recentes, o texto escolhido (aprovada) e os
 * textos das outras opções do mesmo par (preteridas). Espera as gravações da
 * mais recente para a mais antiga.
 */
export function extrairExemplosFewShot(
  gravacoes: GravacaoParaExemplo[],
): ExemplosFewShot {
  const aprovadas: string[] = [];
  const preteridas: string[] = [];

  for (const g of gravacoes) {
    if (g.escolhidaIdx == null) continue;
    const escolhida = g.legendas[g.escolhidaIdx]?.texto?.trim();
    if (!escolhida) continue;
    aprovadas.push(escolhida);

    g.legendas.forEach((l, i) => {
      const t = l.texto?.trim();
      if (i !== g.escolhidaIdx && t) preteridas.push(t);
    });
  }

  return { aprovadas, preteridas };
}

export function montarBlocoFewShot(
  exemplos: string[],
  preteridas: string[] = [],
): string {
  const usar = exemplos.filter((t) => t && t.trim()).slice(0, MAX_EXEMPLOS);
  if (usar.length === 0) return "";

  const lista = usar
    .map((t, i) => `Exemplo ${i + 1}:\n${t.trim()}`)
    .join("\n\n---\n\n");

  const contraste = preteridas
    .filter((t) => t && t.trim())
    .slice(0, MAX_CONTRASTES);

  const blocoContraste =
    contraste.length === 0
      ? ""
      : `

## Legendas preteridas pelo líder (contraste)
Nestes casos o líder preferiu OUTRA opção. Não são necessariamente ruins, mas
foram a segunda escolha: use para perceber o que o líder tende a NÃO preferir
(tom, tamanho, abertura) e fique mais perto dos exemplos aprovados acima:

${contraste.map((t, i) => `Preterida ${i + 1}:\n${t.trim()}`).join("\n\n---\n\n")}
`;

  return `

## Exemplos de legendas aprovadas pelo líder (referência de estilo)
As legendas abaixo já foram escolhidas e publicadas. Absorva o **tom, ritmo,
formato e voz** delas nas suas próximas gerações — NÃO copie o conteúdo, apenas
o estilo:

${lista}
${blocoContraste}`;
}
