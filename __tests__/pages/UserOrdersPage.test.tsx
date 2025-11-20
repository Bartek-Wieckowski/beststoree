import { render, screen, waitFor, RenderResult } from "@testing-library/react";
import { describe, it, expect, vi, Mock, beforeEach } from "vitest";
import OrdersPage from "@/app/user/orders/page";
import { getMyOrders } from "@/lib/actions/order.actions";
import CONTENT_PAGE from "@/lib/content-page";
import { mockOrders } from "../mocks/test-data";

vi.mock("@/lib/actions/order.actions", () => ({
  getMyOrders: vi.fn(),
}));

vi.mock("@/auth", () => ({
  auth: vi.fn().mockResolvedValue(null),
}));

const mockedGetMyOrders = getMyOrders as Mock;

async function renderOrdersPage(page: string = "1"): Promise<RenderResult> {
  const Component = await OrdersPage({
    searchParams: Promise.resolve({ page }),
  });
  return render(Component);
}

describe("UserOrdersPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render h2 with correct text", async () => {
    mockedGetMyOrders.mockResolvedValue({
      data: [],
      totalPages: 1,
    });

    await renderOrdersPage();

    await waitFor(() => {
      const heading = screen.getByRole("heading", { level: 2 });
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveTextContent(CONTENT_PAGE.USER_ORDERS_PAGE.orders);
    });
  });

  it("should render table headers correctly", async () => {
    mockedGetMyOrders.mockResolvedValue({
      data: [],
      totalPages: 1,
    });

    await renderOrdersPage();

    await waitFor(() => {
      expect(
        screen.getByText(CONTENT_PAGE.USER_ORDERS_PAGE.orderId)
      ).toBeInTheDocument();
      expect(
        screen.getByText(CONTENT_PAGE.USER_ORDERS_PAGE.date)
      ).toBeInTheDocument();
      expect(
        screen.getByText(CONTENT_PAGE.USER_ORDERS_PAGE.total)
      ).toBeInTheDocument();
      expect(
        screen.getByText(CONTENT_PAGE.USER_ORDERS_PAGE.paid)
      ).toBeInTheDocument();
      expect(
        screen.getByText(CONTENT_PAGE.USER_ORDERS_PAGE.delivered)
      ).toBeInTheDocument();
      expect(
        screen.getByText(CONTENT_PAGE.USER_ORDERS_PAGE.actions)
      ).toBeInTheDocument();
    });
  });

  it("should render orders when they exist", async () => {
    mockedGetMyOrders.mockResolvedValue({
      data: mockOrders,
      totalPages: 1,
    });

    await renderOrdersPage();

    await waitFor(() => {
      // formatId takes last 6 chars and prepends ".."
      // "order-1" -> "..rder-1", "order-2" -> "..rder-2"
      expect(screen.getByText("..rder-1")).toBeInTheDocument();
      expect(screen.getByText("..rder-2")).toBeInTheDocument();
    });
  });

  it("should render empty table body when no orders", async () => {
    mockedGetMyOrders.mockResolvedValue({
      data: [],
      totalPages: 1,
    });

    await renderOrdersPage();

    await waitFor(() => {
      const table = screen.getByRole("table");
      expect(table).toBeInTheDocument();
      // Table should only have header row, no data rows
      const rows = screen.getAllByRole("row");
      expect(rows).toHaveLength(1); // Only header row
    });
  });

  it("should render pagination when totalPages > 1", async () => {
    mockedGetMyOrders.mockResolvedValue({
      data: mockOrders,
      totalPages: 3,
    });

    await renderOrdersPage("1");

    await waitFor(() => {
      expect(
        screen.getByText(CONTENT_PAGE.PAGINATION.previous)
      ).toBeInTheDocument();
      expect(
        screen.getByText(CONTENT_PAGE.PAGINATION.next)
      ).toBeInTheDocument();
    });
  });

  it("should not render pagination when totalPages <= 1", async () => {
    mockedGetMyOrders.mockResolvedValue({
      data: mockOrders,
      totalPages: 1,
    });

    await renderOrdersPage();

    await waitFor(() => {
      expect(
        screen.queryByText(CONTENT_PAGE.PAGINATION.previous)
      ).not.toBeInTheDocument();
      expect(
        screen.queryByText(CONTENT_PAGE.PAGINATION.next)
      ).not.toBeInTheDocument();
    });
  });

  it("should render paid status correctly for paid order", async () => {
    mockedGetMyOrders.mockResolvedValue({
      data: [mockOrders[0]], // Paid order
      totalPages: 1,
    });

    await renderOrdersPage();

    await waitFor(() => {
      // Should show date/time, not "Not Paid"
      expect(
        screen.queryByText(CONTENT_PAGE.USER_ORDERS_PAGE.notPaid)
      ).not.toBeInTheDocument();
    });
  });

  it("should render not paid status correctly for unpaid order", async () => {
    mockedGetMyOrders.mockResolvedValue({
      data: [mockOrders[1]], // Unpaid order
      totalPages: 1,
    });

    await renderOrdersPage();

    await waitFor(() => {
      expect(
        screen.getByText(CONTENT_PAGE.USER_ORDERS_PAGE.notPaid)
      ).toBeInTheDocument();
    });
  });

  it("should render not delivered status correctly for undelivered order", async () => {
    mockedGetMyOrders.mockResolvedValue({
      data: [mockOrders[0]], // Undelivered order
      totalPages: 1,
    });

    await renderOrdersPage();

    await waitFor(() => {
      expect(
        screen.getByText(CONTENT_PAGE.USER_ORDERS_PAGE.notDelivered)
      ).toBeInTheDocument();
    });
  });

  it("should render Details link for each order", async () => {
    mockedGetMyOrders.mockResolvedValue({
      data: mockOrders,
      totalPages: 1,
    });

    await renderOrdersPage();

    await waitFor(() => {
      const detailsLinks = screen.getAllByText("Details");
      expect(detailsLinks).toHaveLength(2);
    });
  });

  it("should call getMyOrders with correct page number", async () => {
    mockedGetMyOrders.mockResolvedValue({
      data: [],
      totalPages: 1,
    });

    await renderOrdersPage("2");

    await waitFor(() => {
      expect(mockedGetMyOrders).toHaveBeenCalledWith({ page: 2 });
    });
  });

  it("should default to page 1 when page is not provided", async () => {
    mockedGetMyOrders.mockResolvedValue({
      data: [],
      totalPages: 1,
    });

    const Component = await OrdersPage({
      searchParams: Promise.resolve({} as { page: string }),
    });
    render(Component);

    await waitFor(() => {
      expect(mockedGetMyOrders).toHaveBeenCalledWith({ page: 1 });
    });
  });
});
