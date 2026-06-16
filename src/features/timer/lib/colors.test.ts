import { describe, expect, it } from "vitest";
import { COLOR_LIST, COLOR_MAP } from "./colors";

describe("colors", () => {
  it("lists every color defined in the map", () => {
    expect(COLOR_LIST).toHaveLength(Object.keys(COLOR_MAP).length);
  });

  it("gives every color a dot class and a label", () => {
    for (const color of COLOR_LIST) {
      expect(COLOR_MAP[color].dot).toMatch(/^bg-/);
      expect(COLOR_MAP[color].label.length).toBeGreaterThan(0);
    }
  });

  it("includes the default white color", () => {
    expect(COLOR_LIST).toContain("white");
  });
});
