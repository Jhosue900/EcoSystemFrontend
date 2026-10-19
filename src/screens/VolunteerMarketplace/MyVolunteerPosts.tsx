import { Clock3, MapPin, Trash2, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppShell, PageContainer, SectionHeading } from "../../components/AppShell";
import { Button } from "../../components/ui/button";
import { getStoredToken, isValidJwt } from "../../lib/auth";

const API_BASE = (import.meta.env.VITE_API_URL ?? "").replace(/\/+$/, "");

type MyPost = {
  id: string;
  title: string;
  description: string;
  location: string;
  date_needed: string;
  task_type: string;
  is_active: boolean;
  created_at: string;
};

export const MyVolunteerPosts = (): JSX.Element => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<MyPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);

  const fetchPosts = () => {
    const token = getStoredToken();
    if (!token || !isValidJwt(token)) {
      navigate("/login");
      return;
    }
    setLoading(true);
    fetch(`${API_BASE}/api/myVolunteerPosts`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setPosts(data.volunteer_posts || []))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchPosts(); }, [navigate]);

  const handleToggle = async (post: MyPost) => {
    const token = getStoredToken();
    if (!token) return;
    setBusyId(post.id);
    try {
      const res = await fetch(`${API_BASE}/api/volunteerPosts/${post.id}/toggle`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setPosts(prev => prev.map(p => p.id === post.id ? { ...p, is_active: !p.is_active } : p));
      }
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (post: MyPost) => {
    if (!window.confirm(`Delete "${post.title}"? This can't be undone.`)) return;
    const token = getStoredToken();
    if (!token) return;
    setBusyId(post.id);
    try {
      const res = await fetch(`${API_BASE}/api/volunteerPosts/${post.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setPosts(prev => prev.filter(p => p.id !== post.id));
      }
    } finally {
      setBusyId(null);
    }
  };

  return (
    <AppShell>
      <PageContainer>
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
          <SectionHeading
            eyebrow="Your requests"
            title="My Volunteer Requests"
            description="Pause a request when you no longer need help, or remove it permanently."
          />
          <Button
            onClick={() => navigate("/volunteer-posts/new")}
            className="rounded-full bg-[#27bb5c] px-5 font-bold text-white hover:bg-[#149b47]"
          >
            <Users size={15} /> Create Request
          </Button>
        </div>

        <div className="rounded-[24px] bg-white p-4 shadow-[0_12px_30px_rgba(43,91,58,.08)] mt-6">
          {loading ? (
            <div className="p-10 text-center text-[#718077]">Loading...</div>
          ) : posts.length === 0 ? (
            <div className="p-10 text-center">
              <p className="font-bold">You haven't requested any volunteers yet</p>
              <Button onClick={() => navigate("/volunteer-posts/new")} className="mt-4 rounded-full bg-[#27bb5c] font-bold text-white">
                Create your first request
              </Button>
            </div>
          ) : (
            <div className="divide-y divide-[#edf3ee]">
              {posts.map((post) => (
                <div key={post.id} className="flex flex-col gap-4 py-5 lg:flex-row lg:items-center">
                  <div className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${post.is_active ? "bg-[#d9f2df] text-[#087532]" : "bg-[#eef1ee] text-[#94a198]"}`}>
                    <Users size={18} />
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-bold">{post.title}</p>
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${post.is_active ? "bg-[#e2f3e4] text-[#087532]" : "bg-[#eef1ee] text-[#718077]"}`}>
                        {post.is_active ? "Active" : "Paused"}
                      </span>
                    </div>
                    <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-[#718077]">
                      <span className="flex items-center gap-1"><MapPin size={12} /> {post.location}</span>
                      <span className="flex items-center gap-1"><Clock3 size={12} /> {post.date_needed}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" disabled={busyId === post.id} onClick={() => handleToggle(post)} className="rounded-full border-[#b5dfbf] font-bold text-[#087532]">
                      {post.is_active ? "Pause" : "Activate"}
                    </Button>
                    <Button variant="outline" disabled={busyId === post.id} onClick={() => handleDelete(post)} className="rounded-full border-[#e6b3ad] text-[#bd5548]">
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