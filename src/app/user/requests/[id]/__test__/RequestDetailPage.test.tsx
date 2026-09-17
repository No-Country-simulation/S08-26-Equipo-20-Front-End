import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import RequestDetailPage from "../page";
import { RequestService } from "@/services/request.service";
import { CustomerRequestDetail, CommentItem } from "@/types/request";

// 1. Mock de navegación de Next.js
const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

// 2. Mock de RequestService
vi.mock("@/services/request.service", () => ({
  RequestService: {
    getRequestDetail: vi.fn(),
    addComment: vi.fn(),
  },
}));

// 3. Mock de datos tipados
const mockDetail: CustomerRequestDetail = {
  id: 101,
  description: "Problema con la VPN corporativa",
  status: "IN_PROGRESS",
  category_id: 1,
  priority_id: 2,
  team_id: 1,
  created_by: 1,
  assigned_to: 2,
  created_at: "2026-09-17T10:00:00Z",
  updated_at: "2026-09-17T11:00:00Z",
  resolved_at: null,
  closed_at: null,
  category: { id: 1, name: "Infraestructura" },
  priority: { id: 2, name: "Media", level: 2 },
  team: { id: 1, name: "Soporte Redes" },
  creator: { id: 1, name: "Juan Cruz", email: "juan@serviceflow.com" },
  assignee: { id: 2, name: "Agente Soporte", email: "agent@serviceflow.com" },
  comments: [
    {
      id: 1,
      request_id: 101,
      user_id: 1,
      content: "Mensaje visible de usuario",
      is_internal: false,
      created_at: "2026-09-17T10:15:00Z",
      user: { id: 1, name: "Juan Cruz", email: "juan@serviceflow.com" },
    },
    {
      id: 2,
      request_id: 101,
      user_id: 2,
      content: "Nota interna confidencial de agentes",
      is_internal: true,
      created_at: "2026-09-17T10:20:00Z",
      user: { id: 2, name: "Agente Soporte", email: "agent@serviceflow.com" },
    },
  ],
  attachments: [
    {
      id: 1,
      request_id: 101,
      uploaded_by: 1,
      file_name: "error-log.png",
      file_path: "/uploads/error-log.png",
      created_at: "2026-09-17T10:00:00Z",
    },
  ],
};

function createThenableParams(id = "101") {
  const data = { id };
  return {
    status: "fulfilled",
    value: data,
    then(onFulfilled?: (val: typeof data) => any) {
      return Promise.resolve(onFulfilled ? onFulfilled(data) : data);
    },
  } as unknown as Promise<{ id: string }>;
}

describe("RequestDetailPage - Estrategia de Pruebas", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("muestra el estado de carga (Loading state) al iniciar la obtención del detalle", async () => {
    let resolver: (val: CustomerRequestDetail) => void;
    const controlledPromise = new Promise<CustomerRequestDetail>((res) => {
      resolver = res;
    });

    vi.mocked(RequestService.getRequestDetail).mockImplementation(() => controlledPromise);

    render(<RequestDetailPage params={createThenableParams("101")} />);

    expect(screen.getByText(/cargando detalles del ticket\.\.\./i)).toBeInTheDocument();

    resolver!(mockDetail);
    await waitFor(() => {
      expect(screen.queryByText(/cargando detalles del ticket\.\.\./i)).not.toBeInTheDocument();
    });
  });

  it("renderiza la información del ticket, adjuntos y excluye notas internas (Success state)", async () => {
    vi.mocked(RequestService.getRequestDetail).mockResolvedValue(mockDetail);

    render(<RequestDetailPage params={createThenableParams("101")} />);

    const titles = await screen.findAllByText("Problema con la VPN corporativa");
    expect(titles.length).toBeGreaterThanOrEqual(1);

    const idBadges = screen.getAllByText(/101/);
    expect(idBadges.length).toBeGreaterThanOrEqual(1);

    const attachments = screen.getAllByText("error-log.png");
    expect(attachments.length).toBeGreaterThanOrEqual(1);

    const publicComments = screen.getAllByText("Mensaje visible de usuario");
    expect(publicComments.length).toBeGreaterThanOrEqual(1);

    expect(screen.queryByText("Nota interna confidencial de agentes")).not.toBeInTheDocument();
  });

  it("muestra el estado de error cuando la API falla o el ticket no existe", async () => {
    vi.mocked(RequestService.getRequestDetail).mockRejectedValue(new Error("Ticket inexistente"));

    render(<RequestDetailPage params={createThenableParams("101")} />);

    expect(await screen.findByText(/ticket inexistente/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /volver al portal/i })).toBeInTheDocument();
  });

  it("permite responder al ticket y añade el nuevo comentario a la lista", async () => {
    const user = userEvent.setup();
    vi.mocked(RequestService.getRequestDetail).mockResolvedValue(mockDetail);

    const newCommentResponse: CommentItem = {
      id: 3,
      request_id: 101,
      user_id: 1,
      content: "Adjunto más información sobre el error",
      is_internal: false,
      created_at: "2026-09-17T12:00:00Z",
      user: { id: 1, name: "Juan Cruz", email: "juan@serviceflow.com" },
    };

    vi.mocked(RequestService.addComment).mockResolvedValue(newCommentResponse);

    render(<RequestDetailPage params={createThenableParams("101")} />);

    await screen.findAllByText("Problema con la VPN corporativa");

    const textareas = screen.getAllByPlaceholderText(/escribe una respuesta o consulta adicional\.\.\./i);
    const submitButtons = screen.getAllByRole("button", { name: /enviar respuesta/i });

    expect(submitButtons[0]).toBeDisabled();

    for (const textarea of textareas) {
      await user.type(textarea, "Adjunto más información sobre el error");
    }

    const enabledButton = submitButtons.find((btn) => !btn.hasAttribute("disabled"));
    expect(enabledButton).toBeDefined();
    await user.click(enabledButton!);

    expect(RequestService.addComment).toHaveBeenCalledWith(101, "Adjunto más información sobre el error");

    const newComments = await screen.findAllByText("Adjunto más información sobre el error");
    expect(newComments.length).toBeGreaterThanOrEqual(1);

    expect(textareas[0]).toHaveValue("");
  });

  it("navega de regreso a /user al pulsar 'Volver a mis solicitudes'", async () => {
    const user = userEvent.setup();
    vi.mocked(RequestService.getRequestDetail).mockResolvedValue(mockDetail);

    render(<RequestDetailPage params={createThenableParams("101")} />);

    const backButtons = await screen.findAllByRole("button", { name: /volver a mis solicitudes/i });
    await user.click(backButtons[0]);

    expect(mockPush).toHaveBeenCalledWith("/user");
  });
});
