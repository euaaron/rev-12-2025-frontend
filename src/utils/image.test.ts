import type { ICar } from "../types/ICar";

import { getCarImage } from "./image";

describe("getCarImage", () => {
  const base: ICar = {
    id: "1",
    make: "Audi",
    model: "A3",
    year: 2022,
    color: "Red",
    mobile: "",
    tablet: "",
    desktop: "",
  };

  it("falls back across device sizes", () => {
    const car: ICar = {
      ...base,
      mobile: "https://example.com/mobile.png",
      tablet: "https://example.com/tablet.png",
      desktop: "https://example.com/desktop.png",
    };

    expect(getCarImage(car, "mobile")).toBe("https://example.com/mobile.png");
    expect(getCarImage(car, "tablet")).toBe("https://example.com/tablet.png");
    expect(getCarImage(car, "desktop")).toBe("https://example.com/desktop.png");
  });

  it("selects all fallback paths for every device", () => {
    // mobile: mobile || tablet || desktop || ""
    expect(
      getCarImage(
        { ...base, mobile: "https://x/m", tablet: "https://x/t", desktop: "https://x/d" },
        "mobile"
      )
    ).toBe("https://x/m");
    expect(
      getCarImage(
        { ...base, mobile: "", tablet: "https://x/t", desktop: "https://x/d" },
        "mobile"
      )
    ).toBe("https://x/t");
    expect(
      getCarImage({ ...base, mobile: "", tablet: "", desktop: "https://x/d" }, "mobile")
    ).toBe("https://x/d");
    expect(getCarImage({ ...base, mobile: "", tablet: "", desktop: "" }, "mobile")).toBe("");

    // tablet: tablet || desktop || mobile || ""
    expect(
      getCarImage(
        { ...base, mobile: "https://x/m", tablet: "https://x/t", desktop: "https://x/d" },
        "tablet"
      )
    ).toBe("https://x/t");
    expect(
      getCarImage(
        { ...base, mobile: "https://x/m", tablet: "", desktop: "https://x/d" },
        "tablet"
      )
    ).toBe("https://x/d");
    expect(
      getCarImage({ ...base, mobile: "https://x/m", tablet: "", desktop: "" }, "tablet")
    ).toBe("https://x/m");
    expect(getCarImage({ ...base, mobile: "", tablet: "", desktop: "" }, "tablet")).toBe("");

    // desktop: desktop || tablet || mobile || ""
    expect(
      getCarImage(
        { ...base, mobile: "https://x/m", tablet: "https://x/t", desktop: "https://x/d" },
        "desktop"
      )
    ).toBe("https://x/d");
    expect(
      getCarImage(
        { ...base, mobile: "https://x/m", tablet: "https://x/t", desktop: "" },
        "desktop"
      )
    ).toBe("https://x/t");
    expect(
      getCarImage({ ...base, mobile: "https://x/m", tablet: "", desktop: "" }, "desktop")
    ).toBe("https://x/m");
    expect(getCarImage({ ...base, mobile: "", tablet: "", desktop: "" }, "desktop")).toBe("");
  });
});
