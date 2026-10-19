import { CircleUserRound, Leaf, LogOut, Menu, UserRound, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { clearStoredToken, getStoredToken, isValidJwt, decodeJwt } from "../lib/auth";

export const AppShell = ({ children }: { children: React.ReactNode }): JSX.Element => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [userType, setUserType] = useState<string>("donor");
  const [userName, setUserName] = useState<string>("");
  const profileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const token = getStoredToken();
    const valid = isValidJwt(token);
    setIsAuthenticated(valid);
    
    if (valid && token) {
      const payload = decodeJwt(token);
      if (payload) {
        setUserType((payload.user_type as string) || "donor");
        setUserName((payload.name as string) || "");
      }
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleProfileButtonClick = () => {
    if (isAuthenticated) {
      setIsProfileMenuOpen((prev) => !prev);
    } else {
      navigate("/login");
    }
  };

  const handleLogout = () => {
    clearStoredToken();
    setIsAuthenticated(false);
    setIsProfileMenuOpen(false);
    setIsMobileMenuOpen(false);
    navigate("/login");
  };

  const getLinks = () => {
    if (!isAuthenticated) return [];
    const commonLinks = [{ label: "Collection Points", to: "/collection-points" }];
    
    if (userType === "beneficiary") {
      return [
        { label: "Marketplace", to: "/marketplace" }, 
        { label: "Volunteer Hub", to: "/volunteer-marketplace" },
        { label: "My History", to: "/beneficiary-history" },
        ...commonLinks
      ];
    }
    
    if (userType === "volunteer") {
      return [
        { label: "Volunteer Hub", to: "/volunteer-marketplace" }, 
        ...commonLinks
      ];
    }
    
    // Donor
    return [
      { label: "My Donations", to: "/my-donations" },
      { label: "Volunteer Hub", to: "/volunteer-marketplace" }, 
      ...commonLinks
    ]; 
  };

  const links = getLinks();

  return (
    <div className="min-h-screen bg-[#eef6f0] text-[#142018]">
      <header className="sticky top-0 z-40 border-b border-[#d8e8dc] bg-[#f6fff3]/95 shadow-[0_8px_24px_rgba(31,78,44,0.08)] backdrop-blur">
        <div className="mx-auto flex max-w-[1240px] items-center justify-between gap-4 px-4 py-4 lg:px-8">
          
          <NavLink to="/" className="flex shrink-0 items-center gap-2 text-xl font-extrabold tracking-tight text-[#087532]">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-[#ccefd4] text-[#087532]">
              <Leaf size={17} />
            </span>
            EcoSystem
          </NavLink>

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-6 md:flex">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `text-sm font-semibold transition-colors ${
                    isActive ? "text-[#087532]" : "text-[#526158] hover:text-[#087532]"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            {(!isAuthenticated || userType === "donor") && (
              <button
                type="button"
                onClick={() => navigate(isAuthenticated ? "/create-donation" : "/login")}
                className="hidden sm:inline-flex h-9 items-center justify-center gap-2 whitespace-nowrap rounded-full bg-[#27bb5c] px-5 py-2 text-sm font-bold text-white shadow-[0_5px_12px_rgba(39,187,92,.25)] transition-colors hover:bg-[#149b47]"
              >
                Donate Now
              </button>
            )}

            <div className="relative" ref={profileMenuRef}>
              <button
                aria-label="Profile"
                type="button"
                onClick={handleProfileButtonClick}
                className="rounded-full p-2 text-[#526158] transition-colors hover:bg-[#e5f3e7]"
              >
                <CircleUserRound size={20} />
              </button>

              {isAuthenticated && isProfileMenuOpen && (
                <div
                  role="menu"
                  className="absolute right-0 top-11 w-52 rounded-2xl border border-[#d8e8dc] bg-white p-2 shadow-[0_16px_36px_rgba(31,78,44,0.14)]"
                >
                  {userName && (
                    <p className="truncate px-3 pb-2 pt-1 text-xs font-semibold text-[#94a198]">
                      {userName}
                    </p>
                  )}
                  <button
                    role="menuitem"
                    type="button"
                    onClick={() => { setIsProfileMenuOpen(false); navigate("/profile"); }}
                    className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm font-semibold text-[#142018] transition-colors hover:bg-[#e5f3e7]"
                  >
                    <UserRound size={16} /> View Profile
                  </button>
                  <button
                    role="menuitem"
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm font-semibold text-[#bd5548] transition-colors hover:bg-[#f9dfda]"
                  >
                    <LogOut size={16} /> Log Out
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="rounded-full p-2 text-[#526158] hover:bg-[#e5f3e7] md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Nav Dropdown */}
        {isMobileMenuOpen && (
          <div className="border-t border-[#d8e8dc] bg-white px-4 py-3 shadow-lg md:hidden flex flex-col gap-1">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `rounded-xl px-3 py-3 text-base font-semibold transition-colors ${
                    isActive ? "bg-[#e8f8e9] text-[#087532]" : "text-[#526158] hover:bg-[#f4fbf3]"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
            {(!isAuthenticated || userType === "donor") && (
              <button
                onClick={() => { setIsMobileMenuOpen(false); navigate(isAuthenticated ? "/create-donation" : "/login"); }}
                className="mt-2 flex w-full items-center justify-center rounded-xl bg-[#27bb5c] py-3 text-sm font-bold text-white"
              >
                Donate Now
              </button>
            )}
          </div>
        )}
      </header>

      {children}

      <footer className="mt-14 rounded-t-[38px] bg-white px-6 py-10 lg:px-12">
        <div className="mx-auto flex max-w-[1240px] flex-col justify-between gap-6 text-sm text-[#657169] sm:flex-row sm:items-center">
          <div>
            <p className="font-extrabold text-[#087532]">EcoSystem</p>
            <p className="mt-1">© 2026 EcoSystem. For a sustainable future.</p>
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <Link to="/terms" className="hover:text-[#087532] transition-colors">
              Terms of Service
            </Link>
            <Link to="/privacy" className="hover:text-[#087532] transition-colors">
              Privacy Policy
            </Link>
            </div>
        </div>
      </footer>
    </div>
  );
};

export const PageContainer = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}): JSX.Element => (
  <main className={`mx-auto w-full max-w-[1240px] px-4 py-8 lg:px-8 lg:py-14 ${className}`}>
    {children}
  </main>
);

export const SectionHeading = ({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}): JSX.Element => (
  <div className="mb-8">
    {eyebrow && (
      <p className="mb-2 text-xs font-extrabold uppercase tracking-[0.18em] text-[#18a34a]">
        {eyebrow}
      </p>
    )}
    <h1 className="text-2xl font-extrabold tracking-tight text-[#142018] sm:text-4xl">{title}</h1>
    {description && (
      <p className="mt-2 max-w-2xl text-sm leading-6 text-[#617066] sm:text-base">{description}</p>
    )}
  </div>
);

export const StatCard = ({
  icon: Icon,
  label,
  value,
  color = "green",
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  color?: "green" | "teal" | "red";
}): JSX.Element => (
  <div className="rounded-[22px] bg-white p-5 text-center shadow-[0_12px_30px_rgba(43,91,58,.1)]">
    <div
      className={`mx-auto mb-3 grid h-9 w-9 place-items-center rounded-full ${
        color === "red"
          ? "bg-[#f9dfda] text-[#bd5548]"
          : color === "teal"
          ? "bg-[#d8f0ee] text-[#198f86]"
          : "bg-[#d9f2df] text-[#13934a]"
      }`}
    >
      <Icon size={17} />
    </div>
    <p className="text-2xl font-extrabold text-[#087532]">{value}</p>
    <p className="mt-1 text-xs text-[#6c7c71]">{label}</p>
  </div>
);