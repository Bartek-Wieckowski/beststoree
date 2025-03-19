import UserButton from "@/components/shared/header/UserButton";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, MockInstance, vi } from "vitest";

vi.mock("@/auth", () => ({
  auth: vi.fn().mockResolvedValue(null),
}));

describe("UserButton()", () => {
  beforeEach(async () => {
    render(await UserButton());
  });

  it("should have link to sign in page", () => {
    const link = screen.getByTestId("sign-in-button");
    expect(link).toHaveAttribute("href", "/sign-in");
  });

  it("should have button with user icon and Sign In text", () => {
    const button = screen.getByTestId("sign-in-button");
    const icon = button.querySelector("svg");
    expect(icon).toBeInTheDocument();
    expect(button).toHaveTextContent("Sign In");
  });
});

describe("UserButton() with logged in user", () => {
  beforeEach(async () => {
    const authModule = await import("@/auth");
    (authModule.auth as unknown as MockInstance).mockResolvedValueOnce({
      user: {
        name: "John Doe",
        email: "john@example.com",
      },
    });

    render(await UserButton());
  });

  it("should display user initial first letter when logged in", () => {
    const button = screen.getByText("J");
    expect(button).toBeInTheDocument();
  });

  it("should display user name and email", async () => {
    const userButton = screen.getByTestId("user-button");

    await userEvent.click(userButton);

    const userName = await screen.findByTestId("user-name");
    const userEmail = await screen.findByTestId("user-email");

    expect(userName).toBeInTheDocument();
    expect(userEmail).toBeInTheDocument();
    expect(userName).toHaveTextContent("John Doe");
    expect(userEmail).toHaveTextContent("john@example.com");
  });

  it("should render button with Sign Out text", async () => {
    const userButton = screen.getByTestId("user-button");

    await userEvent.click(userButton);

    const button = await screen.findByText("Sign Out");
    expect(button).toHaveTextContent("Sign Out");
  });
});
