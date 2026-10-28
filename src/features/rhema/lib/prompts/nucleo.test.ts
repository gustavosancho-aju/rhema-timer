import { describe, expect, it } from "vitest";
import {
  montarBlocoNucleo,
  parseJsonObjeto,
  sanitizarNucleo,
} from "./nucleo";

describe("parseJsonObjeto", () => {
  it("extrai o objeto mesmo com texto/cerca em volta", () => {
    expect(parseJsonObjeto('```json\n{"a":1}\n```')).toEqual({ a: 1 });
  });
  it("retorna null sem JSON ou com JSON inválido", () => {
    expect(parseJsonObjeto("sem json")).toBeNull();
    expect(parseJsonObjeto("{quebrado")).toBeNull();
  });
});

describe("sanitizarNucleo", () => {
  it("aceita uma resposta completa", () => {
    const n = sanitizarNucleo({
      tema: "Fé no deserto",
      ideia_central: "Deus age onde não há caminho.",
      frases_de_impacto: ["Ele abre caminho", "", "No deserto também"],
      trecho_forte: "Quando não há saída, Ele é a saída.",
    });
    expect(n).toEqual({
      tema: "Fé no deserto",
      ideiaCentral: "Deus age onde não há caminho.",
      frasesImpacto: ["Ele abre caminho", "No deserto também"],
      trechoForte: "Quando não há saída, Ele é a saída.",
    });
  });

  it("retorna null para insuficiente, lixo ou sem ideia/trecho", () => {
    expect(sanitizarNucleo({ insuficiente: true })).toBeNull();
    expect(sanitizarNucleo(null)).toBeNull();
    expect(sanitizarNucleo("texto")).toBeNull();
    expect(sanitizarNucleo({ tema: "só tema" })).toBeNull();
  });

  it("limita a 3 frases de impacto", () => {
    const n = sanitizarNucleo({
      ideia_central: "x",
      frases_de_impacto: ["1", "2", "3", "4", "5"],
    });
    expect(n?.frasesImpacto).toEqual(["1", "2", "3"]);
  });
});

describe("montarBlocoNucleo", () => {
  it("vazio quando não há núcleo", () => {
    expect(montarBlocoNucleo(null)).toBe("");
  });

  it("monta o bloco com os campos preenchidos", () => {
    const bloco = montarBlocoNucleo({
      tema: "Fé",
      ideiaCentral: "Deus é fiel.",
      frasesImpacto: ["Ele não falha"],
      trechoForte: "Trecho.",
    });
    expect(bloco).toContain("Tema: Fé");
    expect(bloco).toContain("Ideia central: Deus é fiel.");
    expect(bloco).toContain('- "Ele não falha"');
    expect(bloco).toContain("Trecho mais forte: Trecho.");
  });
});
