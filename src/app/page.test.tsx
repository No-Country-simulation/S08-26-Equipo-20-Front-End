import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Home from "./page";

describe("Home", () => {
  it("muestra la marca y el acceso corporativo", () => {
    render(<Home />);

    expect(
      screen.getByRole("heading", { name: /serviceflow/i }),
    ).toBeInTheDocument();
    expect(screen.getByText("Acceso Corporativo")).toBeInTheDocument();
  });
});