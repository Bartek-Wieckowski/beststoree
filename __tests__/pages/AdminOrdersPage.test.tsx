import {
  fireEvent,
  render,
  RenderResult,
  screen,
  waitFor,
  act,
  within,
} from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import { Session } from "next-auth";
import { auth } from "@/auth";
import { getAllOrders, deleteOrder } from "@/lib/actions/order.actions";
import AdminOrdersPage from "@/app/admin/orders/page";

vi.mock("@/auth", () => ({
  auth: vi.fn().mockResolvedValue(null),
}));

vi.mock("@/lib/actions/order.actions", () => ({
  getAllOrders: vi.fn(),
  deleteOrder: vi.fn(),
}));

const mockedAuth = auth as Mock;
const mockedGetAllOrders = getAllOrders as Mock;
const mockedDeleteOrder = deleteOrder as Mock;

async function renderAdminOrdersPage(
  page: string = "1",
  query: string = "all"
): Promise<RenderResult> {
  const Component = await AdminOrdersPage({
    searchParams: Promise.resolve({ page, query }),
  });
  return render(Component);
}

describe("AdminOrdersPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockedAuth.mockResolvedValue({
      user: {
        id: "admin-user-id",
        role: "admin",
      },
    } as Session);

    mockedGetAllOrders.mockResolvedValue({
      data: [],
      totalPages: 1,
    });
  });

  it("should render each table header with correct text", async () => {
    await renderAdminOrdersPage();

    expect(screen.getByText("Order ID")).toBeInTheDocument();
    expect(screen.getByText("Date")).toBeInTheDocument();
    expect(screen.getByText("Buyer")).toBeInTheDocument();
    expect(screen.getByText("Total")).toBeInTheDocument();
    expect(screen.getByText("Paid")).toBeInTheDocument();
    expect(screen.getByText("Delivered")).toBeInTheDocument();
    expect(screen.getByText("Actions")).toBeInTheDocument();
  });

  it("should delete order when user clicks delete button", async () => {
    const mockOrders = [
      {
        id: "order-1",
        createdAt: new Date("2024-01-01"),
        totalPrice: "100.00",
        isPaid: true,
        paidAt: new Date("2024-01-01"),
        isDelivered: false,
        deliveredAt: null,
        user: { name: "John Doe" },
      },
      {
        id: "order-2",
        createdAt: new Date("2024-01-02"),
        totalPrice: "200.00",
        isPaid: false,
        paidAt: null,
        isDelivered: false,
        deliveredAt: null,
        user: { name: "Jane Smith" },
      },
    ];

    mockedGetAllOrders.mockResolvedValue({
      data: mockOrders,
      totalPages: 1,
    });

    mockedDeleteOrder.mockResolvedValue({
      success: true,
      message: "Order deleted successfully",
    });

    const { rerender } = await renderAdminOrdersPage();

    // Sprawdź, że początkowo są 2 zamówienia
    expect(screen.getByText("..rder-1")).toBeInTheDocument();
    expect(screen.getByText("..rder-2")).toBeInTheDocument();

    // Znajdź pierwszy przycisk Delete i kliknij go
    const deleteButtons = screen.getAllByText("Delete");
    await act(async () => {
      fireEvent.click(deleteButtons[0]);
    });

    // Poczekaj na otwarcie dialogu
    const dialog = await waitFor(() => {
      return screen.getByRole("alertdialog");
    });

    // Znajdź przycisk potwierdzający w dialogu używając within
    const { getByRole: getByRoleInDialog } = within(dialog);
    const confirmButton = getByRoleInDialog("button", { name: /^delete$/i });

    // Zaktualizuj mock, żeby zwracał tylko 1 zamówienie po usunięciu
    mockedGetAllOrders.mockResolvedValue({
      data: [mockOrders[1]], // tylko drugie zamówienie
      totalPages: 1,
    });

    // Kliknij przycisk potwierdzający
    await act(async () => {
      fireEvent.click(confirmButton);
    });

    // Poczekaj na zakończenie usuwania
    await waitFor(() => {
      expect(mockedDeleteOrder).toHaveBeenCalledWith("order-1");
    });

    // Re-renderuj komponent z zaktualizowanymi danymi
    const UpdatedComponent = await AdminOrdersPage({
      searchParams: Promise.resolve({ page: "1", query: "all" }),
    });
    rerender(UpdatedComponent);

    // Sprawdź, że zostało tylko 1 zamówienie
    await waitFor(() => {
      expect(screen.queryByText("..rder-1")).not.toBeInTheDocument();
      expect(screen.getByText("..rder-2")).toBeInTheDocument();
    });
  });
});
