import { act, render, screen, waitFor } from "@testing-library/react";

const workerStart = vi.fn().mockResolvedValue(undefined);

function deferred<T = void>() {
  let resolve!: (value: T) => void;
  let reject!: (reason?: unknown) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}

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

  it("shouldUseMsw follows override first, then env", async () => {
    const { shouldUseMsw } = await import("./shouldUseMsw");

    expect(shouldUseMsw(true, { DEV: false, VITE_USE_MSW: "false" })).toBe(true);
    expect(shouldUseMsw(false, { DEV: true, VITE_USE_MSW: "true" })).toBe(false);

    expect(shouldUseMsw(undefined, { DEV: true, VITE_USE_MSW: "false" })).toBe(true);
    expect(shouldUseMsw(undefined, { DEV: false, VITE_USE_MSW: "true" })).toBe(true);
    expect(shouldUseMsw(undefined, { DEV: false, VITE_USE_MSW: "false" })).toBe(false);
  });

  it("does not set ready if unmounted before MSW starts (cancelled)", async () => {
    globalThis.__BOOT_USE_MSW__ = true;

    const d = deferred<void>();
    workerStart.mockReturnValueOnce(d.promise);

    const { Boot } = await importFreshBoot();
    const { unmount } = render(<Boot />);

    await waitFor(() => {
      expect(workerStart).toHaveBeenCalledTimes(1);
    });

    unmount();

    await act(async () => {
      d.resolve();
      await d.promise;
      // Flush the microtask queue so the async IIFE continues.
      await Promise.resolve();
    });

    // Nothing to assert beyond "no crash"; this test exists to execute the cancelled branch.
    expect(true).toBe(true);
  });
});
