import { cleanup, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { UsersSection } from "@/components/admin/UsersSection";
import {
  activateUser,
  createUser,
  deactivateUser,
  listUsers,
  updateUser,
} from "@/services/users";
import { listTeams } from "@/services/teams";
import { ApiError } from "@/services/http";
import type { SystemUser, UserCreateResult } from "@/types/users";
import type { Team } from "@/types/teams";

vi.mock("@/services/users", () => ({
  listUsers: vi.fn(),
  createUser: vi.fn(),
  updateUser: vi.fn(),
  deactivateUser: vi.fn(),
  activateUser: vi.fn(),
}));

vi.mock("@/services/teams", () => ({
  listTeams: vi.fn(),
  createTeam: vi.fn(),
  updateTeam: vi.fn(),
  deleteTeam: vi.fn(),
}));

function makeUser(overrides: Partial<SystemUser> = {}): SystemUser {
  return {
    id: 1,
    name: "Ana Pérez",
    email: "ana@example.com",
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

function renderUsersSection() {
  render(<UsersSection />);
}

describe("UsersSection", () => {
  beforeEach(() => {
    vi.mocked(listUsers).mockResolvedValue({
      items: [makeUser()],
      total: 1,
    });
    vi.mocked(listTeams).mockResolvedValue({
      items: [makeTeam()],
      total: 1,
    });
  });

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it("muestra los usuarios cargados", async () => {
    renderUsersSection();

    expect(await screen.findByText("Ana Pérez")).toBeInTheDocument();
    expect(screen.getByText("ana@example.com")).toBeInTheDocument();
    expect(screen.getAllByText("AGENT").length).toBeGreaterThan(0);
    expect(screen.getByText("Soporte")).toBeInTheDocument();
    expect(screen.getByText("Activo")).toBeInTheDocument();
  });

  it("muestra el estado vacío cuando no hay usuarios", async () => {
    vi.mocked(listUsers).mockResolvedValue({ items: [], total: 0 });
    renderUsersSection();

    expect(await screen.findByText("No hay usuarios")).toBeInTheDocument();
  });

  it("muestra un mensaje claro si falla la carga", async () => {
    vi.mocked(listUsers).mockRejectedValue(
      new ApiError("Error interno del servidor", 500),
    );
    renderUsersSection();

    expect(
      await screen.findByText("Error interno del servidor"),
    ).toBeInTheDocument();
  });

  it("filtra por rol al cambiar la selección", async () => {
    const user = userEvent.setup();
    renderUsersSection();

    await screen.findByText("Ana Pérez");
    await user.selectOptions(screen.getByLabelText("Filtrar por rol"), "AGENT");

    await waitFor(() =>
      expect(listUsers).toHaveBeenLastCalledWith({
        search: undefined,
        role: "AGENT",
      }),
    );
  });

  it("filtra por búsqueda al enviar el formulario", async () => {
    const user = userEvent.setup();
    renderUsersSection();

    await user.type(
      screen.getByPlaceholderText("Buscar por nombre o email"),
      "ana",
    );
    await user.click(screen.getByRole("button", { name: "Buscar usuarios" }));

    await waitFor(() =>
      expect(listUsers).toHaveBeenLastCalledWith({
        search: "ana",
        role: undefined,
      }),
    );
  });

  it("crea un usuario y recarga la lista", async () => {
    const user = userEvent.setup();
    vi.mocked(createUser).mockResolvedValue({
      user: makeUser(),
      temporary_password: null,
    } satisfies UserCreateResult);
    renderUsersSection();

    await user.click(
      await screen.findByRole("button", { name: "Crear Usuario" }),
    );
    const dialog = await screen.findByRole("dialog", { name: "Crear Usuario" });
    await user.type(within(dialog).getByLabelText("Nombre"), "Luis Gómez");
    await user.type(
      within(dialog).getByLabelText("Email"),
      "luis@example.com",
    );
    await user.click(
      within(dialog).getByRole("button", { name: "Crear Usuario" }),
    );

    await waitFor(() =>
      expect(createUser).toHaveBeenCalledWith({
        name: "Luis Gómez",
        email: "luis@example.com",
        role_id: 3,
        team_id: null,
        password: undefined,
      }),
    );
    await waitFor(() =>
      expect(
        screen.queryByRole("dialog", { name: "Crear Usuario" }),
      ).not.toBeInTheDocument(),
    );
    expect(listTeams).toHaveBeenCalledTimes(2);
    expect(listUsers).toHaveBeenCalledTimes(2);
  });

  it("muestra la contraseña temporal tras crear un usuario", async () => {
    const user = userEvent.setup();
    vi.mocked(createUser).mockResolvedValue({
      user: makeUser(),
      temporary_password: "Temp1234",
    } satisfies UserCreateResult);
    renderUsersSection();

    await user.click(
      await screen.findByRole("button", { name: "Crear Usuario" }),
    );
    const dialog = await screen.findByRole("dialog", { name: "Crear Usuario" });
    await user.type(within(dialog).getByLabelText("Nombre"), "Luis Gómez");
    await user.type(
      within(dialog).getByLabelText("Email"),
      "luis@example.com",
    );
    await user.click(
      within(dialog).getByRole("button", { name: "Crear Usuario" }),
    );

    expect(
      await screen.findByRole("dialog", { name: "Contraseña Temporal" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Temp1234")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Listo" }));
    expect(
      screen.queryByRole("dialog", { name: "Contraseña Temporal" }),
    ).not.toBeInTheDocument();
  });

  it("desactiva un usuario tras confirmar", async () => {
    const user = userEvent.setup();
    renderUsersSection();

    await user.click(
      await screen.findByRole("button", {
        name: "Desactivar usuario Ana Pérez",
      }),
    );
    expect(
      screen.getByText(
        '¿Deseás desactivar a "Ana Pérez"? El usuario no podrá iniciar sesión.',
      ),
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Desactivar" }));

    await waitFor(() => expect(deactivateUser).toHaveBeenCalledWith(1));
    await waitFor(() =>
      expect(
        screen.queryByRole("dialog", { name: "Desactivar Usuario" }),
      ).not.toBeInTheDocument(),
    );
  });

  it("edita un usuario y envía los cambios", async () => {
    const user = userEvent.setup();
    vi.mocked(updateUser).mockResolvedValue(makeUser());
    renderUsersSection();

    await user.click(
      await screen.findByRole("button", { name: "Editar usuario Ana Pérez" }),
    );
    const dialog = await screen.findByRole("dialog", {
      name: "Editar Usuario",
    });
    await user.clear(within(dialog).getByLabelText("Nombre"));
    await user.type(within(dialog).getByLabelText("Nombre"), "Ana Gómez");
    await user.click(
      within(dialog).getByRole("button", { name: "Guardar Cambios" }),
    );

    await waitFor(() =>
      expect(updateUser).toHaveBeenCalledWith(1, {
        name: "Ana Gómez",
        role_id: 2,
        team_id: 1,
        is_active: true,
      }),
    );
  });

  it("reactiva un usuario inactivo tras confirmar", async () => {
    vi.mocked(listUsers).mockResolvedValue({
      items: [makeUser({ is_active: false })],
      total: 1,
    });
    const user = userEvent.setup();
    renderUsersSection();

    await user.click(
      await screen.findByRole("button", { name: "Activar usuario Ana Pérez" }),
    );
    expect(screen.getByText('¿Deseás activar a "Ana Pérez"?')).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Activar" }));

    await waitFor(() => expect(activateUser).toHaveBeenCalledWith(1));
  });
});