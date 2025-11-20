import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import ProfilePage from "@/app/user/profile/page";

vi.mock("@/auth", () => ({
  auth: vi.fn().mockResolvedValue(null),
}));

describe("UserProfilePage", () => {
  beforeEach(async () => {
    vi.clearAllMocks();
    render(await ProfilePage());
  });

  it("should render h2 with correct text", async () => {
    await waitFor(() => {
      const heading = screen.getByRole("heading", { level: 2 });
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveTextContent("Profile");
    });
  });
});
