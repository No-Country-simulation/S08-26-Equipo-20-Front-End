import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { LoginForm } from "@/components/auth/LoginForm";
import { SessionProvider } from "@/hooks/useSession";
import { login, getCurrentUser } from "@/services/auth";
import { ApiError } from "@/services/http";
import type { AuthUser } from "@/types/auth";

const { replace } = vi.hoisted(() => ({ replace: vi.fn() }));

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    replace,
    push: vi.fn(),
    refresh: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
  }),
}));

vi.mock("@/services/auth", () => ({
  login: vi.fn(),
  getCurrentUser: vi.fn(),
  changePassword: vi.fn(),
}));

function makeUser(overrides: Partial<AuthUser> = {}): AuthUser {
  return {
    id: 1,
    name: "Test User",
    email: "test@example.com",
    role: "USER",
    team: null,
    must_change_password: false,
    is_active: true,
    ...overrides,
  };
}

function renderLoginForm() {
  render(
    <SessionProvider>
      <LoginForm />
    </SessionProvider>,
  );
}

describe("LoginForm", () => {
  beforeEach(() => {
    vi.mocked(getCurrentUser).mockResolvedValue(makeUser());
  });

  afterEach(() => {
    cleanup();
    window.localStorage.clear();
    vi.clearAllMocks();
  });

  it("muestra los campos y la acción principal", () => {
    renderLoginForm();

    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Contraseña")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Iniciar Sesión" }),
    ).toBeInTheDocument();
  });

  it("valida el email y la contraseña al enviar vacío", async () => {
    const user = userEvent.setup();
    renderLoginForm();

    await user.click(screen.getByRole("button", { name: "Iniciar Sesión" }));

    expect(screen.getByText("Ingresá tu email")).toBeInTheDocument();
  });

  it("valida el formato del email", async () => {
    const user = userEvent.setup();
    renderLoginForm();

    await user.type(screen.getByLabelText("Email"), "email-invalido");
    await user.click(screen.getByRole("button", { name: "Iniciar Sesión" }));

    expect(screen.getByText("Ingresá un email válido")).toBeInTheDocument();
  });

  it("muestra las credenciales inválidas ante un error 401", async () => {
    const user = userEvent.setup();
    vi.mocked(login).mockRejectedValue(
      new ApiError("Credenciales inválidas", 401),
    );
    renderLoginForm();

    await user.type(screen.getByLabelText("Email"), "test@example.com");
    await user.type(screen.getByLabelText("Contraseña"), "wrong-password");
    await user.click(screen.getByRole("button", { name: "Iniciar Sesión" }));

    await waitFor(() =>
      expect(screen.getByText("Credenciales inválidas")).toBeInTheDocument(),
    );
    expect(login).toHaveBeenCalledWith({
      email: "test@example.com",
      password: "wrong-password",
    });
  });

  it("redirige al área del rol después de un login exitoso", async () => {
    const user = userEvent.setup();
    vi.mocked(login).mockResolvedValue({
      access_token: "token",
      token_type: "bearer",
    });
    vi.mocked(getCurrentUser).mockResolvedValue(makeUser({ role: "AGENT" }));
    renderLoginForm();

    await user.type(screen.getByLabelText("Email"), "test@example.com");
    await user.type(screen.getByLabelText("Contraseña"), "secret123");
    await user.click(screen.getByRole("button", { name: "Iniciar Sesión" }));

    await waitFor(() => expect(replace).toHaveBeenCalledWith("/agent"));
  });

  it("redirige al cambio de contraseña cuando es obligatorio", async () => {
    const user = userEvent.setup();
    vi.mocked(login).mockResolvedValue({
      access_token: "token",
      token_type: "bearer",
    });
    vi.mocked(getCurrentUser).mockResolvedValue(
      makeUser({ must_change_password: true }),
    );
    renderLoginForm();

    await user.type(screen.getByLabelText("Email"), "test@example.com");
    await user.type(screen.getByLabelText("Contraseña"), "secret123");
    await user.click(screen.getByRole("button", { name: "Iniciar Sesión" }));

    await waitFor(() =>
      expect(replace).toHaveBeenCalledWith("/change-password"),
    );
  });

  it("permite mostrar y ocultar la contraseña", async () => {
    const user = userEvent.setup();
    renderLoginForm();

    const passwordInput = screen.getByLabelText("Contraseña");
    expect(passwordInput).toHaveAttribute("type", "password");

    await user.click(
      screen.getByRole("button", { name: "Mostrar contraseña" }),
    );
    expect(passwordInput).toHaveAttribute("type", "text");

    await user.click(
      screen.getByRole("button", { name: "Ocultar contraseña" }),
    );
    expect(passwordInput).toHaveAttribute("type", "password");
  });
});