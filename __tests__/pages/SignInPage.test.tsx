import { render, RenderResult, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import SignInPage from "@/app/(auth)/sign-in/page";

vi.mock("@/auth", () => ({
  auth: vi.fn().mockResolvedValue(null),
}));

async function renderSignInPage(): Promise<RenderResult> {
  const Component = await SignInPage({
    searchParams: Promise.resolve({ callbackUrl: "/" }),
  });
  return render(Component);
}

describe("SignInPage", () => {
  it("should show sign in title", async () => {
    await renderSignInPage();

    expect(screen.getByTestId("sign-in-title")).toBeInTheDocument();
    expect(screen.getByTestId("sign-in-title")).toHaveTextContent("Sign In");
  });

  it("should render credentials form component", async () => {
    await renderSignInPage();
    expect(screen.getByText("Email")).toBeInTheDocument();
    expect(screen.getByText("Password")).toBeInTheDocument();
  });
});
