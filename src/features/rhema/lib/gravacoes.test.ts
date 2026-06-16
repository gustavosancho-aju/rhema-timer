import { describe, expect, it } from "vitest";
import { CULTO_LABELS, CULTO_TIPOS, isCultoTipo } from "./gravacoes-types";

describe("isCultoTipo", () => {
  it("aceita os três tipos válidos", () => {
    expect(isCultoTipo("sozo")).toBe(true);
    expect(isCultoTipo("familia")).toBe(true);
    expect(isCultoTipo("quarta")).toBe(true);
  });

  it("rejeita valores inválidos", () => {
    expect(isCultoTipo("domingo")).toBe(false);
    expect(isCultoTipo("")).toBe(false);
    expect(isCultoTipo(null)).toBe(false);
    expect(isCultoTipo(42)).toBe(false);
    expect(isCultoTipo(undefined)).toBe(false);
  });
});

describe("CULTO_LABELS", () => {
  it("tem um rótulo legível para cada tipo", () => {
    for (const tipo of CULTO_TIPOS) {
      expect(CULTO_LABELS[tipo]).toBeTruthy();
    }
    expect(CULTO_LABELS.familia).toBe("Culto da Família");
  });
});
