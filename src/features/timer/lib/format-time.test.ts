import { describe, expect, it } from "vitest";
import { formatTime, parseTime } from "./format-time";

describe("formatTime", () => {
  it("formats seconds under a minute as mm:ss", () => {
    expect(formatTime(45)).toBe("00:45");
  });

  it("formats minutes as mm:ss", () => {
    expect(formatTime(125)).toBe("02:05");
  });

  it("formats hours as hh:mm:ss", () => {
    expect(formatTime(3661)).toBe("01:01:01");
  });

  it("prefixes negative durations with a minus sign", () => {
    expect(formatTime(-90)).toBe("-01:30");
  });

  it("handles zero", () => {
    expect(formatTime(0)).toBe("00:00");
  });
});

describe("parseTime", () => {
  it("parses mm:ss", () => {
    expect(parseTime("02:05")).toBe(125);
  });

  it("parses hh:mm:ss", () => {
    expect(parseTime("01:01:01")).toBe(3661);
  });

  it("parses a single number as seconds", () => {
    expect(parseTime("45")).toBe(45);
  });

  it("returns 0 for non-numeric input", () => {
    expect(parseTime("abc")).toBe(0);
  });

  it("is the inverse of formatTime", () => {
    expect(parseTime(formatTime(599))).toBe(599);
  });
});
