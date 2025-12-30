import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import type { ICar } from "../types/ICar";

import type { PaginationProps } from "./shared/Pagination";

type RafCallback = Parameters<typeof window.requestAnimationFrame>[0];

declare global {
  interface Window {
    __rafCb?: RafCallback;
  }
}

export {};

const carsMocks = vi.hoisted(() => ({
  setPage: vi.fn(),
  setPageSize: vi.fn(),
  value: {
    carsWithImage: [
      {
        car: { id: "1", make: "Audi", model: "A3", year: 2022, color: "Red" },
        imageUrl: "https://example.com/a.png",
      },
    ],
    page: 1,
    setPage: (page: number) => carsMocks.setPage(page),
    pageSize: 25,
    setPageSize: (pageSize: number) => carsMocks.setPageSize(pageSize),
    totalCount: 100,
    totalPages: 5,
  },
}));

vi.mock("../contexts/CarsContext", () => ({
  useCars: () => carsMocks.value,
}));

let lastPaginationProps: PaginationProps | undefined;
vi.mock("./shared/Pagination", () => ({
  Pagination: (props: PaginationProps) => {
    lastPaginationProps = props;
    return (
      <div
        data-testid="pagination"
        data-transparent={String(props.transparentWhenStickyBottom)}
      />
    );
  },
}));

vi.mock("./Car", () => ({
  Car: ({ car, isFooterCollapsed, onToggleFooterCollapsed }: {
    car: ICar;
    isFooterCollapsed?: boolean;
    onToggleFooterCollapsed?: () => void;
  }) => (
    <button
      type="button"
      data-testid={`car-${car.id}`}
      data-collapsed={String(Boolean(isFooterCollapsed))}
      onClick={onToggleFooterCollapsed}
    >
      {car.make} {car.model}
    </button>
  ),
}));

describe("CarsList (effects)", () => {
  beforeEach(() => {
    carsMocks.setPage.mockReset();
    carsMocks.setPageSize.mockReset();
    lastPaginationProps = undefined;
  });

  const rectWithBottom = (bottom: number): DOMRect => ({ bottom } as DOMRect);

  it("debounces scroll/resize with requestAnimationFrame", async () => {
    const rafSpy = vi
      .spyOn(window, "requestAnimationFrame")
      .mockImplementation((cb: RafCallback) => {
        // Run later (explicitly) to test the debounce path.
        window.__rafCb = cb;
        return 123;
      });

    const rectSpy = vi
      .spyOn(HTMLElement.prototype, "getBoundingClientRect")
      // First run: stuck (distance 0)
      .mockReturnValueOnce(rectWithBottom(window.innerHeight))
      // Next runs: not stuck
      .mockReturnValue(rectWithBottom(window.innerHeight - 20));

    const { CarsList } = await import("./CarsList");
    render(<CarsList />);

    // After the initial check, isPaginationStuck becomes true => transparentWhenStickyBottom false
    await waitFor(() =>
      expect(lastPaginationProps?.transparentWhenStickyBottom).toBe(false)
    );

    // Trigger twice before RAF runs; second call should early-return.
    document.dispatchEvent(new Event("scroll", { bubbles: true }));
    document.dispatchEvent(new Event("scroll", { bubbles: true }));
    expect(rafSpy).toHaveBeenCalledTimes(1);

    // Now flush RAF callback; it should run check() again.
    window.__rafCb?.(0);

    await waitFor(() =>
      expect(lastPaginationProps?.transparentWhenStickyBottom).toBe(true)
    );

    rectSpy.mockRestore();
    rafSpy.mockRestore();
  });

  it("cancels a pending animation frame on unmount", async () => {
    let capturedCb: RafCallback | undefined;
    const rafSpy = vi
      .spyOn(window, "requestAnimationFrame")
      .mockImplementation((cb: RafCallback) => {
        capturedCb = cb;
        return 456;
      });
    const cancelSpy = vi.spyOn(window, "cancelAnimationFrame");

    const rectSpy = vi
      .spyOn(HTMLElement.prototype, "getBoundingClientRect")
      .mockReturnValue({
      bottom: window.innerHeight - 20,
    } as DOMRect);

    const { CarsList } = await import("./CarsList");
    const { unmount } = render(<CarsList />);

    document.dispatchEvent(new Event("scroll", { bubbles: true }));
    expect(rafSpy).toHaveBeenCalledTimes(1);
    expect(typeof capturedCb).toBe("function");

    unmount();
    expect(cancelSpy).toHaveBeenCalledWith(456);

    rafSpy.mockRestore();
    cancelSpy.mockRestore();
    rectSpy.mockRestore();
  });

  it("toggles collapsed car id", async () => {
    const { CarsList } = await import("./CarsList");
    render(<CarsList />);

    const car = screen.getByTestId("car-1");
    expect(car).toHaveAttribute("data-collapsed", "false");

    fireEvent.click(car);
    expect(screen.getByTestId("car-1")).toHaveAttribute(
      "data-collapsed",
      "true"
    );

    fireEvent.click(screen.getByTestId("car-1"));
    expect(screen.getByTestId("car-1")).toHaveAttribute(
      "data-collapsed",
      "false"
    );
  });
});
