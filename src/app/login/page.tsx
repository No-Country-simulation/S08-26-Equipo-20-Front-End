import type { Metadata } from "next";
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Ingreso | ServiceFlow",
};

export default function LoginPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <div className="mb-8 flex w-full max-w-sm flex-col items-center gap-2">
        <h1 className="text-lg font-bold uppercase tracking-widest text-white">
          ServiceFlow
        </h1>
        <p className="text-xs text-gray-400">Acceso Corporativo</p>
      </div>
      <LoginForm />
    </main>
  );
}