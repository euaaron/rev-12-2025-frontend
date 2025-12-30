import { render, screen } from "@testing-library/react";
import React from "react";

import App from "./App";

vi.mock("./contexts/CarsContext", () => ({
  CarsProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

vi.mock("./pages/Cars", () => ({
  Cars: () => <div>Mock Cars Page</div>,
}));

describe("App", () => {
  it("renders suspense fallback then Cars page", async () => {
    render(<App />);

    // Suspense fallback should show a progressbar briefly.
    expect(screen.getByRole("progressbar")).toBeInTheDocument();

    expect(await screen.findByText("Mock Cars Page")).toBeInTheDocument();
  });
});
