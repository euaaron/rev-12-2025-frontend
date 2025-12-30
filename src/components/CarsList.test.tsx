import { render, screen } from "@testing-library/react";

import { CarsList } from "./CarsList";

const mocks = vi.hoisted(() => ({
  value: {
    loading: false,
    error: undefined as unknown,
    creating: false,
    createError: undefined as unknown,
    filterMake: "",
    setFilterMake: vi.fn(),
    filterModel: "",
    setFilterModel: vi.fn(),
    filterColor: "",
    setFilterColor: vi.fn(),
    filterYear: "",
    setFilterYear: vi.fn(),
    sortBy: "model",
    setSortBy: vi.fn(),
    sortDir: "asc",
    setSortDir: vi.fn(),
    cars: [],
    carsWithImage: [
      {
        car: { id: "1", make: "Audi", model: "A3", year: 2022, color: "Red" },
        imageUrl: "",
      },
    ],
    device: "desktop",
    page: 1,
    setPage: vi.fn(),
    pageSize: 25,
    setPageSize: vi.fn(),
    totalCount: 1,
    totalPages: 1,
    createCar: vi.fn(),
    lastCreatedCar: undefined,
    refetch: vi.fn(),
  },
}));

vi.mock("../contexts/CarsContext", () => ({
  useCars: () => mocks.value,
}));

describe("CarsList", () => {
  beforeEach(() => {
    mocks.value.loading = false;
    mocks.value.error = undefined;
    mocks.value.createError = undefined;
  });

  it("renders cars", () => {
    render(<CarsList />);

    expect(screen.getByText("Audi A3")).toBeInTheDocument();
  });
});
