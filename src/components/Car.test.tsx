import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Car } from "./Car";

describe("Car", () => {
  it("renders title and subtitle", () => {
    render(
      <Car
        car={{ id: "1", make: "Audi", model: "A3", year: 2022, color: "Red" }}
        imageUrl="https://example.com/car.png"
      />
    );

    expect(screen.getByText("Audi A3")).toBeInTheDocument();
    expect(screen.getByText("2022 • Red")).toBeInTheDocument();
    expect(screen.getByRole("img")).toHaveAttribute(
      "src",
      "https://example.com/car.png"
    );
  });

  it("falls back when image/subtitle are missing", () => {
    render(
      <Car
        car={{ id: "1", make: "", model: "", year: 0, color: "" }}
        imageUrl="javascript:alert(1)"
      />
    );

    expect(screen.queryByRole("img")).not.toBeInTheDocument();
    expect(screen.getByText(/^car$/i)).toBeInTheDocument();
    expect(screen.queryByText(/•/)).not.toBeInTheDocument();
  });

  it("uses alt fallback when title is empty but image exists", () => {
    render(
      <Car
        car={{ id: "1", make: "", model: "", year: 2022, color: "" }}
        imageUrl="https://example.com/car.png"
      />
    );

    expect(screen.getByRole("img")).toHaveAttribute("alt", "Car");
  });

  it("handles undefined fields", () => {
    render(<Car car={{ id: "1" }} />);

    expect(screen.getByText(/^car$/i)).toBeInTheDocument();
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });

  it("toggles only when clicking the image, not the footer", async () => {
    const user = userEvent.setup();
    const onToggleFooterCollapsed = vi.fn();

    render(
      <Car
        car={{ id: "1", make: "Audi", model: "A3", year: 2022, color: "Red" }}
        imageUrl="https://example.com/car.png"
        onToggleFooterCollapsed={onToggleFooterCollapsed}
      />
    );

    await user.click(screen.getByRole("img"));
    expect(onToggleFooterCollapsed).toHaveBeenCalledTimes(1);

    await user.click(screen.getByText("Audi A3"));
    expect(onToggleFooterCollapsed).toHaveBeenCalledTimes(1);
  });

  it("renders collapsed footer state without throwing", () => {
    render(
      <Car
        car={{ id: "1", make: "Audi", model: "A3", year: 2022, color: "Red" }}
        imageUrl="https://example.com/car.png"
        isFooterCollapsed={true}
        onToggleFooterCollapsed={vi.fn()}
      />
    );

    // Content remains in the DOM; styles change.
    expect(screen.getByText("Audi A3")).toBeInTheDocument();
  });
});
