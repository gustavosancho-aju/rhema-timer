import { describe, expect, it } from "vitest";
import { extrairExemplosFewShot, montarBlocoFewShot } from "./few-shot";

describe("extrairExemplosFewShot", () => {
  it("separa a escolhida (aprovada) das outras opções do mesmo par (preteridas)", () => {
    const r = extrairExemplosFewShot([
      { legendas: [{ texto: "A1" }, { texto: "A2" }], escolhidaIdx: 1 },
      { legendas: [{ texto: "B1" }, { texto: "B2" }], escolhidaIdx: 0 },
    ]);
    expect(r.aprovadas).toEqual(["A2", "B1"]);
    expect(r.preteridas).toEqual(["A1", "B2"]);
  });

  it("ignora gravações sem escolha ou com índice inválido", () => {
    const r = extrairExemplosFewShot([
      { legendas: [{ texto: "X" }, { texto: "Y" }], escolhidaIdx: null },
      { legendas: [{ texto: "Z" }], escolhidaIdx: 5 },
    ]);
    expect(r).toEqual({ aprovadas: [], preteridas: [] });
  });

  it("descarta textos vazios", () => {
    const r = extrairExemplosFewShot([
      { legendas: [{ texto: "ok" }, { texto: "   " }], escolhidaIdx: 0 },
    ]);
    expect(r).toEqual({ aprovadas: ["ok"], preteridas: [] });
  });
});

describe("montarBlocoFewShot", () => {
  it("retorna vazio sem exemplos aprovados", () => {
    expect(montarBlocoFewShot([])).toBe("");
    expect(montarBlocoFewShot([], ["só preterida"])).toBe("");
  });

  it("inclui aprovadas e não inclui seção de contraste sem preteridas", () => {
    const bloco = montarBlocoFewShot(["Legenda boa"]);
    expect(bloco).toContain("Legenda boa");
    expect(bloco).not.toContain("preteridas");
  });

  it("inclui a seção de contraste quando há preteridas", () => {
    const bloco = montarBlocoFewShot(["Boa"], ["Segunda opção"]);
    expect(bloco).toContain("Segunda opção");
    expect(bloco).toContain("Preterida 1");
  });

  it("limita a 6 aprovadas e 3 preteridas", () => {
    const aprovadas = Array.from({ length: 10 }, (_, i) => `ap${i}`);
    const preteridas = Array.from({ length: 10 }, (_, i) => `pr${i}`);
    const bloco = montarBlocoFewShot(aprovadas, preteridas);
    expect(bloco).toContain("Exemplo 6:");
    expect(bloco).not.toContain("Exemplo 7:");
    expect(bloco).toContain("Preterida 3:");
    expect(bloco).not.toContain("Preterida 4:");
  });
});
