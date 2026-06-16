import { describe, expect, it } from "vitest";
import {
  adicionarGravacao,
  MAX_GRAVACOES,
  type GravacaoSalva,
} from "./historico-gravacoes";

function fakeGravacao(id: string): GravacaoSalva {
  return { id, salvaEm: Number(id), duracaoMs: 1000, legendas: [] };
}

describe("adicionarGravacao", () => {
  it("coloca a gravação mais recente no topo", () => {
    const hist = adicionarGravacao([fakeGravacao("1")], fakeGravacao("2"));
    expect(hist.map((g) => g.id)).toEqual(["2", "1"]);
  });

  it("nunca passa de MAX_GRAVACOES itens", () => {
    let hist: GravacaoSalva[] = [];
    for (let i = 1; i <= 10; i++) {
      hist = adicionarGravacao(hist, fakeGravacao(String(i)));
    }
    expect(hist).toHaveLength(MAX_GRAVACOES);
  });

  it("descarta a mais antiga quando excede o limite", () => {
    let hist: GravacaoSalva[] = [];
    for (let i = 1; i <= MAX_GRAVACOES + 1; i++) {
      hist = adicionarGravacao(hist, fakeGravacao(String(i)));
    }
    // a gravação "1" (mais antiga) deve ter saído
    expect(hist.map((g) => g.id)).not.toContain("1");
    expect(hist[0].id).toBe(String(MAX_GRAVACOES + 1));
  });

  it("não muta o array original", () => {
    const original = [fakeGravacao("1")];
    adicionarGravacao(original, fakeGravacao("2"));
    expect(original).toHaveLength(1);
  });
});
