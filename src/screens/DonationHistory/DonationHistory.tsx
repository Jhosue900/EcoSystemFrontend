import {
  CalendarDays,
  Download,
  Leaf,
  Package,
  Search,
  Shirt,
  Soup,
  Tag,
  Tags,
  ToyBrick,
} from "lucide-react";
import {
  AppShell,
  PageContainer,
  SectionHeading,
  StatCard,
} from "../../components/AppShell";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getStoredToken, isValidJwt } from "../../lib/auth";

const API_BASE = (import.meta.env.VITE_API_URL ?? "").replace(/\/+$/, "");

type Donation = {
  id: string;
  images: string[] | null;
  category: string;
  title: string;
  location: string;
  availability: string;
  time_limit: string;
  created_at: string;
};

type Status = "loading" | "error" | "ready";

const categoryIcons: Record<string, React.ElementType> = {
  Food: Soup,
  Clothing: Shirt,
  Household: Tag,
  "Kids & Toys": ToyBrick,
};

const formatDate = (iso: string): string =>
  new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });

// Escapa comillas y neutraliza celdas que Excel interpretaría como fórmula
const csvCell = (value: string | number): string => {
  let text = String(value ?? "");
  if (/^[=+\-@]/.test(text)) text = `'${text}`;
  return `"${text.replace(/"/g, '""')}"`;
};

const exportCsv = (rows: Donation[]): void => {
  const header = [
    "Date",
    "Title",
    "Category",
    "Location",
    "Availability",
    "Time limit",
    "Photos",
  ];
  const lines = rows.map((d) =>
    [
      formatDate(d.created_at),
      d.title,
      d.category,
      d.location,
      d.availability,
      d.time_limit,
      d.images?.length ?? 0,
    ]
      .map(csvCell)
      .join(","),
  );
  // BOM para que Excel respete los acentos
  const csv = "\uFEFF" + [header.map(csvCell).join(","), ...lines].join("\r\n");

  const url = URL.createObjectURL(
    new Blob([csv], { type: "text/csv;charset=utf-8;" }),
  );
  const link = document.createElement("a");
  link.href = url;
  link.download = "donation-history.csv";
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};

export function DonationHistory(): JSX.Element {
  const navigate = useNavigate();

  const [donations, setDonations] = useState<Donation[]>([]);
  const [status, setStatus] = useState<Status>("loading");
  const [errorMessage, setErrorMessage] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");

  useEffect(() => {
    const token = getStoredToken();
    if (!token || !isValidJwt(token)) {
      navigate("/register");
      return;
    }

    const controller = new AbortController();
    setStatus("loading");

    (async () => {
      try {
        const response = await fetch(`${API_BASE}/api/myDonations`, {
          headers: { Authorization: `Bearer ${token}` },
          signal: controller.signal,
        });
        const data = await response.json().catch(() => null);

        if (response.status === 401) {
          navigate("/login"); // sesión vencida
          return;
        }
        if (!response.ok) {
          throw new Error(data?.error ?? "Could not load your donations.");
        }

        setDonations(data?.donations ?? []);
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

  const stats = useMemo(() => {
    const now = new Date();
    const thisMonth = donations.filter((d) => {
      const date = new Date(d.created_at);
      return (
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear()
      );
    }).length;
    return {
      total: donations.length,
      thisMonth,
      categories: new Set(donations.map((d) => d.category)).size,
    };
  }, [donations]);

  const categoryOptions = useMemo(
    () => ["All", ...Array.from(new Set(donations.map((d) => d.category)))],
    [donations],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return donations.filter(
      (d) =>
        (category === "All" || d.category === category) &&
        (!q ||
          [d.title, d.location, d.category].some((value) =>
            (value ?? "").toLowerCase().includes(q),
          )),
    );
  }, [donations, query, category]);

  return (
    <AppShell>
      <PageContainer>
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
          <SectionHeading
            eyebrow="Your journey"
            title="History"
            description="A comprehensive overview of your contributions to a greener, more sustainable world."
          />
          <Button
            variant="outline"
            disabled={filtered.length === 0}
            onClick={() => exportCsv(filtered)}
            className="rounded-full border-[#b5dfbf] font-bold text-[#087532] disabled:opacity-50"
          >
            <Download size={15} /> Export Report
          </Button>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard
            icon={Package}
            label="Total donations"
            value={String(stats.total)}
          />
          <StatCard
            icon={CalendarDays}
            label="This month"
            value={String(stats.thisMonth)}
            color="teal"
          />
          <StatCard
            icon={Tags}
            label="Categories"
            value={String(stats.categories)}
            color="red"
          />
        </div>

        <div className="mt-6 rounded-[24px] bg-white p-4 shadow-[0_12px_30px_rgba(43,91,58,.08)]">
          <div className="flex items-center gap-3 rounded-xl bg-[#f2faf3] px-4">
            <Search size={16} className="text-[#718077]" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by title, location or category..."
              aria-label="Search donations"
              className="border-0 bg-transparent shadow-none focus-visible:ring-0"
            />
            <span className="hidden whitespace-nowrap rounded-full bg-[#087532] px-4 py-2 text-xs font-bold text-white sm:block">
              {filtered.length} {filtered.length === 1 ? "result" : "results"}
            </span>
          </div>

          {categoryOptions.length > 2 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {categoryOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setCategory(option)}
                  className={`rounded-full px-3 py-1 text-xs font-bold transition-colors ${
                    category === option
                      ? "bg-[#087532] text-white"
                      : "bg-[#eef5ee] text-[#526158] hover:bg-[#dcefe0]"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          )}

          {status === "loading" && (
            <div className="mt-4 divide-y divide-[#edf3ee]" aria-busy="true">
              {[0, 1, 2].map((item) => (
                <div key={item} className="flex items-center gap-3 py-5">
                  <div className="h-11 w-11 animate-pulse rounded-xl bg-[#e2eee4]" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 w-1/3 animate-pulse rounded bg-[#e2eee4]" />
                    <div className="h-3 w-1/2 animate-pulse rounded bg-[#eef5ee]" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {status === "error" && (
            <div className="mt-4 rounded-xl bg-[#fdeceb] p-4 text-sm">
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

          {status === "ready" && donations.length === 0 && (
            <div className="px-4 py-12 text-center">
              <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-[#d9f2df] text-[#087532]">
                <Leaf size={24} />
              </div>
              <p className="mt-4 font-bold">No donations yet</p>
              <p className="mt-1 text-sm text-[#718077]">
                When you publish a donation, it will show up here.
              </p>
              <Button
                type="button"
                onClick={() => navigate("/create-donation")}
                className="mt-5 rounded-full bg-[#27bb5c] px-6 font-bold text-white hover:bg-[#149b47]"
              >
                Create a donation
              </Button>
            </div>
          )}

          {status === "ready" && donations.length > 0 && filtered.length === 0 && (
            <p className="px-4 py-10 text-center text-sm text-[#718077]">
              No donations match your search.
            </p>
          )}

          {status === "ready" && filtered.length > 0 && (
            <div className="mt-4 divide-y divide-[#edf3ee]">
              {filtered.map((donation) => {
                const Icon = categoryIcons[donation.category] ?? Leaf;
                const cover = donation.images?.[0];
                return (
                  <div
                    key={donation.id}
                    className="flex flex-col gap-3 py-5 sm:flex-row sm:items-center"
                  >
                    {cover ? (
                      <img
                        src={cover}
                        alt=""
                        loading="lazy"
                        className="h-11 w-11 rounded-xl object-cover"
                      />
                    ) : (
                      <div className="grid h-11 w-11 place-items-center rounded-xl bg-[#d9f2df] text-[#087532]">
                        <Icon size={18} />
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-bold">{donation.title}</p>
                        <span className="rounded-full bg-[#e2f3e4] px-2 py-0.5 text-[10px] font-bold text-[#087532]">
                          {donation.category}
                        </span>
                      </div>
                      <p className="text-xs text-[#718077]">
                        {donation.location} · {formatDate(donation.created_at)}
                      </p>
                    </div>
                    <div className="text-left sm:text-right">
                      <p className="font-extrabold">{donation.availability}</p>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-[#159449]">
                        {donation.time_limit}
                      </p>
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
}