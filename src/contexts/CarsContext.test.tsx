import { render, screen } from "@testing-library/react";

import { CarsProvider, useCars } from "./CarsContext";

const mocks = vi.hoisted(() => ({
  state: {
    loading: false,
    error: undefined,
    creating: false,
    createError: undefined,
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
    carsWithImage: [],
    device: "desktop",
    page: 1,
    setPage: vi.fn(),
    pageSize: 25,
    setPageSize: vi.fn(),
    totalCount: 0,
    totalPages: 1,
    createCar: vi.fn(),
    lastCreatedCar: undefined,
    refetch: vi.fn(),
  },
}));

vi.mock("../hooks/useCarsState", () => ({
  useCarsState: () => mocks.state,
}));

function Consumer() {
  const ctx = useCars();
  return <div>device:{ctx.device}</div>;
}

describe("CarsContext", () => {
  it("throws if used outside CarsProvider", () => {
    function Bad() {
      useCars();
      return null;
    }

    expect(() => render(<Bad />)).toThrow(/CarsProvider/);
  });

  it("provides the value from useCarsState", () => {
    render(
      <CarsProvider>
        <Consumer />
      </CarsProvider>
    );

    expect(screen.getByText("device:desktop")).toBeInTheDocument();
  });
});
