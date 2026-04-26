"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { apiGet, apiPatch, apiDelete, apiPost } from "@/lib/api";
import { Users, Package, CheckCircle2, Trash2, RefreshCw, ToggleLeft, ToggleRight, LogOut, Shield, TrendingUp, Zap, Bell, Send, X, ArrowLeft, Star, Trophy, MapPin, Clock, MoreHorizontal } from "lucide-react";

type Tab = "overview" | "items" | "users" | "announce";

const rarityColor: Record<string, string> = {
  LEGENDARY: "text-yellow-600 bg-yellow-50 border-yellow-200",
  RARE: "text-blue-600 bg-blue-50 border-blue-200",
  UNCOMMON: "text-green-600 bg-green-50 border-green-200",
  COMMON: "text-gray-500 bg-gray-50 border-gray-200",
};
const statusBadge: Record<string, string> = {
  open: "bg-blue-100 text-blue-700", matched: "bg-yellow-100 text-yellow-700",
  claimed: "bg-orange-100 text-orange-700",
  returned: "bg-green-100 text-green-700", closed: "bg-gray-100 text-gray-600",
};

export default function AdminPortal() {
  const { user, token, logout, isAdmin } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("overview");
  const [stats, setStats] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [toast, setToast] = useState("");
  const [announce, setAnnounce] = useState({ title: "", body: "", pinned: false });
  const [awardModal, setAwardModal] = useState<{ userId: string; name: string } | null>(null);
  const [awardXp, setAwardXp] = useState({ xp: "50", reason: "" });

  useEffect(() => {
    if (!user) { router.push("/admin/login"); return; }
    if (!isAdmin) { router.push("/"); return; }
    fetchAll();
  }, [user, isAdmin]);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(""), 3500); };

  const fetchAll = async () => {
    setLoading(true);
    try {
      console.log("Admin: Fetching data...");
      const [s, i, u] = await Promise.all([
        apiGet("/admin/stats"), 
        apiGet("/admin/items"), 
        apiGet("/admin/users"),
      ]);
      
      if (s && !s.message) setStats(s);
      if (Array.isArray(i)) setItems(i);
      if (Array.isArray(u)) setUsers(u);
      
      console.log("Admin: Data loaded successfully.");
    } catch (err) { 
      console.error("Admin: Fetch exception", err); 
      showToast("Critical: Database connection failed.");
    } finally {
      setLoading(false);
    }
  };

  const refresh = async () => { setRefreshing(true); await fetchAll(); setRefreshing(false); };

  const updateStatus = async (id: string, status: string) => {
    await apiPatch(`/admin/items/${id}/status`, { status });
    setItems(prev => prev.map(i => i._id === id ? { ...i, status } : i));
    showToast(`Status updated to "${status}"`);
  };

  const deleteItem = async (id: string) => {
    if (!confirm("Delete this item permanently?")) return;
    await apiDelete(`/admin/items/${id}`);
    setItems(prev => prev.filter(i => i._id !== id));
    showToast("Item deleted.");
  };

  const toggleUser = async (id: string) => {
    const res = await apiPatch(`/admin/users/${id}/toggle`);
    if (res.ok) setUsers(prev => prev.map(u => u._id === id ? { ...u, isActive: res.data.user.isActive } : u));
    showToast(res.data.message);
  };

  const sendAnnouncement = async () => {
    if (!announce.title || !announce.body) { showToast("Title and body required."); return; }
    const res = await apiPost("/admin/announce", announce);
    if (res.ok) { showToast("📢 Announcement sent to all students!"); setAnnounce({ title: "", body: "", pinned: false }); fetchAll(); }
  };

  const awardXpToUser = async () => {
    if (!awardModal) return;
    const res = await apiPatch(`/admin/users/${awardModal.userId}/award-xp`, { xp: Number(awardXp.xp), reason: awardXp.reason });
    if (res.ok) { showToast(`+${awardXp.xp} XP awarded to ${awardModal.name}!`); fetchAll(); }
    setAwardModal(null); setAwardXp({ xp: "50", reason: "" });
  };

  const handleLogout = () => { logout(); router.push("/admin/login"); };

  if (loading) return (
    <div className="flex min-h-screen items-center justify-center bg-gray-950">
      <div className="text-center">
        <motion.img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/150.png" alt="Mewtwo"
          animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 3, ease: "linear" }} className="w-24 h-24 mx-auto mb-4" />
        <p className="text-white font-black font-outfit text-xl">Loading Admin Portal...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-950 text-white flex">
      {/* Toast */}
      {toast && (
        <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-white text-gray-900 px-5 py-3 rounded-2xl shadow-2xl border-4 border-secondary font-bold text-sm">
          <Zap size={16} fill="currentColor" className="text-secondary" /> {toast}
        </motion.div>
      )}

      {/* XP Award Modal */}
      {awardModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            className="bg-gray-900 border border-white/20 rounded-3xl p-8 w-full max-w-sm">
            <div className="flex justify-between mb-5">
              <h3 className="font-black text-lg font-outfit">Award XP to {awardModal.name}</h3>
              <button onClick={() => setAwardModal(null)}><X size={18} className="text-white/50" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-black uppercase text-white/40">XP Amount</label>
                <input type="number" value={awardXp.xp} onChange={e => setAwardXp(a => ({ ...a, xp: e.target.value }))}
                  className="mt-1 w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none" />
              </div>
              <div>
                <label className="text-xs font-black uppercase text-white/40">Reason</label>
                <input type="text" value={awardXp.reason} onChange={e => setAwardXp(a => ({ ...a, reason: e.target.value }))}
                  placeholder="e.g. Helping at campus event..."
                  className="mt-1 w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none" />
              </div>
              <button onClick={awardXpToUser}
                className="w-full py-3 font-black bg-yellow-400 text-gray-900 rounded-2xl hover:-translate-y-0.5 transition-all">
                ⚡ Award {awardXp.xp} XP
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-60 bg-gray-900 border-r border-white/10 flex flex-col z-40">
        <div className="p-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/150.png" alt="Mewtwo" className="w-9 h-9" />
            <div>
              <p className="font-black text-white font-outfit leading-none">FINDLY</p>
              <p className="text-[10px] text-white/40 font-bold uppercase">Admin Portal</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {([
            { id: "overview", icon: TrendingUp, label: "Overview" },
            { id: "items", icon: Package, label: "Manage Items" },
            { id: "users", icon: Users, label: "Manage Students" },
            { id: "announce", icon: Bell, label: "Announcements" },
          ] as { id: Tab; icon: any; label: string }[]).map(({ id, icon: Icon, label }) => (
            <button key={id} onClick={() => setTab(id)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl font-bold text-sm transition-all ${tab === id ? "bg-white/10 text-white" : "text-white/50 hover:bg-white/5 hover:text-white"}`}>
              <Icon size={17} />{label}
            </button>
          ))}
          <div className="pt-3 border-t border-white/10 mt-3">
            <a href="http://localhost:3000" target="_blank" rel="noreferrer"
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl font-bold text-sm text-white/40 hover:bg-white/5 hover:text-white transition-all">
              🏠 View Student Portal
            </a>
          </div>
        </nav>

        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-2 px-2 mb-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 to-orange-500 flex items-center justify-center">
              <Shield size={14} className="text-white" />
            </div>
            <div>
              <p className="text-xs font-black">{user?.name}</p>
              <p className="text-[10px] text-white/40">Administrator</p>
            </div>
          </div>
          <button onClick={handleLogout}
            className="w-full flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 text-sm font-bold transition-all">
            <LogOut size={14} /> Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="ml-60 p-8 flex-1 min-h-screen">
        {/* Topbar */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black font-outfit">
              {tab === "overview" && "Overview"}
              {tab === "items" && "Manage Items"}
              {tab === "users" && "Manage Students"}
              {tab === "announce" && "Announcements"}
            </h1>
            <p className="text-white/40 text-sm font-semibold">NIET FINDLY Administration</p>
          </div>
          <button onClick={refresh} className={`flex items-center gap-2 px-4 py-2 bg-white/10 rounded-xl border border-white/20 text-sm font-bold hover:bg-white/20 transition-all ${refreshing ? "animate-spin" : ""}`}>
            <RefreshCw size={15} />
          </button>
        </div>

        {/* ── OVERVIEW ── */}
        {tab === "overview" && stats && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
              {[
                { label: "Students", value: stats.totalUsers, color: "from-blue-600 to-blue-800", icon: <Users size={24} /> },
                { label: "All Items", value: stats.totalItems, color: "from-purple-600 to-purple-800", icon: <Package size={24} /> },
                { label: "Open", value: stats.openItems, color: "from-orange-500 to-orange-700", icon: <ArrowLeft size={24} className="rotate-180" /> },
                { label: "Returned", value: stats.returnedItems, color: "from-green-500 to-green-700", icon: <CheckCircle2 size={24} /> },
                { label: "Lost", value: stats.lostItems, color: "from-red-500 to-red-700", icon: <Bell size={24} /> },
                { label: "Found", value: stats.foundItems, color: "from-teal-500 to-teal-700", icon: <Star size={24} /> },
              ].map((s, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                  className={`bg-gradient-to-br ${s.color} rounded-2xl p-5`}>
                  <div className="text-3xl mb-1">{s.icon}</div>
                  <div className="text-3xl font-black">{s.value}</div>
                  <div className="text-[10px] font-bold text-white/70 uppercase tracking-wider">{s.label}</div>
                </motion.div>
              ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <div className="bg-gray-900 rounded-2xl border border-white/10 p-6">
                <h3 className="font-black text-lg mb-4 font-outfit">🕐 Recent Reports</h3>
                <div className="space-y-2">
                  {stats.recentItems?.length === 0 && <p className="text-white/30 text-sm">No items yet.</p>}
                  {stats.recentItems?.map((item: any) => (
                    <div key={item._id} className="flex items-center gap-3 p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors">
                      <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full border ${rarityColor[item.rarity] || ""}`}>{item.rarity}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold truncate">{item.title}</p>
                        <p className="text-[10px] text-white/30">{item.location} · {item.type.toUpperCase()}</p>
                      </div>
                      <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase ${statusBadge[item.status] || ""}`}>{item.status}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gray-900 rounded-2xl border border-white/10 p-6">
                <h3 className="font-black text-lg mb-4 font-outfit">🏆 Top Users</h3>
                <div className="space-y-2">
                  {stats.topTrainers?.length === 0 && <p className="text-white/30 text-sm">No students yet.</p>}
                  {stats.topTrainers?.map((t: any, i: number) => (
                    <div key={t._id} className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
                      <span className="text-xl font-black text-white/20">#{i + 1}</span>
                      <div className="flex-1">
                        <p className="text-sm font-bold">{t.name}</p>
                        <p className="text-[10px] text-white/30">{t.branch || "—"} · {t.itemsReturned} returned</p>
                      </div>
                      <div className="flex items-center gap-1 bg-yellow-500/20 px-2 py-1 rounded-full">
                        <Zap size={10} className="text-yellow-400" fill="currentColor" />
                        <span className="text-xs font-black text-yellow-400">{t.xp} XP</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ── ITEMS ── */}
        {tab === "items" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="bg-gray-900 rounded-2xl border border-white/10 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr className="border-b border-white/10 text-white/40 text-xs font-black uppercase">
                    <th className="px-4 py-3 text-left">Item</th>
                    <th className="px-4 py-3 text-left">Type</th>
                    <th className="px-4 py-3 text-left">Location</th>
                    <th className="px-4 py-3 text-left">Reporter</th>
                    <th className="px-4 py-3 text-left">Status</th>
                    <th className="px-4 py-3 text-left">Rarity</th>
                    <th className="px-4 py-3 text-left">Actions</th>
                  </tr></thead>
                  <tbody className="divide-y divide-white/5">
                    {items.length === 0 && <tr><td colSpan={7} className="px-4 py-8 text-center text-white/30">No items.</td></tr>}
                    {items.map(item => (
                      <tr key={item._id} className="hover:bg-white/5 transition-colors">
                        <td className="px-4 py-3 font-bold max-w-[160px] truncate">{item.title}</td>
                        <td className="px-4 py-3">
                          <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${item.type === "lost" ? "bg-red-500/20 text-red-400" : "bg-green-500/20 text-green-400"}`}>{item.type}</span>
                        </td>
                        <td className="px-4 py-3 text-white/50 text-xs max-w-[120px] truncate">{item.location}</td>
                        <td className="px-4 py-3 text-white/50 text-xs">{item.reportedBy?.name || "—"}</td>
                        <td className="px-4 py-3">
                          <select value={item.status} onChange={e => updateStatus(item._id, e.target.value)}
                            className="text-[10px] font-black uppercase px-2 py-1 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none cursor-pointer">
                            {["open", "claimed", "matched", "returned", "closed"].map(s => <option key={s} value={s} className="bg-gray-900 text-white">{s.toUpperCase()}</option>)}
                          </select>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full border ${rarityColor[item.rarity] || ""}`}>{item.rarity}</span>
                        </td>
                        <td className="px-4 py-3">
                          <button onClick={() => deleteItem(item._id)} className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all">
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {/* ── USERS ── */}
        {tab === "users" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="bg-gray-900 rounded-2xl border border-white/10 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr className="border-b border-white/10 text-white/40 text-xs font-black uppercase">
                    <th className="px-4 py-3 text-left">Student</th>
                    <th className="px-4 py-3 text-left">Enrollment</th>
                    <th className="px-4 py-3 text-left">Branch / Year</th>
                    <th className="px-4 py-3 text-left">XP / Level</th>
                    <th className="px-4 py-3 text-left">Achievements</th>
                    <th className="px-4 py-3 text-left">Status</th>
                    <th className="px-4 py-3 text-left">Actions</th>
                  </tr></thead>
                  <tbody className="divide-y divide-white/5">
                    {users.length === 0 && <tr><td colSpan={7} className="px-4 py-8 text-center text-white/30">No students registered yet.</td></tr>}
                    {users.map(u => (
                      <tr key={u._id} className="hover:bg-white/5 transition-colors">
                        <td className="px-4 py-3"><p className="font-bold">{u.name}</p><p className="text-[10px] text-white/30">{u.email}</p></td>
                        <td className="px-4 py-3 font-mono text-xs text-white/50">{u.enrollmentNo || "—"}</td>
                        <td className="px-4 py-3 text-xs text-white/50">{u.branch || "—"} / {u.year || "—"}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1">
                            <Zap size={11} className="text-yellow-400" fill="currentColor" />
                            <span className="text-xs font-black text-yellow-400">{u.xp} XP</span>
                            <span className="text-[10px] text-white/30 ml-1">Lvl {u.level}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap gap-1">{u.achievements?.slice(0, 3).map((a: string) => <Trophy key={a} size={14} className="text-yellow-400" />)}</div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${u.isActive ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
                            {u.isActive ? "Active" : "Suspended"}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <button onClick={() => toggleUser(u._id)} title={u.isActive ? "Suspend" : "Activate"}
                              className={`p-1.5 rounded-lg transition-all ${u.isActive ? "bg-red-500/10 text-red-400 hover:bg-red-500/20" : "bg-green-500/10 text-green-400 hover:bg-green-500/20"}`}>
                              {u.isActive ? <ToggleRight size={15} /> : <ToggleLeft size={15} />}
                            </button>
                            <button onClick={() => setAwardModal({ userId: u._id, name: u.name })} title="Award XP"
                              className="p-1.5 rounded-lg bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20 transition-all">
                              <Zap size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {/* ── ANNOUNCE ── */}
        {tab === "announce" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 max-w-2xl">
            <div className="bg-gray-900 rounded-2xl border border-white/10 p-6">
              <h3 className="font-black text-lg mb-5 font-outfit flex items-center gap-2"><Bell size={18} /> Send Announcement to All Students</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-black uppercase text-white/40">Title</label>
                  <input type="text" value={announce.title} onChange={e => setAnnounce(a => ({ ...a, title: e.target.value }))}
                    placeholder="e.g. Mid-sem Special: Double XP Weekend!"
                    className="mt-1 w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-white/50" />
                </div>
                <div>
                  <label className="text-xs font-black uppercase text-white/40">Message</label>
                  <textarea rows={4} value={announce.body} onChange={e => setAnnounce(a => ({ ...a, body: e.target.value }))}
                    placeholder="Your message to all NIET students..."
                    className="mt-1 w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-white/50 resize-none" />
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={announce.pinned} onChange={e => setAnnounce(a => ({ ...a, pinned: e.target.checked }))}
                    className="w-4 h-4 rounded accent-yellow-400" />
                  <span className="text-sm font-bold text-white/70">Pin to homepage</span>
                </label>
                <button onClick={sendAnnouncement}
                  className="flex items-center gap-2 px-6 py-3 font-black bg-white text-gray-900 rounded-xl hover:-translate-y-0.5 transition-all">
                  <Send size={16} /> Send to All Students
                </button>
              </div>
            </div>

            {/* Previous announcements */}
            <div className="bg-gray-900 rounded-2xl border border-white/10 p-6">
              <h3 className="font-black mb-4 font-outfit">Previous Announcements</h3>
              <div className="space-y-3">
                {stats?.announcements?.map((a: any) => (
                  <div key={a._id} className="p-4 bg-white/5 rounded-xl">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-bold text-sm">{a.title}</p>
                      {a.pinned && <span className="text-[9px] font-black uppercase bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded-full">Pinned</span>}
                    </div>
                    <p className="text-xs text-white/50 font-semibold">{a.body}</p>
                    <p className="text-[10px] text-white/30 mt-2">From {a.from} · {new Date(a.createdAt).toLocaleDateString("en-IN")}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}
