import { describe, expect, it } from "vitest";
import {
  MAX_VERSICULOS,
  formatarReferencia,
  montarBlocoVersiculos,
  sanitizarVersiculos,
  type VersiculoContexto,
} from "./versiculos-contexto";

function v(parcial: Partial<VersiculoContexto> = {}): VersiculoContexto {
  return {
    livro: "Isaías",
    capitulo: 43,
    versiculo_inicio: 19,
    versiculo_fim: 19,
    texto_sugerido: "Eis que farei uma coisa nova.",
    confianca: 0.9,
    tipo: "citacao_direta",
    ...parcial,
  };
}

describe("formatarReferencia", () => {
  it("versículo único", () => {
    expect(formatarReferencia(v())).toBe("Isaías 43:19");
  });
  it("intervalo", () => {
    expect(formatarReferencia(v({ versiculo_fim: 21 }))).toBe("Isaías 43:19-21");
  });
});

describe("sanitizarVersiculos", () => {
  it("devolve vazio para entrada que não é lista", () => {
    expect(sanitizarVersiculos(undefined)).toEqual([]);
    expect(sanitizarVersiculos("x")).toEqual([]);
    expect(sanitizarVersiculos({})).toEqual([]);
  });

  it("descarta itens malformados e mantém os válidos", () => {
    const r = sanitizarVersiculos([
      v(),
      null,
      { livro: "João" },
      v({ capitulo: 0 }),
      v({ confianca: 2 }),
      v({ tipo: "outro" as never }),
      v({ texto_sugerido: "  " }),
    ]);
    expect(r).toHaveLength(1);
    expect(r[0].livro).toBe("Isaías");
  });

  it("remove duplicatas pela referência", () => {
    expect(sanitizarVersiculos([v(), v({ confianca: 0.8 })])).toHaveLength(1);
  });

  it("prioriza citação direta e depois maior confiança", () => {
    const r = sanitizarVersiculos([
      v({ livro: "Salmos", capitulo: 23, tipo: "alusao", confianca: 0.99 }),
      v({ livro: "João", capitulo: 3, versiculo_inicio: 16, versiculo_fim: 16, confianca: 0.8 }),
      v({ livro: "Rute", capitulo: 1, confianca: 0.95 }),
    ]);
    expect(r.map((x) => x.livro)).toEqual(["Rute", "João", "Salmos"]);
  });

  it(`limita a ${MAX_VERSICULOS} versículos`, () => {
    const muitos = Array.from({ length: 8 }, (_, i) => v({ capitulo: i + 1 }));
    expect(sanitizarVersiculos(muitos)).toHaveLength(MAX_VERSICULOS);
  });

  it("corrige fim menor que início", () => {
    const [r] = sanitizarVersiculos([v({ versiculo_inicio: 20, versiculo_fim: 5 })]);
    expect(r.versiculo_fim).toBe(20);
  });
});

describe("montarBlocoVersiculos", () => {
  it("sem versículos, proíbe inventar referência", () => {
    const bloco = montarBlocoVersiculos([]);
    expect(bloco).toContain("Nenhum versículo foi detectado");
    expect(bloco).toContain("nunca invente");
  });

  it("com versículos, lista referência, tipo, confiança e texto", () => {
    const bloco = montarBlocoVersiculos([v()]);
    expect(bloco).toContain('Isaías 43:19 (citação direta, confiança 90%): "Eis que farei uma coisa nova."');
    expect(bloco).toContain("Não cite nenhum outro versículo");
  });
});
