import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import * as safeInput from "../utils/safeInput";

import { CarsFiltersSidebar } from "./CarsFiltersSidebar";


const mocks = vi.hoisted(() => ({
  onToggle: vi.fn(),
  setFilterMake: vi.fn(),
  setFilterModel: vi.fn(),
  setFilterColor: vi.fn(),
  setFilterYear: vi.fn(),
  setSortBy: vi.fn(),
  setSortDir: vi.fn(),
}));

vi.mock("../contexts/CarsContext", () => ({
  useCars: () => ({
    filterMake: "",
    setFilterMake: mocks.setFilterMake,
    filterModel: "",
    setFilterModel: mocks.setFilterModel,
    filterColor: "",
    setFilterColor: mocks.setFilterColor,
    filterYear: "",
    setFilterYear: mocks.setFilterYear,
    sortBy: "model",
    setSortBy: mocks.setSortBy,
    sortDir: "asc",
    setSortDir: mocks.setSortDir,
  }),
}));

describe("CarsFiltersSidebar", () => {
  it("renders fields and calls onToggle when provided", async () => {
    const user = userEvent.setup();

    render(
      <CarsFiltersSidebar onToggle={mocks.onToggle} toggleAriaLabel="Hide filters" />
    );

    await user.click(screen.getByLabelText("Hide filters"));
    expect(mocks.onToggle).toHaveBeenCalled();
  });

  it("uses default toggle label when not provided", async () => {
    const user = userEvent.setup();
    render(<CarsFiltersSidebar onToggle={mocks.onToggle} />);

    await user.click(screen.getByLabelText(/toggle filters/i));
    expect(mocks.onToggle).toHaveBeenCalled();
  });

  it("does not render toggle button when onToggle is missing", () => {
    render(<CarsFiltersSidebar />);
    expect(screen.queryByLabelText(/toggle filters/i)).toBeNull();
    expect(screen.queryByLabelText(/hide filters/i)).toBeNull();
  });

  it("sanitizes text and digits inputs", async () => {
    render(<CarsFiltersSidebar />);

    fireEvent.change(screen.getByLabelText(/Make/i), {
      target: { value: "a\u0000b" },
    });
    expect(mocks.setFilterMake).toHaveBeenLastCalledWith("ab");

    fireEvent.change(screen.getByLabelText(/model/i), {
      target: { value: "c\u0000iv" },
    });
    expect(mocks.setFilterModel).toHaveBeenLastCalledWith("civ");

    fireEvent.change(screen.getByLabelText(/year/i), {
      target: { value: "20a2-4" },
    });
    expect(mocks.setFilterYear).toHaveBeenLastCalledWith("2024");

    fireEvent.change(screen.getByLabelText(/color/i), {
      target: { value: "b\u0000lue" },
    });
    expect(mocks.setFilterColor).toHaveBeenLastCalledWith("blue");
  });

  it("updates sort values when valid", async () => {
    const user = userEvent.setup();
    render(<CarsFiltersSidebar />);

    // MUI Select renders a button/combobox; open it and select an option.
    const sortBy = screen.getByRole("combobox", { name: /sort by/i });
    fireEvent.mouseDown(sortBy);
    await user.click(screen.getByRole("option", { name: /^make$/i }));
    expect(mocks.setSortBy).toHaveBeenCalledWith("make");

    const direction = screen.getByRole("combobox", { name: /direction/i });
    fireEvent.mouseDown(direction);
    await user.click(screen.getByRole("option", { name: /descending/i }));
    expect(mocks.setSortDir).toHaveBeenCalledWith("desc");
  });

  it("ignores invalid sort values", () => {
    const sortByGuard = vi.spyOn(safeInput, "isSortBy").mockReturnValue(false);
    const sortDirGuard = vi.spyOn(safeInput, "isSortDir").mockReturnValue(false);

    render(<CarsFiltersSidebar />);

    const sortBy = screen.getByRole("combobox", { name: /sort by/i });
    fireEvent.mouseDown(sortBy);
    fireEvent.click(screen.getByRole("option", { name: /^make$/i }));
    expect(mocks.setSortBy).not.toHaveBeenCalled();

    const direction = screen.getByRole("combobox", { name: /direction/i });
    fireEvent.mouseDown(direction);
    fireEvent.click(screen.getByRole("option", { name: /descending/i }));
    expect(mocks.setSortDir).not.toHaveBeenCalled();

    sortByGuard.mockRestore();
    sortDirGuard.mockRestore();
  });
});
