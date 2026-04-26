"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { apiGet } from "@/lib/api";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { MapPin, Clock, Zap, Trophy, Star, Package, ArrowLeft, Megaphone, Footprints, Handshake, ClipboardList, Shield, CheckCircle2 } from "lucide-react";

const ACHIEVEMENTS_DEF: Record<string, { name: string; icon: React.ReactNode; desc: string }> = {
  joined:        { name: "Welcome FINDLY!", icon: <Megaphone size={20} />, desc: "Joined FINDLY" },
  first_report:  { name: "First Steps",      icon: <Footprints size={20} />, desc: "Submitted first report" },
  first_return:  { name: "Good Samaritan",   icon: <Handshake size={20} />, desc: "Returned first item" },
  five_reports:  { name: "Active User",      icon: <ClipboardList size={20} />, desc: "Submitted 5 reports" },
  ten_returns:   { name: "Campus Hero",      icon: <Shield size={20} />, desc: "Returned 10 items" },
  legendary_find:{ name: "Legendary Finder", icon: <Star size={20} />, desc: "Returned a LEGENDARY item" },
  speed_return:  { name: "Speed Runner",     icon: <Zap size={20} />, desc: "Returned item within 1 hour" },
};

const LEVEL_POKEMON = [
  "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/129.png",  // Lvl 1 - Magikarp
  "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png",    // Bulbasaur
  "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/4.png",    // Charmander
  "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/7.png",    // Squirtle
  "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png",   // Pikachu
  "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/133.png",  // Eevee
  "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/52.png",   // Meowth
  "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/149.png",  // Dragonite
  "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/150.png",  // Mewtwo
  "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/151.png",  // Mew (Lvl 99)
];

const RARITY_COLORS: Record<string, string> = {
  LEGENDARY: "bg-yellow-100 text-yellow-800 border-yellow-300",
  RARE: "bg-blue-100 text-blue-800 border-blue-300",
  UNCOMMON: "bg-green-100 text-green-800 border-green-300",
  COMMON: "bg-gray-100 text-gray-600 border-gray-200",
};

export default function ProfilePage() {
  const { user } = useAuth();
  const router = useRouter();
  const [myItems, setMyItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { router.push("/login"); return; }
    apiGet("/items/my").then(data => { setMyItems(Array.isArray(data) ? data : []); setLoading(false); });
  }, [user]);



  if (!user) return null;

  const xpInLevel = user.xp % 100;
  const pokemonIdx = Math.min(Math.floor(user.level / 10), LEVEL_POKEMON.length - 1);
  const partnerPokemon = LEVEL_POKEMON[pokemonIdx];
  const levelTitle = user.level < 3 ? "Rookie Trainer" : user.level < 6 ? "Rising Trainer" : user.level < 10 ? "Expert Trainer" : "Elite Trainer";

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-blue-50 to-pink-50">
      <Navbar />

      <div className="container px-4 pt-28 pb-20 mx-auto max-w-4xl">
        <Link href="/" className="inline-flex items-center gap-2 mb-6 text-foreground/50 hover:text-primary transition-colors">
          <ArrowLeft size={16} /><span className="text-xs font-black uppercase tracking-widest font-outfit">Back</span>
        </Link>

        {/* Profile Header Card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="relative bg-white rounded-[2rem] border-4 border-muted p-8 mb-6 overflow-hidden shadow-[0_6px_0_0_hsl(var(--primary)/0.15)]">

          {/* Background pattern */}
          <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "radial-gradient(circle at 20px 20px, hsl(var(--primary)) 2px, transparent 0)", backgroundSize: "40px 40px" }} />

          {/* Partner Pokémon */}
          <motion.img src={partnerPokemon} alt="Partner"
            animate={{ y: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 3 }}
            className="absolute right-4 top-4 w-28 h-28 drop-shadow-xl opacity-80 md:w-36 md:h-36" />

          <div className="relative z-10 flex flex-col sm:flex-row items-start gap-6">


            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-3xl font-black font-outfit">{user.name}</h1>
                {user.role === "admin" && (
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 bg-purple-100 text-purple-700 border border-purple-300 rounded-full">Admin</span>
                )}
              </div>
              <p className="text-sm font-semibold text-muted-foreground">{user.email}</p>
              {user.enrollmentNo && <p className="text-xs font-mono text-muted-foreground">{user.enrollmentNo} · {user.branch} {user.year}</p>}

              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs font-black px-3 py-1 bg-secondary/20 rounded-full border-2 border-secondary/40 text-secondary-foreground">{levelTitle}</span>
                <span className="text-xs font-black px-3 py-1 bg-primary/10 rounded-full border-2 border-primary/20 text-primary">Level {user.level}</span>
              </div>

              {/* XP bar */}
              <div className="mt-4 max-w-xs">
                <div className="flex justify-between mb-1">
                  <span className="text-[10px] font-black uppercase text-muted-foreground">XP Progress</span>
                  <span className="text-[10px] font-black text-primary">{xpInLevel}/100 to Lvl {user.level + 1}</span>
                </div>
                <div className="h-3 rounded-full bg-muted overflow-hidden border-2 border-muted">
                  <motion.div className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
                    initial={{ width: 0 }} animate={{ width: `${xpInLevel}%` }} transition={{ duration: 1 }} />
                </div>
                <p className="text-[10px] font-bold text-muted-foreground mt-1">Total: {user.xp} XP</p>
              </div>
            </div>
          </div>

          {/* Stats row */}
          <div className="relative z-10 grid grid-cols-3 gap-4 mt-6 pt-5 border-t-2 border-muted">
            {[
              { label: "Items Reported", value: user.itemsReported ?? 0, icon: <ClipboardList className="w-5 h-5 mx-auto mb-1 text-primary" /> },
              { label: "Items Returned", value: user.itemsReturned ?? 0, icon: <CheckCircle2 className="w-5 h-5 mx-auto mb-1 text-primary" /> },
              { label: "Achievements", value: (user.achievements?.length ?? 0), icon: <Trophy className="w-5 h-5 mx-auto mb-1 text-primary" /> },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <div className="text-2xl mb-1">{s.icon}</div>
                <div className="text-2xl font-black font-outfit text-foreground">{s.value}</div>
                <div className="text-[10px] font-bold uppercase text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Achievements */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-white rounded-[2rem] border-4 border-muted p-6 mb-6">
          <h2 className="text-xl font-black font-outfit mb-5 flex items-center gap-2"><Trophy size={20} className="text-primary" /> Achievement Badges</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {Object.entries(ACHIEVEMENTS_DEF).map(([id, ach]) => {
              const earned = user.achievements?.includes(id);
              return (
                <motion.div key={id} whileHover={{ scale: 1.05 }}
                  className={`flex flex-col items-center p-4 rounded-2xl border-2 text-center transition-all ${earned ? "bg-secondary/10 border-secondary/40" : "bg-muted/20 border-muted opacity-40 grayscale"}`}>
                  <div className="text-primary mb-2">{ach.icon}</div>
                  <p className="text-xs font-black text-foreground leading-tight">{ach.name}</p>
                  <p className="text-[9px] text-muted-foreground font-semibold mt-0.5 leading-tight">{ach.desc}</p>
                  {earned && <span className="mt-2 text-[8px] font-black text-green-600 bg-green-50 px-2 py-0.5 rounded-full border border-green-200">EARNED ✓</span>}
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* My Items */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="bg-white rounded-[2rem] border-4 border-muted p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-black font-outfit flex items-center gap-2"><Package size={20} className="text-primary" /> My Reports</h2>
            <Link href="/report/lost">
              <button className="px-4 py-2 text-xs font-black bg-primary text-white rounded-xl hover:-translate-y-0.5 transition-all border-b-2 border-primary/50">+ New Report</button>
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center py-10">
              <motion.img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/54.png" alt=""
                animate={{ rotate: [-10, 10, -10] }} transition={{ repeat: Infinity, duration: 1 }} className="w-14 h-14" />
            </div>
          ) : myItems.length === 0 ? (
            <div className="text-center py-10">
              <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/129.png" alt="" className="w-16 h-16 mx-auto opacity-40 mb-3" />
              <p className="font-black text-muted-foreground">No reports yet!</p>
              <Link href="/report/lost"><button className="mt-3 px-5 py-2 text-sm font-black bg-primary text-white rounded-xl hover:-translate-y-0.5 transition-all">Submit First Report →</button></Link>
            </div>
          ) : (
            <div className="space-y-3">
              {myItems.map((item, i) => (
                <motion.div key={item._id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                  className="flex items-center gap-4 p-4 bg-muted/20 rounded-2xl border-2 border-muted hover:border-primary transition-colors group">
                  <img src={item.image || "/images/id_card.png"} alt="" className="w-14 h-14 rounded-xl object-cover shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-black font-outfit text-sm truncate">{item.title}</p>
                      <span className={`text-[8px] font-black uppercase px-1.5 py-0.5 rounded-full border ${RARITY_COLORS[item.rarity] || ""} shrink-0`}>{item.rarity}</span>
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="flex items-center gap-1 text-[10px] text-muted-foreground font-semibold"><MapPin size={9}/>{item.location}</span>
                      <span className="flex items-center gap-1 text-[10px] text-muted-foreground font-semibold"><Clock size={9}/>{new Date(item.createdAt).toLocaleDateString("en-IN")}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1.5">
                    <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${item.type === "lost" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>{item.type}</span>
                    <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${item.status === "returned" ? "bg-green-100 text-green-600" : item.status === "open" ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-500"}`}>{item.status}</span>
                    {item.status === "returned" && (
                      <div className="flex items-center gap-0.5">
                        <Zap size={9} className="text-yellow-500" fill="currentColor" />
                        <span className="text-[9px] font-black text-yellow-600">+{item.xpReward} XP</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
