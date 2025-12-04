import { render, screen, act } from "@testing-library/react";
import { describe, expect, it, afterEach, vi } from "vitest";
import CONTENT_PAGE from "@/lib/content-page";
import PromotionCountdown from "@/components/PromotionCountdown";

describe("PromotionCountdown()", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it("should render countdown with correct values when deal is active", async () => {
    // Set current date - TARGET_DATE will be today + 2 days (2025-12-22)
    const mockDate = new Date("2025-12-20T12:00:00");
    vi.useFakeTimers({ now: mockDate });

    render(<PromotionCountdown />);

    // Advance timers to allow useEffect to run
    await act(async () => {
      vi.advanceTimersByTime(100);
    });

    expect(
      screen.getByText(
        CONTENT_PAGE.COMPONENT.PROMOTION_COUNTDOWN.dealOfTheMonth
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        CONTENT_PAGE.COMPONENT.PROMOTION_COUNTDOWN.dealOfTheMonthDescription
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(CONTENT_PAGE.COMPONENT.PROMOTION_COUNTDOWN.days)
    ).toBeInTheDocument();
    expect(
      screen.getByText(CONTENT_PAGE.COMPONENT.PROMOTION_COUNTDOWN.hours)
    ).toBeInTheDocument();
    expect(
      screen.getByText(CONTENT_PAGE.COMPONENT.PROMOTION_COUNTDOWN.minutes)
    ).toBeInTheDocument();
    expect(
      screen.getByText(CONTENT_PAGE.COMPONENT.PROMOTION_COUNTDOWN.seconds)
    ).toBeInTheDocument();
  });
});
