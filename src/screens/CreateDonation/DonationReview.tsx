import { CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AppShell, PageContainer } from "../../components/AppShell";
import { DonationStepLayout } from "./DonationStepLayout";
import { useEffect, useRef, useState } from "react";
import { getStoredToken, isValidJwt } from "../../lib/auth";
import { useDonation } from "./DonationContext";

// Misma convención que loginForm.tsx y createAccount.tsx
const API_BASE = (import.meta.env.VITE_API_URL ?? "").replace(/\/+$/, "");

export const DonationReview = (): JSX.Element => {
  const navigate = useNavigate();
  const { draft, resetDraft } = useDonation();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const published = useRef(false);

  const isIncomplete =
    !draft.category ||
    !draft.title.trim() ||
    !draft.location.trim() ||
    !draft.availability.trim() ||
    !draft.time_limit.trim();

  // Si se recarga la página el estado se pierde: volver al inicio del flujo
  useEffect(() => {
    if (isIncomplete && !published.current) {
      navigate("/create-donation", { replace: true });
    }
  }, [isIncomplete, navigate]);

  const summary = [
    ["Category", draft.category],
    ["Title", draft.title],
    ["Location", draft.location],
    ["Availability", draft.availability],
    ["Time limit", draft.time_limit],
    ["Photos", String(draft.images.length)],
  ];

  const handlePublish = async () => {
    if (isSubmitting) return;

    const token = getStoredToken();
    if (!token || !isValidJwt(token)) {
      navigate("/register");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      // FormData porque enviamos archivos. No pongas Content-Type a mano:
      // el navegador lo agrega con el boundary correcto.
      const body = new FormData();
      draft.images.forEach((file) => body.append("images", file));
      body.append("category", draft.category);
      body.append("title", draft.title.trim());
      body.append("location", draft.location.trim());
      body.append("availability", draft.availability.trim());
      body.append("time_limit", draft.time_limit.trim());

      const response = await fetch(`${API_BASE}/api/createDonation`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body,
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        if (response.status === 401) {
          navigate("/register");
          return;
        }
        throw new Error(
          data?.error ?? data?.message ?? "Could not publish the donation.",
        );
      }

      published.current = true;
      navigate("/marketplace");
      resetDraft();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Try again in a moment.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AppShell>
      <PageContainer>
        <DonationStepLayout
          step={4}
          title="Review & Publish"
          nextLabel={isSubmitting ? "Publishing..." : "Publish Donation"}
          nextDisabled={isSubmitting || isIncomplete}
          onNext={handlePublish}
        >
          <div className="mt-6 rounded-2xl bg-[#f4fbf3] p-5 text-left">
            <h3 className="text-sm font-extrabold text-[#087532]">Summary</h3>
            <dl className="mt-4 divide-y divide-[#e1eee3]">
              {summary.map(([key, value]) => (
                <div key={key} className="flex justify-between py-3 text-sm">
                  <dt className="text-[#718077]">{key}</dt>
                  <dd className="font-bold text-[#142018]">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
          {error && (
            <p
              role="alert"
              className="mt-4 rounded-xl bg-red-50 p-3 text-left text-sm font-semibold text-red-700"
            >
              {error}
            </p>
          )}
          <div className="mt-4 flex items-center gap-2 rounded-xl bg-[#e8f8e9] p-3 text-left text-sm text-[#087532]">
            <CheckCircle2 size={16} /> Your donation will be visible in the
            marketplace immediately.
          </div>
        </DonationStepLayout>
      </PageContainer>
    </AppShell>
  );
};