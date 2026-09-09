import { getAccessToken } from "./session";

export class ApiError extends Error {
  readonly status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

interface RequestOptions {
  method?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
  body?: unknown;
  headers?: HeadersInit;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

const FALLBACK_MESSAGES: Record<number, string> = {
  400: "Solicitud inválida",
  401: "La sesión expiró",
  403: "No tiene permisos para realizar esta acción",
  404: "No se pudo encontrar el recurso",
  409: "El recurso ya existe",
  422: "Verificá los datos ingresados",
  500: "No se pudo completar la operación, intente nuevamente",
  503: "El servicio no está disponible",
};

function buildMessage(status: number, detail: unknown): string {
  if (status !== 401 && typeof detail === "string" && detail.trim() !== "") {
    return detail;
  }
  return FALLBACK_MESSAGES[status] ?? "Ocurrió un error inesperado";
}

async function readDetail(response: Response): Promise<unknown> {
  try {
    const body = (await response.json()) as { detail?: unknown };
    return body.detail;
  } catch {
    return undefined;
  }
}

export async function apiRequest<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const headers = new Headers(options.headers);
  if (options.body !== undefined && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  const token = getAccessToken();
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method: options.method ?? "GET",
      headers,
      body:
        options.body === undefined ? undefined : JSON.stringify(options.body),
    });
  } catch {
    throw new ApiError("No se pudo conectar con el servidor");
  }

  if (!response.ok) {
    const detail = await readDetail(response);
    throw new ApiError(buildMessage(response.status, detail), response.status);
  }

  if (response.status === 204) {
    return undefined as T;
  }
  return (await response.json()) as T;
}