import { Clock3, HandHeart, Home, MapPin, Phone, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AppShell,
  PageContainer,
  SectionHeading,
} from "../../components/AppShell";
import { Button } from "../../components/ui/button";
import { getStoredToken, isValidJwt } from "../../lib/auth";

const API_BASE = (import.meta.env.VITE_API_URL ?? "").replace(/\/+$/, "");

type MyPoint = {
  id: string;
  name: string;
  address: string;
  city: string;
  schedule: string;
  phone: string;
  description: string;
  accepted_categories: string[];
  is_active: boolean;
  created_at: string;
};

type Status = "loading" | "error" | "ready";

export const MyCollectionPoints = (): JSX.Element => {
  const navigate = useNavigate();

  const [points, setPoints] = useState<MyPoint[]>([]);
  const [status, setStatus] = useState<Status>("loading");
  const [errorMessage, setErrorMessage] = useState("");
  const [actionError, setActionError] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

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
        const response = await fetch(`${API_BASE}/api/myCollectionPoints`, {
          headers: { Authorization: `Bearer ${token}` },
          signal: controller.signal,
        });
        const data = await response.json().catch(() => null);

        if (response.status === 401) {
          navigate("/login");
          return;
        }
        if (!response.ok) {
          throw new Error(data?.error ?? "Could not load your spaces.");
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

  const runAction = async (
    id: string,
    request: (token: string) => Promise<Response>,
    onSuccess: () => void,
  ) => {
    const token = getStoredToken();
    if (!token || !isValidJwt(token)) {
      navigate("/login");
      return;
    }

    setBusyId(id);
    setActionError("");
    try {
      const response = await request(token);
      const data = await response.json().catch(() => null);

      if (response.status === 401) {
        navigate("/login");
        return;
      }
      if (!response.ok) {
        throw new Error(data?.error ?? "Something went wrong. Try again.");
      }
      onSuccess();
    } catch (err) {
      setActionError(
        err instanceof Error ? err.message : "Could not reach the server.",
      );
    } finally {
      setBusyId(null);
    }
  };

  const handleToggle = (point: MyPoint) =>
    runAction(
      point.id,
      (token) =>
        fetch(`${API_BASE}/api/collectionPoints/${point.id}/toggle`, {
          method: "PATCH",
          headers: { Authorization: `Bearer ${token}` },
        }),
      () =>
        setPoints((prev) =>
          prev.map((p) =>
            p.id === point.id ? { ...p, is_active: !p.is_active } : p,
          ),
        ),
    );

  const handleDelete = (point: MyPoint) => {
    if (!window.confirm(`Delete "${point.name}"? This can't be undone.`)) return;
    runAction(
      point.id,
      (token) =>
        fetch(`${API_BASE}/api/collectionPoints/${point.id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }),
      () => setPoints((prev) => prev.filter((p) => p.id !== point.id)),
    );
  };

  return (
    <AppShell>
      <PageContainer>
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
          <SectionHeading
            eyebrow="Your spaces"
            title="My collection points"
            description="Pause a space when you can't receive donations, or remove it for good."
          />
          <Button
            type="button"
            onClick={() => navigate("/collection-points/new")}
            className="rounded-full bg-[#27bb5c] px-5 font-bold text-white hover:bg-[#149b47]"
          >
            <HandHeart size={15} /> Offer another space
          </Button>
        </div>

        {actionError && (
          <p
            role="alert"
            className="mb-4 rounded-xl bg-[#fdeceb] px-4 py-3 text-sm font-semibold text-[#bd5548]"
          >
            {actionError}
          </p>
        )}

        <div className="rounded-[24px] bg-white p-4 shadow-[0_12px_30px_rgba(43,91,58,.08)]">
          {status === "loading" && (
            <div className="divide-y divide-[#edf3ee]" aria-busy="true">
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
            <div className="rounded-xl bg-[#fdeceb] p-4 text-sm">
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
            <div className="px-4 py-12 text-center">
              <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-[#d9f2df] text-[#087532]">
                <Home size={24} />
              </div>
              <p className="mt-4 font-bold">You haven't offered a space yet</p>
              <p className="mt-1 text-sm text-[#718077]">
                Publish your home or place so neighbors can drop off donations.
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

          {status === "ready" && points.length > 0 && (
            <div className="divide-y divide-[#edf3ee]">
              {points.map((point) => (
                <div
                  key={point.id}
                  className="flex flex-col gap-4 py-5 lg:flex-row lg:items-center"
                >
                  <div
                    className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${
                      point.is_active
                        ? "bg-[#d9f2df] text-[#087532]"
                        : "bg-[#eef1ee] text-[#94a198]"
                    }`}
                  >
                    <Home size={18} />
                  </div>

                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-bold">{point.name}</p>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                          point.is_active
                            ? "bg-[#e2f3e4] text-[#087532]"
                            : "bg-[#eef1ee] text-[#718077]"
                        }`}
                      >
                        {point.is_active ? "Active" : "Paused"}
                      </span>
                    </div>
                    <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-[#718077]">
                      <span className="flex items-center gap-1">
                        <MapPin size={12} /> {point.address}, {point.city}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock3 size={12} /> {point.schedule}
                      </span>
                      <span className="flex items-center gap-1">
                        <Phone size={12} /> {point.phone}
                      </span>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {point.accepted_categories.map((item) => (
                        <span
                          key={item}
                          className="rounded-full bg-[#eef5ee] px-2 py-0.5 text-[10px] font-bold text-[#526158]"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      disabled={busyId === point.id}
                      onClick={() => handleToggle(point)}
                      className="rounded-full border-[#b5dfbf] font-bold text-[#087532] disabled:opacity-50"
                    >
                      {point.is_active ? "Pause" : "Activate"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      disabled={busyId === point.id}
                      onClick={() => handleDelete(point)}
                      aria-label={`Delete ${point.name}`}
                      className="rounded-full border-[#e6b3ad] text-[#bd5548] disabled:opacity-50"
                    >
                      <Trash2 size={15} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </PageContainer>
    </AppShell>
  );
};
