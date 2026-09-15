import { cleanup, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { PrioritiesSection } from "@/components/admin/PrioritiesSection";
import {
  createPriority,
  deletePriority,
  listPriorities,
  updatePriority,
} from "@/services/priorities";
import { ApiError } from "@/services/http";
import type { Priority } from "@/types/priorities";

vi.mock("@/services/priorities", () => ({
  listPriorities: vi.fn(),
  createPriority: vi.fn(),
  updatePriority: vi.fn(),
  deletePriority: vi.fn(),
}));

function makePriority(overrides: Partial<Priority> = {}): Priority {
  return {
    id: 1,
    name: "Alta",
    level: 3,
    ...overrides,
  };
}

function renderPrioritiesSection() {
  render(<PrioritiesSection />);
}

describe("PrioritiesSection", () => {
  beforeEach(() => {
    vi.mocked(listPriorities).mockResolvedValue({
      items: [makePriority()],
      total: 1,
    });
  });

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it("muestra las prioridades cargadas", async () => {
    renderPrioritiesSection();

    expect(await screen.findByText("Alta")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Crear Prioridad" }),
    ).toBeInTheDocument();
  });

  it("muestra el estado vacío cuando no hay prioridades", async () => {
    vi.mocked(listPriorities).mockResolvedValue({ items: [], total: 0 });
    renderPrioritiesSection();

    expect(await screen.findByText("No hay prioridades")).toBeInTheDocument();
  });

  it("muestra un mensaje claro si falla la carga", async () => {
    vi.mocked(listPriorities).mockRejectedValue(
      new ApiError("Error interno del servidor", 500),
    );
    renderPrioritiesSection();

    expect(
      await screen.findByText("Error interno del servidor"),
    ).toBeInTheDocument();
  });

  it("crea una prioridad y recarga la lista", async () => {
    const user = userEvent.setup();
    vi.mocked(createPriority).mockResolvedValue(
      makePriority({ id: 2, name: "Urgente", level: 5 }),
    );
    renderPrioritiesSection();

    await user.click(
      await screen.findByRole("button", { name: "Crear Prioridad" }),
    );
    const dialog = await screen.findByRole("dialog", {
      name: "Crear Prioridad",
    });
    await user.type(within(dialog).getByLabelText("Nombre"), "Urgente");
    await user.type(within(dialog).getByLabelText("Nivel"), "5");
    await user.click(
      within(dialog).getByRole("button", { name: "Crear Prioridad" }),
    );

    await waitFor(() =>
      expect(createPriority).toHaveBeenCalledWith({ name: "Urgente", level: 5 }),
    );
    await waitFor(() =>
      expect(
        screen.queryByRole("dialog", { name: "Crear Prioridad" }),
      ).not.toBeInTheDocument(),
    );
    expect(listPriorities).toHaveBeenCalledTimes(2);
  });

  it("valida que el nivel esté entre 1 y 10", async () => {
    const user = userEvent.setup();
    renderPrioritiesSection();

    await user.click(
      await screen.findByRole("button", { name: "Crear Prioridad" }),
    );
    const dialog = await screen.findByRole("dialog", {
      name: "Crear Prioridad",
    });
    await user.type(within(dialog).getByLabelText("Nombre"), "Media");
    await user.type(within(dialog).getByLabelText("Nivel"), "15");
    await user.click(
      within(dialog).getByRole("button", { name: "Crear Prioridad" }),
    );

    expect(
      await screen.findByText("El nivel debe ser un número entre 1 y 10"),
    ).toBeInTheDocument();
    expect(createPriority).not.toHaveBeenCalled();
  });

  it("edita una prioridad existente", async () => {
    const user = userEvent.setup();
    vi.mocked(updatePriority).mockResolvedValue(makePriority());
    renderPrioritiesSection();

    await user.click(
      await screen.findByRole("button", { name: "Editar prioridad Alta" }),
    );
    const dialog = await screen.findByRole("dialog", {
      name: "Editar Prioridad",
    });
    await user.clear(within(dialog).getByLabelText("Nivel"));
    await user.type(within(dialog).getByLabelText("Nivel"), "4");
    await user.click(
      within(dialog).getByRole("button", { name: "Guardar Cambios" }),
    );

    await waitFor(() =>
      expect(updatePriority).toHaveBeenCalledWith(1, {
        name: "Alta",
        level: 4,
      }),
    );
  });

  it("elimina una prioridad tras confirmar", async () => {
    const user = userEvent.setup();
    renderPrioritiesSection();

    await user.click(
      await screen.findByRole("button", {
        name: "Eliminar prioridad Alta",
      }),
    );
    expect(
      screen.getByText(
        '¿Deseás eliminar la prioridad "Alta"? Esta acción no se puede deshacer.',
      ),
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Eliminar" }));

    await waitFor(() => expect(deletePriority).toHaveBeenCalledWith(1));
    await waitFor(() =>
      expect(
        screen.queryByRole("dialog", { name: "Eliminar Prioridad" }),
      ).not.toBeInTheDocument(),
    );
  });
});