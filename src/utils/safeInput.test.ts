import {
  sanitizeTextInput,
  sanitizeDigitsInput,
  parseCarYear,
  sanitizeHttpUrl,
  isSortBy,
  isSortDir,
} from "./safeInput";

describe("safeInput", () => {
  it("sanitizeTextInput strips control chars and limits length", () => {
    expect(sanitizeTextInput("a\u0000b")).toBe("ab");
    expect(sanitizeTextInput("x".repeat(100), 4)).toBe("xxxx");
  });

  it("sanitizeDigitsInput keeps digits only", () => {
    expect(sanitizeDigitsInput("20a2-4", 4)).toBe("2024");
    expect(sanitizeDigitsInput("123456", 4)).toBe("1234");
  });

  it("parseCarYear validates year bounds", () => {
    expect(parseCarYear("2024")).toBe(2024);
    expect(parseCarYear("abcd")).toBeUndefined();
    expect(parseCarYear("189")).toBeUndefined();
    expect(parseCarYear("0000")).toBeUndefined();

    // Too far in the future should be rejected.
    const tooNew = String(new Date().getFullYear() + 2);
    expect(parseCarYear(tooNew)).toBeUndefined();
  });

  it("sanitizeHttpUrl accepts http/https and rejects others", () => {
    expect(sanitizeHttpUrl("https://example.com/a.png")).toBe(
      "https://example.com/a.png"
    );

    expect(sanitizeHttpUrl("ftp://example.com/file")).toBeUndefined();
    expect(sanitizeHttpUrl("javascript:alert(1)")).toBeUndefined();
    expect(sanitizeHttpUrl("not a url")).toBeUndefined();
    expect(sanitizeHttpUrl("")).toBeUndefined();
    expect(sanitizeHttpUrl("   ")).toBeUndefined();
  });

  it("sanitizeHttpUrl rejects overly long URLs", () => {
    const tooLong = `https://example.com/${"a".repeat(3000)}`;
    expect(sanitizeHttpUrl(tooLong)).toBeUndefined();
  });

  it("sanitizeHttpUrl rejects credentials", () => {
    expect(sanitizeHttpUrl("https://user:pass@example.com/")).toBeUndefined();
  });

  it("type guards validate sort values", () => {
    expect(isSortBy("model")).toBe(true);
    expect(isSortBy("nope")).toBe(false);

    expect(isSortDir("asc")).toBe(true);
    expect(isSortDir("desc")).toBe(true);
    expect(isSortDir("sideways")).toBe(false);
  });
});
