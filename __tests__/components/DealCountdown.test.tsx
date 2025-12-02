import { render, screen, act } from "@testing-library/react";
import { describe, expect, it, afterEach, vi } from "vitest";
import DealCountdown from "@/components/PromotionCountdown";
import CONTENT_PAGE from "@/lib/content-page";

describe("DealCountdown()", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it("should render countdown with correct values when deal is active", async () => {
    // Set current date - TARGET_DATE will be today + 2 days (2025-12-22)
    const mockDate = new Date("2025-12-20T12:00:00");
    vi.useFakeTimers({ now: mockDate });

    render(<DealCountdown />);

    // Advance timers to allow useEffect to run
    await act(async () => {
      vi.advanceTimersByTime(100);
    });

    expect(
      screen.getByText(CONTENT_PAGE.DEAL_COUNTDOWN.dealOfTheMonth)
    ).toBeInTheDocument();
    expect(
      screen.getByText(CONTENT_PAGE.DEAL_COUNTDOWN.dealOfTheMonthDescription)
    ).toBeInTheDocument();
    expect(
      screen.getByText(CONTENT_PAGE.DEAL_COUNTDOWN.days)
    ).toBeInTheDocument();
    expect(
      screen.getByText(CONTENT_PAGE.DEAL_COUNTDOWN.hours)
    ).toBeInTheDocument();
    expect(
      screen.getByText(CONTENT_PAGE.DEAL_COUNTDOWN.minutes)
    ).toBeInTheDocument();
    expect(
      screen.getByText(CONTENT_PAGE.DEAL_COUNTDOWN.seconds)
    ).toBeInTheDocument();
  });
});
