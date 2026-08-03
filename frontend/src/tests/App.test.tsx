import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { DesignSystemRoutes } from "@/App";

describe("design system routes", () => {
  it("renders the overview page", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <DesignSystemRoutes />
      </MemoryRouter>,
    );

    expect(screen.getByText(/A premium luxury foundation built before the storefront/i)).toBeInTheDocument();
  });

  it("renders the cards page", () => {
    render(
      <MemoryRouter initialEntries={["/components/cards"]}>
        <DesignSystemRoutes />
      </MemoryRouter>,
    );

    expect(screen.getByText(/The product card is the signature component/i)).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: /Add to Cart/i })).toHaveLength(2);
  });
});
