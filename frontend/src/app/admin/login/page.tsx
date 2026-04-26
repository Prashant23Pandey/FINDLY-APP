"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, Shield, AlertCircle, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function AdminLoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError("");
    const result = await login(form.email, form.password);
    if (result.ok) {
      // Check if actually admin
      const stored = localStorage.getItem("findly_user");
      const user = stored ? JSON.parse(stored) : null;
      if (user?.role === "admin") {
        router.push("/admin");
      } else {
        setError("This account does not have admin privileges.");
        localStorage.removeItem("findly_token");
        localStorage.removeItem("findly_user");
      }
    } else {
      setError(result.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)" }}>

      {/* Gengar floating bg */}
      <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/94.png" alt="Gengar" className="fixed w-48 h-48 bottom-10 right-10 opacity-5 pointer-events-none hidden lg:block animate-pulse" />
      <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/249.png" alt="Lugia" className="fixed w-48 h-48 top-10 left-10 opacity-5 pointer-events-none hidden lg:block" />

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/10 border-2 border-white/20 mb-4">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-black font-outfit text-white">Admin Portal</h1>
          <p className="text-sm font-semibold text-white/50">Admin Management Portal · FINDLY</p>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-[2rem] border border-white/20 p-8">
          <AnimatePresence>
            {error && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="flex items-center gap-3 p-3 mb-5 bg-red-500/20 border border-red-400/30 rounded-2xl text-red-300">
                <AlertCircle size={16} /><span className="text-xs font-bold">{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1">
              <label className="text-xs font-black uppercase tracking-widest text-white/50">Admin Email</label>
              <div className="relative">
                <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="admin@niet.co.in"
                  className="w-full pl-10 pr-4 py-3.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-white/30 font-medium focus:outline-none focus:border-white/50 transition-all" />
                <Mail size={15} className="absolute left-3 top-4 text-white/40" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-black uppercase tracking-widest text-white/50">Password</label>
              <div className="relative">
                <input type={showPass ? "text" : "password"} required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-3.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-white/30 font-medium focus:outline-none focus:border-white/50 transition-all" />
                <Lock size={15} className="absolute left-3 top-4 text-white/40" />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-4 text-white/40">
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full py-4 font-black font-outfit text-xl bg-white text-gray-900 rounded-2xl hover:-translate-y-0.5 hover:shadow-lg transition-all disabled:opacity-60 flex items-center justify-center gap-2">
              {loading ? <span className="animate-pulse">Verifying...</span> : <><Shield size={20} /> Access Admin Portal</>}
            </button>
          </form>

          <p className="mt-6 pt-5 border-t border-white/10 text-center text-sm font-semibold text-white/40">
            Not an admin? <Link href="/login" className="text-white font-black hover:underline">Student Login →</Link>
          </p>
        </div>

        <p className="mt-4 text-center text-xs font-semibold text-white/30">
          Admin accounts require a special registration code. Contact your IT department.
        </p>
      </motion.div>
    </div>
  );
}
