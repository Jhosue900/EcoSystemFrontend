import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  User, 
  Mail, 
  MapPin, 
  Calendar, 
  ShieldCheck, 
  HandHeart, 
  HandHelping 
} from "lucide-react";
import { AppShell, PageContainer, SectionHeading } from "../../components/AppShell";
import { getStoredToken, isValidJwt } from "../../lib/auth";

const API_BASE = (import.meta.env.VITE_API_URL ?? "").replace(/\/+$/, "");

type UserProfile = {
  id: string;
  name: string;
  lastname: string;
  age: number;
  country: string;
  city: string;
  mail: string;
  user_type: "donor" | "beneficiary" | "volunteer";
  created_at: string;
};

export const Profile = (): JSX.Element => {
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = getStoredToken();
    if (!token || !isValidJwt(token)) {
      navigate("/login");
      return;
    }

    fetch(`${API_BASE}/api/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        const data = await res.json();
        if (res.status === 401) {
          navigate("/login");
          return;
        }
        if (!res.ok) throw new Error(data?.error ?? "Error loading profile");
        return data;
      })
      .then((data) => {
        if (data?.user) {
          setProfileData(data.user);
        }
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : "Connection error");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [navigate]);

  if (loading) {
    return (
      <AppShell>
        <PageContainer>
          <div className="py-20 text-center text-[#718077]">Loading profile...</div>
        </PageContainer>
      </AppShell>
    );
  }

  if (error || !profileData) {
    return (
      <AppShell>
        <PageContainer>
          <div className="py-20 text-center text-red-600 font-semibold">{error || "Profile not found"}</div>
        </PageContainer>
      </AppShell>
    );
  }

  const roleLabels: Record<string, { label: string, icon: any, textColor: string }> = {
    donor: { label: "Donor", icon: HandHeart, textColor: "text-[#087532]" },
    beneficiary: { label: "Beneficiary", icon: HandHeart, textColor: "text-[#1565c0]" },
    volunteer: { label: "Volunteer", icon: HandHelping, textColor: "text-[#e65100]" },
  };

  const roleInfo = roleLabels[profileData.user_type] || roleLabels.donor;
  const RoleIcon = roleInfo.icon;

  return (
    <AppShell>
      <PageContainer>
        <SectionHeading 
          eyebrow="Account Settings" 
          title="My Profile" 
          description="Review your personal information and your role in EcoSystem."
        />

        <div className="mt-8 max-w-3xl overflow-hidden rounded-[32px] bg-white shadow-[0_20px_50px_rgba(43,91,58,.08)]">
          <div className="bg-[#f4fbf3] p-8 sm:p-10 border-b border-[#e1eee3] flex flex-col sm:flex-row items-center gap-6">
            <div className="grid h-24 w-24 shrink-0 place-items-center rounded-full bg-[#ccefd4] text-[#087532] shadow-sm">
              <User size={48} />
            </div>
            <div className="text-center sm:text-left">
              <h2 className="text-3xl font-extrabold text-[#142018]">
                {profileData.name} {profileData.lastname}
              </h2>
              <div className="mt-3 inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-bold shadow-sm border border-[#e1eee3] bg-white">
                <RoleIcon size={16} className={roleInfo.textColor} />
                <span className="text-[#526158]">{roleInfo.label}</span>
              </div>
            </div>
          </div>

          <div className="p-8 sm:p-10">
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-[#94a198] mb-6">
              Personal Information
            </h3>
            
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-1">
                <p className="flex items-center gap-2 text-xs font-bold text-[#718077]">
                  <Mail size={14} /> Email Address
                </p>
                <p className="text-base font-semibold text-[#142018]">
                  {profileData.mail}
                </p>
              </div>

              <div className="space-y-1">
                <p className="flex items-center gap-2 text-xs font-bold text-[#718077]">
                  <Calendar size={14} /> Age
                </p>
                <p className="text-base font-semibold text-[#142018]">
                  {profileData.age} years old
                </p>
              </div>

              <div className="space-y-1">
                <p className="flex items-center gap-2 text-xs font-bold text-[#718077]">
                  <MapPin size={14} /> Location
                </p>
                <p className="text-base font-semibold text-[#142018]">
                  {profileData.city}, {profileData.country}
                </p>
              </div>

              <div className="space-y-1">
                <p className="flex items-center gap-2 text-xs font-bold text-[#718077]">
                  <ShieldCheck size={14} /> Account Status
                </p>
                <p className="inline-flex items-center gap-1 rounded-full bg-[#e8f8e9] px-2.5 py-1 text-xs font-bold text-[#087532]">
                  Active
                </p>
              </div>
            </div>
          </div>
        </div>
      </PageContainer>
    </AppShell>
  );
};