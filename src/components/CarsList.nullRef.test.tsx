import { render } from "@testing-library/react";

// Force CarsList's useEffect to hit the `if (!el) return;` branch by
// overriding useRef() to always return { current: null }.
vi.mock("react", async () => {
  const actual = await vi.importActual<typeof import("react")>("react");
  return {
    ...actual,
    useRef: () => ({ current: null }),
  };
});

const carsMocks = vi.hoisted(() => ({
  value: {
    carsWithImage: [],
    page: 1,
    setPage: vi.fn(),
    pageSize: 25,
    setPageSize: vi.fn(),
    totalCount: 0,
    totalPages: 1,
  },
}));

vi.mock("../contexts/CarsContext", () => ({
  useCars: () => carsMocks.value,
}));

vi.mock("./Car", () => ({
  Car: () => null,
}));

vi.mock("./shared/Pagination", () => ({
  Pagination: () => null,
}));

describe("CarsList (null ref)", () => {
  it("returns early when stickyPaginationRef is null", async () => {
    vi.resetModules();
    const { CarsList } = await import("./CarsList");
    render(<CarsList />);
  });
});
