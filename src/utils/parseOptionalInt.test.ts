import { parseOptionalInt } from "./parseOptionalInt";

describe("parseOptionalInt", () => {
  it("returns undefined for empty/whitespace", () => {
    expect(parseOptionalInt("")).toBeUndefined();
    expect(parseOptionalInt("   ")).toBeUndefined();
  });

  it("returns undefined for non-integers", () => {
    expect(parseOptionalInt("12.3")).toBeUndefined();
    expect(parseOptionalInt("abc"))
      .toBeUndefined();
    expect(parseOptionalInt("1e3")).toBeUndefined();
  });

  it("parses signed integers", () => {
    expect(parseOptionalInt("42")).toBe(42);
    expect(parseOptionalInt("  -7 ")).toBe(-7);
    expect(parseOptionalInt("+8")).toBe(8);
  });

  it("returns undefined for unsafe integers", () => {
    expect(parseOptionalInt(String(Number.MAX_SAFE_INTEGER + 1))).toBeUndefined();
  });
});
