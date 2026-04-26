"use client";

import { useState, useEffect, Suspense } from "react";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal, Grid, List as ListIcon, MapPin, Clock, Zap, Filter, ShieldCheck } from "lucide-react";
import Navbar from "@/components/Navbar";
import { cn } from "@/lib/utils";
import { apiGet, apiPatch, apiPost } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

const POKEMON_BUDDIES = [
  "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/133.png",
  "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/39.png",
  "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/52.png",
  "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/54.png",
  "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/175.png",
  "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/132.png",
];

const XP_REWARDS: Record<string, number> = { LEGENDARY: 200, RARE: 150, UNCOMMON: 100, COMMON: 50 };
const RARITY_COLORS: Record<string, string> = {
  LEGENDARY: "bg-yellow-400 text-yellow-900",
  RARE: "bg-blue-400 text-blue-900",
  UNCOMMON: "bg-green-400 text-green-900",
  COMMON: "bg-gray-300 text-gray-700",
};

function SearchContent() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const [view, setView] = useState<"grid" | "list">("grid");
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [typeFilter, setTypeFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [returning, setReturning] = useState<string | null>(null);
  const [toast, setToast] = useState<{ msg: string; xp?: number } | null>(null);
  const [contactItem, setContactItem] = useState<any>(null);

  const fetchItems = async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (typeFilter) params.set("type", typeFilter);
    if (categoryFilter) params.set("category", categoryFilter);
    if (locationFilter) params.set("location", locationFilter);
    const data = await apiGet(`/items?${params.toString()}`);
    setItems(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  useEffect(() => { fetchItems(); }, [typeFilter, categoryFilter, locationFilter]);

  const handleReturn = async (itemId: string) => {
    if (!user) { window.location.href = "/login"; return; }
    setReturning(itemId);
    const res = await apiPatch(`/items/${itemId}/return`);
    if (res.ok) {
      setToast({ msg: res.data.message, xp: res.data.item?.xpReward });
      fetchItems();
      setTimeout(() => setToast(null), 4000);
    }
    setReturning(null);
  };

  const handleClaim = async (itemId: string) => {
    if (!user) { window.location.href = "/login"; return; }
    setReturning(itemId);
    const res = await apiPost(`/items/${itemId}/claim`, {});
    if (res.ok) {
      setToast({ msg: res.data.message });
      fetchItems();
      setTimeout(() => setToast(null), 4000);
    } else {
      alert(res.data?.message || "Claim failed.");
    }
    setReturning(null);
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-gradient-to-br from-yellow-50 via-blue-50 to-pink-50">
      <Navbar />

      {/* Toast */}
      {toast && (
        <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-white border-4 border-secondary rounded-3xl px-6 py-3 shadow-2xl">
          <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png" alt="Pikachu" className="w-10 h-10" />
          <div>
            <p className="font-black text-foreground text-sm font-outfit">{toast.msg}</p>
            {toast.xp && <p className="text-xs font-bold text-secondary-foreground">+{toast.xp} XP earned! ⚡</p>}
          </div>
        </motion.div>
      )}

      {/* Fixed BG Pokémon */}
      <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/143.png" alt="" className="fixed w-40 h-40 bottom-10 right-4 opacity-10 pointer-events-none animate-pulse hidden lg:block" />
      <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/129.png" alt="" className="fixed w-24 h-24 top-1/3 left-2 opacity-10 pointer-events-none hidden lg:block" />

      <div className="container px-4 pt-28 pb-20 mx-auto">
        {/* Header */}
        <header className="relative mb-10 text-center">
          <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/143.png" alt="Snorlax"
            className="absolute w-32 h-32 -top-20 right-4 lg:right-24 drop-shadow-2xl hover:scale-110 transition-transform cursor-pointer z-10" />
          <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/132.png" alt="Ditto"
            className="absolute w-20 h-20 -top-14 left-4 lg:left-24 drop-shadow-xl hover:rotate-12 transition-transform cursor-pointer" />
            <span className="text-xs font-black uppercase tracking-widest font-outfit">Lost Item Database</span>
          <h1 className="text-5xl font-black font-outfit text-foreground md:text-6xl">A Wild Item <span className="text-primary italic">Appeared!</span></h1>
          <p className="mt-3 text-base font-semibold text-foreground/60 max-w-lg mx-auto">
            Browse lost & found items across NIET campus. Return them to earn XP rewards!
          </p>
        </header>

        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Sidebar Filters */}
          <aside className="w-full lg:w-64 space-y-5 shrink-0">
            <div className="p-6 bg-white rounded-3xl border-4 border-muted poke-scroll relative overflow-hidden">
              <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/54.png" alt="" className="absolute w-20 h-20 -bottom-4 -right-4 opacity-20" />
              <div className="flex items-center gap-2 mb-5">
                <SlidersHorizontal size={16} className="text-primary" />
                <h3 className="text-sm font-black uppercase tracking-widest font-outfit">Filters</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block mb-1 text-[10px] font-black uppercase tracking-wider text-muted-foreground">Type</label>
                  <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}
                    className="w-full px-3 py-2 bg-muted/30 border-2 border-muted rounded-xl text-xs font-bold focus:outline-none focus:border-primary">
                    <option value="">All Types</option>
                    <option value="lost">Lost</option>
                    <option value="found">Found</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-1 text-[10px] font-black uppercase tracking-wider text-muted-foreground">Category</label>
                  <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}
                    className="w-full px-3 py-2 bg-muted/30 border-2 border-muted rounded-xl text-xs font-bold focus:outline-none focus:border-primary">
                    <option value="">All Categories</option>
                    {["Electronics", "ID/Wallets", "Books", "Bags", "Keys", "Clothing", "Other"].map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block mb-1 text-[10px] font-black uppercase tracking-wider text-muted-foreground">Location</label>
                  <select value={locationFilter} onChange={e => setLocationFilter(e.target.value)}
                    className="w-full px-3 py-2 bg-muted/30 border-2 border-muted rounded-xl text-xs font-bold focus:outline-none focus:border-primary">
                    <option value="">All Locations</option>
                    {["Main Gate", "Library", "Cafeteria", "Block-A", "Block-B", "Block-C", "Hostel", "Sports Ground"].map(l => <option key={l}>{l}</option>)}
                  </select>
                </div>
                <button onClick={fetchItems}
                  className="w-full py-3 font-black text-xs uppercase rounded-xl bg-foreground text-background hover:scale-[1.02] transition-all border-b-4 border-black/20 shadow-md active:scale-[0.98] active:border-b-0">
                  Apply Filters
                </button>
              </div>
            </div>

            {/* Pikachu tip */}
            <div className="p-5 border-4 border-secondary/40 bg-secondary/10 rounded-3xl relative overflow-hidden">
              <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png" alt="" className="absolute w-16 h-16 -top-3 -right-3" />
              <p className="text-[10px] font-black uppercase text-secondary-foreground mb-1.5 font-outfit">⚡ Pikachu's Tips</p>
              <p className="text-[11px] text-foreground/70 font-semibold leading-relaxed">
                Returning a <strong>LEGENDARY</strong> item = <strong className="text-primary">+200 XP</strong>! Check cafeteria & labs!
              </p>
            </div>

            {/* Report button */}
            {!user && (
              <Link href="/login">
                <div className="p-4 bg-primary text-white rounded-3xl text-center cursor-pointer hover:-translate-y-0.5 transition-all">
                  <p className="font-black font-outfit">Login to Report</p>
                  <p className="text-[10px] text-white/70 font-semibold">& earn XP!</p>
                </div>
              </Link>
            )}
          </aside>

          {/* Results */}
          <main className="flex-1">
            {/* Search bar */}
            <div className="flex gap-3 mb-6">
              <div className="relative flex-1">
                <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && fetchItems()}
                  placeholder="Search ID card, earbuds, backpack..."
                  className="w-full px-5 py-4 pl-12 bg-white border-4 border-muted rounded-2xl focus:outline-none focus:border-primary font-medium transition-all" />
                <Search className="absolute left-4 top-4 w-5 h-5 text-muted-foreground" />
              </div>
              <button onClick={fetchItems} className="px-8 py-4 bg-foreground text-background rounded-2xl font-black font-outfit hover:-translate-y-1 hover:shadow-xl transition-all border-b-4 border-foreground/30 active:translate-y-0 active:border-b-0 shadow-lg">
                Search
              </button>
              <div className="flex items-center gap-1 p-1 border-2 rounded-2xl bg-white border-muted">
                <button onClick={() => setView("grid")} className={`p-2 rounded-xl ${view === "grid" ? "bg-primary text-white" : "text-muted-foreground"}`}><Grid size={16} /></button>
                <button onClick={() => setView("list")} className={`p-2 rounded-xl ${view === "list" ? "bg-primary text-white" : "text-muted-foreground"}`}><ListIcon size={16} /></button>
              </div>
            </div>

            {loading ? (
              <div className="flex flex-col items-center py-20 gap-4">
                <motion.img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/54.png" alt="Psyduck"
                  animate={{ rotate: [-10, 10, -10] }} transition={{ repeat: Infinity, duration: 1 }} className="w-20 h-20" />
                <p className="font-black text-muted-foreground font-outfit">Scanning database...</p>
              </div>
            ) : items.length === 0 ? (
              <div className="flex flex-col items-center py-20 gap-4 text-center">
                <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/129.png" alt="Magikarp" className="w-24 h-24 opacity-60" />
                <p className="font-black text-xl text-foreground font-outfit">No Items Found!</p>
                <p className="text-sm font-semibold text-muted-foreground">Try a different search term or clear the filters.</p>
              </div>
            ) : (
              <div className={cn("grid gap-5", view === "grid" ? "grid-cols-1 sm:grid-cols-2 xl:grid-cols-2" : "grid-cols-1")}>
                {items.map((item, idx) => (
                  <motion.div key={item._id} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.07 }}
                    className={cn("group bg-white rounded-3xl border-4 border-muted hover:border-primary transition-all hover:-translate-y-1 hover:shadow-[0_8px_0_0_hsl(var(--primary)/0.2)] relative overflow-hidden", view === "list" ? "flex" : "")}>

                    {/* Pokemon buddy */}
                    <img src={POKEMON_BUDDIES[idx % POKEMON_BUDDIES.length]} alt=""
                      className="absolute w-14 h-14 -top-2 -right-2 z-10 drop-shadow-lg group-hover:scale-125 group-hover:-translate-y-2 transition-all duration-300" />

                    {/* Image Section */}
                    <div className={cn("relative overflow-hidden bg-muted", view === "grid" ? "aspect-[4/3]" : "w-40 h-36 shrink-0")}>
                      {item.image ? (
                        <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted to-muted/50">
                          <Zap size={32} className="text-muted-foreground/20" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                      <div className={`absolute bottom-2 left-2 px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${RARITY_COLORS[item.rarity] || ""}`}>{item.rarity}</div>
                      <div className={`absolute top-2 right-2 px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${item.type === "lost" ? "bg-red-500 text-white" : "bg-green-500 text-white"}`}>{item.type === "lost" ? "🔴 LOST" : "🟢 FOUND"}</div>
                    </div>

                    {/* Content */}
                    <div className={cn("p-5 flex flex-col gap-2", view === "list" ? "flex-1" : "")}>
                      <span className="text-[9px] font-black uppercase tracking-widest text-primary">{item.category}</span>
                      <h3 className="text-base font-black font-outfit group-hover:text-primary transition-colors">{item.title}</h3>
                      <p className="text-xs text-foreground/60 font-semibold line-clamp-2">{item.description}</p>

                      <div className="flex flex-col gap-1 mt-1">
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-semibold"><MapPin size={11} /> {item.location}</div>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-semibold"><Clock size={11} /> {new Date(item.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</div>
                      </div>

                      {/* XP strip */}
                      <div className="flex items-center justify-between mt-1 px-3 py-2 rounded-2xl bg-secondary/10 border-2 border-dashed border-secondary/40">
                        <span className="text-[9px] font-black text-secondary-foreground uppercase">Return Reward</span>
                        <span className="text-sm font-black text-primary">+{XP_REWARDS[item.rarity] || 50} XP ⚡</span>
                      </div>

                      <div className="flex flex-col gap-2 mt-1">
                        {item.reportedBy?._id === user?.id ? (
                          <button onClick={() => setContactItem(item)}
                            className="w-full py-3 text-[11px] font-black uppercase text-center bg-foreground text-background rounded-2xl hover:brightness-110 hover:scale-[1.02] transition-all active:scale-95 shadow-md">
                            📋 View My Handover
                          </button>
                        ) : (
                          <button onClick={() => {
                              if (item.status === "open") {
                                if (item.type === "found") handleClaim(item._id);
                                else handleReturn(item._id);
                              }
                              setContactItem(item);
                            }} 
                            disabled={returning === item._id}
                            className="w-full py-3 text-[11px] font-black uppercase bg-foreground text-background rounded-2xl hover:brightness-110 hover:scale-[1.02] transition-all active:scale-95 disabled:opacity-60 shadow-md">
                            {returning === item._id ? "⚡ Syncing..." : "📞 Contact Now"}
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Handover Modal */}
      {contactItem && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-md bg-white rounded-[3rem] border-8 border-primary p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary via-secondary to-accent" />
            
            <button onClick={() => setContactItem(null)} className="absolute top-6 right-6 p-2 rounded-full bg-muted/50 hover:bg-muted transition-colors">
               <Zap size={16} className="rotate-45" />
            </button>

            <div className="text-center mb-8">
              <div className="inline-flex p-4 rounded-full bg-primary/10 mb-4 animate-bounce">
                <ShieldCheck className="w-10 h-10 text-primary" />
              </div>
              <h2 className="text-3xl font-black font-outfit">Safe Handover</h2>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-1">Verification Required</p>
            </div>

            <div className="space-y-6">
              <div className="space-y-3">
                <p className="text-[10px] font-black uppercase text-muted-foreground text-center">Contact Information</p>
                <a href={`tel:${contactItem.contactInfo}`} className="flex items-center justify-between p-4 bg-white border-4 border-muted rounded-2xl hover:border-primary transition-colors group">
                   <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-green-100 text-green-600"><Zap size={16} /></div>
                      <div>
                        <p className="text-xs font-black uppercase text-foreground/50">Call Personnel</p>
                        <p className="font-black text-foreground">{contactItem.contactInfo}</p>
                      </div>
                   </div>
                   <Zap size={18} className="text-muted group-hover:text-primary transition-colors shrink-0" />
                </a>

                <a href={`https://wa.me/${contactItem.contactInfo.replace(/\s+/g, '')}?text=${encodeURIComponent(`Hi, I'm contacting you from FINDLY regarding the ${contactItem.title} item!`)}`} 
                  target="_blank" rel="noreferrer"
                  className="flex items-center justify-between p-4 bg-[#25D366]/10 border-4 border-[#25D366]/20 rounded-2xl hover:bg-[#25D366]/20 transition-all group">
                   <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-[#25D366] text-white">
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                      </div>
                      <div>
                        <p className="text-xs font-black uppercase text-[#25D366]/70">WhatsApp Message</p>
                        <p className="font-black text-foreground">Chat Instantly</p>
                      </div>
                   </div>
                   <Zap size={18} className="text-[#25D366] group-hover:scale-125 transition-transform shrink-0" />
                </a>

                <div className="p-4 bg-secondary/10 border-4 border-secondary/20 rounded-2xl flex items-start gap-3">
                  <div className="mt-1"><Zap size={12} className="text-secondary-foreground" /></div>
                  <p className="text-[10px] font-bold text-secondary-foreground leading-relaxed">
                    Meet at a busy campus location like the <span className="font-black">Central Library</span> or <span className="font-black">Main Cafeteria</span> for maximum safety.
                  </p>
                </div>
              </div>

              <button onClick={() => setContactItem(null)} 
                className="w-full py-4 bg-foreground text-background rounded-3xl font-black font-outfit hover:-translate-y-1 transition-all shadow-xl">
                I Understand, Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center font-outfit text-xl font-black">Loading...</div>}>
      <SearchContent />
    </Suspense>
  );
}
