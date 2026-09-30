import type { Metadata } from "next";
import { LoginForm } from "@/components/auth/LoginForm";
import { Brand } from "@/components/ui/Brand";

export const metadata: Metadata = {
  title: "Ingreso | ServiceFlow",
};

export default function LoginPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <div className="mb-8 flex w-full max-w-sm flex-col items-center gap-2">
        <h1>
          <Brand tagline="Acceso Corporativo" size="lg" />
        </h1>
      </div>
      <LoginForm />
    </main>
  );
}