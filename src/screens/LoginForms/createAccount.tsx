import {
  CheckCircle2,
  Gift,
  HandHeart,
  HandHelping,
  Leaf,
  Lock,
  Mail,
  MapPin,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppShell, PageContainer } from "../../components/AppShell";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";

const API_BASE = (import.meta.env.VITE_API_URL ?? "").replace(/\/+$/, "");

const SuccessCard = ({ name }: { name: string }): JSX.Element => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => navigate("/login"), 3000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="mx-auto max-w-xl text-center">
      <div className="mt-10 rounded-[28px] bg-white p-10 shadow-[0_20px_50px_rgba(43,91,58,.12)]">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[#d9f2df] text-[#159449]">
          <CheckCircle2 size={32} />
        </div>
        <h1 className="mt-6 text-2xl font-extrabold text-[#087532]">
          Account created successfully!
        </h1>
        <p className="mx-auto mt-3 max-w-sm leading-6 text-[#617066]">
          {name ? `Welcome, ${name}. ` : ""}
          You can now log in and start donating with EcoSystem.
        </p>
        <Button
          onClick={() => navigate("/login")}
          className="mt-7 w-full rounded-full bg-[#27bb5c] py-5 font-bold text-white hover:bg-[#149b47]"
        >
          Go to Login
        </Button>
        <p className="mt-3 text-xs text-[#94a198]">
          You will be redirected automatically in a few seconds...
        </p>
      </div>
    </div>
  );
};

const userTypeOptions = [
  {
    value: "donor",
    icon: Gift,
    label: "Donor",
    description: "I want to donate items or money.",
  },
  {
    value: "beneficiary",
    icon: HandHeart,
    label: "Beneficiary",
    description: "I want to receive donations.",
  },
  {
    value: "volunteer",
    icon: HandHelping,
    label: "Volunteer",
    description: "I want to support with time and effort.",
  },
] as const;

type UserType = (typeof userTypeOptions)[number]["value"];

export const CreateAccount = (): JSX.Element => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    lastName: "",
    age: "",
    country: "",
    city: "",
    email: "",
    password: "",
    userType: "donor" as UserType,
  });
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const set =
    (key: keyof typeof form) =>
    (event: React.ChangeEvent<HTMLInputElement>) =>
      setForm((prev) => ({ ...prev, [key]: event.target.value }));

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setErrorMessage("");

    if (!acceptedTerms) {
      setErrorMessage("You must accept the Terms and Conditions and Privacy Policy to register.");
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch(`${API_BASE}/api/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          lastname: form.lastName,
          age: Number(form.age),
          country: form.country,
          city: form.city,
          mail: form.email,
          pass: form.password,
          user_type: form.userType,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error ?? "Could not create the account.");
      }

      setSuccess(true);
    } catch (err) {
      setErrorMessage(
        err instanceof Error
          ? err.message
          : "Could not connect to the server. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <AppShell>
        <PageContainer>
          <SuccessCard name={form.name} />
        </PageContainer>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <PageContainer>
        <div className="mx-auto max-w-xl text-center">
          <p className="text-xs font-extrabold uppercase tracking-[.18em] text-[#18a34a]">
            Create account
          </p>
          <h1 className="mt-3 text-3xl font-extrabold text-[#087532] sm:text-4xl">
            Join EcoSystem
          </h1>
          <p className="mx-auto mt-3 max-w-md leading-6 text-[#617066]">
            Create your account to donate, track your impact, and support verified organizations.
          </p>

          <form
            onSubmit={handleSubmit}
            className="mt-10 rounded-[28px] bg-white p-6 text-left shadow-[0_20px_50px_rgba(43,91,58,.12)] sm:p-10"
          >
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-[#e4f2e4] text-[#087532]">
              <Leaf size={28} />
            </div>

            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-bold text-[#526158]">
                  First Name
                </label>
                <div className="relative">
                  <User
                    size={16}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#8ea896]"
                  />
                  <Input
                    required
                    value={form.name}
                    onChange={set("name")}
                    placeholder="Sophie"
                    className="h-11 rounded-xl border-[#cfe6d6] bg-[#f7fcf6] pl-9 text-sm focus-visible:ring-[#27bb5c]"
                  />
                </div>
              </div>
              <div>
                <label className="mb-2 block text-sm font-bold text-[#526158]">
                  Last Name
                </label>
                <Input
                  required
                  value={form.lastName}
                  onChange={set("lastName")}
                  placeholder="Martinez"
                  className="h-11 rounded-xl border-[#cfe6d6] bg-[#f7fcf6] text-sm focus-visible:ring-[#27bb5c]"
                />
              </div>
            </div>

            <div className="mt-5 grid gap-5 sm:grid-cols-3">
              <div>
                <label className="mb-2 block text-sm font-bold text-[#526158]">
                  Age
                </label>
                <Input
                  required
                  type="number"
                  min={13}
                  value={form.age}
                  onChange={set("age")}
                  placeholder="27"
                  className="h-11 rounded-xl border-[#cfe6d6] bg-[#f7fcf6] text-sm focus-visible:ring-[#27bb5c]"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-bold text-[#526158]">
                  Country
                </label>
                <div className="relative">
                  <MapPin
                    size={16}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#8ea896]"
                  />
                  <Input
                    required
                    value={form.country}
                    onChange={set("country")}
                    placeholder="Colombia"
                    className="h-11 rounded-xl border-[#cfe6d6] bg-[#f7fcf6] pl-9 text-sm focus-visible:ring-[#27bb5c]"
                  />
                </div>
              </div>
              <div>
                <label className="mb-2 block text-sm font-bold text-[#526158]">
                  City
                </label>
                <Input
                  required
                  value={form.city}
                  onChange={set("city")}
                  placeholder="Cali"
                  className="h-11 rounded-xl border-[#cfe6d6] bg-[#f7fcf6] text-sm focus-visible:ring-[#27bb5c]"
                />
              </div>
            </div>

            <div className="mt-5">
              <label className="mb-2 block text-sm font-bold text-[#526158]">
                Email Address
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
                  placeholder="sophie@email.com"
                  className="h-11 rounded-xl border-[#cfe6d6] bg-[#f7fcf6] pl-9 text-sm focus-visible:ring-[#27bb5c]"
                />
              </div>
            </div>

            <div className="mt-5">
              <label className="mb-2 block text-sm font-bold text-[#526158]">
                Password
              </label>
              <div className="relative">
                <Lock
                  size={16}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#8ea896]"
                />
                <Input
                  required
                  type="password"
                  minLength={8}
                  value={form.password}
                  onChange={set("password")}
                  placeholder="At least 8 characters"
                  className="h-11 rounded-xl border-[#cfe6d6] bg-[#f7fcf6] pl-9 text-sm focus-visible:ring-[#27bb5c]"
                />
              </div>
            </div>

            <div className="mt-5">
              <label className="mb-2 block text-sm font-bold text-[#526158]">
                Account Type
              </label>
              <div className="grid gap-3 sm:grid-cols-3">
                {userTypeOptions.map(({ value, icon: Icon, label, description }) => {
                  const selected = form.userType === value;
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() =>
                        setForm((prev) => ({ ...prev, userType: value }))
                      }
                      className={`flex flex-col items-start gap-2 rounded-2xl border-2 p-4 text-left transition-colors ${
                        selected
                          ? "border-[#27bb5c] bg-[#e8f8e9]"
                          : "border-[#e1eee3] bg-[#f7fcf6] hover:border-[#a8dcb4]"
                      }`}
                    >
                      <div className="flex w-full items-center justify-between">
                        <span
                          className={`grid h-9 w-9 place-items-center rounded-full ${
                            selected
                              ? "bg-[#c5edcf] text-[#087532]"
                              : "bg-white text-[#718077]"
                          }`}
                        >
                          <Icon size={16} />
                        </span>
                        <span
                          className={`h-4 w-4 rounded-full border-2 ${
                            selected
                              ? "border-[#159449] bg-[#159449]"
                              : "border-[#bacdbf]"
                          }`}
                        >
                          {selected && (
                            <CheckCircle2 size={12} className="text-white" />
                          )}
                        </span>
                      </div>
                      <span className="text-sm font-bold">{label}</span>
                      <span className="text-xs leading-5 text-[#718077]">
                        {description}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* CHECKBOX DE TÉRMINOS Y CONDICIONES */}
            <div className="mt-6 flex items-start gap-3">
              <input
                type="checkbox"
                id="terms"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                className="mt-1 h-4 w-4 cursor-pointer rounded border-gray-300 text-[#27bb5c] focus:ring-[#27bb5c]"
              />
              <label htmlFor="terms" className="text-sm leading-5 text-[#526158]">
                I accept the{" "}
                <Link to="/terms" target="_blank" className="font-bold text-[#087532] hover:underline">
                  Terms and Conditions
                </Link>{" "}
                and the{" "}
                <Link to="/privacy" target="_blank" className="font-bold text-[#087532] hover:underline">
                  Privacy Policy
                </Link>
                .
              </label>
            </div>

            {errorMessage && (
              <p className="mt-5 rounded-xl bg-[#fdeceb] px-4 py-3 text-sm font-semibold text-[#bd5548]">
                {errorMessage}
              </p>
            )}

            <Button
              type="submit"
              disabled={submitting}
              className="mt-6 w-full rounded-full bg-[#27bb5c] py-5 font-bold text-white hover:bg-[#149b47] disabled:opacity-60"
            >
              {submitting ? "Creating account..." : "Create account"}
            </Button>

            <p className="mt-4 text-center text-sm text-[#718077]">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="font-bold text-[#087532] hover:underline"
              >
                Log in
              </button>
            </p>
          </form>
        </div>
      </PageContainer>
    </AppShell>
  );
};