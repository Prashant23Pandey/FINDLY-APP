"use client";

import { motion } from "framer-motion";
import { 
  BarChart3, 
  Map as MapIcon, 
  Trophy, 
  Flame, 
  Clock, 
  BrainCircuit, 
  ShieldCheck,
  TrendingDown,
  Zap,
  Star
} from "lucide-react";
import Navbar from "@/components/Navbar";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();
  
  const stats = [
    { label: "Trust Score", value: user?.xp ? (840 + user.xp / 10).toFixed(0) : "840", icon: <ShieldCheck className="text-secondary" />, trend: "+12%" },
    { label: "Items Found", value: user?.itemsReturned || "0", icon: <Trophy className="text-primary" />, trend: "+2" },
    { label: "Active Rituals", value: "05", icon: <Flame className="text-orange-500" />, trend: "-1" },
    { label: "Lost Items", value: user?.itemsReported || "0", icon: <Clock className="text-accent" />, trend: "0" },
  ];

  return (
    <div className="relative min-h-screen">
      <Navbar />
      
      <div className="container px-4 pt-32 pb-20 mx-auto">
        <header className="flex flex-col items-start justify-between gap-6 mb-12 md:flex-row md:items-end relative">
          <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/151.png" alt="Mew" className="absolute w-24 h-24 -top-16 left-1/3 opacity-80 animate-bounce cursor-pointer hover:scale-125 transition-transform" />
          
          <div>
            <div className="flex items-center gap-2 mb-2 text-primary">
              <span className="text-xs font-black uppercase tracking-[0.2em] font-outfit">Dr. Pandey's Lab Status</span>
            </div>
            <h1 className="text-4xl font-black text-foreground font-outfit">Campus Analytics</h1>
            <p className="mt-2 text-sm font-bold text-foreground/60">Manage campus leaderboards and missing item XP payouts.</p>
          </div>
          
          <div className="flex items-center gap-4 p-4 border bg-background border-border rounded-2xl shadow-sm poke-scroll">
            <div className="flex flex-col text-right">
              <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold font-outfit">Campus Head</span>
              <span className="text-sm font-black text-foreground font-outfit">Dr. Rajnish Pandey</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-accent border-2 border-white/20" />
          </div>
        </header>

        <div className="bg-white/50 backdrop-blur-sm border-4 border-muted rounded-[3rem] p-8 md:p-12 shadow-[0_12px_40px_rgba(0,0,0,0.05)]">
          <section className="grid gap-6 mb-12 md:grid-cols-4">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="p-7 bg-white rounded-[2rem] border-4 border-muted shadow-sm hover:border-primary/30 transition-colors"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2.5 rounded-xl bg-muted/30">{stat.icon}</div>
                  <span className={cn(
                    "text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider",
                    stat.trend.includes("+") ? "bg-green-100 text-green-600 border border-green-200" : "bg-red-100 text-red-600 border border-red-200"
                  )}>
                    {stat.trend}
                  </span>
                </div>
                <p className="text-3xl font-black font-outfit text-foreground leading-none">{stat.value}</p>
                <p className="text-[10px] font-black uppercase tracking-[0.15em] text-foreground/40 mt-2">{stat.label}</p>
              </motion.div>
            ))}
          </section>
  
          <div className="grid gap-8 lg:grid-cols-3">
            <section className="p-8 lg:col-span-2 bg-white rounded-[2.5rem] border-4 border-muted shadow-sm min-h-[450px]">
              <div className="flex items-center gap-3 mb-8 relative">
                <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/149.png" alt="Dragonite" className="absolute w-24 h-24 -top-12 -right-6 hover:scale-110 transition-transform hidden sm:block" />
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-primary/10">
                    <MapIcon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-2xl font-black font-outfit">Campus Analytics Heatmap</h3>
                </div>
              </div>
              
              <div className="relative flex items-center justify-center border-4 border-muted rounded-[2rem] aspect-video bg-muted/30 overflow-hidden shadow-inner group">
                 <iframe 
                   src="https://maps.google.com/maps?q=NIET,%20Greater%20Noida&t=m&z=16&output=embed&iwloc=near" 
                   title="NIET Greater Noida Map"
                   className="absolute inset-0 w-full h-full grayscale-[20%] group-hover:grayscale-0 transition-all duration-700"
                   frameBorder="0"
                 />
                 <div className="absolute top-[30%] left-[40%] w-8 h-8 bg-primary rounded-full shadow-[0_0_30px_hsl(var(--primary))] animate-ping border-4 border-white pointer-events-none opacity-60" />
                 <div className="absolute bottom-[40%] right-[30%] w-6 h-6 bg-secondary rounded-full shadow-[0_0_20px_hsl(var(--secondary))] animate-ping border-4 border-white pointer-events-none opacity-60" />
              </div>
            </section>
  
            <section className="space-y-6">
              <div className="p-8 bg-white rounded-[2.5rem] border-4 border-muted shadow-sm h-full flex flex-col">
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-2.5 rounded-xl bg-accent/10">
                    <BrainCircuit className="w-6 h-6 text-accent" />
                  </div>
                  <h3 className="text-2xl font-black font-outfit">AI Insights</h3>
                </div>
                
                <div className="space-y-5 flex-1">
                  <div className="p-5 border-4 border-muted bg-muted/5 rounded-[1.5rem] relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-2 h-full bg-red-400 opacity-20" />
                    <div className="flex items-start gap-4">
                      <TrendingDown className="w-5 h-5 mt-1 text-red-500" />
                      <div>
                        <p className="text-sm font-black uppercase tracking-tight">Risk Zone Detected</p>
                        <p className="mt-1.5 text-xs text-foreground/50 font-semibold leading-relaxed">
                          Frequent item loss reported near <span className="text-primary font-bold">The Main Hall</span> between 4 PM - 6 PM.
                        </p>
                      </div>
                    </div>
                  </div>
  
                  <div className="p-5 border-4 border-accent/20 bg-accent/5 rounded-[1.5rem] relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-2 h-full bg-accent" />
                    <div className="flex items-start gap-4">
                      <BrainCircuit className="w-5 h-5 mt-1 text-accent" />
                      <div>
                        <p className="text-sm font-black uppercase tracking-tight text-accent">Active Matching</p>
                        <p className="mt-1.5 text-xs text-foreground/60 font-semibold leading-relaxed">
                          A reported <span className="text-primary font-bold italic">Red Notebook</span> aligns with your search history.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
  
                <div className="mt-8 p-4 bg-muted/20 rounded-2xl flex items-center gap-3 border-2 border-muted">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Neural Mat Engine Active</span>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

function SparkleIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
      <path d="M5 3v4" />
      <path d="M19 17v4" />
      <path d="M3 5h4" />
      <path d="M17 19h4" />
    </svg>
  );
}
