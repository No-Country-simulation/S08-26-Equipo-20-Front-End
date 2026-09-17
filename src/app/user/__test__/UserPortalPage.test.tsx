import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import UserPortalPage from "../page";
import { RequestService } from "@/services/request.service";
import { useSession } from "@/hooks/useSession";
import { CustomerRequestRead } from "@/types/request";
import type { AuthUser } from "@/types/auth";

// 1. Mock de navegación de Next.js
const mockPush = vi.fn();
const mockReplace = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
    replace: mockReplace,
  }),
}));

// 2. Mock de sesión y servicios
vi.mock("@/hooks/useSession", () => ({
  useSession: vi.fn(),
}));

vi.mock("@/services/request.service", () => ({
  RequestService: {
    getMyRequests: vi.fn(),
    getRequestDetail: vi.fn(),
    addComment: vi.fn(),
  },
}));

vi.mock("@/services/session", () => ({
  clearAccessToken: vi.fn(),
}));

const mockRequests: CustomerRequestRead[] = [
  {
    id: 101,
    description: "Fallo en impresora de planta baja",
    status: "NEW",
    category_id: null,
    priority_id: null,
    team_id: null,
    created_by: 1,
    assigned_to: null,
    created_at: "2026-09-17T10:00:00Z",
    updated_at: "2026-09-17T10:00:00Z",
    resolved_at: null,
    closed_at: null,
  },
  {
    id: 102,
    description: "Acceso denegado al servidor VPN",
    status: "RESOLVED",
    category_id: null,
    priority_id: null,
    team_id: null,
    created_by: 1,
    assigned_to: null,
    created_at: "2026-09-17T11:00:00Z",
    updated_at: "2026-09-17T11:30:00Z",
    resolved_at: "2026-09-17T11:30:00Z",
    closed_at: null,
  },
];

describe("UserPortalPage - Estrategia de Pruebas", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    const mockUser: AuthUser = {
      id: 1,
      name: "juan cruz",
      email: "juan@serviceflow.com",
      role: "USER",
      team: null,
      must_change_password: false,
      is_active: true,
    };

    vi.mocked(useSession).mockReturnValue({
      user: mockUser,
      loading: false,
      login: vi.fn(),
      logout: vi.fn(),
      changePassword: vi.fn(),
    });
  });

  it("muestra el estado de carga (Loading state) al montar el portal", async () => {
    let resolver: (val: CustomerRequestRead[]) => void;
    const controlledPromise = new Promise<CustomerRequestRead[]>((res) => {
      resolver = res;
    });

    vi.mocked(RequestService.getMyRequests).mockImplementation(() => controlledPromise);

    render(<UserPortalPage />);

    expect(screen.getByText(/cargando solicitudes\.\.\./i)).toBeInTheDocument();

    resolver!([]);
    await waitFor(() => {
      expect(screen.queryByText(/cargando solicitudes\.\.\./i)).not.toBeInTheDocument();
    });
  });

  it("renderiza correctamente las métricas y la lista con datos (Success state)", async () => {
    vi.mocked(RequestService.getMyRequests).mockResolvedValue(mockRequests);

    render(<UserPortalPage />);

    const firstItem = await screen.findByText("Fallo en impresora de planta baja");
    expect(firstItem).toBeInTheDocument();

    expect(screen.getByText("Acceso denegado al servidor VPN")).toBeInTheDocument();

    const metricCounts = screen.getAllByText("01");
    expect(metricCounts).toHaveLength(2);
  });

  it("muestra el mensaje de estado vacío (Empty state) cuando no hay requerimientos", async () => {
    vi.mocked(RequestService.getMyRequests).mockResolvedValue([]);

    render(<UserPortalPage />);

    const emptyMessage = await screen.findByText(/no hay solicitudes registradas/i);
    expect(emptyMessage).toBeInTheDocument();
  });

  it("filtra tickets dinámicamente según la búsqueda del usuario", async () => {
    const user = userEvent.setup();
    vi.mocked(RequestService.getMyRequests).mockResolvedValue(mockRequests);

    render(<UserPortalPage />);

    await screen.findByText("Fallo en impresora de planta baja");

    const searchInputs = screen.getAllByPlaceholderText(/buscar en mis solicitudes\.\.\./i);
    for (const input of searchInputs) {
      await user.type(input, "VPN");
    }

    const matchingItems = screen.getAllByText("Acceso denegado al servidor VPN");
    expect(matchingItems.length).toBeGreaterThanOrEqual(1);
    expect(screen.queryByText("Fallo en impresora de planta baja")).not.toBeInTheDocument();
  });

  it("navega hacia /user/requests/[id] al presionar un ticket de la lista", async () => {
    const user = userEvent.setup();
    vi.mocked(RequestService.getMyRequests).mockResolvedValue(mockRequests);

    render(<UserPortalPage />);

    const item = await screen.findByText("Fallo en impresora de planta baja");
    await user.click(item);

    expect(mockPush).toHaveBeenCalledWith("/user/requests/101");
  });

  it("cierra la sesión y redirige a /login al pulsar SALIR", async () => {
    const user = userEvent.setup();
    vi.mocked(RequestService.getMyRequests).mockResolvedValue([]);

    render(<UserPortalPage />);

    const logoutButtons = await screen.findAllByRole("button", { name: /salir/i });
    await user.click(logoutButtons[0]);

    expect(mockReplace).toHaveBeenCalledWith("/login");
  });
});
