import { describe, expect, it } from "vitest";
import {
  CURADOR_SYSTEM_PROMPT,
  LIMITES_FORMATO,
  montarUserPrompt,
} from "./curador";
import { COMBINADOR_SYSTEM_PROMPT } from "./combinador";

describe("prompts: regras de formato do Instagram", () => {
  it.each([
    ["curador", CURADOR_SYSTEM_PROMPT],
    ["combinador", COMBINADOR_SYSTEM_PROMPT],
  ])("%s carrega os limites de LIMITES_FORMATO", (_nome, prompt) => {
    expect(prompt).toContain(`${LIMITES_FORMATO.ganchoMaxChars} caracteres`);
    expect(prompt).toContain(`${LIMITES_FORMATO.corpoMaxLinhas} linhas`);
    expect(prompt).toContain(`${LIMITES_FORMATO.totalMaxChars}`);
  });

  it("o curador não manda mais usar 'muitas quebras'", () => {
    expect(CURADOR_SYSTEM_PROMPT).not.toMatch(/muitas quebras/i);
  });
});

describe("montarUserPrompt", () => {
  const base = { transcricao: "texto da pregação", nucleo: null, versiculos: [] };

  it("sempre inclui a transcrição, a regra de versículos e a instrução final", () => {
    const p = montarUserPrompt(base);
    expect(p).toContain("texto da pregação");
    expect(p).toContain("Nenhum versículo foi detectado");
    expect(p.endsWith("Responda apenas com o JSON.")).toBe(true);
    expect(p).not.toContain("Núcleo da pregação");
  });

  it("coloca núcleo e versículos antes da transcrição", () => {
    const p = montarUserPrompt({
      transcricao: "texto da pregação",
      nucleo: {
        tema: "Fé",
        ideiaCentral: "Deus é fiel.",
        frasesImpacto: [],
        trechoForte: "",
      },
      versiculos: [
        {
          livro: "João",
          capitulo: 3,
          versiculo_inicio: 16,
          versiculo_fim: 16,
          texto_sugerido: "Porque Deus amou o mundo",
          confianca: 0.95,
          tipo: "citacao_direta",
        },
      ],
    });
    const iNucleo = p.indexOf("Núcleo da pregação");
    const iVersiculos = p.indexOf("João 3:16");
    const iTranscricao = p.indexOf("texto da pregação");
    expect(iNucleo).toBeGreaterThan(-1);
    expect(iNucleo).toBeLessThan(iVersiculos);
    expect(iVersiculos).toBeLessThan(iTranscricao);
  });
});
