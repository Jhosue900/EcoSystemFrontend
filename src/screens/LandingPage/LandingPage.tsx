import {
  ArrowRight,
  Check,
  HandHeart,
  Handshake,
  Home,
  Leaf,
  Link2,
  MapPin,
  PackageCheck,
  Recycle,
  Store,
  Truck,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AppShell, PageContainer } from "../../components/AppShell";
import { Button } from "../../components/ui/button";

import { useEffect, useState } from "react";
import { getStoredToken, isValidJwt } from "../../lib/auth";

const impactStats: [React.ElementType, string, string][] = [
  [Recycle, "Waste diverted", "4,820 kg"],
  [PackageCheck, "Items reused", "1,284"],
  [Leaf, "CO₂ prevented", "12.4 tons"],
  [MapPin, "Collection points", "42"],
];

const steps: [React.ElementType, string, string][] = [
  [
    Link2,
    "Publish",
    "Share the items you want to give a second life, or post your space as a collection point.",
  ],
  [
    Handshake,
    "Coordinate",
    "Match with beneficiaries, charities, or volunteers nearby and agree on a pickup.",
  ],
  [
    Truck,
    "Deliver",
    "Hand off the donation at a collection point or arrange a direct pickup.",
  ],
];

const roles: [React.ElementType, string, string][] = [
  [
    HandHeart,
    "Donor",
    "Have items you no longer use? Publish them and give them a second life instead of throwing them away.",
  ],
  [
    Handshake,
    "Beneficiary",
    "Looking for something you need? Browse the marketplace and request donations from your community.",
  ],
  [
    Truck,
    "Volunteer",
    "Help move donations between donors and beneficiaries, or support collection points.",
  ],
];

export function LandingPage(): JSX.Element {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const authenticated = isValidJwt(getStoredToken());
    setIsAuthenticated(authenticated);

    if (authenticated) {
      navigate("/dashboard");
    }
  }, [navigate]);

  return (
    <AppShell>
      <PageContainer>
        {/* HERO */}
        <section className="grid items-center gap-12 py-8 lg:grid-cols-[1fr_0.85fr] lg:py-16">
          <div>
            <span className="inline-flex rounded-full bg-[#d4f1dc] px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-[#07803a]">
              Circular economy 2.0
            </span>
            <h1 className="mt-6 max-w-xl text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-6xl">
              Give products a <span className="text-[#07933d]">second life</span> before they
              become waste.
            </h1>
            <p className="mt-6 max-w-lg text-base leading-7 text-[#617066]">
              EcoSystem connects donors, beneficiaries, volunteers, and collection points so every
              donation finds a new home — and nothing useful ends up in the trash.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button
                onClick={() => navigate("/marketplace")}
                className="rounded-full bg-[#27bb5c] px-6 py-3 font-bold text-white hover:bg-[#149b47]"
              >
                Explore Marketplace <ArrowRight size={16} />
              </Button>
              <Button
                onClick={() => navigate("/create-donation")}
                variant="outline"
                className="rounded-full border-[#b5dfbf] bg-transparent px-6 py-3 font-bold text-[#087532]"
              >
                Give an item
              </Button>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[32px] bg-[#c7edf0] p-5 shadow-[0_20px_50px_rgba(22,108,74,.16)]">
            <div className="flex h-[310px] items-center justify-center rounded-[24px] bg-[radial-gradient(circle_at_50%_30%,#f5fff2,#93d7c4_70%)]">
              <div className="text-center">
                <Leaf className="mx-auto h-20 w-20 text-[#0d9d57]" />
                <p className="mt-3 text-sm font-extrabold uppercase tracking-[.2em] text-[#086b42]">
                  Good things grow
                </p>
              </div>
            </div>
            <div className="absolute bottom-9 left-9 rounded-xl bg-white/90 px-4 py-3 shadow-lg">
              <p className="text-xs font-bold text-[#087532]">Impact made visible</p>
              <p className="text-[11px] text-[#617066]">Every item counts.</p>
            </div>
          </div>
        </section>

        {/* IMPACT STATS */}
        <section className="py-12">
          <div className="mb-7 text-center">
            <p className="text-xs font-extrabold uppercase tracking-[.18em] text-[#18a34a]">
              Impact dashboard
            </p>
            <h2 className="mt-2 text-3xl font-extrabold">Small actions. Real change.</h2>
            <p className="mt-2 text-[#617066]">Track the good your community is doing together.</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {impactStats.map(([Icon, label, value]) => (
              <div
                key={label}
                className="rounded-[22px] bg-white p-5 shadow-[0_10px_24px_rgba(43,91,58,.08)]"
              >
                <div className="mb-5 grid h-9 w-9 place-items-center rounded-full bg-[#d9f2df] text-[#07933d]">
                  <Icon size={17} />
                </div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#6c7c71]">
                  {label}
                </p>
                <p className="mt-1 text-xl font-extrabold text-[#087532]">{value}</p>
                <div className="mt-4 h-1.5 rounded-full bg-[#e8f2e9]">
                  <div className="h-full w-3/4 rounded-full bg-[#36c567]" />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ROLES */}
        <section className="py-12">
          <div className="mb-8">
            <p className="text-xs font-extrabold uppercase tracking-[.18em] text-[#18a34a]">
              Built for everyone
            </p>
            <h2 className="mt-2 text-3xl font-extrabold">Find your role in the circle</h2>
            <p className="mt-2 max-w-2xl text-[#617066]">
              Whether you want to give, receive, or help move things around — EcoSystem has a place
              for you.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {roles.map(([Icon, title, text]) => (
              <div
                key={title}
                className="rounded-[24px] bg-white p-6 shadow-[0_10px_24px_rgba(43,91,58,.08)]"
              >
                <div className="mb-5 grid h-11 w-11 place-items-center rounded-full bg-[#d9f2df] text-[#087532]">
                  <Icon size={18} />
                </div>
                <h3 className="text-lg font-extrabold">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-[#617066]">{text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* COLLECTION POINTS */}
        <section className="py-12">
          <div className="grid items-center gap-8 rounded-[28px] bg-[#e4f4e7] p-8 sm:p-12 lg:grid-cols-[1fr_0.9fr]">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[.18em] text-[#18a34a]">
                Collection points
              </p>
              <h2 className="mt-2 text-3xl font-extrabold">
                Turn your space into a collection point
              </h2>
              <p className="mt-3 max-w-lg leading-6 text-[#617066]">
                Have a shop, a house, or any accessible space? Post it as a collection point so
                donors and beneficiaries can coordinate drop-offs and pickups safely.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button
                  onClick={() => navigate("/collection-points")}
                  className="rounded-full bg-[#27bb5c] px-6 py-3 font-bold text-white hover:bg-[#149b47]"
                >
                  Find collection points <MapPin size={16} />
                </Button>
                <Button
                  onClick={() => navigate("/collection-points/new")}
                  variant="outline"
                  className="rounded-full border-[#b5dfbf] bg-transparent px-6 py-3 font-bold text-[#087532]"
                >
                  Post my space <Store size={16} />
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[Home, Store, MapPin, PackageCheck].map((Icon, i) => (
                <div
                  key={i}
                  className="flex h-28 items-center justify-center rounded-2xl bg-white text-[#087532] shadow-sm"
                >
                  <Icon size={28} />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="py-12">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[.18em] text-[#18a34a]">
                How it works
              </p>
              <h2 className="mt-2 text-3xl font-extrabold">Circular in 3 steps</h2>
            </div>
            <Button
              onClick={() => navigate("/dashboard")}
              variant="ghost"
              className="font-bold text-[#087532]"
            >
              View impact <ArrowRight size={16} />
            </Button>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {steps.map(([Icon, title, text], index) => (
              <div key={title} className="rounded-[24px] bg-[#e4f4e7] p-7">
                <div className="mb-12 grid h-11 w-11 place-items-center rounded-full bg-white text-[#087532]">
                  <Icon size={18} />
                </div>
                <p className="mb-2 text-sm font-extrabold text-[#087532]">0{index + 1}</p>
                <h3 className="text-xl font-extrabold">{title}</h3>
                <p className="mt-2 leading-6 text-[#617066]">{text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA FINAL */}
        <section className="flex flex-col items-start justify-between gap-8 rounded-[28px] bg-[#26c45b] p-8 text-[#063d1d] sm:p-12 lg:flex-row lg:items-center">
          <div>
            <h2 className="max-w-lg text-3xl font-extrabold">Ready to make an actual impact?</h2>
            <p className="mt-3 max-w-md leading-6 text-[#15592c]">
              Your unused items can become someone else's next opportunity — or your space can
              become the bridge that makes it happen.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={() => navigate("/create-donation")}
              className="rounded-full bg-white px-6 font-bold text-[#087532] hover:bg-[#effff1]"
            >
              Start donating <ArrowRight size={16} />
            </Button>
            <Button
              onClick={() => navigate("/register")}
              variant="outline"
              className="rounded-full border-[#063d1d]/30 bg-transparent px-6 font-bold text-[#063d1d] hover:bg-[#063d1d]/10"
            >
              Create account
            </Button>
          </div>
        </section>
      </PageContainer>
    </AppShell>
  );
}