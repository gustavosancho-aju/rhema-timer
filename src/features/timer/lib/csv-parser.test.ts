import { describe, expect, it } from "vitest";
import { parseCsv } from "./csv-parser";

describe("parseCsv", () => {
  it("returns an empty array for empty input", () => {
    expect(parseCsv("")).toEqual([]);
  });

  it("parses a basic countdown row", () => {
    const rows = parseCsv("title,presenter,duration,type\nAbertura,João,05:00,countdown");
    expect(rows).toHaveLength(1);
    expect(rows[0]).toMatchObject({
      title: "Abertura",
      presenter: "João",
      type: "countdown",
      duration: 300,
    });
    expect(rows[0].error).toBeUndefined();
  });

  it("accepts a plain number as duration in seconds", () => {
    const rows = parseCsv("title,duration\nLouvor,90");
    expect(rows[0].duration).toBe(90);
  });

  it("flags a row with an empty title", () => {
    const rows = parseCsv("title,duration\n,05:00");
    expect(rows[0].error).toBe("título vazio");
  });

  it("flags a countdown with invalid duration", () => {
    const rows = parseCsv("title,duration\nPregação,abc");
    expect(rows[0].error).toBe("duração inválida");
  });

  it("defaults unknown types to countdown", () => {
    const rows = parseCsv("title,duration,type\nX,01:00,banana");
    expect(rows[0].type).toBe("countdown");
  });

  it("respects quoted fields containing commas", () => {
    const rows = parseCsv('title,duration\n"Bloco 1, parte 2",01:00');
    expect(rows[0].title).toBe("Bloco 1, parte 2");
  });

  it("parses autoAdvance truthy values", () => {
    const rows = parseCsv("title,duration,autoadvance\nX,01:00,sim");
    expect(rows[0].autoAdvance).toBe(true);
  });
});
