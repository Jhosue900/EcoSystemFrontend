import { CheckCircle2, Mail, Phone } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AppShell, PageContainer } from "../../components/AppShell";
import { DonationStepLayout } from "./DonationStepLayout";
import { useEffect, useRef, useState } from "react";
import { getStoredToken, isValidJwt } from "../../lib/auth";
import { useDonation } from "./DonationContext";
import { Input } from "../../components/ui/input";

const API_BASE = (import.meta.env.VITE_API_URL ?? "").replace(/\/+$/, "");

export const DonationReview = (): JSX.Element => {
  const navigate = useNavigate();
  const { draft, resetDraft } = useDonation();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  
  // Estados para los contactos
  const [contactPhone, setContactPhone] = useState("");
  const [contactEmail, setContactEmail] = useState("");

  const published = useRef(false);

  const isIncomplete =
    !draft.category || !draft.title.trim() || !draft.location.trim() ||
    !draft.availability.trim() || !draft.time_limit.trim();

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

    if (!contactPhone.trim() && !contactEmail.trim()) {
      setError("Please provide at least one contact method (phone or email).");
      return;
    }

    const token = getStoredToken();
    if (!token || !isValidJwt(token)) {
      navigate("/register");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const body = new FormData();
      draft.images.forEach((file) => body.append("images", file));
      body.append("category", draft.category);
      body.append("title", draft.title.trim());
      body.append("location", draft.location.trim());
      body.append("availability", draft.availability.trim());
      body.append("time_limit", draft.time_limit.trim());
      body.append("contact_phone", contactPhone.trim());
      body.append("contact_email", contactEmail.trim());

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
        throw new Error(data?.error ?? data?.message ?? "Could not publish the donation.");
      }

      published.current = true;
      navigate("/marketplace");
      resetDraft();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Try again in a moment.");
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

          {/* SECCIÓN DE CONTACTO */}
          <div className="mt-6 rounded-2xl bg-[#f4fbf3] p-5 border border-[#e1eee3] text-left">
            <h3 className="text-sm font-extrabold text-[#087532] mb-1">Contact Information</h3>
            <p className="text-xs text-[#718077] mb-4">How should beneficiaries reach you to coordinate the pickup?</p>
            
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-xs font-bold text-[#526158]">Phone / WhatsApp</label>
                <div className="relative">
                  <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8ea896]" />
                  <Input 
                    value={contactPhone} 
                    onChange={(e) => setContactPhone(e.target.value)} 
                    placeholder="+57 300..." 
                    className="h-11 rounded-xl border-[#cfe6d6] bg-white pl-9 text-sm focus-visible:ring-[#27bb5c]" 
                  />
                </div>
              </div>
              <div>
                <label className="mb-2 block text-xs font-bold text-[#526158]">Email</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8ea896]" />
                  <Input 
                    type="email" 
                    value={contactEmail} 
                    onChange={(e) => setContactEmail(e.target.value)} 
                    placeholder="you@email.com" 
                    className="h-11 rounded-xl border-[#cfe6d6] bg-white pl-9 text-sm focus-visible:ring-[#27bb5c]" 
                  />
                </div>
              </div>
            </div>
          </div>

          {error && (
            <p role="alert" className="mt-4 rounded-xl bg-red-50 p-3 text-left text-sm font-semibold text-red-700">
              {error}
            </p>
          )}
          <div className="mt-4 flex items-center gap-2 rounded-xl bg-[#e8f8e9] p-3 text-left text-sm text-[#087532]">
            <CheckCircle2 size={16} /> Your donation will be visible in the marketplace immediately.
          </div>
        </DonationStepLayout>
      </PageContainer>
    </AppShell>
  );
};