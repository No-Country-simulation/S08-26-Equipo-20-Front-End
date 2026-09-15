import { cleanup, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { CategoriesSection } from "@/components/admin/CategoriesSection";
import {
  createCategory,
  deleteCategory,
  listCategories,
  updateCategory,
} from "@/services/categories";
import { ApiError } from "@/services/http";
import type { Category } from "@/types/categories";

vi.mock("@/services/categories", () => ({
  listCategories: vi.fn(),
  createCategory: vi.fn(),
  updateCategory: vi.fn(),
  deleteCategory: vi.fn(),
}));

function makeCategory(overrides: Partial<Category> = {}): Category {
  return {
    id: 1,
    name: "Hardware",
    description: "Problemas de hardware",
    requires_approval: false,
    ...overrides,
  };
}

function renderCategoriesSection() {
  render(<CategoriesSection />);
}

describe("CategoriesSection", () => {
  beforeEach(() => {
    vi.mocked(listCategories).mockResolvedValue({
      items: [makeCategory()],
      total: 1,
    });
  });

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it("muestra las categorías cargadas", async () => {
    renderCategoriesSection();

    expect(await screen.findByText("Hardware")).toBeInTheDocument();
    expect(screen.getByText("Problemas de hardware")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Crear Categoría" }),
    ).toBeInTheDocument();
  });

  it("muestra el estado vacío cuando no hay categorías", async () => {
    vi.mocked(listCategories).mockResolvedValue({ items: [], total: 0 });
    renderCategoriesSection();

    expect(await screen.findByText("No hay categorías")).toBeInTheDocument();
  });

  it("muestra un mensaje claro si falla la carga", async () => {
    vi.mocked(listCategories).mockRejectedValue(
      new ApiError("Error interno del servidor", 500),
    );
    renderCategoriesSection();

    expect(
      await screen.findByText("Error interno del servidor"),
    ).toBeInTheDocument();
  });

  it("crea una categoría y recarga la lista", async () => {
    const user = userEvent.setup();
    vi.mocked(createCategory).mockResolvedValue(
      makeCategory({ id: 2, name: "Software" }),
    );
    renderCategoriesSection();

    await user.click(
      await screen.findByRole("button", { name: "Crear Categoría" }),
    );
    const dialog = await screen.findByRole("dialog", {
      name: "Crear Categoría",
    });
    await user.type(within(dialog).getByLabelText("Nombre"), "Software");
    await user.click(
      within(dialog).getByRole("button", { name: "Crear Categoría" }),
    );

    await waitFor(() =>
      expect(createCategory).toHaveBeenCalledWith({
        name: "Software",
        description: null,
        requires_approval: false,
      }),
    );
    await waitFor(() =>
      expect(
        screen.queryByRole("dialog", { name: "Crear Categoría" }),
      ).not.toBeInTheDocument(),
    );
    expect(listCategories).toHaveBeenCalledTimes(2);
  });

  it("edita una categoría existente", async () => {
    const user = userEvent.setup();
    vi.mocked(updateCategory).mockResolvedValue(makeCategory());
    renderCategoriesSection();

    await user.click(
      await screen.findByRole("button", { name: "Editar categoría Hardware" }),
    );
    const dialog = await screen.findByRole("dialog", {
      name: "Editar Categoría",
    });
    await user.clear(within(dialog).getByLabelText("Nombre"));
    await user.type(within(dialog).getByLabelText("Nombre"), "Redes");
    await user.click(
      within(dialog).getByRole("button", { name: "Guardar Cambios" }),
    );

    await waitFor(() =>
      expect(updateCategory).toHaveBeenCalledWith(1, {
        name: "Redes",
        description: "Problemas de hardware",
        requires_approval: false,
      }),
    );
  });

  it("elimina una categoría tras confirmar", async () => {
    const user = userEvent.setup();
    renderCategoriesSection();

    await user.click(
      await screen.findByRole("button", {
        name: "Eliminar categoría Hardware",
      }),
    );
    expect(
      screen.getByText(
        '¿Deseás eliminar la categoría "Hardware"? Esta acción no se puede deshacer.',
      ),
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Eliminar" }));

    await waitFor(() => expect(deleteCategory).toHaveBeenCalledWith(1));
    await waitFor(() =>
      expect(
        screen.queryByRole("dialog", { name: "Eliminar Categoría" }),
      ).not.toBeInTheDocument(),
    );
  });
});