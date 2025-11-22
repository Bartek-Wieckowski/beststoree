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
import { getAllUsers, deleteUser } from "@/lib/actions/user.actions";
import AdminUsersPage from "@/app/admin/users/page";

vi.mock("@/auth", () => ({
  auth: vi.fn().mockResolvedValue(null),
}));

vi.mock("@/lib/actions/user.actions", () => ({
  getAllUsers: vi.fn(),
  deleteUser: vi.fn(),
}));

const mockedAuth = auth as Mock;
const mockedGetAllUsers = getAllUsers as Mock;
const mockedDeleteUser = deleteUser as Mock;

async function renderAdminUsersPage(
  page: string = "1",
  query: string = "all"
): Promise<RenderResult> {
  const Component = await AdminUsersPage({
    searchParams: Promise.resolve({ page, query }),
  });
  return render(Component);
}

describe("AdminUsersPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockedAuth.mockResolvedValue({
      user: {
        id: "admin-user-id",
        role: "admin",
      },
    } as Session);

    mockedGetAllUsers.mockResolvedValue({
      data: [],
      totalPages: 1,
    });
  });

  it("should render each table header with correct text", async () => {
    await renderAdminUsersPage();

    expect(screen.getByText("ID")).toBeInTheDocument();
    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Email")).toBeInTheDocument();
    expect(screen.getByText("Role")).toBeInTheDocument();
    expect(screen.getByText("Actions")).toBeInTheDocument();
  });

  it("should delete order when user clicks delete button", async () => {
    const mockUsers = [
      {
        id: "user-1",
        createdAt: new Date("2024-01-01"),
        email: "john.doe@example.com",
        role: "user",
      },
      {
        id: "user-2",
        createdAt: new Date("2024-01-02"),
        email: "jane.smith@example.com",
        role: "admin",
      },
    ];

    mockedGetAllUsers.mockResolvedValue({
      data: mockUsers,
      totalPages: 1,
    });

    mockedDeleteUser.mockResolvedValue({
      success: true,
      message: "User deleted successfully",
    });

    const { rerender } = await renderAdminUsersPage();

    // Sprawdź, że początkowo są 2 zamówienia
    expect(screen.getByText("..user-1")).toBeInTheDocument();
    expect(screen.getByText("..user-2")).toBeInTheDocument();

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
    mockedGetAllUsers.mockResolvedValue({
      data: [mockUsers[1]], // tylko drugie użytkownika
      totalPages: 1,
    });

    // Kliknij przycisk potwierdzający
    await act(async () => {
      fireEvent.click(confirmButton);
    });

    // Poczekaj na zakończenie usuwania
    await waitFor(() => {
      expect(mockedDeleteUser).toHaveBeenCalledWith("user-1");
    });

    // Re-renderuj komponent z zaktualizowanymi danymi
    const UpdatedComponent = await AdminUsersPage({
      searchParams: Promise.resolve({ page: "1", query: "all" }),
    });
    rerender(UpdatedComponent);

    // Sprawdź, że zostało tylko 1 użytkownik
    await waitFor(() => {
      expect(screen.queryByText("..user-1")).not.toBeInTheDocument();
      expect(screen.getByText("..user-2")).toBeInTheDocument();
    });
  });
});
