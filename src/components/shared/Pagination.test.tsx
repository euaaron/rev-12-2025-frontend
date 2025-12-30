import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Pagination } from "./Pagination";

describe("Pagination", () => {
  it("disables nav and shows 0–0 when empty", () => {
    const onPageChange = vi.fn();
    const onPageSizeChange = vi.fn();

    render(
      <Pagination
        page={1}
        onPageChange={onPageChange}
        pageSize={10}
        onPageSizeChange={onPageSizeChange}
        totalCount={0}
        totalPages={0}
      />
    );

    expect(screen.getByLabelText(/first page/i)).toBeDisabled();
    expect(screen.getByLabelText(/previous page/i)).toBeDisabled();
    expect(screen.getByLabelText(/next page/i)).toBeDisabled();
    expect(screen.getByLabelText(/last page/i)).toBeDisabled();

    // This text is rendered in the lg-only block; it's present but typically hidden.
    expect(
      screen.getByText(/0–0 of 0 items/i, { selector: "*" })
    ).toBeInTheDocument();
  });

  it("navigates with clamped next/prev/first/last", async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();

    const view = render(
      <Pagination
        page={3}
        onPageChange={onPageChange}
        pageSize={10}
        onPageSizeChange={vi.fn()}
        totalCount={100}
        totalPages={5}
      />
    );

    await user.click(screen.getByLabelText(/first page/i));
    expect(onPageChange).toHaveBeenLastCalledWith(1);

    await user.click(screen.getByLabelText(/previous page/i));
    expect(onPageChange).toHaveBeenLastCalledWith(2);

    await user.click(screen.getByLabelText(/next page/i));
    expect(onPageChange).toHaveBeenLastCalledWith(4);

    await user.click(screen.getByLabelText(/last page/i));
    expect(onPageChange).toHaveBeenLastCalledWith(5);

    // Clamp prev at 1
    onPageChange.mockClear();
    view.rerender(
      <Pagination
        page={1}
        onPageChange={onPageChange}
        pageSize={10}
        onPageSizeChange={vi.fn()}
        totalCount={100}
        totalPages={5}
      />
    );
    expect(screen.getByLabelText(/previous page/i)).toBeDisabled();
    expect(screen.getByLabelText(/first page/i)).toBeDisabled();
    expect(onPageChange).not.toHaveBeenCalled();
  });

  it("handles page input guards and clamping", () => {
    const onPageChange = vi.fn();

    render(
      <Pagination
        page={2}
        onPageChange={onPageChange}
        pageSize={10}
        onPageSizeChange={vi.fn()}
        totalCount={100}
        totalPages={5}
      />
    );

    const pageInput = screen.getByLabelText("Page") as HTMLInputElement;

    fireEvent.change(pageInput, { target: { value: "abc" } });
    expect(onPageChange).not.toHaveBeenCalled();

    fireEvent.change(pageInput, { target: { value: "0" } });
    expect(onPageChange).toHaveBeenLastCalledWith(1);

    fireEvent.change(pageInput, { target: { value: "999" } });
    expect(onPageChange).toHaveBeenLastCalledWith(5);

    fireEvent.change(pageInput, { target: { value: "3.7" } });
    expect(onPageChange).toHaveBeenLastCalledWith(3);
  });

  it("treats page=0 as page 1", () => {
    render(
      <Pagination
        page={0}
        onPageChange={vi.fn()}
        pageSize={10}
        onPageSizeChange={vi.fn()}
        totalCount={100}
        totalPages={5}
      />
    );

    expect(screen.getByLabelText("Page")).toHaveValue("1");
  });

  it("changes page size and resets to page 1 for valid values", async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    const onPageSizeChange = vi.fn();

    render(
      <Pagination
        page={3}
        onPageChange={onPageChange}
        pageSize={10}
        onPageSizeChange={onPageSizeChange}
        totalCount={100}
        totalPages={10}
        pageSizeOptions={[10, 25]}
      />
    );

    const itemsPerPage = screen.getByRole(
      "combobox",
      { name: /items per page/i, hidden: true }
    );

    fireEvent.mouseDown(itemsPerPage);
    await user.click(screen.getByRole("option", { name: "25" }));

    expect(onPageSizeChange).toHaveBeenCalledWith(25);
    expect(onPageChange).toHaveBeenCalledWith(1);
  });

  it("invokes the text buttons for previous/next", () => {
    const onPageChange = vi.fn();

    render(
      <Pagination
        page={2}
        onPageChange={onPageChange}
        pageSize={10}
        onPageSizeChange={vi.fn()}
        totalCount={100}
        totalPages={3}
      />
    );

    fireEvent.click(
      screen.getByRole("button", { name: /^previous$/i, hidden: true })
    );
    expect(onPageChange).toHaveBeenLastCalledWith(1);

    fireEvent.click(
      screen.getByRole("button", { name: /^next$/i, hidden: true })
    );
    expect(onPageChange).toHaveBeenLastCalledWith(3);
  });

  it("disables navigation when loading", () => {
    render(
      <Pagination
        loading={true}
        page={2}
        onPageChange={vi.fn()}
        pageSize={10}
        onPageSizeChange={vi.fn()}
        totalCount={100}
        totalPages={10}
      />
    );

    expect(screen.getByLabelText(/first page/i)).toBeDisabled();
    expect(screen.getByLabelText(/previous page/i)).toBeDisabled();
    expect(screen.getByLabelText(/next page/i)).toBeDisabled();
    expect(screen.getByLabelText(/last page/i)).toBeDisabled();
  });

  it("disables next/last when already at the last page", () => {
    render(
      <Pagination
        page={5}
        onPageChange={vi.fn()}
        pageSize={10}
        onPageSizeChange={vi.fn()}
        totalCount={100}
        totalPages={5}
      />
    );

    expect(screen.getByLabelText(/next page/i)).toBeDisabled();
    expect(screen.getByLabelText(/last page/i)).toBeDisabled();
  });

  it("ignores non-finite page size", async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    const onPageSizeChange = vi.fn();

    render(
      <Pagination
        page={2}
        onPageChange={onPageChange}
        pageSize={10}
        onPageSizeChange={onPageSizeChange}
        totalCount={100}
        totalPages={10}
        pageSizeOptions={[10, Number.POSITIVE_INFINITY]}
      />
    );

    const itemsPerPage = screen.getByRole(
      "combobox",
      { name: /items per page/i, hidden: true }
    );

    fireEvent.mouseDown(itemsPerPage);
    await user.click(screen.getByRole("option", { name: "Infinity" }));
    expect(onPageSizeChange).not.toHaveBeenCalled();
    expect(onPageChange).not.toHaveBeenCalled();
  });

  it("ignores invalid page size values", () => {
    const onPageChange = vi.fn();
    const onPageSizeChange = vi.fn();

    render(
      <Pagination
        page={3}
        onPageChange={onPageChange}
        pageSize={0}
        onPageSizeChange={onPageSizeChange}
        totalCount={100}
        totalPages={10}
        pageSizeOptions={[0]}
      />
    );

    const itemsPerPage = screen.getByRole(
      "combobox",
      { name: /items per page/i, hidden: true }
    );

    fireEvent.mouseDown(itemsPerPage);
    fireEvent.click(screen.getByRole("option", { name: "0" }));
    expect(onPageSizeChange).not.toHaveBeenCalled();
    expect(onPageChange).not.toHaveBeenCalled();
  });
});
