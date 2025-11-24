import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import ProductRating from "@/components/shared/product/ProductRating";

describe("ProductRating()", () => {
  it("should render 5 empty stars for value 0", () => {
    const { container } = render(<ProductRating value={0} />);
    const svgs = container.querySelectorAll("svg");
    expect(svgs).toHaveLength(5);
    // Check that all stars are empty (have the empty star path)
    svgs.forEach((svg) => {
      const path = svg.querySelector("path");
      expect(path).toBeInTheDocument();
      // Empty star has a specific path that includes "M2.866"
      expect(path?.getAttribute("d")).toContain("M2.866");
    });
  });

  it("should render 1 half star and 4 empty stars for value 0.5", () => {
    const { container } = render(<ProductRating value={0.5} />);
    const svgs = container.querySelectorAll("svg");
    expect(svgs).toHaveLength(5);
    // First star should be half
    const firstPath = svgs[0].querySelector("path");
    expect(firstPath?.getAttribute("d")).toContain("M5.354");
    // Rest should be empty
    for (let i = 1; i < 5; i++) {
      const path = svgs[i].querySelector("path");
      expect(path?.getAttribute("d")).toContain("M2.866");
    }
  });

  it("should render 1 full star and 4 empty stars for value 1", () => {
    const { container } = render(<ProductRating value={1} />);
    const svgs = container.querySelectorAll("svg");
    expect(svgs).toHaveLength(5);
    // First star should be full
    const firstPath = svgs[0].querySelector("path");
    expect(firstPath?.getAttribute("d")).toContain("M3.612");
    // Rest should be empty
    for (let i = 1; i < 5; i++) {
      const path = svgs[i].querySelector("path");
      expect(path?.getAttribute("d")).toContain("M2.866");
    }
  });

  it("should render 1 full star, 1 half star, and 3 empty stars for value 1.5", () => {
    const { container } = render(<ProductRating value={1.5} />);
    const svgs = container.querySelectorAll("svg");
    expect(svgs).toHaveLength(5);
    // First star should be full
    expect(svgs[0].querySelector("path")?.getAttribute("d")).toContain(
      "M3.612"
    );
    // Second star should be half
    expect(svgs[1].querySelector("path")?.getAttribute("d")).toContain(
      "M5.354"
    );
    // Rest should be empty
    for (let i = 2; i < 5; i++) {
      const path = svgs[i].querySelector("path");
      expect(path?.getAttribute("d")).toContain("M2.866");
    }
  });

  it("should render 2 full stars and 3 empty stars for value 2", () => {
    const { container } = render(<ProductRating value={2} />);
    const svgs = container.querySelectorAll("svg");
    expect(svgs).toHaveLength(5);
    // First two stars should be full
    expect(svgs[0].querySelector("path")?.getAttribute("d")).toContain(
      "M3.612"
    );
    expect(svgs[1].querySelector("path")?.getAttribute("d")).toContain(
      "M3.612"
    );
    // Rest should be empty
    for (let i = 2; i < 5; i++) {
      const path = svgs[i].querySelector("path");
      expect(path?.getAttribute("d")).toContain("M2.866");
    }
  });

  it("should render 2 full stars, 1 half star, and 2 empty stars for value 2.5", () => {
    const { container } = render(<ProductRating value={2.5} />);
    const svgs = container.querySelectorAll("svg");
    expect(svgs).toHaveLength(5);
    // First two stars should be full
    expect(svgs[0].querySelector("path")?.getAttribute("d")).toContain(
      "M3.612"
    );
    expect(svgs[1].querySelector("path")?.getAttribute("d")).toContain(
      "M3.612"
    );
    // Third star should be half
    expect(svgs[2].querySelector("path")?.getAttribute("d")).toContain(
      "M5.354"
    );
    // Rest should be empty
    for (let i = 3; i < 5; i++) {
      const path = svgs[i].querySelector("path");
      expect(path?.getAttribute("d")).toContain("M2.866");
    }
  });

  it("should render 3 full stars and 2 empty stars for value 3", () => {
    const { container } = render(<ProductRating value={3} />);
    const svgs = container.querySelectorAll("svg");
    expect(svgs).toHaveLength(5);
    // First three stars should be full
    for (let i = 0; i < 3; i++) {
      expect(svgs[i].querySelector("path")?.getAttribute("d")).toContain(
        "M3.612"
      );
    }
    // Rest should be empty
    for (let i = 3; i < 5; i++) {
      const path = svgs[i].querySelector("path");
      expect(path?.getAttribute("d")).toContain("M2.866");
    }
  });

  it("should render 3 full stars, 1 half star, and 1 empty star for value 3.5", () => {
    const { container } = render(<ProductRating value={3.5} />);
    const svgs = container.querySelectorAll("svg");
    expect(svgs).toHaveLength(5);
    // First three stars should be full
    for (let i = 0; i < 3; i++) {
      expect(svgs[i].querySelector("path")?.getAttribute("d")).toContain(
        "M3.612"
      );
    }
    // Fourth star should be half
    expect(svgs[3].querySelector("path")?.getAttribute("d")).toContain(
      "M5.354"
    );
    // Last should be empty
    expect(svgs[4].querySelector("path")?.getAttribute("d")).toContain(
      "M2.866"
    );
  });

  it("should render 4 full stars and 1 empty star for value 4", () => {
    const { container } = render(<ProductRating value={4} />);
    const svgs = container.querySelectorAll("svg");
    expect(svgs).toHaveLength(5);
    // First four stars should be full
    for (let i = 0; i < 4; i++) {
      expect(svgs[i].querySelector("path")?.getAttribute("d")).toContain(
        "M3.612"
      );
    }
    // Last should be empty
    expect(svgs[4].querySelector("path")?.getAttribute("d")).toContain(
      "M2.866"
    );
  });

  it("should render 4 full stars and 1 half star for value 4.5", () => {
    const { container } = render(<ProductRating value={4.5} />);
    const svgs = container.querySelectorAll("svg");
    expect(svgs).toHaveLength(5);
    // First four stars should be full
    for (let i = 0; i < 4; i++) {
      expect(svgs[i].querySelector("path")?.getAttribute("d")).toContain(
        "M3.612"
      );
    }
    // Last should be half
    expect(svgs[4].querySelector("path")?.getAttribute("d")).toContain(
      "M5.354"
    );
  });

  it("should render 5 full stars for value 5", () => {
    const { container } = render(<ProductRating value={5} />);
    const svgs = container.querySelectorAll("svg");
    expect(svgs).toHaveLength(5);
    // All stars should be full
    svgs.forEach((svg) => {
      const path = svg.querySelector("path");
      expect(path?.getAttribute("d")).toContain("M3.612");
    });
  });

  it("should render caption when provided", () => {
    render(<ProductRating value={4.5} caption="(123 reviews)" />);
    expect(screen.getByText("(123 reviews)")).toBeInTheDocument();
  });

  it("should not render caption when not provided", () => {
    const { container } = render(<ProductRating value={4.5} />);
    const caption = container.querySelector("span");
    expect(caption).not.toBeInTheDocument();
  });

  it("should have correct CSS classes", () => {
    const { container } = render(<ProductRating value={3} />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass("flex", "gap-2");

    const starsContainer = wrapper.firstChild as HTMLElement;
    expect(starsContainer).toHaveClass("flex", "gap-1");

    const svgs = container.querySelectorAll("svg");
    svgs.forEach((svg) => {
      expect(svg).toHaveClass(
        "text-yellow-500",
        "w-5",
        "h-auto",
        "fill-current"
      );
    });
  });

  it("should render caption with correct CSS class", () => {
    render(<ProductRating value={3} caption="Test caption" />);
    const caption = screen.getByText("Test caption");
    expect(caption).toHaveClass("text-sm");
  });
});
