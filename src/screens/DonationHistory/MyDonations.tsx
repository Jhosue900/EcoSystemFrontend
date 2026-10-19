import { Clock3, MapPin, Package, Trash2, Image as ImageIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppShell, PageContainer, SectionHeading } from "../../components/AppShell";
import { Button } from "../../components/ui/button";
import { getStoredToken, isValidJwt } from "../../lib/auth";

const API_BASE = (import.meta.env.VITE_API_URL ?? "").replace(/\/+$/, "");

type Donation = {
  id: string;
  title: string;
  category: string;
  location: string;
  availability: string;
  time_limit: string;
  is_active: boolean;
  images: string[] | null;
  created_at: string;
};

export const MyDonations = (): JSX.Element => {
  const navigate = useNavigate();
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);

  const fetchDonations = () => {
    const token = getStoredToken();
    if (!token || !isValidJwt(token)) {
      navigate("/login");
      return;
    }
    setLoading(true);
    fetch(`${API_BASE}/api/myDonations`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setDonations(data.donations || []))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchDonations(); }, [navigate]);

  const handleToggle = async (donation: Donation) => {
    const token = getStoredToken();
    if (!token) return;
    setBusyId(donation.id);
    try {
      const res = await fetch(`${API_BASE}/api/donations/${donation.id}/toggle`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setDonations(prev => prev.map(d => d.id === donation.id ? { ...d, is_active: !d.is_active } : d));
      }
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (donation: Donation) => {
    if (!window.confirm(`Delete "${donation.title}"? This can't be undone.`)) return;
    const token = getStoredToken();
    if (!token) return;
    setBusyId(donation.id);
    try {
      const res = await fetch(`${API_BASE}/api/donations/${donation.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setDonations(prev => prev.filter(d => d.id !== donation.id));
      }
    } finally {
      setBusyId(null);
    }
  };

  return (
    <AppShell>
      <PageContainer>
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
          <SectionHeading
            eyebrow="Your items"
            title="My Donations"
            description="Manage the items you have published. Pause them if you need a break, or delete them when they're gone."
          />
          <Button
            onClick={() => navigate("/create-donation")}
            className="rounded-full bg-[#27bb5c] px-5 font-bold text-white hover:bg-[#149b47]"
          >
            <Package size={15} /> New Donation
          </Button>
        </div>

        <div className="rounded-[24px] bg-white p-4 shadow-[0_12px_30px_rgba(43,91,58,.08)] mt-6">
          {loading ? (
            <div className="p-10 text-center text-[#718077]">Loading...</div>
          ) : donations.length === 0 ? (
            <div className="p-10 text-center">
              <p className="font-bold">You haven't published any donations yet</p>
              <Button onClick={() => navigate("/create-donation")} className="mt-4 rounded-full bg-[#27bb5c] font-bold text-white">
                Create your first donation
              </Button>
            </div>
          ) : (
            <div className="divide-y divide-[#edf3ee]">
              {donations.map((donation) => {
                const cover = donation.images?.[0];
                return (
                  <div key={donation.id} className="flex flex-col gap-4 py-5 lg:flex-row lg:items-center">
                    {cover ? (
                      <img src={cover} alt="" className="h-14 w-14 rounded-xl object-cover" />
                    ) : (
                      <div className={`grid h-14 w-14 shrink-0 place-items-center rounded-xl ${donation.is_active ? "bg-[#d9f2df] text-[#087532]" : "bg-[#eef1ee] text-[#94a198]"}`}>
                        <ImageIcon size={20} />
                      </div>
                    )}
                    
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-bold">{donation.title}</p>
                        <span className="rounded-full bg-[#e2f3e4] px-2 py-0.5 text-[10px] font-bold text-[#087532]">
                          {donation.category}
                        </span>
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${donation.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                          {donation.is_active ? "Active" : "Paused"}
                        </span>
                      </div>
                      <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-[#718077]">
                        <span className="flex items-center gap-1"><MapPin size={12} /> {donation.location}</span>
                        <span className="flex items-center gap-1"><Clock3 size={12} /> {donation.availability}</span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button variant="outline" disabled={busyId === donation.id} onClick={() => handleToggle(donation)} className="rounded-full border-[#b5dfbf] font-bold text-[#087532]">
                        {donation.is_active ? "Pause" : "Activate"}
                      </Button>
                      <Button variant="outline" disabled={busyId === donation.id} onClick={() => handleDelete(donation)} className="rounded-full border-[#e6b3ad] text-[#bd5548]">
                        <Trash2 size={15} />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </PageContainer>
    </AppShell>
  );
};