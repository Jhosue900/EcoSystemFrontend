import { Clock3, HandHeart, Home, MapPin, Phone, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AppShell,
  PageContainer,
  SectionHeading,
} from "../../components/AppShell";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { getStoredToken, isValidJwt } from "../../lib/auth";

const API_BASE = (import.meta.env.VITE_API_URL ?? "").replace(/\/+$/, "");

type CollectionPoint = {
  id: string;
  name: string;
  address: string;
  city: string;
  schedule: string;
  phone: string;
  description: string;
  accepted_categories: string[];
  created_at: string;
};

type Status = "loading" | "error" | "ready";

const categories = ["All", "Food", "Clothing", "Household", "Kids & Toys"];

export const CollectionPoints = (): JSX.Element => {
  const navigate = useNavigate();

  const [points, setPoints] = useState<CollectionPoint[]>([]);
  const [status, setStatus] = useState<Status>("loading");
  const [errorMessage, setErrorMessage] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");

  useEffect(() => {
    const token = getStoredToken();
    if (!token || !isValidJwt(token)) {
      navigate("/login");
      return;
    }

    const controller = new AbortController();
    setStatus("loading");

    (async () => {
      try {
        const response = await fetch(`${API_BASE}/api/collectionPoints`, {
          headers: { Authorization: `Bearer ${token}` },
          signal: controller.signal,
        });
        const data = await response.json().catch(() => null);

        if (response.status === 401) {
          navigate("/login");
          return;
        }
        if (!response.ok) {
          throw new Error(data?.error ?? "Could not load collection points.");
        }

        setPoints(data?.collection_points ?? []);
        setStatus("ready");
      } catch (err) {
        if (controller.signal.aborted) return;
        setErrorMessage(
          err instanceof Error
            ? err.message
            : "Could not reach the server. Try again.",
        );
        setStatus("error");
      }
    })();

    return () => controller.abort();
  }, [navigate, reloadKey]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return points.filter(
      (p) =>
        (category === "All" || p.accepted_categories.includes(category)) &&
        (!q ||
          [p.name, p.city, p.address].some((value) =>
            (value ?? "").toLowerCase().includes(q),
          )),
    );
  }, [points, query, category]);

  return (
    <AppShell>
      <PageContainer>
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
          <SectionHeading
            eyebrow="Community network"
            title="Collection points"
            description="Homes and spaces run by neighbors who receive donations on behalf of the community. Find one near you or open your own door."
          />
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/my-collection-points")}
              className="rounded-full border-[#b5dfbf] font-bold text-[#087532]"
            >
              My spaces
            </Button>
            <Button
              type="button"
              onClick={() => navigate("/collection-points/new")}
              className="rounded-full bg-[#27bb5c] px-5 font-bold text-white hover:bg-[#149b47]"
            >
              <HandHeart size={15} /> Offer my space
            </Button>
          </div>
        </div>

        <div className="mx-auto flex max-w-3xl items-center rounded-2xl bg-white px-4 py-2 shadow-[inset_0_2px_8px_rgba(54,102,69,.08),0_8px_20px_rgba(54,102,69,.06)]">
          <Search size={18} className="text-[#8ca096]" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, city or address..."
            aria-label="Search collection points"
            className="h-11 border-0 bg-transparent shadow-none focus-visible:ring-0"
          />
        </div>

        <div className="mt-6 flex flex-wrap justify-center gap-3">
          {categories.map((item) => (
            <Button
              key={item}
              type="button"
              onClick={() => setCategory(item)}
              className={`rounded-full px-5 py-2 font-semibold ${
                category === item
                  ? "bg-[#34c759] text-[#064c20] hover:bg-[#34c759]"
                  : "bg-white text-[#526158] hover:bg-[#e4f4e7]"
              }`}
            >
              {item}
            </Button>
          ))}
        </div>

        {status === "loading" && (
          <div
            className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3"
            aria-busy="true"
          >
            {[0, 1, 2].map((item) => (
              <div
                key={item}
                className="h-56 animate-pulse rounded-[26px] bg-[#e2eee4]"
              />
            ))}
          </div>
        )}

        {status === "error" && (
          <div className="mx-auto mt-10 max-w-xl rounded-xl bg-[#fdeceb] p-4 text-sm">
            <p role="alert" className="font-semibold text-[#bd5548]">
              {errorMessage}
            </p>
            <Button
              type="button"
              variant="outline"
              onClick={() => setReloadKey((key) => key + 1)}
              className="mt-3 rounded-full border-[#e6b3ad] font-bold text-[#bd5548]"
            >
              Try again
            </Button>
          </div>
        )}

        {status === "ready" && points.length === 0 && (
          <div className="px-4 py-16 text-center">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-[#d9f2df] text-[#087532]">
              <Home size={24} />
            </div>
            <p className="mt-4 font-bold">No collection points yet</p>
            <p className="mt-1 text-sm text-[#718077]">
              Be the first in your neighborhood to offer a space.
            </p>
            <Button
              type="button"
              onClick={() => navigate("/collection-points/new")}
              className="mt-5 rounded-full bg-[#27bb5c] px-6 font-bold text-white hover:bg-[#149b47]"
            >
              Offer my space
            </Button>
          </div>
        )}

        {status === "ready" && points.length > 0 && visible.length === 0 && (
          <p className="py-16 text-center text-[#718077]">
            No collection points match your search.
          </p>
        )}

        {status === "ready" && visible.length > 0 && (
          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {visible.map((point) => (
              <article
                key={point.id}
                className="flex flex-col rounded-[26px] bg-white p-6 shadow-[0_12px_30px_rgba(43,91,58,.1)] transition-transform hover:-translate-y-1"
              >
                <div className="flex items-start gap-3">
                  <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#d9f2df] text-[#087532]">
                    <Home size={18} />
                  </div>
                  <div>
                    <h2 className="text-lg font-extrabold leading-tight">
                      {point.name}
                    </h2>
                    <p className="text-xs text-[#718077]">{point.city}</p>
                  </div>
                </div>

                {point.description && (
                  <p className="mt-4 text-sm leading-6 text-[#617066]">
                    {point.description}
                  </p>
                )}

                <div className="mt-4 space-y-2 text-sm text-[#526158]">
                  <span className="flex items-center gap-2">
                    <MapPin size={15} className="text-[#18a34a]" />
                    {point.address}
                  </span>
                  <span className="flex items-center gap-2">
                    <Clock3 size={15} className="text-[#18a34a]" />
                    {point.schedule}
                  </span>
                  <span className="flex items-center gap-2">
                    <Phone size={15} className="text-[#18a34a]" />
                    {point.phone}
                  </span>
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  {point.accepted_categories.map((item) => (
                    <span
                      key={item}
                      className="rounded-full bg-[#e2f3e4] px-2.5 py-0.5 text-[10px] font-bold text-[#087532]"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        )}
      </PageContainer>
    </AppShell>
  );
};
