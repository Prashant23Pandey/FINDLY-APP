"use client";

import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  MapPin, 
  Clock, 
  Calendar, 
  ShieldCheck, 
  MessageSquare, 
  Share2, 
  AlertTriangle,
  QrCode,
  Sparkles
} from "lucide-react";
import Navbar from "@/components/Navbar";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function ItemDetail() {
  const status = "Found"; // Lost -> Found -> Verified -> Returned

  return (
    <div className="relative min-h-screen">
      <Navbar />
      
      <div className="container px-4 pt-32 pb-20 mx-auto">
        <Link href="/search" className="flex items-center gap-2 mb-8 transition-colors text-foreground/50 hover:text-primary">
          <ArrowLeft size={16} />
          <span className="text-sm font-medium uppercase tracking-widest">Back to Grimoire</span>
        </Link>

        {/* Scroll-styled Card */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-5xl mx-auto overflow-hidden magic-scroll rounded-[3rem] border-white/5"
        >
          <div className="grid lg:grid-cols-2">
            {/* Image Section */}
            <div className="relative aspect-square lg:aspect-auto">
              <img 
                src="https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=1000" 
                alt="Item Vision" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              
              <div className="absolute bottom-8 left-8 right-8">
                <div className="flex flex-wrap gap-2 mb-4">
                  {["Leather", "Grimoire", "Vintage", "Brown"].map((tag, i) => (
                    <span key={i} className="px-3 py-1 text-[10px] font-bold uppercase border rounded-full bg-black/60 backdrop-blur-md border-white/10 text-white">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Content Section */}
            <div className="p-8 md:p-12 space-y-8">
              <header>
                <div className="flex items-center gap-2 mb-4">
                  <div className="px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] rounded-full bg-green-500/20 text-green-500 border border-green-500/30">
                    Status: {status}
                  </div>
                  <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] rounded-full bg-primary/20 text-primary border border-primary/30">
                    Ministry Verified
                  </div>
                </div>
                <h1 className="text-4xl font-bold font-outfit text-glow-gold">Tom Riddle's Diary</h1>
                <p className="mt-4 text-foreground/60 leading-relaxed italic">
                  "Found near the sink in the girls' bathroom on the second floor. It looks like an old spellbook or a very fancy journal. My ink disappears when I write in it! Has a 'T.M. Riddle' emblem on the cover."
                </p>
              </header>

              {/* Status Timeline */}
              <div className="py-8 border-y border-white/5">
                <div className="flex justify-between relative">
                  <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-white/5 -translate-y-1/2" />
                  <div className="absolute top-1/2 left-0 w-2/3 h-[2px] bg-primary -translate-y-1/2 shadow-[0_0_10px_#fde047]" />
                  
                  {[
                    { label: "Lost", done: true },
                    { label: "Found", done: true },
                    { label: "Verified", done: true },
                    { label: "Returned", done: false },
                  ].map((s, i) => (
                    <div key={i} className="relative z-10 flex flex-col items-center gap-2">
                       <div className={cn(
                         "w-4 h-4 rounded-full border-2",
                         s.done ? "bg-primary border-primary shadow-[0_0_10px_#fde047]" : "bg-card border-white/10"
                       )} />
                       <span className={cn("text-[8px] font-bold uppercase tracking-widest", s.done ? "text-primary" : "text-foreground/20")}>
                         {s.label}
                       </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Details List */}
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase text-foreground/30 tracking-widest">Discovery Coordinates</span>
                  <div className="flex items-center gap-2 font-bold text-sm">
                    <MapPin size={14} className="text-primary" />
                    Moaning Myrtle's Bathroom
                  </div>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase text-foreground/30 tracking-widest">Ritual Time</span>
                  <div className="flex items-center gap-2 font-bold text-sm">
                    <Clock size={14} className="text-primary" />
                    Midnight, Halloween
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-4 pt-4 sm:flex-row">
                <Link href="/chat" className="flex-1">
                  <button className="w-full flex items-center justify-center gap-2 py-4 bg-primary text-primary-foreground font-bold rounded-2xl hover:shadow-[0_0_20px_rgba(253,224,71,0.5)] transition-all">
                    <MessageSquare size={18} />
                    <span>Send an Owl (Chat)</span>
                  </button>
                </Link>
                <div className="flex gap-4">
                  <button className="p-4 border border-white/10 rounded-2xl hover:bg-white/5 transition-colors">
                    <QrCode size={20} className="text-foreground/60" />
                  </button>
                  <button className="p-4 border border-white/10 rounded-2xl hover:bg-white/5 transition-colors">
                    <Share2 size={20} className="text-foreground/60" />
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400">
                <AlertTriangle size={14} />
                <span className="text-[10px] font-bold uppercase tracking-tighter">Report suspicious enchantment</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
