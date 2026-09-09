"use client";

import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { useSession } from "@/hooks/useSession";
import { ApiError } from "@/services/http";
import { ROLE_AREA } from "@/types/auth";

const MIN_PASSWORD_LENGTH = 8;

export function ChangePasswordForm() {
  const router = useRouter();
  const { user, loading, changePassword } = useSession();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswords, setShowPasswords] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    if (loading) {
      return;
    }
    if (!user) {
      router.replace("/login");
      return;
    }
    if (!user.must_change_password) {
      router.replace(ROLE_AREA[user.role]);
    }
  }, [loading, user, router]);

  function validateForm(): string | null {
    if (!currentPassword) {
      return "Ingresá tu contraseña actual";
    }
    if (newPassword.length < MIN_PASSWORD_LENGTH) {
      return `La contraseña nueva debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres`;
    }
    if (newPassword !== confirmPassword) {
      return "Las contraseñas no coinciden";
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
      await changePassword({
        current_password: currentPassword,
        new_password: newPassword,
      });
      router.replace(ROLE_AREA[user?.role ?? "USER"]);
    } catch (cause) {
      setError(
        cause instanceof ApiError
          ? cause.message
          : "No se pudo cambiar la contraseña, intentá nuevamente",
      );
    } finally {
      setIsPending(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-sm space-y-4"
      noValidate
    >
      {error && (
        <p role="alert" className="text-xs text-red-500">
          {error}
        </p>
      )}
      <div>
        <label
          htmlFor="current-password"
          className="mb-1.5 block text-xs text-gray-400"
        >
          Contraseña actual
        </label>
        <input
          id="current-password"
          type="password"
          autoComplete="current-password"
          value={currentPassword}
          onChange={(event) => setCurrentPassword(event.target.value)}
          className="w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-white placeholder-zinc-700 transition-colors focus:border-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-600"
          placeholder="••••••••"
        />
      </div>
      <div>
        <label
          htmlFor="new-password"
          className="mb-1.5 block text-xs text-gray-400"
        >
          Contraseña nueva
        </label>
        <div className="relative">
          <input
            id="new-password"
            type={showPasswords ? "text" : "password"}
            autoComplete="new-password"
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
            className="w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 pr-10 text-sm text-white placeholder-zinc-700 transition-colors focus:border-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-600"
            placeholder="Mínimo 8 caracteres"
          />
          <button
            type="button"
            onClick={() => setShowPasswords((visible) => !visible)}
            aria-label={
              showPasswords
                ? "Ocultar contraseñas"
                : "Mostrar contraseñas"
            }
            className="absolute inset-y-0 right-0 flex items-center px-3 text-zinc-500 hover:text-zinc-300"
          >
            {showPasswords ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>
      <div>
        <label
          htmlFor="confirm-password"
          className="mb-1.5 block text-xs text-gray-400"
        >
          Confirmar contraseña nueva
        </label>
        <input
          id="confirm-password"
          type={showPasswords ? "text" : "password"}
          autoComplete="new-password"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          className="w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-white placeholder-zinc-700 transition-colors focus:border-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-600"
          placeholder="Repetí la contraseña nueva"
        />
      </div>
      <button
        type="submit"
        disabled={isPending}
        className="flex h-10 w-full items-center justify-center gap-2 rounded-md bg-white text-sm font-medium text-black transition-colors hover:bg-gray-200 disabled:opacity-60"
      >
        {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
        {isPending ? "Guardando..." : "Guardar Cambios"}
      </button>
    </form>
  );
}