import { 
  ArrowRight, 
  Clock3, 
  MapPin, 
  Search, 
  Shirt, 
  Soup, 
  Tag, 
  ToyBrick, 
  User, 
  X, 
  Package, 
  Phone, 
  Mail, 
  MessageCircle,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppShell, PageContainer, SectionHeading } from "../../components/AppShell";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { getStoredToken, isValidJwt, decodeJwt } from "../../lib/auth";

const API_BASE = (import.meta.env.VITE_API_URL ?? "").replace(/\/+$/, "");

type Donation = {
  id: string;
  images: string[] | null;
  category: string;
  title: string;
  location: string;
  availability: string;
  time_limit: string;
  contact_phone: string | null;
  contact_email: string | null;
  created_at: string;
  users: { name: string; lastname: string; city: string; country: string } | null;
};

const categories = ["All Categories", "Food", "Clothing", "Household", "Kids & Toys"];

const categoryIcons: Record<string, React.ElementType> = {
  Food: Soup,
  Clothing: Shirt,
  Household: Tag,
  "Kids & Toys": ToyBrick,
};

export const DonationMarketplace = (): JSX.Element => { 
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("All Categories"); 
  const [search, setSearch] = useState(""); 
  
  // Estado de la modal y el carrusel
  const [selectedDonation, setSelectedDonation] = useState<Donation | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const navigate = useNavigate(); 

  useEffect(() => {
    const token = getStoredToken();
    if (!isValidJwt(token)) {
      navigate("/login");
      return;
    }
    const payload = decodeJwt(token as string);
    if (payload?.user_type === "donor") {
      navigate("/dashboard");
      return;
    }

    fetch(`${API_BASE}/api/donations`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setDonations(data.donations || []))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [navigate]);

  // Al abrir una nueva donación, reseteamos el índice del carrusel a 0
  const openDonation = (donation: Donation) => {
    setCurrentImageIndex(0);
    setSelectedDonation(donation);
  };

  const visible = donations.filter((item) => {
    const matchCategory = category === "All Categories" || item.category === category;
    const matchSearch = item.title.toLowerCase().includes(search.toLowerCase()) || 
                        item.location.toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchSearch;
  });

  const formatWhatsApp = (phone: string) => phone.replace(/[^0-9]/g, "");

  // Funciones para navegar en el carrusel
  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedDonation?.images) {
      setCurrentImageIndex((prev) => (prev === selectedDonation.images!.length - 1 ? 0 : prev + 1));
    }
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedDonation?.images) {
      setCurrentImageIndex((prev) => (prev === 0 ? selectedDonation.images!.length - 1 : prev - 1));
    }
  };

  return (
    <AppShell>
      <PageContainer>
        <SectionHeading 
          eyebrow="Community marketplace" 
          title="Sustainable Giving, Redefined." 
          description="Browse high-quality donations from local neighbors and businesses. Keep useful items in circulation and out of landfills."
        />
        
        <div className="mx-auto flex max-w-3xl items-center rounded-2xl bg-white px-4 py-2 shadow-[inset_0_2px_8px_rgba(54,102,69,.08),0_8px_20px_rgba(54,102,69,.06)]">
          <Search size={18} className="text-[#8ca096]"/>
          <Input 
            value={search} 
            onChange={(event)=>setSearch(event.target.value)} 
            placeholder="Search for food, clothing, or household items..." 
            className="h-11 border-0 bg-transparent shadow-none focus-visible:ring-0"
          />
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {categories.map((item)=>(
            <Button 
              key={item} 
              onClick={()=>setCategory(item)} 
              className={`rounded-full px-5 py-2 font-semibold ${category === item ? "bg-[#34c759] text-[#064c20] hover:bg-[#34c759]" : "bg-white text-[#526158] hover:bg-[#e4f4e7]"}`}
            >
              {item}
            </Button>
          ))}
        </div>

        {loading ? (
          <p className="py-20 text-center text-[#718077]">Loading donations...</p>
        ) : visible.length === 0 ? (
          <p className="py-16 text-center text-[#718077]">No donations match your search.</p>
        ) : (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((item) => {
              const Icon = categoryIcons[item.category] ?? Package;
              const cover = item.images?.[0];
              return (
                <article key={item.id} className="overflow-hidden rounded-[26px] bg-white shadow-[0_12px_30px_rgba(43,91,58,.1)] transition-transform hover:-translate-y-1 flex flex-col">
                  <div className="relative flex h-52 items-center justify-center bg-[#e4f4e7]">
                    {cover ? (
                      <img src={cover} alt={item.title} className="h-full w-full object-cover" />
                    ) : (
                      <Icon size={70} strokeWidth={1.2} className="text-[#a8dcb4]"/>
                    )}
                    <span className="absolute right-4 top-4 rounded-full bg-white/90 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-[#087532] backdrop-blur-sm">
                      {item.category}
                    </span>
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <h2 className="text-xl font-extrabold line-clamp-2">{item.title}</h2>
                      <span className="flex shrink-0 items-center gap-1 text-xs font-bold text-[#149449]">
                        <Clock3 size={13}/>{item.time_limit}
                      </span>
                    </div>
                    <p className="mt-3 flex items-center gap-2 text-sm text-[#718077]">
                      <MapPin size={15}/>{item.location}
                    </p>
                    <div className="mt-auto pt-6 flex items-end justify-between">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-[#9aa8a0]">Availability</p>
                        <p className="mt-1 text-sm font-bold">{item.availability}</p>
                      </div>
                      {/* Al darle click, llamamos a openDonation para resetear el carrusel */}
                      <Button onClick={()=>openDonation(item)} className="rounded-full bg-[#27bb5c] px-5 font-bold text-white hover:bg-[#149b47]">
                        Reserve <ArrowRight size={14}/>
                      </Button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* MODAL DE DONACIÓN CON CARRUSEL DE FOTOS */}
        {selectedDonation && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
            <div className="w-full max-w-lg overflow-hidden rounded-[32px] bg-white shadow-2xl animate-in fade-in zoom-in duration-200 max-h-[90vh] flex flex-col">
              
              {/* CARRUSEL DE IMÁGENES */}
              <div className="relative h-64 shrink-0 bg-[#e4f4e7] group">
                {selectedDonation.images && selectedDonation.images.length > 0 ? (
                  <>
                    <img 
                      src={selectedDonation.images[currentImageIndex]} 
                      alt={`${selectedDonation.title} - photo ${currentImageIndex + 1}`} 
                      className="h-full w-full object-cover transition-opacity duration-300" 
                    />
                    
                    {/* Flechas de navegación (solo si hay más de 1 foto) */}
                    {selectedDonation.images.length > 1 && (
                      <>
                        <button 
                          onClick={prevImage}
                          className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/70 p-2 text-[#142018] opacity-0 transition-opacity hover:bg-white group-hover:opacity-100"
                        >
                          <ChevronLeft size={20} />
                        </button>
                        <button 
                          onClick={nextImage}
                          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/70 p-2 text-[#142018] opacity-0 transition-opacity hover:bg-white group-hover:opacity-100"
                        >
                          <ChevronRight size={20} />
                        </button>

                        {/* Puntos indicadores abajo */}
                        <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
                          {selectedDonation.images.map((_, idx) => (
                            <button
                              key={idx}
                              onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(idx); }}
                              className={`h-2 w-2 rounded-full transition-all ${idx === currentImageIndex ? "bg-white scale-125" : "bg-white/50"}`}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </>
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <Package size={60} className="text-[#a8dcb4]" />
                  </div>
                )}
                
                {/* Botón de Cerrar */}
                <button 
                  onClick={() => setSelectedDonation(null)}
                  className="absolute right-4 top-4 rounded-full bg-white/80 p-2 text-[#142018] hover:bg-white transition-colors z-10"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 sm:p-8 overflow-y-auto">
                <span className="rounded-full bg-[#e8f8e9] px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-[#087532]">
                  {selectedDonation.category}
                </span>
                <h2 className="mt-3 text-2xl font-extrabold text-[#142018]">{selectedDonation.title}</h2>
                
                <div className="mt-4 space-y-3 rounded-xl bg-[#f4fbf3] p-4 border border-[#e1eee3]">
                  <p className="flex items-center gap-3 text-sm text-[#526158]">
                    <MapPin size={18} className="text-[#18a34a]" /> {selectedDonation.location}
                  </p>
                  <p className="flex items-center gap-3 text-sm text-[#526158]">
                    <Clock3 size={18} className="text-[#18a34a]" /> Available: {selectedDonation.availability} ({selectedDonation.time_limit})
                  </p>
                  <p className="flex items-center gap-3 text-sm text-[#526158]">
                    <User size={18} className="text-[#18a34a]" /> Donated by {selectedDonation.users?.name || "Anonymous"}
                  </p>
                </div>

                {/* BOTONES DE CONTACTO */}
                <h3 className="mt-6 mb-3 text-sm font-extrabold text-[#142018]">Contact the Donor</h3>
                <div className="flex flex-col gap-3">
                  {selectedDonation.contact_phone && (
                    <div className="flex gap-2">
                      <a 
                        href={`https://wa.me/${formatWhatsApp(selectedDonation.contact_phone)}`} 
                        target="_blank" 
                        rel="noreferrer"
                        className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#25D366] py-3 text-sm font-bold text-white hover:bg-[#1eb958] transition-colors"
                      >
                        <MessageCircle size={18} /> WhatsApp
                      </a>
                      <a 
                        href={`tel:${selectedDonation.contact_phone}`}
                        className="flex flex-1 items-center justify-center gap-2 rounded-xl border-2 border-[#27bb5c] py-3 text-sm font-bold text-[#087532] hover:bg-[#e8f8e9] transition-colors"
                      >
                        <Phone size={18} /> Call
                      </a>
                    </div>
                  )}

                  {selectedDonation.contact_email && (
                    <a 
                      href={`mailto:${selectedDonation.contact_email}`}
                      className="flex items-center justify-center gap-2 rounded-xl bg-[#f0f4f0] py-3 text-sm font-bold text-[#142018] hover:bg-[#e2eee4] transition-colors"
                    >
                      <Mail size={18} /> {selectedDonation.contact_email}
                    </a>
                  )}
                </div>
                
                <p className="mt-4 text-center text-xs text-[#94a198]">
                  Coordinate a safe pickup location and time with the donor.
                </p>
              </div>
            </div>
          </div>
        )}

      </PageContainer>
    </AppShell>
  ); 
};