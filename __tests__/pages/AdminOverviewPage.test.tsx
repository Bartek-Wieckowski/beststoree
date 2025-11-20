import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import AdminOverviewPage from "@/app/admin/overview/page";
import { Session } from "next-auth";
import { getOrderSummary } from "@/lib/actions/order.actions";
import { auth } from "@/auth";

vi.mock("@/auth", () => ({
  auth: vi.fn().mockResolvedValue(null),
}));

vi.mock("@/lib/actions/order.actions", () => ({
  getOrderSummary: vi.fn(),
}));

const mockedAuth = auth as Mock;
const mockedGetOrderSummary = getOrderSummary as Mock;

describe("AdminOverviewPage", () => {
  beforeEach(async () => {
    vi.clearAllMocks();

    mockedAuth.mockResolvedValue({
      user: {
        id: "admin-user-id",
        role: "admin",
      },
    } as Session);

    mockedGetOrderSummary.mockResolvedValue({
      ordersCount: 10,
      productsCount: 20,
      usersCount: 5,
      totalSales: {
        _sum: {
          totalPrice: 1000,
        },
      },
      latestSales: [],
      salesData: [],
    });

    render(await AdminOverviewPage());
  });

  it("should render h1 with correct text", () => {
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent("Admin Dashboard");
  });
});
