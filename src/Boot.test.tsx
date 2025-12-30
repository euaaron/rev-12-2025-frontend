import { render, screen, waitFor } from "@testing-library/react";

const workerStart = vi.fn().mockResolvedValue(undefined);

async function importFreshBoot() {
  vi.resetModules();
  vi.doMock("./App", () => ({
    default: () => <div>Mock App</div>,
  }));
  vi.doMock("./mocks/browser", () => ({
    worker: {
      start: workerStart,
    },
  }));

  return await import("./Boot");
}

describe("Boot", () => {
  beforeEach(() => {
    workerStart.mockClear();
    globalThis.__BOOT_USE_MSW__ = undefined;
  });

  it("renders App immediately when MSW is disabled", () => {
    globalThis.__BOOT_USE_MSW__ = false;
    return importFreshBoot().then(({ Boot }) => {
      render(<Boot />);

      expect(screen.getByText("Mock App")).toBeInTheDocument();
      expect(screen.queryByLabelText(/loading/i)).toBeNull();
      expect(workerStart).not.toHaveBeenCalled();
    });
  });

  it("shows loading then starts MSW and renders App", async () => {
    globalThis.__BOOT_USE_MSW__ = true;
    const { Boot } = await importFreshBoot();

    render(<Boot />);

    expect(screen.getByLabelText(/loading/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(workerStart).toHaveBeenCalledTimes(1);
    });

    expect(await screen.findByText("Mock App")).toBeInTheDocument();
  });
});
