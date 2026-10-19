import { 
  ArrowRight, 
  HandHeart, 
  History, 
  MapPin, 
  Store, 
  Users, 
  UtensilsCrossed 
} from "lucide-react";
import { AppShell, PageContainer, SectionHeading } from "../../components/AppShell";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getStoredToken, isValidJwt, decodeJwt } from "../../lib/auth";
import { Button } from "../../components/ui/button";

export function Dashboard(): JSX.Element {
  const navigate = useNavigate();
  const [userName, setUserName] = useState<string>("");
  const [userType, setUserType] = useState<string>("donor");

  useEffect(() => {
    const token = getStoredToken();
    if (!isValidJwt(token)) {
      navigate("/login");
      return;
    }

    const payload = decodeJwt(token as string);
    if (payload) {
      setUserName((payload.name as string) || "there");
      setUserType((payload.user_type as string) || "donor");
    }
  }, [navigate]);

  const roleActions = {
    donor: [
      { title: "Create a donation", desc: "Publish items you want to give a second life.", icon: HandHeart, path: "/create-donation", color: "bg-[#e8f8e9] text-[#087532]" },
      { title: "Manage my donations", desc: "Pause or delete the items you have published.", icon: Store, path: "/my-donations", color: "bg-[#e8f8e9] text-[#087532]" },
      { title: "My activity history", desc: "View all the items you have donated.", icon: History, path: "/donor-history", color: "bg-[#f0f4f0] text-[#526158]" },
    ],
    beneficiary: [
      { title: "Explore Marketplace", desc: "Find items you need from local donors.", icon: UtensilsCrossed, path: "/marketplace", color: "bg-[#e8f8e9] text-[#087532]" },
      { title: "Volunteer Hub", desc: "Request help or see volunteer opportunities.", icon: Users, path: "/volunteer-marketplace", color: "bg-[#e8f8e9] text-[#087532]" },
      { title: "Offer a collection point", desc: "Provide a space to receive community donations.", icon: Store, path: "/collection-points/new", color: "bg-[#e8f8e9] text-[#087532]" },
      { title: "My activity history", desc: "View your spaces and volunteer requests.", icon: History, path: "/beneficiary-history", color: "bg-[#f0f4f0] text-[#526158]" },
    ],
    volunteer: [
      { title: "Volunteer Marketplace", desc: "Find people who need help moving donations.", icon: Users, path: "/volunteer-marketplace", color: "bg-[#e8f8e9] text-[#087532]" },
      { title: "Offer a collection point", desc: "Become a hub for donations in your area.", icon: Store, path: "/collection-points/new", color: "bg-[#e8f8e9] text-[#087532]" },
      { title: "My activity history", desc: "View your past volunteer activities.", icon: History, path: "/volunteer-history", color: "bg-[#f0f4f0] text-[#526158]" },
    ],
  };

  const actions = roleActions[userType as keyof typeof roleActions] || roleActions.donor;

  return (
    <AppShell>
      <PageContainer>
        <SectionHeading 
          title={`Hello, ${userName}!`} 
          description={`Welcome back to EcoSystem. Here is what you can do as a ${userType}.`}
        />

        {/* Grid responsive dinámico */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {actions.map((action) => (
            <div 
              key={action.title} 
              className="flex flex-col items-start rounded-[24px] bg-white p-6 shadow-[0_10px_24px_rgba(43,91,58,.06)] transition-transform hover:-translate-y-1"
            >
              <div className={`mb-4 grid h-12 w-12 place-items-center rounded-2xl ${action.color}`}>
                <action.icon size={22} />
              </div>
              <h3 className="text-lg font-extrabold">{action.title}</h3>
              <p className="mt-2 mb-6 flex-1 text-sm leading-6 text-[#617066]">
                {action.desc}
              </p>
              <Button 
                onClick={() => navigate(action.path)}
                className="w-full rounded-full bg-[#27bb5c] font-bold text-white hover:bg-[#149b47]"
              >
                Go <ArrowRight size={16} />
              </Button>
            </div>
          ))}
        </div>
      </PageContainer>
    </AppShell>
  );
}