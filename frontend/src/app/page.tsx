"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Search, MapPin, Gamepad2, Trophy, Zap, Bell, Star, Package, CheckCircle2, Users, Medal } from "lucide-react";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { useEffect, useState } from "react";
import { apiGet } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

const LEADERBOARD_ICONS = ["1", "2", "3", "4", "5"];

export default function Home() {
  const { user } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("Main Cafeteria");
  const [showLevelUp, setShowLevelUp] = useState(false);

  useEffect(() => {
    apiGet("/public/stats").then(setStats).catch(() => {});
  }, []);

  // Show level-up if XP just crossed a threshold
  useEffect(() => {
    if (user && user.xp % 100 < 15 && user.xp > 10) {
      setShowLevelUp(true);
      setTimeout(() => setShowLevelUp(false), 4000);
    }
  }, [user?.xp]);

  return (
    <div className="relative min-h-screen overflow-x-hidden"
      style={{ background: "linear-gradient(135deg, hsl(45,100%,94%) 0%, hsl(195,90%,94%) 50%, hsl(350,85%,95%) 100%)" }}>
      <Navbar />

      {/* Level-Up Celebration */}
      <AnimatePresence>
        {showLevelUp && (
          <motion.div initial={{ opacity: 0, scale: 0.5, y: 100 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.5, y: -100 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 bg-white border-4 border-secondary rounded-3xl px-8 py-4 shadow-2xl flex items-center gap-4">
            <motion.img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png" alt="Pikachu" animate={{ rotate: [0, 20, -20, 0] }} transition={{ repeat: 3, duration: 0.3 }} className="w-14 h-14" />
            <div>
              <p className="font-black text-xl font-outfit text-foreground">LEVEL UP! <Zap className="inline-block w-5 h-5 text-secondary-foreground" fill="currentColor" /></p>
              <p className="text-sm font-semibold text-muted-foreground">You reached Level {user?.level}!</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating BG Pokémon */}
      <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/16.png" alt="" className="fixed w-20 h-20 top-32 left-6 opacity-10 animate-bounce pointer-events-none hidden lg:block" />
      <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/35.png" alt="" className="fixed w-16 h-16 top-48 right-8 opacity-10 animate-pulse pointer-events-none hidden lg:block" />
      <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/175.png" alt="" className="fixed w-14 h-14 bottom-32 left-12 opacity-10 pointer-events-none hidden lg:block" />

      <section className="container relative z-10 flex flex-col items-center px-4 pt-28 pb-20 mx-auto text-center">





        {/* Badge */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 px-6 py-3 mb-6 border-4 border-primary rounded-full bg-white shadow-[0_4px_0_0_hsl(var(--primary))]">
          <Gamepad2 className="w-5 h-5 text-primary" />
          <span className="text-sm font-black tracking-widest uppercase text-primary font-outfit">NIET Campus Lost & Found</span>
        </motion.div>

        {/* Hero + Characters */}
        <div className="relative w-full max-w-4xl">
          <motion.img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png" alt="Pikachu"
            initial={{ opacity: 0, x: -80 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
            className="absolute w-32 h-32 -left-8 top-0 drop-shadow-xl hover:scale-110 hover:-rotate-12 transition-transform cursor-pointer hidden md:block" />
          <motion.img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/133.png" alt="Eevee"
            initial={{ opacity: 0, x: 80 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}
            className="absolute w-28 h-28 -right-6 top-0 drop-shadow-xl hover:scale-110 hover:rotate-12 transition-transform cursor-pointer hidden md:block" />
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="text-5xl font-black leading-tight md:text-7xl text-foreground font-outfit px-8">
            Report & Find <span className="text-primary italic">Lost Items</span>
          </motion.h1>
        </div>

        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="max-w-2xl mt-6 text-lg text-foreground/70 font-semibold md:text-xl">
          The official gamified Lost & Found for NIET. Return lost belongings — <span className="text-primary font-black">earn XP, level up & top the campus leaderboard!</span>
        </motion.p>

        {/* CTA Buttons */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          className="flex flex-col gap-8 mt-14 sm:flex-row items-center justify-center">
          <div className="relative">
            <motion.img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/7.png" alt="Squirtle"
              animate={{ y: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 2 }}
              className="absolute w-20 h-20 -top-16 -left-8 drop-shadow-lg" />
            <Link href={user ? "/report/lost" : "/login"}>
              <button className="relative flex flex-col items-center px-10 py-5 font-outfit transition-all rounded-3xl bg-primary text-primary-foreground hover:-translate-y-1 hover:shadow-[0_12px_0_0_hsl(var(--primary)/0.3)] active:translate-y-1 border-b-[6px] border-primary/40 shadow-lg">
                <span className="font-black text-xl">I Lost Something</span>
                <span className="font-black text-sm text-primary-foreground mt-1">Report to Database</span>
              </button>
            </Link>
          </div>
          <div className="relative">
            <motion.img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/4.png" alt="Charmander"
              animate={{ y: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 2, delay: 0.5 }}
              className="absolute w-20 h-20 -top-16 -right-8 drop-shadow-lg" />
            <Link href={user ? "/report/found" : "/login"}>
              <button className="relative flex flex-col items-center px-10 py-4 font-outfit transition-all border-4 rounded-3xl bg-white border-secondary text-secondary-foreground hover:bg-secondary/20 active:scale-95">
                <span className="font-black text-xl">I Found an Item!</span>
                <span className="font-black text-sm text-secondary-foreground/80 mt-1">Earn +50 XP Reward</span>
              </button>
            </Link>
          </div>
        </motion.div>

        {/* Search Panel */}
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.6 }}
          className="w-full max-w-4xl p-2 mt-20 rounded-[3rem] bg-gradient-to-r from-primary via-secondary to-accent relative">
          <motion.img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/52.png" alt="Meowth"
            animate={{ rotate: [0, -5, 5, 0] }} transition={{ repeat: Infinity, duration: 3 }}
            className="absolute w-24 h-24 -top-16 left-10 drop-shadow-xl z-20" />
          <motion.img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png" alt="Bulbasaur"
            animate={{ rotate: [0, 5, -5, 0] }} transition={{ repeat: Infinity, duration: 3, delay: 1 }}
            className="absolute w-28 h-28 -top-20 right-12 drop-shadow-xl z-20" />
          <div className="relative flex flex-col items-center gap-4 p-8 rounded-[2.8rem] bg-white md:flex-row z-10">
            <div className="flex-1 w-full text-left">
              <label className="block mb-2 text-sm font-black uppercase tracking-wider text-primary font-outfit">What was lost?</label>
              <div className="relative">
                <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="ID Card, Earbuds, Backpack..."
                  className="w-full px-6 py-4 bg-muted/20 border-4 border-muted rounded-2xl focus:outline-none focus:border-primary text-foreground font-medium transition-all" />
                <Search className="absolute w-6 h-6 right-5 top-4 text-primary/40" />
              </div>
            </div>
            <div className="flex-1 w-full text-left">
              <label className="block mb-2 text-sm font-black uppercase tracking-wider text-primary font-outfit">Campus Location</label>
              <div className="relative">
                <select value={location} onChange={e => setLocation(e.target.value)}
                  className="w-full px-6 py-4 bg-muted/20 border-4 border-muted rounded-2xl focus:outline-none focus:border-primary text-foreground font-medium appearance-none cursor-pointer">
                  {["Main Cafeteria", "Computer Lab 3 (Block B)", "Central Library", "Student Union Hall", "Auditorium", "Sports Ground"].map(l => <option key={l}>{l}</option>)}
                </select>
                <MapPin className="absolute w-6 h-6 right-5 top-4 text-primary/40" />
              </div>
            </div>
            <Link href={`/search?search=${encodeURIComponent(search)}&location=${encodeURIComponent(location)}`}
              className="w-full md:w-auto md:self-end">
              <button className="w-full px-8 py-5 font-black font-outfit text-xl rounded-2xl bg-secondary text-secondary-foreground hover:-translate-y-1 hover:shadow-lg transition-all border-b-4 border-secondary/50 flex items-center justify-center gap-2">
                <Search size={22} strokeWidth={3} /> Search!
              </button>
            </Link>
          </div>
        </motion.div>

        {/* Live Leaderboard */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}
          className="w-full max-w-3xl mt-16">
          <div className="flex items-center gap-3 mb-5 justify-center">
            <Trophy className="w-6 h-6 text-secondary-foreground" />
            <h2 className="text-2xl font-black font-outfit">Campus Leaderboard</h2>
            {stats && <span className="text-xs font-black px-2 py-0.5 bg-green-100 text-green-700 rounded-full border border-green-200">● LIVE</span>}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {(stats?.topTrainers?.length ? stats.topTrainers : [
              { name: "No users yet", xp: 0, level: 1, branch: "—", itemsReturned: 0 }
            ]).map((trainer: any, i: number) => (
              <motion.div key={i} whileHover={{ scale: 1.05, rotate: -1 }}
                className="flex flex-col items-center p-5 bg-white rounded-3xl border-4 border-muted poke-scroll text-center">
                <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center mb-2">
                  <span className="font-black text-lg text-secondary-foreground">{LEADERBOARD_ICONS[i] || i + 1}</span>
                </div>
                <span className="font-black font-outfit text-foreground text-sm">{trainer.name}</span>
                <span className="text-[10px] text-muted-foreground font-semibold">{trainer.branch}</span>
                <div className="mt-2 flex items-center gap-1 px-3 py-1 bg-secondary/20 rounded-full">
                  <Zap className="w-3 h-3 text-secondary-foreground" fill="currentColor" />
                  <span className="text-xs font-black text-secondary-foreground">{trainer.xp} XP · Lvl {trainer.level}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* How it works */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 }}
          className="w-full max-w-4xl mt-16">
          <h2 className="text-2xl font-black font-outfit text-center mb-10">How to Earn XP</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              { pokemon: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/54.png", name: "Psyduck", step: "01", title: "Report a Lost Item", desc: "Describe what you lost with location. Helps others find it.", xp: "+10 XP" },
              { pokemon: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/37.png", name: "Vulpix", step: "02", title: "Report a Found Item", desc: "Spotted something on campus? Upload it to alert owners fast!", xp: "+10 XP" },
              { pokemon: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/39.png", name: "Jigglypuff", step: "03", title: "Return to Owner", desc: "Return the item to its owner and earn a full XP reward!", xp: "+50-200 XP" },
            ].map((card, i) => (
              <motion.div key={i} whileHover={{ y: -8 }} className="relative pt-10 p-6 bg-white rounded-3xl border-4 border-muted text-center poke-scroll">
                <img src={card.pokemon} alt={card.name} className="w-20 h-20 mx-auto absolute -top-10 left-1/2 -translate-x-1/2 drop-shadow-lg" />
                <div className="text-xs font-black text-muted-foreground mb-1 mt-2">{card.step}</div>
                <h3 className="text-base font-black font-outfit mb-2">{card.title}</h3>
                <p className="text-xs text-foreground/60 font-semibold leading-relaxed mb-3">{card.desc}</p>
                <span className="inline-block px-3 py-1 bg-secondary/20 rounded-full text-xs font-black text-primary flex items-center gap-1 justify-center">{card.xp} <Zap size={10} fill="currentColor" /></span>
              </motion.div>
            ))}
          </div>
        </motion.div>

      </section>
    </div>
  );
}
