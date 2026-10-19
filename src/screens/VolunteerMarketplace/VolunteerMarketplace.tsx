import { MapPin, Search, Clock, HandHeart, User, Plus, X, Phone, Mail, MessageCircle, FileText } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppShell, PageContainer, SectionHeading } from "../../components/AppShell";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { getStoredToken, isValidJwt } from "../../lib/auth";

const API_BASE = (import.meta.env.VITE_API_URL ?? "").replace(/\/+$/, "");

type VolunteerPost = {
  id: string;
  title: string;
  description: string;
  location: string;
  date_needed: string;
  task_type: string;
  contact_phone: string | null;
  contact_email: string | null;
  users: { name: string, lastname: string } | null;
};

export const VolunteerMarketplace = (): JSX.Element => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<VolunteerPost[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  
  // Estado para la modal
  const [selectedPost, setSelectedPost] = useState<VolunteerPost | null>(null);

  useEffect(() => {
    const token = getStoredToken();
    if (!token || !isValidJwt(token)) {
      navigate("/login");
      return;
    }

    fetch(`${API_BASE}/api/volunteerPosts`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setPosts(data.volunteer_posts || []))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [navigate]);

  const visible = posts.filter(p => 
    p.title.toLowerCase().includes(search.toLowerCase()) || 
    p.location.toLowerCase().includes(search.toLowerCase())
  );

  // Formatear el número para WhatsApp (quitar espacios, símbolos)
  const formatWhatsApp = (phone: string) => {
    return phone.replace(/[^0-9]/g, "");
  };

  return (
    <AppShell>
      <PageContainer>
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <SectionHeading
            eyebrow="Community Support"
            title="Volunteer Opportunities"
            description="Help donors and beneficiaries by moving items, sorting donations, or delivering hope."
          />
          <div className="flex flex-wrap gap-2">
            <Button 
              variant="outline"
              onClick={() => navigate("/my-volunteer-posts")} 
              className="rounded-full border-[#b5dfbf] font-bold text-[#087532] hover:bg-[#e8f8e9]"
            >
              <FileText size={16} /> My Requests
            </Button>
            <Button 
              onClick={() => navigate("/volunteer-posts/new")} 
              className="rounded-full bg-[#27bb5c] font-bold text-white hover:bg-[#149b47]"
            >
              <Plus size={16} /> Create Request
            </Button>
          </div>
        </div>

        <div className="mx-auto flex max-w-3xl items-center rounded-2xl bg-white px-4 py-2 shadow-sm mt-6">
          <Search size={18} className="text-[#8ca096]" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by city or task..."
            className="h-11 border-0 bg-transparent shadow-none focus-visible:ring-0"
          />
        </div>

        {loading ? (
          <p className="text-center py-10 text-[#718077]">Loading requests...</p>
        ) : visible.length === 0 ? (
          <div className="text-center py-20">
            <p className="font-bold text-lg text-[#142018]">No requests found</p>
            <p className="text-[#718077] mt-1">Try adjusting your search or create a new request.</p>
          </div>
        ) : (
          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {visible.map((req) => (
              <article key={req.id} className="flex flex-col rounded-[26px] bg-white shadow-[0_12px_30px_rgba(43,91,58,.1)] overflow-hidden">
                <div className="bg-[#e4f4e7] p-6">
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-white px-3 py-1 text-[10px] font-extrabold uppercase text-[#087532]">
                      {req.task_type}
                    </span>
                    <span className="flex items-center gap-1 text-xs font-bold text-[#149449]">
                      <Clock size={14} /> {req.date_needed}
                    </span>
                  </div>
                  <h2 className="mt-4 text-xl font-extrabold">{req.title}</h2>
                  <p className="mt-1 flex items-center gap-1 text-sm font-semibold text-[#526158]">
                    <User size={14}/> Requested by {req.users?.name || "Someone"}
                  </p>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <p className="flex items-center gap-2 text-sm text-[#718077] mb-4">
                    <MapPin size={16} className="text-[#18a34a]" /> {req.location}
                  </p>
                  <p className="flex-1 text-sm text-[#617066] line-clamp-3">{req.description}</p>
                  
                  <Button 
                    onClick={() => setSelectedPost(req)}
                    className="mt-6 w-full rounded-full bg-[#27bb5c] font-bold text-white hover:bg-[#149b47]"
                  >
                    <HandHeart size={16} /> Offer to help
                  </Button>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* MODAL DE DETALLES Y CONTACTO */}
        {selectedPost && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
            <div className="w-full max-w-lg overflow-hidden rounded-[32px] bg-white shadow-2xl animate-in fade-in zoom-in duration-200">
              
              {/* Header de la Modal */}
              <div className="relative bg-[#e4f4e7] p-8">
                <button 
                  onClick={() => setSelectedPost(null)}
                  className="absolute right-4 top-4 rounded-full bg-white/60 p-2 text-[#087532] hover:bg-white transition-colors"
                >
                  <X size={20} />
                </button>
                <span className="rounded-full bg-white px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-[#087532]">
                  {selectedPost.task_type}
                </span>
                <h2 className="mt-3 text-2xl font-extrabold text-[#142018]">{selectedPost.title}</h2>
                <p className="mt-1 flex items-center gap-1 text-sm font-semibold text-[#526158]">
                  <User size={14}/> {selectedPost.users?.name} {selectedPost.users?.lastname}
                </p>
              </div>

              {/* Cuerpo de la Modal */}
              <div className="p-8">
                <div className="space-y-4 mb-6">
                  <p className="flex items-center gap-3 text-sm text-[#526158]">
                    <MapPin size={18} className="text-[#18a34a]" /> {selectedPost.location}
                  </p>
                  <p className="flex items-center gap-3 text-sm text-[#526158]">
                    <Clock size={18} className="text-[#18a34a]" /> {selectedPost.date_needed}
                  </p>
                </div>

                <div className="rounded-xl bg-[#f4fbf3] p-4 text-sm leading-6 text-[#617066] border border-[#e1eee3]">
                  {selectedPost.description}
                </div>

                <h3 className="mt-6 mb-3 text-sm font-extrabold text-[#142018]">Contact Information</h3>
                
                <div className="flex flex-col gap-3">
                  {selectedPost.contact_phone && (
                    <div className="flex gap-2">
                      <a 
                        href={`https://wa.me/${formatWhatsApp(selectedPost.contact_phone)}`} 
                        target="_blank" 
                        rel="noreferrer"
                        className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#25D366] py-3 text-sm font-bold text-white hover:bg-[#1eb958] transition-colors"
                      >
                        <MessageCircle size={18} /> WhatsApp
                      </a>
                      <a 
                        href={`tel:${selectedPost.contact_phone}`}
                        className="flex flex-1 items-center justify-center gap-2 rounded-xl border-2 border-[#27bb5c] py-3 text-sm font-bold text-[#087532] hover:bg-[#e8f8e9] transition-colors"
                      >
                        <Phone size={18} /> Call
                      </a>
                    </div>
                  )}

                  {selectedPost.contact_email && (
                    <a 
                      href={`mailto:${selectedPost.contact_email}`}
                      className="flex items-center justify-center gap-2 rounded-xl bg-[#f0f4f0] py-3 text-sm font-bold text-[#142018] hover:bg-[#e2eee4] transition-colors"
                    >
                      <Mail size={18} /> {selectedPost.contact_email}
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

      </PageContainer>
    </AppShell>
  );
};