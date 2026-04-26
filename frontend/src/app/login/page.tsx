"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, Zap, ArrowRight, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const result = await login(form.email, form.password);
    if (result.ok) {
      router.push("/");
    } else {
      setError(result.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20"
      style={{ background: "linear-gradient(135deg, hsl(45,100%,94%) 0%, hsl(195,90%,94%) 50%, hsl(350,85%,95%) 100%)" }}>

      {/* Background Pokémon */}
      <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png" alt="Pikachu" className="fixed w-40 h-40 bottom-10 right-10 opacity-10 pointer-events-none animate-bounce hidden lg:block" />
      <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/7.png" alt="Squirtle" className="fixed w-32 h-32 top-20 left-10 opacity-10 pointer-events-none hidden lg:block" />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <motion.img
            src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png"
            alt="Pikachu"
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="w-24 h-24 mx-auto mb-3 drop-shadow-xl"
          />
          <h1 className="text-4xl font-black font-outfit text-foreground">Welcome Back!</h1>
          <p className="text-sm font-semibold text-foreground/60 mt-1">Login to your PokeFind User account</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-[2rem] border-4 border-muted p-8 shadow-[0_8px_0_0_hsl(var(--primary)/0.15)]">
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="flex items-center gap-3 p-3 bg-red-50 border-2 border-red-200 rounded-2xl text-red-700">
                  <AlertCircle size={16} />
                  <span className="text-xs font-bold">{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Email */}
            <div className="space-y-1">
              <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Email Address</label>
              <div className="relative">
                <input
                  type="email" required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="yourname@niet.co.in"
                  className="w-full pl-10 pr-4 py-3.5 border-2 border-muted bg-muted/20 rounded-2xl focus:outline-none focus:border-primary text-foreground font-medium transition-all"
                />
                <Mail className="absolute left-3 top-4 w-4 h-4 text-muted-foreground" />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Password</label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"} required
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-11 py-3.5 border-2 border-muted bg-muted/20 rounded-2xl focus:outline-none focus:border-primary text-foreground font-medium transition-all"
                />
                <Lock className="absolute left-3 top-4 w-4 h-4 text-muted-foreground" />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-4 text-muted-foreground hover:text-foreground">
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button type="submit" disabled={loading}
              className="w-full py-4 font-black font-outfit text-xl bg-foreground text-background rounded-2xl hover:-translate-y-1 hover:shadow-xl active:translate-y-0 transition-all border-b-4 border-foreground/30 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg">
              {loading ? (
                <span className="animate-pulse">Logging in... ⚡</span>
              ) : (
                <><Zap size={20} fill="currentColor" /> Login to FINDLY</>
              )}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t-2 border-muted text-center">
            <p className="text-sm font-semibold text-foreground/60">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="font-black text-primary hover:underline">Register as User →</Link>
            </p>
          </div>
        </div>

        {/* Admin hint */}
        <div className="mt-4 flex items-center gap-2 justify-center p-3 bg-white/60 rounded-2xl border-2 border-muted">
          <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/94.png" alt="Gengar" className="w-8 h-8" />
          <p className="text-xs font-bold text-foreground/60">
            Admin? <Link href="/admin/login" className="text-primary font-black hover:underline">Use the Admin Portal →</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
