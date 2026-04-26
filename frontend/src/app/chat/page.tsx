"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Shield, Sparkles, MessageSquare, Info, ShieldAlert } from "lucide-react";
import Navbar from "@/components/Navbar";
import { cn } from "@/lib/utils";

export default function Chat() {
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([
    { sender: "Hedwig", text: "Hoot hoot. I believe I have summoned your lost artifact near the restricted section of the library.", time: "10:30 AM", isSelf: false },
    { sender: "Me", text: "That is grand news! Was it the space gray laptop?", time: "10:31 AM", isSelf: true },
    { sender: "Hedwig", text: "Indeed. It has a distinctive sticker of a dragon on the lid.", time: "10:32 AM", isSelf: false },
  ]);

  const sendMessage = () => {
    if (!message.trim()) return;
    setChatHistory([...chatHistory, { sender: "Me", text: message, time: "Now", isSelf: true }]);
    setMessage("");
  };

  return (
    <div className="relative h-screen overflow-hidden flex flex-col">
      <Navbar />
      
      <div className="flex-1 container px-4 pt-32 pb-6 mx-auto flex gap-6">
        {/* Chat List (Sidebar) */}
        <aside className="w-80 hidden lg:flex flex-col gap-4">
          <div className="p-6 magic-scroll rounded-3xl border-accent/20">
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-accent mb-4">Owl Post Network</h3>
            <div className="space-y-4">
              <div className="p-4 border rounded-2xl bg-white/5 border-primary/30 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center border border-primary/40">
                  <Sparkles className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-bold">Hedwig</p>
                  <p className="text-[10px] text-foreground/40 uppercase tracking-tighter">Dell Laptop (Gray)</p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 border border-white/5 bg-white/5 rounded-3xl mt-auto">
            <div className="flex items-center gap-3 mb-2">
              <Shield className="w-4 h-4 text-green-500" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-green-500">Identity Masked</span>
            </div>
            <p className="text-xs text-foreground/40 leading-relaxed italic">
              Your personal information is invisible to the other wizard. All communications pass through Hogwarts secure channels.
            </p>
          </div>
        </aside>

        {/* Chat Main Window */}
        <main className="flex-1 flex flex-col magic-scroll rounded-[2rem] overflow-hidden border-white/5 relative">
          {/* Header */}
          <header className="p-6 border-b border-white/5 flex items-center justify-between bg-white/2">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-primary/30 to-accent/30 flex items-center justify-center border border-white/10">
                <span className="text-xl">🦉</span>
              </div>
              <div>
                <h2 className="text-lg font-bold font-outfit">Hedwig</h2>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-[10px] uppercase font-bold tracking-widest text-foreground/40">In Owlery</span>
                </div>
              </div>
            </div>
            
            <button className="p-3 transition-colors rounded-full bg-white/5 hover:bg-white/10 text-foreground/50">
              <Info size={20} />
            </button>
          </header>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
             <div className="flex justify-center mb-8">
               <div className="flex items-center gap-2 px-4 py-1 border border-white/10 rounded-full bg-white/5">
                 <ShieldAlert className="w-3 h-3 text-primary" />
                 <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-foreground/40">Owl Post Encryption Active</span>
               </div>
             </div>

             {chatHistory.map((msg, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: msg.isSelf ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={cn(
                    "flex flex-col max-w-[80%] gap-1",
                    msg.isSelf ? "ml-auto items-end" : "mr-auto items-start"
                  )}
                >
                  <div className={cn(
                    "p-4 rounded-2xl text-sm leading-relaxed",
                    msg.isSelf 
                      ? "bg-primary text-primary-foreground rounded-tr-none shadow-[0_0_20px_rgba(253,224,71,0.2)]" 
                      : "bg-white/5 border border-white/10 rounded-tl-none"
                  )}>
                    {msg.text}
                  </div>
                  <span className="text-[8px] uppercase font-bold tracking-widest text-foreground/30 px-1">{msg.time}</span>
                </motion.div>
             ))}
          </div>

          {/* Input Area */}
          <div className="p-6 bg-white/2 border-t border-white/5">
             <div className="relative flex items-center">
                <input 
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  type="text" 
                  placeholder="Inscribe your message..."
                  className="w-full pl-6 pr-16 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:border-primary/50 text-foreground transition-all"
                />
                <button 
                  onClick={sendMessage}
                  className="absolute right-2 p-3 bg-primary text-primary-foreground rounded-xl hover:shadow-[0_0_15px_rgba(253,224,71,0.5)] transition-all active:scale-95"
                >
                  <Send size={18} />
                </button>
             </div>
             <p className="mt-3 text-[10px] text-center text-foreground/20 italic">Press Enter to manifest your message</p>
          </div>
        </main>
      </div>
    </div>
  );
}
