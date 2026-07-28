import { render, screen } from "@testing-library/react";
import { Button } from "@/components/primitives/Button";

describe("Button", () => {
  it("renders loading state accessibly", () => {
    render(<Button loading>Saving</Button>);

    expect(screen.getByRole("button", { name: /Saving/i })).toBeDisabled();
  });

  it("supports outline variant styling", () => {
    render(<Button variant="outline">Outline</Button>);

    expect(screen.getByRole("button", { name: /Outline/i }).className).toContain("border");
  });
});
