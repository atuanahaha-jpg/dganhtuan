import { describe, expect, it } from "vitest";
import { formatCount, slugify } from "../../src/lib/utils";

describe("formatCount", () => {
  it("formats large counts compactly", () => {
    expect(formatCount(1200)).toBe("1.2K");
  });
});
describe("slugify", () => {
  it("creates a clean URL slug", () => {
    expect(slugify("Beautiful Mountains & Lakes")).toBe("beautiful-mountains-lakes");
  });
  it("handles punctuation-only input", () => {
    expect(slugify("!!!")).toBe("");
  });
});
