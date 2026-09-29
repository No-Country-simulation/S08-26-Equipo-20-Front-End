import { cleanup, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { TeamsSection } from "@/components/admin/TeamsSection";
import {
  createTeam,
  deleteTeam,
  listTeams,
  updateTeam,
} from "@/services/teams";
import { listUsers, updateUser } from "@/services/users";
import { ApiError } from "@/services/http";
import type { Team } from "@/types/teams";
import type { SystemUser } from "@/types/users";

vi.mock("@/services/teams", () => ({
  listTeams: vi.fn(),
  createTeam: vi.fn(),
  updateTeam: vi.fn(),
  deleteTeam: vi.fn(),
}));

vi.mock("@/services/users", () => ({
  listUsers: vi.fn(),
  updateUser: vi.fn(),
}));

function makeTeam(overrides: Partial<Team> = {}): Team {
  return {
    id: 1,
    name: "Soporte",
    description: "Equipo de soporte",
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-01-01T00:00:00Z",
    ...overrides,
  };
}

function makeUser(overrides: Partial<SystemUser> = {}): SystemUser {
  return {
    id: 10,
    name: "Ana Gomez",
    email: "ana.gomez@empresa.com",
    role: "AGENT",
    team: "Soporte",
    role_id: 2,
    team_id: 1,
    must_change_password: false,
    is_active: true,
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-01-01T00:00:00Z",
    ...overrides,
  };
}

function renderTeamsSection() {
  render(<TeamsSection />);
}

describe("TeamsSection", () => {
  beforeEach(() => {
    vi.mocked(listTeams).mockResolvedValue({
      items: [makeTeam()],
      total: 1,
    });
    vi.mocked(listUsers).mockResolvedValue({
      items: [
        makeUser(),
        makeUser({
          id: 11,
          name: "Luis Perez",
          email: "luis.perez@empresa.com",
          team: null,
          team_id: null,
        }),
        makeUser({
          id: 12,
          name: "Sofia Diaz",
          email: "sofia.diaz@empresa.com",
          team: "Mesa de ayuda",
          team_id: 2,
        }),
      ],
      total: 3,
    });
    vi.mocked(updateUser).mockResolvedValue(makeUser());
  });

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it("muestra los equipos cargados", async () => {
    renderTeamsSection();

    expect(await screen.findByText("Soporte")).toBeInTheDocument();
    expect(screen.getByText("Equipo de soporte")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Crear Equipo" })).toBeInTheDocument();
  });

  it("muestra el estado vacío cuando no hay equipos", async () => {
    vi.mocked(listTeams).mockResolvedValue({ items: [], total: 0 });
    renderTeamsSection();

    expect(await screen.findByText("No hay equipos")).toBeInTheDocument();
  });

  it("muestra un mensaje claro si falla la carga", async () => {
    vi.mocked(listTeams).mockRejectedValue(
      new ApiError("Error interno del servidor", 500),
    );
    renderTeamsSection();

    expect(
      await screen.findByText("Error interno del servidor"),
    ).toBeInTheDocument();
  });

  it("crea un equipo y recarga la lista", async () => {
    const user = userEvent.setup();
    vi.mocked(createTeam).mockResolvedValue(
      makeTeam({ id: 2, name: "Mesa de ayuda" }),
    );
    renderTeamsSection();

    await user.click(
      await screen.findByRole("button", { name: "Crear Equipo" }),
    );
    const dialog = await screen.findByRole("dialog", { name: "Crear Equipo" });
    await user.type(within(dialog).getByLabelText("Nombre"), "Mesa de ayuda");
    await user.click(
      within(dialog).getByRole("button", { name: "Crear Equipo" }),
    );

    await waitFor(() =>
      expect(createTeam).toHaveBeenCalledWith({
        name: "Mesa de ayuda",
        description: null,
      }),
    );
    await waitFor(() =>
      expect(
        screen.queryByRole("dialog", { name: "Crear Equipo" }),
      ).not.toBeInTheDocument(),
    );
    expect(listTeams).toHaveBeenCalledTimes(2);
  });

  it("edita un equipo existente", async () => {
    const user = userEvent.setup();
    vi.mocked(updateTeam).mockResolvedValue(makeTeam());
    renderTeamsSection();

    await user.click(
      await screen.findByRole("button", { name: "Editar equipo Soporte" }),
    );
    await user.clear(screen.getByLabelText("Nombre"));
    await user.type(screen.getByLabelText("Nombre"), "Infraestructura");
    await user.click(screen.getByRole("button", { name: "Guardar Cambios" }));

    await waitFor(() =>
      expect(updateTeam).toHaveBeenCalledWith(1, {
        name: "Infraestructura",
        description: "Equipo de soporte",
      }),
    );
  });

  it("no reenvía el nombre cuando solo se edita la descripción", async () => {
    const user = userEvent.setup();
    vi.mocked(updateTeam).mockResolvedValue(makeTeam());
    renderTeamsSection();

    await user.click(
      await screen.findByRole("button", { name: "Editar equipo Soporte" }),
    );
    const dialog = await screen.findByRole("dialog", { name: "Editar Equipo" });
    await user.clear(within(dialog).getByLabelText("Descripción"));
    await user.type(
      within(dialog).getByLabelText("Descripción"),
      "Soporte de segundo nivel",
    );
    await user.click(within(dialog).getByRole("button", { name: "Guardar Cambios" }));

    await waitFor(() =>
      expect(updateTeam).toHaveBeenCalledWith(1, {
        description: "Soporte de segundo nivel",
      }),
    );
  });

  it("muestra los miembros actuales y agrega un usuario al equipo", async () => {
    const user = userEvent.setup();
    vi.mocked(updateTeam).mockResolvedValue(makeTeam());
    renderTeamsSection();

    await user.click(
      await screen.findByRole("button", { name: "Editar equipo Soporte" }),
    );
    const dialog = await screen.findByRole("dialog", { name: "Editar Equipo" });
    expect(within(dialog).getByText("Ana Gomez")).toBeInTheDocument();

    await user.click(within(dialog).getByText("Luis Perez"));
    await user.click(within(dialog).getByRole("button", { name: "Guardar Cambios" }));

    await waitFor(() =>
      expect(updateUser).toHaveBeenCalledWith(11, { team_id: 1 }),
    );
  });

  it("quita un miembro del equipo", async () => {
    const user = userEvent.setup();
    vi.mocked(updateTeam).mockResolvedValue(makeTeam());
    renderTeamsSection();

    await user.click(
      await screen.findByRole("button", { name: "Editar equipo Soporte" }),
    );
    const dialog = await screen.findByRole("dialog", { name: "Editar Equipo" });
    await user.click(
      within(dialog).getByRole("button", { name: "Quitar Ana Gomez del equipo" }),
    );
    await user.click(within(dialog).getByRole("button", { name: "Guardar Cambios" }));

    await waitFor(() =>
      expect(updateUser).toHaveBeenCalledWith(10, { team_id: null }),
    );
  });

  it("filtra los candidatos por nombre o email", async () => {
    const user = userEvent.setup();
    renderTeamsSection();

    await user.click(
      await screen.findByRole("button", { name: "Editar equipo Soporte" }),
    );
    const dialog = await screen.findByRole("dialog", { name: "Editar Equipo" });
    await user.type(
      within(dialog).getByLabelText("Buscar usuario para agregar al equipo"),
      "sofia",
    );

    const candidates = within(dialog).getByTestId("team-candidates");
    expect(within(candidates).getByText("Sofia Diaz")).toBeInTheDocument();
    expect(within(candidates).queryByText("Luis Perez")).not.toBeInTheDocument();
  });

  it("no actualiza los miembros si no cambiaron", async () => {
    const user = userEvent.setup();
    vi.mocked(updateTeam).mockResolvedValue(makeTeam());
    renderTeamsSection();

    await user.click(
      await screen.findByRole("button", { name: "Editar equipo Soporte" }),
    );
    const dialog = await screen.findByRole("dialog", { name: "Editar Equipo" });
    await user.click(within(dialog).getByRole("button", { name: "Guardar Cambios" }));

    await waitFor(() => expect(updateTeam).toHaveBeenCalled());
    expect(updateUser).not.toHaveBeenCalled();
  });

  it("elimina un equipo tras confirmar", async () => {
    const user = userEvent.setup();
    renderTeamsSection();

    await user.click(
      await screen.findByRole("button", { name: "Eliminar equipo Soporte" }),
    );
    expect(
      screen.getByText(
        '¿Deseás eliminar el equipo "Soporte"? Esta acción no se puede deshacer.',
      ),
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Eliminar" }));

    await waitFor(() => expect(deleteTeam).toHaveBeenCalledWith(1));
    await waitFor(() =>
      expect(
        screen.queryByRole("dialog", { name: "Eliminar Equipo" }),
      ).not.toBeInTheDocument(),
    );
  });
});