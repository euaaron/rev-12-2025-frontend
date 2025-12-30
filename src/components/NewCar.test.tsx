import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import * as safeInput from "../utils/safeInput";

import { NewCar } from "./NewCar";


const mocks = vi.hoisted(() => ({
  creating: false,
  createCar: vi.fn().mockResolvedValue(undefined),
}));

vi.mock("../contexts/CarsContext", () => {
  return {
    useCars: () => ({
      creating: mocks.creating,
      createCar: mocks.createCar,
    }),
  };
});

describe("NewCar", () => {
  beforeEach(() => {
    mocks.creating = false;
    mocks.createCar.mockClear();
  });

  it("submits a valid car and clears fields", async () => {
    const user = userEvent.setup();

    render(<NewCar />);

    await user.type(screen.getByLabelText(/make/i), "  Tesla ");
    await user.type(screen.getByLabelText(/model/i), " Model 3 ");
    await user.type(screen.getByLabelText(/year/i), "2024");
    await user.type(screen.getByLabelText(/color/i), " Black ");

    await user.click(screen.getByRole("button", { name: /submit/i }));

    expect(mocks.createCar).toHaveBeenCalledWith({
      make: "Tesla",
      model: "Model 3",
      year: 2024,
      color: "Black",
    });

    expect(screen.getByLabelText(/make/i)).toHaveValue("");
    expect(screen.getByLabelText(/model/i)).toHaveValue("");
    expect(screen.getByLabelText(/year/i)).toHaveValue("");
    expect(screen.getByLabelText(/color/i)).toHaveValue("");
  });

  it("shows creating state and passes only valid image URLs", async () => {
    const user = userEvent.setup();
    const onSubmitted = vi.fn();

    render(<NewCar onSubmitted={onSubmitted} />);

    await user.type(screen.getByLabelText(/make/i), "Tesla");
    await user.type(screen.getByLabelText(/model/i), "Model Y");
    await user.type(screen.getByLabelText(/year/i), "2024");
    await user.type(screen.getByLabelText(/color/i), "Blue");

    await user.type(
      screen.getByLabelText(/mobile image url/i),
      "https://example.com/mobile.png"
    );
    await user.type(
      screen.getByLabelText(/tablet image url/i),
      "javascript:alert(1)"
    );
    await user.type(
      screen.getByLabelText(/desktop image url/i),
      "https://example.com/desktop.png"
    );

    await user.click(screen.getByRole("button", { name: /submit/i }));

    expect(mocks.createCar).toHaveBeenCalledWith({
      make: "Tesla",
      model: "Model Y",
      year: 2024,
      color: "Blue",
      mobile: "https://example.com/mobile.png",
      desktop: "https://example.com/desktop.png",
    });
    expect(onSubmitted).toHaveBeenCalledTimes(1);

    // Cover the "Adding…" branch.
    mocks.creating = true;
    render(<NewCar />);
    expect(screen.getByRole("button", { name: /adding/i })).toBeDisabled();
  });

  it("includes tablet URL when valid", async () => {
    const user = userEvent.setup();
    const onSubmitted = vi.fn();

    render(<NewCar onSubmitted={onSubmitted} />);

    await user.type(screen.getByLabelText(/make/i), "Tesla");
    await user.type(screen.getByLabelText(/model/i), "Model X");
    await user.type(screen.getByLabelText(/year/i), "2024");
    await user.type(screen.getByLabelText(/color/i), "White");

    await user.type(
      screen.getByLabelText(/tablet image url/i),
      "https://example.com/tablet.png"
    );

    await user.click(screen.getByRole("button", { name: /submit/i }));

    expect(mocks.createCar).toHaveBeenCalledWith({
      make: "Tesla",
      model: "Model X",
      year: 2024,
      color: "White",
      tablet: "https://example.com/tablet.png",
    });
    expect(onSubmitted).toHaveBeenCalledTimes(1);
  });

  it("does not submit when required fields are missing", async () => {
    render(<NewCar />);

    expect(screen.getByRole("button", { name: /submit/i })).toBeDisabled();
    expect(mocks.createCar).not.toHaveBeenCalled();
  });

  it("returns early when submitting while disabled", () => {
    const { container } = render(<NewCar />);
    const form = container.querySelector("form");
    expect(form).toBeTruthy();

    fireEvent.submit(form!);
    expect(mocks.createCar).not.toHaveBeenCalled();
  });

  it("returns early if parsedYear becomes undefined at submit time", async () => {
    const user = userEvent.setup();

    const original = safeInput.parseCarYear;
    let submitPhase = false;
    const spy = vi.spyOn(safeInput, "parseCarYear").mockImplementation((value) => {
      return submitPhase ? undefined : original(value);
    });

    render(<NewCar />);
    await user.type(screen.getByLabelText(/make/i), "Tesla");
    await user.type(screen.getByLabelText(/model/i), "Model S");
    await user.type(screen.getByLabelText(/year/i), "2024");
    await user.type(screen.getByLabelText(/color/i), "Black");

    submitPhase = true;
    await user.click(screen.getByRole("button", { name: /submit/i }));
    expect(mocks.createCar).not.toHaveBeenCalled();

    spy.mockRestore();
  });
});
