import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { User, LogOut, Sparkles, Activity, ShieldCheck, Settings, ChevronDown, RotateCcw } from 'lucide-react';
import GoogleIcon from './GoogleIcon.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { useApp } from '../../context/AppContext.jsx';

export default function UserDropdown() {
  const { user, logout } = useAuth();
  const { sessionId, newSession, profile } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!user) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        className="flex items-center gap-2.5 rounded-full border border-white/10 bg-white/5 py-1.5 pl-1.5 pr-3 transition hover:border-indigo-400/40 hover:bg-white/10 focus:outline-none"
      >
        <img
          src={user.avatar}
          alt={user.name}
          className="h-7 w-7 rounded-full border border-white/20 object-cover"
        />
        <div className="hidden text-left sm:block">
          <p className="max-w-[90px] truncate text-xs font-semibold leading-tight text-white">{user.name}</p>
        </div>
        <ChevronDown className={`h-3.5 w-3.5 text-zinc-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Card */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 w-72 origin-top-right overflow-hidden rounded-2xl border border-white/10 bg-[#141419] p-3 text-fg shadow-2xl shadow-black/80 backdrop-blur-2xl z-50"
          >
            {/* User Profile Summary */}
            <div className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.03] p-3">
              <img
                src={user.avatar}
                alt={user.name}
                className="h-11 w-11 rounded-full border border-white/15 object-cover"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <p className="truncate text-sm font-bold text-white">{user.name}</p>
                  {user.provider === 'google' && (
                    <span title="Signed in with Google">
                      <GoogleIcon className="h-3.5 w-3.5 shrink-0" />
                    </span>
                  )}
                </div>
                <p className="truncate text-xs text-zinc-400">{user.email}</p>
                <div className="mt-1 flex items-center gap-1 text-[10px] text-emerald-400 font-medium">
                  <ShieldCheck className="h-3 w-3" />
                  <span>Personalized feed active</span>
                </div>
              </div>
            </div>

            {/* Session Info */}
            <div className="my-2 rounded-lg bg-indigo-500/10 px-3 py-2 text-[11px] text-indigo-300">
              <span className="font-medium text-indigo-200">Session ID:</span> {sessionId.slice(0, 16)}...
            </div>

            {/* Actions List */}
            <div className="space-y-1">
              <button
                onClick={() => {
                  newSession();
                  setIsOpen(false);
                  navigate('/');
                }}
                className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-zinc-300 transition hover:bg-white/10 hover:text-white text-left"
              >
                <RotateCcw className="h-4 w-4 text-indigo-400" />
                <span>Reset Feed Session</span>
              </button>

              <Link
                to="/lab"
                onClick={() => setIsOpen(false)}
                className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-zinc-300 transition hover:bg-white/10 hover:text-white"
              >
                <Activity className="h-4 w-4 text-emerald-400" />
                <span>Live Recommendation Lab</span>
              </Link>
            </div>

            {/* Divider */}
            <div className="my-2 border-t border-white/10" />

            {/* Sign out */}
            <button
              onClick={() => {
                logout();
                setIsOpen(false);
              }}
              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-rose-400 transition hover:bg-rose-500/10 hover:text-rose-300"
            >
              <LogOut className="h-4 w-4" />
              <span>Sign Out</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
