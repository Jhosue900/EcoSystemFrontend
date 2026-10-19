import { ArrowLeft, Mail, MapPin, Phone } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppShell, PageContainer } from "../../components/AppShell";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { getStoredToken, isValidJwt } from "../../lib/auth";

const API_BASE = (import.meta.env.VITE_API_URL ?? "").replace(/\/+$/, "");
const inputClass = "h-11 rounded-xl border-[#cfe6d6] bg-[#f7fcf6] text-sm focus-visible:ring-[#27bb5c]";

export const CreateVolunteerPost = (): JSX.Element => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ 
    title: "", 
    description: "", 
    location: "", 
    date_needed: "", 
    task_type: "Delivery",
    contact_phone: "",
    contact_email: ""
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isValidJwt(getStoredToken())) navigate("/login");
  }, [navigate]);

  const set = (key: keyof typeof form) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => setForm(prev => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.contact_phone.trim() && !form.contact_email.trim()) {
      setError("Please provide at least one contact method (phone or email).");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/api/volunteerPosts`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${getStoredToken()}` },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "Error creating post");
      navigate("/volunteer-marketplace");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AppShell>
      <PageContainer>
        <div className="mx-auto max-w-2xl">
          <button onClick={() => navigate(-1)} className="mb-6 flex items-center gap-2 text-sm font-bold text-[#087532]">
            <ArrowLeft size={16} /> Back
          </button>
          <div className="text-center mb-8">
            <h1 className="text-4xl font-extrabold text-[#087532]">Request a Volunteer</h1>
            <p className="mt-2 text-[#617066]">Need help moving items or delivering donations? Post a request.</p>
          </div>

          <form onSubmit={handleSubmit} className="rounded-[28px] bg-white p-8 shadow-xl">
            <div className="mb-5">
              <label className="mb-2 block text-sm font-bold text-[#526158]">What do you need help with?</label>
              <Input required value={form.title} onChange={set("title")} placeholder="e.g. Help moving a sofa" className={inputClass} />
            </div>
            
            <div className="mb-5">
              <label className="mb-2 block text-sm font-bold text-[#526158]">Description</label>
              <textarea required rows={3} value={form.description} onChange={set("description")} placeholder="Provide details about the task..." className="w-full rounded-xl border border-[#cfe6d6] bg-[#f7fcf6] px-3 py-2 text-sm" />
            </div>

            <div className="grid gap-5 sm:grid-cols-2 mb-5">
              <div>
                <label className="mb-2 block text-sm font-bold text-[#526158]">Location</label>
                <div className="relative">
                  <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8ea896]" />
                  <Input required value={form.location} onChange={set("location")} placeholder="City or Address" className={`${inputClass} pl-9`} />
                </div>
              </div>
              <div>
                <label className="mb-2 block text-sm font-bold text-[#526158]">When?</label>
                <Input required value={form.date_needed} onChange={set("date_needed")} placeholder="e.g. Tomorrow at 10am" className={inputClass} />
              </div>
            </div>

            <div className="mb-6">
              <label className="mb-2 block text-sm font-bold text-[#526158]">Task Type</label>
              <select value={form.task_type} onChange={set("task_type")} className="w-full h-11 rounded-xl border border-[#cfe6d6] bg-[#f7fcf6] px-3 text-sm">
                <option value="Delivery">Delivery</option>
                <option value="Logistics">Logistics (Moving items)</option>
                <option value="On-site">On-site Help</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* SECCIÓN DE CONTACTO */}
            <div className="mb-8 rounded-2xl bg-[#f4fbf3] p-5 border border-[#e1eee3]">
              <h3 className="text-sm font-extrabold text-[#087532] mb-4">Contact Information</h3>
              <p className="text-xs text-[#718077] mb-4">Provide at least one way for volunteers to reach you.</p>
              
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-xs font-bold text-[#526158]">Phone / WhatsApp</label>
                  <div className="relative">
                    <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8ea896]" />
                    <Input value={form.contact_phone} onChange={set("contact_phone")} placeholder="+57 300..." className={`${inputClass} pl-9`} />
                  </div>
                </div>
                <div>
                  <label className="mb-2 block text-xs font-bold text-[#526158]">Email</label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8ea896]" />
                    <Input type="email" value={form.contact_email} onChange={set("contact_email")} placeholder="you@email.com" className={`${inputClass} pl-9`} />
                  </div>
                </div>
              </div>
            </div>

            {error && <p className="mb-4 text-sm text-red-600 font-semibold">{error}</p>}

            <Button type="submit" disabled={submitting} className="w-full rounded-full bg-[#27bb5c] py-5 font-bold text-white hover:bg-[#149b47]">
              {submitting ? "Posting..." : "Publish Request"}
            </Button>
          </form>
        </div>
      </PageContainer>
    </AppShell>
  );
};