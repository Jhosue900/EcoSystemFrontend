import { CalendarDays, Clock3, Home, Leaf, MapPin, Package } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppShell, PageContainer, SectionHeading } from "../../components/AppShell";
import { getStoredToken, isValidJwt } from "../../lib/auth";

const API_BASE = (import.meta.env.VITE_API_URL ?? "").replace(/\/+$/, "");

type Donation = {
  id: string;
  title: string;
  category: string;
  location: string;
  availability: string;
  created_at: string;
};

type CollectionPoint = {
  id: string;
  name: string;
  address: string;
  city: string;
  schedule: string;
  is_active: boolean;
  created_at: string;
};

export const DonorHistory = (): JSX.Element => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"donations" | "collection">("donations");
  
  const [donations, setDonations] = useState<Donation[]>([]);
  const [points, setPoints] = useState<CollectionPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getStoredToken();
    if (!token || !isValidJwt(token)) {
      navigate("/login");
      return;
    }

    const headers = { Authorization: `Bearer ${token}` };

    Promise.all([
      fetch(`${API_BASE}/api/myDonations`, { headers }).then(res => res.json()),
      fetch(`${API_BASE}/api/myCollectionPoints`, { headers }).then(res => res.json())
    ])
      .then(([donationsData, pointsData]) => {
        setDonations(donationsData.donations || []);
        setPoints(pointsData.collection_points || []);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [navigate]);

  return (
    <AppShell>
      <PageContainer>
        <SectionHeading
          eyebrow="Your journey"
          title="My Activity History"
          description="A complete overview of the items you have donated and the spaces you've offered."
        />

        <div className="mb-6 flex gap-2 border-b border-[#d8e8dc]">
          <button
            onClick={() => setActiveTab("donations")}
            className={`flex items-center gap-2 border-b-2 px-6 py-3 text-sm font-bold transition-colors ${
              activeTab === "donations" ? "border-[#27bb5c] text-[#087532]" : "border-transparent text-[#718077] hover:text-[#087532]"
            }`}
          >
            <Leaf size={16} /> My Donations
          </button>
          <button
            onClick={() => setActiveTab("collection")}
            className={`flex items-center gap-2 border-b-2 px-6 py-3 text-sm font-bold transition-colors ${
              activeTab === "collection" ? "border-[#27bb5c] text-[#087532]" : "border-transparent text-[#718077] hover:text-[#087532]"
            }`}
          >
            <Home size={16} /> Collection Points
          </button>
        </div>

        {loading ? (
          <p className="text-center py-10 text-[#718077]">Loading history...</p>
        ) : (
          <div className="rounded-[24px] bg-white p-6 shadow-[0_12px_30px_rgba(43,91,58,.08)]">
            
            {activeTab === "donations" && (
              <div>
                {donations.length === 0 ? (
                  <div className="text-center py-10">
                    <Package className="mx-auto h-10 w-10 text-[#d9f2df]" />
                    <p className="mt-3 font-bold">No donations yet</p>
                    <p className="text-sm text-[#718077]">When you publish a donation, it will show up here.</p>
                  </div>
                ) : (
                  <div className="divide-y divide-[#edf3ee]">
                    {donations.map((donation) => (
                      <div key={donation.id} className="flex flex-col gap-3 py-5 sm:flex-row sm:items-center">
                        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#d9f2df] text-[#087532]">
                          <Leaf size={18} />
                        </div>
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="font-bold">{donation.title}</p>
                            <span className="rounded-full bg-[#e2f3e4] px-2 py-0.5 text-[10px] font-bold text-[#087532]">
                              {donation.category}
                            </span>
                          </div>
                          <p className="mt-1 flex items-center gap-3 text-xs text-[#718077]">
                            <span className="flex items-center gap-1"><MapPin size={12} /> {donation.location}</span>
                            <span className="flex items-center gap-1"><CalendarDays size={12} /> {new Date(donation.created_at).toLocaleDateString()}</span>
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-extrabold">{donation.availability}</p>
                          <p className="text-[10px] font-bold uppercase text-[#159449]">Published</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "collection" && (
              <div>
                {points.length === 0 ? (
                  <div className="text-center py-10">
                    <Home className="mx-auto h-10 w-10 text-[#d9f2df]" />
                    <p className="mt-3 font-bold">No collection points offered</p>
                    <p className="text-sm text-[#718077]">You haven't offered any spaces yet.</p>
                  </div>
                ) : (
                  <div className="divide-y divide-[#edf3ee]">
                    {points.map((point) => (
                      <div key={point.id} className="flex flex-col gap-3 py-5 sm:flex-row sm:items-center">
                        <div className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${point.is_active ? "bg-[#d9f2df] text-[#087532]" : "bg-[#eef1ee] text-[#94a198]"}`}>
                          <Home size={18} />
                        </div>
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="font-bold">{point.name}</p>
                            <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${point.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                              {point.is_active ? "Active" : "Paused"}
                            </span>
                          </div>
                          <p className="mt-1 flex items-center gap-3 text-xs text-[#718077]">
                            <span className="flex items-center gap-1"><MapPin size={12} /> {point.address}, {point.city}</span>
                            <span className="flex items-center gap-1"><Clock3 size={12} /> {point.schedule}</span>
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-[#94a198]">
                            {new Date(point.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </PageContainer>
    </AppShell>
  );
};