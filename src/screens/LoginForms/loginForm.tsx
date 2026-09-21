import { Leaf, Lock, Mail } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppShell, PageContainer } from "../../components/AppShell";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";

// Asegura limpiar cualquier barra final para evitar URLs con "//"
const API_BASE = (import.meta.env.VITE_API_URL ?? "").replace(/\/+$/, "");

export const Login = (): JSX.Element => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const set =
    (key: keyof typeof form) =>
    (event: React.ChangeEvent<HTMLInputElement>) =>
      setForm((prev) => ({ ...prev, [key]: event.target.value }));

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setErrorMessage("");
    setSubmitting(true);
    try {
      const response = await fetch(`${API_BASE}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email,
          pass: form.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error ?? "Correo o contraseña incorrectos.");
      }

      if (data?.session?.access_token) {
        localStorage.setItem("ecosystem_jwt", data.session.access_token);
      }

      if (data?.user) {
        localStorage.setItem("ecosystem_user", JSON.stringify(data.user));
      }

      navigate("/dashboard");
    } catch (err) {
      setErrorMessage(
        err instanceof Error
          ? err.message
          : "No se pudo conectar con el servidor. Intenta de nuevo.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AppShell>
      <PageContainer>
        <div className="mx-auto max-w-md text-center">
          <p className="text-xs font-extrabold uppercase tracking-[.18em] text-[#18a34a]">
            Bienvenido de nuevo
          </p>
          <h1 className="mt-3 text-4xl font-extrabold text-[#087532]">
            Inicia sesión
          </h1>
          <p className="mx-auto mt-3 max-w-sm leading-6 text-[#617066]">
            Accede a tu cuenta para seguir donando y viendo tu impacto en
            ReVida.
          </p>

          <form
            onSubmit={handleSubmit}
            className="mt-10 rounded-[28px] bg-white p-6 text-left shadow-[0_20px_50px_rgba(43,91,58,.12)] sm:p-10"
          >
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-[#e4f2e4] text-[#087532]">
              <Leaf size={28} />
            </div>

            <div className="mt-8">
              <label className="mb-2 block text-sm font-bold text-[#526158]">
                Correo electrónico
              </label>
              <div className="relative">
                <Mail
                  size={16}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#8ea896]"
                />
                <Input
                  required
                  type="email"
                  value={form.email}
                  onChange={set("email")}
                  placeholder="sofia@correo.com"
                  className="h-11 rounded-xl border-[#cfe6d6] bg-[#f7fcf6] pl-9 text-sm focus-visible:ring-[#27bb5c]"
                />
              </div>
            </div>

            <div className="mt-5">
              <div className="mb-2 flex items-center justify-between">
                <label className="block text-sm font-bold text-[#526158]">
                  Contraseña
                </label>
                <button
                  type="button"
                  className="text-xs font-semibold text-[#087532] hover:underline"
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </div>
              <div className="relative">
                <Lock
                  size={16}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#8ea896]"
                />
                <Input
                  required
                  type="password"
                  value={form.password}
                  onChange={set("password")}
                  placeholder="Tu contraseña"
                  className="h-11 rounded-xl border-[#cfe6d6] bg-[#f7fcf6] pl-9 text-sm focus-visible:ring-[#27bb5c]"
                />
              </div>
            </div>

            {errorMessage && (
              <p className="mt-5 rounded-xl bg-[#fdeceb] px-4 py-3 text-sm font-semibold text-[#bd5548]">
                {errorMessage}
              </p>
            )}

            <Button
              type="submit"
              disabled={submitting}
              className="mt-8 w-full rounded-full bg-[#27bb5c] py-5 font-bold text-white hover:bg-[#149b47] disabled:opacity-60"
            >
              {submitting ? "Iniciando sesión..." : "Iniciar sesión"}
            </Button>

            <p className="mt-4 text-center text-sm text-[#718077]">
              ¿No tienes cuenta?{" "}
              <button
                type="button"
                onClick={() => navigate("/register")}
                className="font-bold text-[#087532] hover:underline"
              >
                Crea una aquí
              </button>
            </p>
          </form>
        </div>
      </PageContainer>
    </AppShell>
  );
};