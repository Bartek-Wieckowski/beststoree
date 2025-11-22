import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import UpdateUserForm from "@/components/admin/UpdateUserForm";

describe("AdminUsersUpdateForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  const user = {
    id: "user-123",
    name: "Test User",
    email: "test@example.com",
    role: "user",
  };

  describe("Form fields", () => {
    it("should render all input fields", () => {
      render(<UpdateUserForm user={user} />);

      const inputs = screen.getAllByRole("textbox");
      expect(inputs).toHaveLength(2);
    });

    it("should render all labels", () => {
      render(<UpdateUserForm user={user} />);

      expect(screen.getByText("Email")).toBeInTheDocument();
      expect(screen.getByText("Name")).toBeInTheDocument();
      expect(screen.getByText("Role")).toBeInTheDocument();
    });

    it("should render select for role", () => {
      render(<UpdateUserForm user={user} />);

      const selectButton = screen.getByRole("combobox");
      expect(selectButton).toBeInTheDocument();
      expect(selectButton.tagName).toBe("BUTTON");
      expect(selectButton).toHaveTextContent("User");
    });
  });
});
