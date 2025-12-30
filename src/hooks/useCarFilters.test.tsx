import { act, renderHook } from "@testing-library/react";

import { useCarFilters } from "./useCarFilters";

describe("useCarFilters", () => {
  it("uses defaults when options omitted", () => {
    const { result } = renderHook(() => useCarFilters());

    expect(result.current.filterMake).toBe("");
    expect(result.current.filterModel).toBe("");
    expect(result.current.filterColor).toBe("");
    expect(result.current.filterYear).toBe("");
    expect(result.current.sortBy).toBe("make");
    expect(result.current.sortDir).toBe("asc");
  });

  it("accepts initial values and updates", () => {
    const { result } = renderHook(() =>
      useCarFilters({
        initialMake: "Audi",
        initialModel: "A3",
        initialColor: "Red",
        initialYear: "2022",
        initialSortBy: "year",
        initialSortDir: "desc",
      })
    );

    expect(result.current.filterMake).toBe("Audi");
    expect(result.current.sortBy).toBe("year");
    expect(result.current.sortDir).toBe("desc");

    act(() => {
      result.current.setFilterModel("Q5");
      result.current.setSortDir("asc");
    });

    expect(result.current.filterModel).toBe("Q5");
    expect(result.current.sortDir).toBe("asc");
  });
});
