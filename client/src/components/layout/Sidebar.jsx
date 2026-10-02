import { NavLink } from 'react-router-dom';
import { LogIn, Sparkles } from 'lucide-react';
import { NAV } from './nav.js';
import { useApp } from '../../context/AppContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import GoogleIcon from '../auth/GoogleIcon.jsx';

export default function Sidebar() {
  const { sessionId } = useApp();
  const { user, isAuthenticated, openAuthModal } = useAuth();

  return (
    <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] w-60 shrink-0 flex-col justify-between border-r border-fg/5 bg-ink/60 p-4 lg:flex">
      <nav className="space-y-1.5" aria-label="Primary">
        {NAV.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-indigo-500/18 to-violet-500/8 text-fg ring-1 ring-indigo-400/30'
                  : 'text-zinc-400 hover:bg-fg/5 hover:text-zinc-100'
              }`
            }
          >
            <Icon className="h-[18px] w-[18px]" />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="space-y-3">
        {isAuthenticated && user ? (
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
            <div className="flex items-center gap-2.5">
              <img
                src={user.avatar}
                alt={user.name}
                className="h-8 w-8 rounded-full border border-white/15 object-cover"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-bold text-white">{user.name}</p>
                <p className="truncate text-[10px] text-zinc-400">{user.email}</p>
              </div>
            </div>
            <div className="mt-2 flex items-center gap-1 text-[10px] text-indigo-300">
              <Sparkles className="h-3 w-3 text-indigo-400" />
              <span>Personalized recommendations</span>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-indigo-500/20 bg-indigo-500/5 p-3 text-center">
            <p className="text-xs font-semibold text-white">Unlock personalized feeds</p>
            <p className="mt-1 text-[11px] text-zinc-400">Sign in with Google in 1 click</p>
            <button
              onClick={() => openAuthModal('signin')}
              className="mt-2.5 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600/80 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-indigo-500"
            >
              <GoogleIcon className="h-3.5 w-3.5" />
              <span>Sign in</span>
            </button>
          </div>
        )}

        <div className="soft-card rounded-2xl p-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-500">Session</p>
          <p className="mt-1 truncate font-mono text-xs text-zinc-300">{sessionId}</p>
          <p className="mt-2 text-[11px] leading-relaxed text-zinc-500">Scroll forever. Fetch almost nothing.</p>
        </div>
      </div>
    </aside>
  );
}

