"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, BarChart3, PlusCircle, Gamepad2, User, LogOut, Zap, Shield, Bell, Trophy, Package, Megaphone, CheckCircle2, AlertTriangle, PartyPopper } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { apiPatch, apiGet } from "@/lib/api";

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    if (user) {
      const fetchNotifs = async () => {
        const u = await apiGet("/auth/me"); // Refresh user data
        if (u.ok) {
          const notifs = u.data.user.notifications || [];
          setNotifications(notifs.slice(0, 8));
          setUnread(notifs.filter((n: any) => !n.read).length);
          localStorage.setItem("findly_user", JSON.stringify(u.data.user));
        }
      };
      
      fetchNotifs();
      const interval = setInterval(fetchNotifs, 10000); // Poll every 10s
      return () => clearInterval(interval);
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    router.push("/login");
  };

  const markRead = async () => {
    setUnread(0);
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    await apiPatch("/auth/notifications/read");
  };

  const notifIcon: Record<string, React.ReactNode> = {
    achievement: <Trophy size={14} className="text-yellow-500" />,
    item_returned: <Package size={14} className="text-green-500" />,
    announcement: <Megaphone size={14} className="text-blue-500" />,
    xp_award: <Zap size={14} className="text-primary" fill="currentColor" />,
    welcome: <PartyPopper size={14} className="text-purple-500" />,
    warning: <AlertTriangle size={14} className="text-red-500" />,
    match: <CheckCircle2 size={14} className="text-secondary" />,
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-3 bg-white/90 backdrop-blur-md border-b-4 border-primary/20 shadow-sm">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 shrink-0">
        <div className="p-1.5 transition-all duration-500 rounded-full bg-secondary/30 hover:bg-secondary/50 hover:rotate-[360deg]">
          <Gamepad2 className="w-7 h-7 text-primary" />
        </div>
        <span className="text-2xl font-black tracking-tighter text-primary font-outfit">FINDLY</span>
      </Link>

      {/* Nav Links */}
      <div className="items-center hidden gap-2 md:flex">
        <NavLink href="/search" icon={<Search size={17} />} label="Search" />
        {isAdmin
          ? <NavLink href="/admin" icon={<Shield size={17} />} label="Admin Portal" />
          : <NavLink href="/dashboard" icon={<BarChart3 size={17} />} label="Campus Analytics" />
        }
        <NavLink href="/report/lost" icon={<PlusCircle size={17} />} label="Report Lost" />
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2">
        {user ? (
          <>
            {/* XP Bar chip */}
            <div className="hidden lg:flex flex-col items-start px-3 py-1.5 bg-secondary/20 rounded-full border-2 border-secondary/50 min-w-[110px]">
              <div className="flex items-center gap-1 w-full justify-between">
                <Zap className="w-3 h-3 text-secondary-foreground" fill="currentColor" />
                <span className="text-[10px] font-black text-secondary-foreground font-outfit">Lvl {user.level} · {user.xp} XP</span>
              </div>
              <div className="w-full h-1 bg-secondary/30 rounded-full mt-1 overflow-hidden">
                <motion.div
                  className="h-full bg-secondary-foreground rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${(user.xp % 100)}%` }}
                  transition={{ duration: 0.8 }}
                />
              </div>
            </div>

            {/* Notifications Bell */}
            <div className="relative">
              <button onClick={() => { setNotifOpen(!notifOpen); setDropdownOpen(false); if (notifOpen === false) markRead(); }}
                className="relative p-2 rounded-full bg-muted/30 hover:bg-muted/60 transition-all border-2 border-muted">
                <Bell size={18} className="text-foreground/70" />
                {unread > 0 && (
                  <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-white text-[9px] font-black rounded-full flex items-center justify-center">
                    {unread > 9 ? "9+" : unread}
                  </motion.span>
                )}
              </button>

              <AnimatePresence>
                {notifOpen && (
                  <motion.div initial={{ opacity: 0, y: -8, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -8 }}
                    className="absolute right-0 top-12 w-80 bg-white rounded-2xl border-4 border-muted shadow-2xl z-50 overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-3 border-b-2 border-muted">
                      <p className="font-black text-sm font-outfit">Notifications</p>
                      {notifications.length > 0 && (
                        <span className="text-[10px] font-bold text-muted-foreground">{notifications.length} total</span>
                      )}
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="flex flex-col items-center py-8 gap-2">
                          <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/175.png" alt="" className="w-12 h-12 opacity-40" />
                          <p className="text-xs font-bold text-muted-foreground">No notifications yet!</p>
                        </div>
                      ) : (
                        notifications.map((n: any, i: number) => (
                          <div key={n._id || i} className={`px-4 py-3 border-b border-muted/50 hover:bg-muted/20 transition-colors ${!n.read ? "bg-primary/5" : ""}`}>
                            <div className="flex gap-2">
                              <span className="shrink-0 mt-0.5">{notifIcon[n.type] || <Bell size={14} />}</span>
                              <div>
                                <p className="text-xs font-black text-foreground">{n.title}</p>
                                <p className="text-[10px] text-muted-foreground font-semibold mt-0.5 leading-relaxed">{n.body}</p>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* User dropdown */}
            <div className="relative">
              <button onClick={() => { setDropdownOpen(!dropdownOpen); setNotifOpen(false); }}
                className="flex items-center gap-2 px-3 py-2 bg-primary/10 rounded-full border-2 border-primary/20 hover:bg-primary/20 transition-all">

                <span className="text-xs font-black text-foreground hidden sm:block">{user.name.split(" ")[0]}</span>
              </button>

              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div initial={{ opacity: 0, y: -8, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -8 }}
                    className="absolute right-0 top-12 w-56 bg-white rounded-2xl border-4 border-muted shadow-xl p-2 z-50">
                    <div className="px-3 py-2 mb-1 border-b-2 border-muted">
                      <p className="text-sm font-black">{user.name}</p>
                      <p className="text-[10px] text-muted-foreground font-semibold">{user.email}</p>
                      {user.enrollmentNo && <p className="text-[10px] text-muted-foreground font-mono">{user.enrollmentNo}</p>}
                    </div>
                    <Link href="/profile" onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-muted/30 text-foreground/70 transition-all text-sm font-bold">
                      <User size={14} /> My Profile
                    </Link>
                    {isAdmin && (
                      <Link href="/admin" onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-primary/10 text-primary transition-all text-sm font-bold">
                        <Shield size={14} /> Admin Portal
                      </Link>
                    )}
                    <button onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-red-50 text-red-500 transition-all text-sm font-bold">
                      <LogOut size={14} /> Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </>
        ) : (
          <div className="flex items-center gap-2">
            <Link href="/login">
              <button className="px-4 py-2 text-sm font-black text-primary border-2 border-primary/30 rounded-full hover:bg-primary/10 transition-all">Login</button>
            </Link>
            <Link href="/register">
              <button className="px-4 py-2 text-sm font-black bg-primary text-white rounded-full hover:bg-primary/90 transition-all border-b-2 border-primary/50">Register ⚡</button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}

function NavLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <Link href={href} className="flex items-center gap-2 px-3 py-2 rounded-full transition-all text-foreground/70 hover:text-primary hover:bg-primary/10 group">
      <span className="transition-transform group-hover:-translate-y-0.5">{icon}</span>
      <span className="text-xs font-black uppercase tracking-wide">{label}</span>
    </Link>
  );
}
