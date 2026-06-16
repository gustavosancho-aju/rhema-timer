// Monta um bloco de "exemplos aprovados" para ensinar o estilo ao curador
// (aprendizado few-shot a partir das legendas que o líder escolheu).

const MAX_EXEMPLOS = 6;

export function montarBlocoFewShot(exemplos: string[]): string {
  const usar = exemplos.filter((t) => t && t.trim()).slice(0, MAX_EXEMPLOS);
  if (usar.length === 0) return "";

  const lista = usar
    .map((t, i) => `Exemplo ${i + 1}:\n${t.trim()}`)
    .join("\n\n---\n\n");

  return `

## Exemplos de legendas aprovadas pelo líder (referência de estilo)
As legendas abaixo já foram escolhidas e publicadas. Absorva o **tom, ritmo,
formato e voz** delas nas suas próximas gerações — NÃO copie o conteúdo, apenas
o estilo:

${lista}
`;
}
