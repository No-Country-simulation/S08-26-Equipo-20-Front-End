import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { Brand } from "@/components/ui/Brand";

describe("Brand", () => {
  afterEach(() => {
    cleanup();
  });

  it("muestra el tagline", () => {
    render(<Brand tagline="Acceso Corporativo" />);

    expect(screen.getByText("Acceso Corporativo")).toBeInTheDocument();
  });

  it("no renderiza el texto visible de la marca", () => {
    const { container } = render(<Brand tagline="Acceso Corporativo" />);

    const wordmarkTexts = screen.getAllByText("ServiceFlow");
    expect(wordmarkTexts).toHaveLength(1);
    expect(wordmarkTexts[0].tagName.toLowerCase()).toBe("title");
    expect(container.querySelector("svg")).toContainElement(wordmarkTexts[0]);
  });

  it("omite el tagline cuando no se informa", () => {
    const { container } = render(<Brand />);

    expect(
      screen.getByRole("img", { name: "ServiceFlow" }),
    ).toBeInTheDocument();
    expect(container.querySelectorAll("span")).toHaveLength(1);
  });

  it("usa el tamaño grande cuando se solicita", () => {
    const { container } = render(<Brand size="lg" />);

    expect(container.querySelector("svg")).toHaveClass("h-14", "w-14");
  });

  it("usa el tamaño compacto por defecto", () => {
    const { container } = render(<Brand />);

    expect(container.querySelector("svg")).toHaveClass("h-10", "w-10");
  });

  it("expone el nombre accesible de la marca en el logo", () => {
    render(<Brand tagline="Área de Agente" />);

    expect(screen.getByRole("img", { name: "ServiceFlow" })).toBeInTheDocument();
  });
});
