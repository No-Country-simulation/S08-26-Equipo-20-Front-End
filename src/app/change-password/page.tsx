import type { Metadata } from "next";
import { ChangePasswordForm } from "@/components/auth/ChangePasswordForm";
import { Brand } from "@/components/ui/Brand";

export const metadata: Metadata = {
  title: "Cambiar Contraseña | ServiceFlow",
};

export default function ChangePasswordPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <div className="mb-8 flex w-full max-w-sm flex-col items-center gap-2">
        <h1>
          <Brand tagline="Acceso Corporativo" size="lg" />
        </h1>
      </div>
      <ChangePasswordForm />
    </main>
  );
}