import { act, renderHook, waitFor } from "@testing-library/react";

import type { SortBy, SortDir } from "../types/carSorting";
import type { ICar } from "../types/ICar";

import { useCarsState } from "./useCarsState";

const apolloMocks = vi.hoisted(() => {
  const stableItems: ICar[] = [
    { id: "1", make: "Audi", model: "A3", year: 2022, color: "Red" },
    { id: "2", make: "Audi", model: "Q5", year: 2023, color: "Blue" },
  ];

  const stableData = {
    carsPage: {
      totalCount: 2,
      items: stableItems,
    },
  };

  return {
    lastQueryVars: undefined as unknown,
    stableData,
    queryData: stableData as unknown,
    refetch: vi.fn().mockResolvedValue({}),
    mutate: vi.fn().mockResolvedValue({
      data: {
        createCar: {
          id: "99",
          make: "Tesla",
          model: "Model 3",
          year: 2024,
          color: "Black",
        } satisfies ICar,
      },
    }),
  };
});

const mediaMocks = vi.hoisted(() => {
  return {
    mobile: false,
    tablet: false,
    desktop: true,
  };
});

vi.mock("@mui/material", async () => {
  return {
    useMediaQuery: (query: string) => {
      if (query.includes("max-width:640")) return mediaMocks.mobile;
      if (query.includes("max-width:1023")) return mediaMocks.tablet;
      if (query.includes("min-width:1024")) return mediaMocks.desktop;
      return false;
    },
  };
});

vi.mock("@apollo/client", () => {
  return {
    gql: () => ({}),
    ApolloProvider: ({ children }: { children: unknown }) => children,
    ApolloClient: function ApolloClient() {
      return {};
    },
    InMemoryCache: function InMemoryCache() {
      return {};
    },
    useQuery: (_query: unknown, options: { variables: unknown }) => {
      apolloMocks.lastQueryVars = options.variables;
      return {
        loading: false,
        error: undefined,
        data: apolloMocks.queryData,
        refetch: apolloMocks.refetch,
      };
    },
    useMutation: () => {
      return [apolloMocks.mutate, { loading: false, error: undefined }] as const;
    },
  };
});

describe("useCarsState", () => {
  beforeEach(() => {
    apolloMocks.refetch.mockClear();
    apolloMocks.mutate.mockClear();
    apolloMocks.lastQueryVars = undefined;
    apolloMocks.queryData = apolloMocks.stableData;

    // defaults
    mediaMocks.mobile = false;
    mediaMocks.tablet = false;
    mediaMocks.desktop = true;
  });

  it("combines filters + data and builds query variables", async () => {
    const { result } = renderHook(() => useCarsState());

    // From useCarFilters defaults
    expect(result.current.filterMake).toBe("");
    expect(result.current.sortBy).toBe("make");
    expect(result.current.sortDir).toBe("asc");

    // From cars data
    expect(result.current.device).toBe("desktop");
    expect(result.current.page).toBe(1);
    expect(result.current.pageSize).toBe(25);

    await waitFor(() => {
      expect(result.current.cars.length).toBe(2);
      expect(result.current.totalCount).toBe(2);
      expect(result.current.totalPages).toBe(1);
    });

    expect(apolloMocks.lastQueryVars).toMatchObject({
      make: "",
      model: "",
      color: "",
      year: undefined,
      sortBy: "make",
      sortDir: "asc",
      page: 1,
      pageSize: 25,
      isDesktop: true,
      isTablet: false,
      isMobile: false,
    });
  });

  it.each([
    ["desktop", { desktop: true, tablet: false, mobile: false }],
    ["tablet", { desktop: false, tablet: true, mobile: false }],
    ["mobile", { desktop: false, tablet: false, mobile: true }],
    // Covers the fallback when none match.
    ["mobile", { desktop: false, tablet: false, mobile: false }],
  ] as const)("detects device kind: %s", async (expected, flags) => {
    mediaMocks.desktop = flags.desktop;
    mediaMocks.tablet = flags.tablet;
    mediaMocks.mobile = flags.mobile;

    const { result } = renderHook(() => useCarsState());
    expect(result.current.device).toBe(expected);
  });

  it("falls back to default sort values when invalid", async () => {
    const { result } = renderHook(() => useCarsState());

    await act(async () => {
      result.current.setFilterYear("2024");
      result.current.setSortBy("not-a-valid-sort" as unknown as SortBy);
      result.current.setSortDir("not-a-valid-dir" as unknown as SortDir);
    });

    expect(apolloMocks.lastQueryVars).toMatchObject({
      year: 2024,
      sortBy: "make",
      sortDir: "asc",
    });
  });

  it("keeps cached cars empty when query data is missing", async () => {
    apolloMocks.queryData = undefined;

    const { result } = renderHook(() => useCarsState());

    await waitFor(() => {
      expect(result.current.cars).toEqual([]);
      expect(result.current.totalCount).toBe(0);
      expect(result.current.totalPages).toBe(1);
      expect(result.current.carsWithImage).toEqual([]);
    });
  });

  it("falls back to empty cars/0 total when carsPage fields are missing", async () => {
    apolloMocks.queryData = {
      carsPage: {
        items: undefined,
        totalCount: undefined,
      },
    };

    const { result } = renderHook(() => useCarsState());

    await waitFor(() => {
      expect(result.current.cars).toEqual([]);
      expect(result.current.totalCount).toBe(0);
      expect(result.current.totalPages).toBe(1);
      expect(result.current.carsWithImage).toEqual([]);
    });
  });

  it("createCar sanitizes input, calls mutation, refetches, and sets lastCreatedCar", async () => {
    const { result } = renderHook(() => useCarsState());

    await act(async () => {
      await result.current.createCar({
        make: "  Tesla \u0000 ",
        model: " Model 3 ",
        year: 2024,
        color: " Black ",
        mobile: "https://example.com/mobile.png",
        tablet: "javascript:alert(1)",
        desktop: "https://example.com/desktop.png",
      });
    });

    expect(apolloMocks.mutate).toHaveBeenCalledTimes(1);
    expect(apolloMocks.mutate).toHaveBeenCalledWith({
      variables: {
        params: {
          make: "Tesla",
          model: "Model 3",
          color: "Black",
          year: 2024,
          mobile: "https://example.com/mobile.png",
          desktop: "https://example.com/desktop.png",
        },
      },
    });

    expect(apolloMocks.refetch).toHaveBeenCalledTimes(1);

    await waitFor(() => {
      expect(result.current.lastCreatedCar?.id).toBe("99");
    });
  });

  it("createCar includes tablet URL and omits missing optional URLs", async () => {
    const { result } = renderHook(() => useCarsState());

    await act(async () => {
      await result.current.createCar({
        make: "Tesla",
        model: "Model X",
        year: 2024,
        color: "White",
        tablet: "https://example.com/tablet.png",
      });
    });

    expect(apolloMocks.mutate).toHaveBeenCalledTimes(1);
    expect(apolloMocks.mutate).toHaveBeenCalledWith({
      variables: {
        params: {
          make: "Tesla",
          model: "Model X",
          color: "White",
          year: 2024,
          tablet: "https://example.com/tablet.png",
        },
      },
    });
  });

  it("createCar returns undefined when required fields are missing", async () => {
    const { result } = renderHook(() => useCarsState());

    let created: ICar | undefined;
    await act(async () => {
      created = await result.current.createCar({
        make: "",
        model: "Model 3",
        year: 2024,
        color: "Black",
      });
    });

    expect(created).toBeUndefined();
    expect(apolloMocks.mutate).not.toHaveBeenCalled();
  });

  it.each([
    ["non-integer", 2024.5],
    ["too-low", 1800],
    ["too-high", new Date().getFullYear() + 2],
  ])("createCar returns undefined for invalid year (%s)", async (_label, year) => {
    const { result } = renderHook(() => useCarsState());

    let created: ICar | undefined;
    await act(async () => {
      created = await result.current.createCar({
        make: "Tesla",
        model: "Model 3",
        year: year as number,
        color: "Black",
      });
    });

    expect(created).toBeUndefined();
    expect(apolloMocks.mutate).not.toHaveBeenCalled();
  });

  it("createCar returns undefined when mutation throws", async () => {
    apolloMocks.mutate.mockRejectedValueOnce(new Error("Boom"));
    const { result } = renderHook(() => useCarsState());

    let created: ICar | undefined;
    await act(async () => {
      created = await result.current.createCar({
        make: "Tesla",
        model: "Model 3",
        year: 2024,
        color: "Black",
      });
    });

    expect(created).toBeUndefined();
  });
});
