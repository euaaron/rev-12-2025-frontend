import { render } from "@testing-library/react";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

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

// Override Box with a non-forwardRef component so the `ref={stickyPaginationRef}`
// does NOT attach, keeping stickyPaginationRef.current === null.
vi.mock("@mui/material", async () => {
  const actual = await vi.importActual<typeof import("@mui/material")>(
    "@mui/material"
  );

  type BoxMockProps = ComponentPropsWithoutRef<"div"> & {
    sx?: unknown;
    children?: ReactNode;
  };

  return {
    ...actual,
    Box: (props: BoxMockProps) => {
      const divProps = { ...props } as BoxMockProps & Record<string, unknown>;
      delete divProps.sx;
      return <div {...divProps} />;
    },
  };
});

vi.mock("./Car", () => ({
  Car: () => null,
}));

vi.mock("./shared/Pagination", () => ({
  Pagination: () => null,
}));

describe("CarsList (Box ref not forwarded)", () => {
  it("hits the early return when ref is not attached", async () => {
    vi.resetModules();
    const { CarsList } = await import("./CarsList");
    render(<CarsList />);
  });
});
