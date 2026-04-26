"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, User, Phone, BookOpen, Zap, AlertCircle, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const BRANCHES = ["CSE", "CSE-AI", "CSE-DS", "IT", "ECE", "ME", "CE", "EEE"];
const YEARS = ["1st Year", "2nd Year", "3rd Year", "4th Year"];

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: "", email: "", password: "", confirmPassword: "",
    enrollmentNo: "", phone: "", branch: "", year: "",
  });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const set = (key: string, val: string) => setForm((f) => ({ ...f, [key]: val }));

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) { setError("Passwords do not match!"); return; }
    if (form.password.length < 6) { setError("Password must be at least 6 characters."); return; }
    setError(""); setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError("");
    const result = await register({
      name: form.name, email: form.email, password: form.password,
      enrollmentNo: form.enrollmentNo, phone: form.phone,
      branch: form.branch, year: form.year,
    });
    if (result.ok) router.push("/");
    else setError(result.message);
    setLoading(false);
  };

  const pokeBuddies = [
    "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/4.png",
    "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/133.png",
  ];

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20"
      style={{ background: "linear-gradient(135deg, hsl(195,90%,94%) 0%, hsl(45,100%,94%) 100%)" }}>

      <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png" alt="Bulbasaur" className="fixed w-36 h-36 bottom-10 left-10 opacity-10 pointer-events-none hidden lg:block" />
      <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/4.png" alt="Charmander" className="fixed w-36 h-36 top-20 right-10 opacity-10 pointer-events-none hidden lg:block animate-bounce" />

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-6">
          <motion.img
            src={pokeBuddies[step - 1]} alt="pokemon"
            key={step}
            initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", bounce: 0.5 }}
            className="w-24 h-24 mx-auto mb-3 drop-shadow-xl"
          />
          <h1 className="text-4xl font-black font-outfit text-foreground">Become a User!</h1>
          <p className="text-sm font-semibold text-foreground/60 mt-1">Create your NIET FINDLY account</p>

          {/* Step indicator */}
          <div className="flex items-center justify-center gap-3 mt-4">
            {[1, 2].map((s) => (
              <div key={s} className={`flex items-center gap-1 px-3 py-1 rounded-full border-2 text-xs font-black transition-all ${step === s ? "bg-primary text-white border-primary" : step > s ? "bg-green-400 text-white border-green-400" : "bg-white border-muted text-muted-foreground"}`}>
                {step > s ? <CheckCircle2 size={12} /> : null} Step {s}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-[2rem] border-4 border-muted p-8 shadow-[0_8px_0_0_hsl(var(--accent)/0.3)]">
          <AnimatePresence>
            {error && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="flex items-center gap-3 p-3 mb-4 bg-red-50 border-2 border-red-200 rounded-2xl text-red-700">
                <AlertCircle size={16} /><span className="text-xs font-bold">{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {step === 1 ? (
            <form onSubmit={handleNext} className="space-y-4">
              <h2 className="text-sm font-black uppercase tracking-widest text-muted-foreground mb-4">Account Info</h2>

              <div className="space-y-1">
                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Full Name</label>
                <div className="relative">
                  <input type="text" required value={form.name} onChange={(e) => set("name", e.target.value)}
                    placeholder="Ash Ketchum"
                    className="w-full pl-10 pr-4 py-3 border-2 border-muted bg-muted/20 rounded-xl focus:outline-none focus:border-primary font-medium transition-all" />
                  <User size={15} className="absolute left-3 top-3.5 text-muted-foreground" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">College Email</label>
                <div className="relative">
                  <input type="email" required value={form.email} onChange={(e) => set("email", e.target.value)}
                    placeholder="2100123456@niet.co.in"
                    className="w-full pl-10 pr-4 py-3 border-2 border-muted bg-muted/20 rounded-xl focus:outline-none focus:border-primary font-medium transition-all" />
                  <Mail size={15} className="absolute left-3 top-3.5 text-muted-foreground" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Password</label>
                <div className="relative">
                  <input type={showPass ? "text" : "password"} required value={form.password} onChange={(e) => set("password", e.target.value)}
                    placeholder="Min 6 characters"
                    className="w-full pl-10 pr-10 py-3 border-2 border-muted bg-muted/20 rounded-xl focus:outline-none focus:border-primary font-medium transition-all" />
                  <Lock size={15} className="absolute left-3 top-3.5 text-muted-foreground" />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-3.5 text-muted-foreground">
                    {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Confirm Password</label>
                <div className="relative">
                  <input type="password" required value={form.confirmPassword} onChange={(e) => set("confirmPassword", e.target.value)}
                    placeholder="Repeat password"
                    className="w-full pl-10 pr-4 py-3 border-2 border-muted bg-muted/20 rounded-xl focus:outline-none focus:border-primary font-medium transition-all" />
                  <Lock size={15} className="absolute left-3 top-3.5 text-muted-foreground" />
                </div>
              </div>

              <button type="submit" className="w-full py-3.5 font-black font-outfit text-lg bg-primary text-primary-foreground rounded-2xl hover:-translate-y-0.5 transition-all border-b-4 border-primary/50">
                Next Step →
              </button>
            </form>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h2 className="text-sm font-black uppercase tracking-widest text-muted-foreground mb-4">User Profile</h2>

              <div className="space-y-1">
                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Enrollment No.</label>
                <div className="relative">
                  <input type="text" value={form.enrollmentNo} onChange={(e) => set("enrollmentNo", e.target.value)}
                    placeholder="2100123456"
                    className="w-full pl-10 pr-4 py-3 border-2 border-muted bg-muted/20 rounded-xl focus:outline-none focus:border-primary font-medium transition-all" />
                  <BookOpen size={15} className="absolute left-3 top-3.5 text-muted-foreground" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Phone Number</label>
                <div className="relative">
                  <input type="tel" value={form.phone} onChange={(e) => set("phone", e.target.value)}
                    placeholder="9876543210"
                    className="w-full pl-10 pr-4 py-3 border-2 border-muted bg-muted/20 rounded-xl focus:outline-none focus:border-primary font-medium transition-all" />
                  <Phone size={15} className="absolute left-3 top-3.5 text-muted-foreground" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Branch</label>
                  <select value={form.branch} onChange={(e) => set("branch", e.target.value)}
                    className="w-full px-3 py-3 border-2 border-muted bg-muted/20 rounded-xl focus:outline-none focus:border-primary font-medium text-sm">
                    <option value="">Select...</option>
                    {BRANCHES.map((b) => <option key={b}>{b}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Year</label>
                  <select value={form.year} onChange={(e) => set("year", e.target.value)}
                    className="w-full px-3 py-3 border-2 border-muted bg-muted/20 rounded-xl focus:outline-none focus:border-primary font-medium text-sm">
                    <option value="">Select...</option>
                    {YEARS.map((y) => <option key={y}>{y}</option>)}
                  </select>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setStep(1)}
                  className="flex-1 py-3.5 font-black border-2 border-muted rounded-2xl text-foreground/70 hover:bg-muted/30 transition-all">
                  ← Back
                </button>
                <button type="submit" disabled={loading}
                  className="flex-2 flex-grow py-3.5 font-black font-outfit text-lg bg-foreground text-background rounded-2xl hover:-translate-y-1 hover:shadow-xl active:translate-y-0 transition-all border-b-4 border-foreground/30 disabled:opacity-60 flex items-center justify-center gap-2 shadow-lg">
                  {loading ? <span className="animate-pulse">Creating... ⚡</span> : <><Zap size={18} fill="currentColor" /> Start Journey!</>}
                </button>
              </div>
            </form>
          )}

          <p className="mt-5 pt-4 border-t-2 border-muted text-center text-sm font-semibold text-foreground/60">
            Already registered? <Link href="/login" className="font-black text-primary hover:underline">Login →</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
