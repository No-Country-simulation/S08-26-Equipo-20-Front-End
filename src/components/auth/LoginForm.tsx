"use client";

import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { useSession } from "@/hooks/useSession";
import { ApiError } from "@/services/http";
import { ROLE_AREA } from "@/types/auth";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function LoginForm() {
  const router = useRouter();
  const { user, loading, login } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    if (loading || !user) {
      return;
    }
    const area = user.must_change_password ? "/change-password" : ROLE_AREA[user.role];
    router.replace(area);
  }, [loading, user, router]);

  function redirectTo(area: string): void {
    router.replace(area);
  }

  function validateForm(): string | null {
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      return "Ingresá tu email";
    }
    if (!EMAIL_PATTERN.test(trimmedEmail)) {
      return "Ingresá un email válido";
    }
    if (!password) {
      return "Ingresá tu contraseña";
    }
    return null;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isPending) {
      return;
    }
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }
    setError(null);
    setIsPending(true);
    try {
      const authUser = await login({ email: email.trim(), password });
      redirectTo(
        authUser.must_change_password ? "/change-password" : ROLE_AREA[authUser.role],
      );
    } catch (cause) {
      setError(
        cause instanceof ApiError
          ? cause.message
          : "No se pudo iniciar sesión, intentá nuevamente",
      );
    } finally {
      setIsPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4" noValidate>
      {error && (
        <p role="alert" className="text-xs text-red-500">
          {error}
        </p>
      )}
      <div>
        <label htmlFor="email" className="mb-1.5 block text-xs text-gray-400">
          Email
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-white placeholder-zinc-700 transition-colors focus:border-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-600"
          placeholder="usuario@empresa.com"
        />
      </div>
      <div>
        <label
          htmlFor="password"
          className="mb-1.5 block text-xs text-gray-400"
        >
          Contraseña
        </label>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 pr-10 text-sm text-white placeholder-zinc-700 transition-colors focus:border-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-600"
            placeholder="••••••••"
          />
          <button
            type="button"
            onClick={() => setShowPassword((visible) => !visible)}
            aria-label={
              showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
            }
            className="absolute inset-y-0 right-0 flex items-center px-3 text-zinc-500 hover:text-zinc-300"
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>
      <button
        type="submit"
        disabled={isPending}
        className="flex h-10 w-full items-center justify-center gap-2 rounded-md bg-white text-sm font-medium text-black transition-colors hover:bg-gray-200 disabled:opacity-60"
      >
        {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
        {isPending ? "Ingresando..." : "Iniciar Sesión"}
      </button>
    </form>
  );
}