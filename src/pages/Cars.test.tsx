import { render, screen, waitForElementToBeRemoved, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";

import { Cars } from "./Cars";

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
    carsWithImage: [],
    device: "desktop",
    page: 1,
    setPage: vi.fn(),
    pageSize: 25,
    setPageSize: vi.fn(),
    totalCount: 0,
    totalPages: 1,
    createCar: vi.fn(async () => undefined),
    lastCreatedCar: undefined,
    refetch: vi.fn(),
  },
}));

vi.mock("../contexts/CarsContext", async () => {
  const actual = await vi.importActual<typeof import("../contexts/CarsContext")>(
    "../contexts/CarsContext"
  );
  return {
    ...actual,
    useCars: () => mocks.value,
  };
});

vi.mock("../components/CarsList", () => ({
  CarsList: () => <div>Mock CarsList</div>,
}));

vi.mock("../components/NewCar", () => ({
  NewCar: ({ onSubmitted }: { onSubmitted?: () => void }) => (
    <button type="button" onClick={onSubmitted}>
      Mock submit
    </button>
  ),
}));

describe("Cars page", () => {
  beforeEach(() => {
    mocks.value.loading = false;
    mocks.value.error = undefined;
    mocks.value.createError = undefined;
  });

  it("renders header with title and New Car button", () => {
    render(<Cars />);

    expect(screen.getByRole("heading", { name: /^cars$/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /new car/i })).toBeInTheDocument();
  });

  it("shows loading indicator and hides list while loading", () => {
    mocks.value.loading = true;
    render(<Cars />);

    expect(screen.getByRole("progressbar")).toBeInTheDocument();
    expect(screen.queryByText("Mock CarsList")).toBeNull();
  });

  it("renders CarsList when not loading", async () => {
    mocks.value.loading = false;
    render(<Cars />);
    expect(await screen.findByText("Mock CarsList")).toBeInTheDocument();
  });

  it("toggles filters sidebar", async () => {
    const user = userEvent.setup();
    render(<Cars />);

    await user.click(screen.getByLabelText(/hide filters/i));
    expect(screen.getByLabelText(/show filters/i)).toBeInTheDocument();

    await user.click(screen.getByLabelText(/show filters/i));
    expect(screen.getByLabelText(/hide filters/i)).toBeInTheDocument();
  });

  it("shows errors when present", () => {
    mocks.value.error = new Error("Boom");
    mocks.value.createError = new Error("Create failed");
    render(<Cars />);

    expect(screen.getByText(/failed to create car/i)).toBeInTheDocument();
    expect(screen.getByText(/boom/i)).toBeInTheDocument();
  });

  it("opens and closes the create dialog", async () => {
    const user = userEvent.setup();
    render(<Cars />);

    await user.click(screen.getByRole("button", { name: /new car/i }));
    expect(screen.getByText(/add a new car/i)).toBeInTheDocument();

    const dialog = screen.getByRole("dialog");
    const d = within(dialog);
    await user.click(d.getByRole("button", { name: /mock submit/i }));

    await waitForElementToBeRemoved(() => screen.queryByText(/add a new car/i));
  });

  it("closes the create dialog on escape (Dialog onClose)", async () => {
    const user = userEvent.setup();
    render(<Cars />);

    await user.click(screen.getByRole("button", { name: /new car/i }));
    expect(screen.getByText(/add a new car/i)).toBeInTheDocument();

    await user.keyboard("{Escape}");
    await waitForElementToBeRemoved(() => screen.queryByText(/add a new car/i));
  });

  it("closes the create dialog via Close button", async () => {
    const user = userEvent.setup();
    render(<Cars />);

    await user.click(screen.getByRole("button", { name: /new car/i }));
    expect(screen.getByText(/add a new car/i)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /^close$/i }));
    await waitForElementToBeRemoved(() => screen.queryByText(/add a new car/i));
  });
});
