import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ProtectedArea } from "@/components/auth/ProtectedArea";
import { SessionProvider } from "@/hooks/useSession";
import { getCurrentUser } from "@/services/auth";
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

const TOKEN_KEY = "serviceflow.access_token";

afterEach(() => {
  cleanup();
  window.localStorage.clear();
  vi.clearAllMocks();
});

describe("ProtectedArea", () => {
  it("redirige al login cuando no hay sesión", async () => {
    render(
      <SessionProvider>
        <ProtectedArea area="USER">
          <p>Contenido protegido</p>
        </ProtectedArea>
      </SessionProvider>,
    );

    await waitFor(() => expect(replace).toHaveBeenCalledWith("/login"));
  });

  it("redirige al área propia cuando el rol no corresponde", async () => {
    window.localStorage.setItem(TOKEN_KEY, "token");
    vi.mocked(getCurrentUser).mockResolvedValue(makeUser({ role: "ADMIN" }));

    render(
      <SessionProvider>
        <ProtectedArea area="AGENT">
          <p>Contenido de agente</p>
        </ProtectedArea>
      </SessionProvider>,
    );

    await waitFor(() => expect(replace).toHaveBeenCalledWith("/admin"));
  });

  it("muestra el contenido cuando el rol coincide", async () => {
    window.localStorage.setItem(TOKEN_KEY, "token");
    vi.mocked(getCurrentUser).mockResolvedValue(makeUser({ role: "USER" }));

    render(
      <SessionProvider>
        <ProtectedArea area="USER">
          <p>Contenido de usuario</p>
        </ProtectedArea>
      </SessionProvider>,
    );

    expect(await screen.findByText("Contenido de usuario")).toBeInTheDocument();
    expect(replace).not.toHaveBeenCalled();
  });
});