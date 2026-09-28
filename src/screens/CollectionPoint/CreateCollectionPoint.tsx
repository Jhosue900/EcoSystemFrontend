import {
  ArrowLeft,
  Clock3,
  Home,
  MapPin,
  Phone,
  Shirt,
  Soup,
  Tag,
  ToyBrick,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppShell, PageContainer } from "../../components/AppShell";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { getStoredToken, isValidJwt } from "../../lib/auth";
import { ChoiceCard } from "../CreateDonation/DonationStepLayout";

const API_BASE = (import.meta.env.VITE_API_URL ?? "").replace(/\/+$/, "");

const categoryOptions: [React.ElementType, string][] = [
  [Soup, "Food"],
  [Shirt, "Clothing"],
  [Tag, "Household"],
  [ToyBrick, "Kids & Toys"],
];

const inputClass =
  "h-11 rounded-xl border-[#cfe6d6] bg-[#f7fcf6] text-sm focus-visible:ring-[#27bb5c]";

export const CreateCollectionPoint = (): JSX.Element => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    address: "",
    city: "",
    schedule: "",
    phone: "",
    description: "",
  });
  const [accepted, setAccepted] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!isValidJwt(getStoredToken())) {
      navigate("/login");
    }
  }, [navigate]);

  const set =
    (key: keyof typeof form) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((prev) => ({ ...prev, [key]: event.target.value }));

  const toggleCategory = (label: string) =>
    setAccepted((prev) =>
      prev.includes(label) ? prev.filter((c) => c !== label) : [...prev, label],
    );

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (submitting) return;

    const token = getStoredToken();
    if (!token || !isValidJwt(token)) {
      navigate("/login");
      return;
    }
    if (accepted.length === 0) {
      setErrorMessage("Select at least one type of donation you can receive.");
      return;
    }

    setErrorMessage("");
    setSubmitting(true);

    try {
      const response = await fetch(`${API_BASE}/api/collectionPoints`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...form, accepted_categories: accepted }),
      });
      const data = await response.json().catch(() => null);

      if (response.status === 401) {
        navigate("/login");
        return;
      }
      if (!response.ok) {
        throw new Error(data?.error ?? "Could not publish your space.");
      }

      navigate("/my-collection-points");
    } catch (err) {
      setErrorMessage(
        err instanceof Error
          ? err.message
          : "Could not reach the server. Try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AppShell>
      <PageContainer>
        <div className="mx-auto max-w-2xl">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="mb-6 flex items-center gap-2 text-sm font-bold text-[#087532]"
          >
            <ArrowLeft size={16} /> Back
          </button>

          <div className="text-center">
            <p className="text-xs font-extrabold uppercase tracking-[.18em] text-[#18a34a]">
              Become a collection point
            </p>
            <h1 className="mt-3 text-4xl font-extrabold text-[#087532]">
              Offer your space
            </h1>
            <p className="mx-auto mt-3 max-w-md leading-6 text-[#617066]">
              Your home or place can be the spot where neighbors drop off
              donations. Only signed-in members can see your address and phone.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="mt-10 rounded-[28px] bg-white p-6 text-left shadow-[0_20px_50px_rgba(43,91,58,.12)] sm:p-10"
          >
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-[#e4f2e4] text-[#087532]">
              <Home size={28} />
            </div>

            <div className="mt-8">
              <label
                htmlFor="cp-name"
                className="mb-2 block text-sm font-bold text-[#526158]"
              >
                Space name
              </label>
              <Input
                id="cp-name"
                required
                value={form.name}
                onChange={set("name")}
                placeholder="Casa de Sofía"
                className={inputClass}
              />
            </div>

            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="cp-address"
                  className="mb-2 block text-sm font-bold text-[#526158]"
                >
                  Address
                </label>
                <div className="relative">
                  <MapPin
                    size={16}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#8ea896]"
                  />
                  <Input
                    id="cp-address"
                    required
                    value={form.address}
                    onChange={set("address")}
                    placeholder="Cra 43A #1-50"
                    className={`${inputClass} pl-9`}
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="cp-city"
                  className="mb-2 block text-sm font-bold text-[#526158]"
                >
                  City
                </label>
                <Input
                  id="cp-city"
                  required
                  value={form.city}
                  onChange={set("city")}
                  placeholder="Medellín"
                  className={inputClass}
                />
              </div>
            </div>

            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="cp-schedule"
                  className="mb-2 block text-sm font-bold text-[#526158]"
                >
                  Drop-off hours
                </label>
                <div className="relative">
                  <Clock3
                    size={16}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#8ea896]"
                  />
                  <Input
                    id="cp-schedule"
                    required
                    value={form.schedule}
                    onChange={set("schedule")}
                    placeholder="Mon–Fri, 4pm–7pm"
                    className={`${inputClass} pl-9`}
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="cp-phone"
                  className="mb-2 block text-sm font-bold text-[#526158]"
                >
                  Contact phone
                </label>
                <div className="relative">
                  <Phone
                    size={16}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#8ea896]"
                  />
                  <Input
                    id="cp-phone"
                    required
                    type="tel"
                    value={form.phone}
                    onChange={set("phone")}
                    placeholder="+57 300 000 0000"
                    className={`${inputClass} pl-9`}
                  />
                </div>
              </div>
            </div>

            <div className="mt-5">
              <label
                htmlFor="cp-description"
                className="mb-2 block text-sm font-bold text-[#526158]"
              >
                Notes for donors{" "}
                <span className="font-normal text-[#94a198]">(optional)</span>
              </label>
              <textarea
                id="cp-description"
                rows={3}
                value={form.description}
                onChange={set("description")}
                placeholder="Ring the bell at the green gate. Leave items in the garage."
                className="w-full rounded-xl border border-[#cfe6d6] bg-[#f7fcf6] px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#27bb5c]"
              />
            </div>

            <div className="mt-5">
              <p className="mb-2 text-sm font-bold text-[#526158]">
                What can you receive?
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                {categoryOptions.map(([Icon, label]) => (
                  <ChoiceCard
                    key={label}
                    icon={Icon}
                    label={label}
                    selected={accepted.includes(label)}
                    onClick={() => toggleCategory(label)}
                  />
                ))}
              </div>
            </div>

            {errorMessage && (
              <p
                role="alert"
                className="mt-5 rounded-xl bg-[#fdeceb] px-4 py-3 text-sm font-semibold text-[#bd5548]"
              >
                {errorMessage}
              </p>
            )}

            <Button
              type="submit"
              disabled={submitting}
              className="mt-8 w-full rounded-full bg-[#27bb5c] py-5 font-bold text-white hover:bg-[#149b47] disabled:opacity-60"
            >
              {submitting ? "Publishing..." : "Publish my space"}
            </Button>
          </form>
        </div>
      </PageContainer>
    </AppShell>
  );
};
