import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import GoogleIcon from '../components/auth/GoogleIcon.jsx';
import { useAuth, DEMO_GOOGLE_USERS } from '../context/AuthContext.jsx';
import Logo from '../components/layout/Logo.jsx';

export default function Login() {
  const { loginWithGoogle, loginWithEmail, authLoading } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showGoogleAccounts, setShowGoogleAccounts] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await loginWithEmail({ email, password });
      navigate('/');
    } catch (err) {
      setError(err.message || 'Sign in failed');
    }
  };

  const handleGoogleLogin = async (acc) => {
    try {
      await loginWithGoogle(acc);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Google login failed');
    }
  };

  const handleFillDemo = async () => {
    setEmail('developer@endless.io');
    setPassword('demo-pass-123');
    try {
      await loginWithEmail({ email: 'developer@endless.io', password: 'demo-pass-123' });
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="mx-auto flex min-h-[calc(100vh-12rem)] max-w-5xl items-center justify-center py-8">
      <div className="grid w-full max-w-4xl grid-cols-1 overflow-hidden rounded-3xl border border-white/10 bg-[#111116] shadow-2xl lg:grid-cols-2">
        {/* Left Side: Brand Showcase */}
        <div className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-indigo-950/80 via-zinc-900 to-ink p-10 lg:flex">
          <div className="pointer-events-none absolute -left-16 -top-16 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-16 -right-16 h-64 w-64 rounded-full bg-violet-500/20 blur-3xl" />

          <div className="relative">
            <Link to="/" className="flex items-center gap-3">
              <Logo />
              <span className="text-xl font-black tracking-tight text-white">Endless</span>
            </Link>
            <div className="mt-12 space-y-4">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-300">
                <Sparkles className="h-3.5 w-3.5" /> Next-Gen Recommendation Engine
              </span>
              <h1 className="text-3xl font-extrabold tracking-tight text-white">
                Endless content.<br />
                <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
                  Personalized for you.
                </span>
              </h1>
              <p className="text-sm leading-relaxed text-zinc-400">
                Sign in with Google to sync your watch history, personalize ranking signals, and explore synthetic catalog streams with zero loading friction.
              </p>
            </div>
          </div>

          <div className="relative space-y-3 border-t border-white/10 pt-6">
            <div className="flex items-center gap-3 text-xs text-zinc-300">
              <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>Session-aware cryptographic cursors</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-zinc-300">
              <ShieldCheck className="h-4 w-4 text-indigo-400 shrink-0" />
              <span>Multi-tiered LRU & Redis cache layer</span>
            </div>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="p-8 sm:p-10">
          <div className="mb-6">
            <h2 className="text-2xl font-bold tracking-tight text-white">Sign in to Endless</h2>
            <p className="mt-1 text-xs text-zinc-400">Continue with Google or your email credentials</p>
          </div>

          {error && (
            <div className="mb-4 rounded-xl border border-rose-500/20 bg-rose-500/10 p-3 text-xs text-rose-300">
              {error}
            </div>
          )}

          {/* Google Sign In */}
          <div className="space-y-2.5">
            {!showGoogleAccounts ? (
              <button
                type="button"
                id="page-continue-google"
                disabled={authLoading}
                onClick={() => setShowGoogleAccounts(true)}
                className="group flex w-full items-center justify-center gap-3 rounded-2xl border border-white/15 bg-white/10 px-4 py-3.5 text-sm font-semibold text-white shadow-lg transition-all hover:border-indigo-400/50 hover:bg-white/[0.14] active:scale-[0.99] disabled:opacity-50"
              >
                <GoogleIcon className="h-5 w-5 shrink-0 transition-transform group-hover:scale-110" />
                <span>Continue with Google</span>
              </button>
            ) : (
              <div className="space-y-3 rounded-2xl border border-indigo-500/30 bg-indigo-950/20 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <GoogleIcon className="h-4 w-4" />
                    <span className="text-xs font-semibold text-white">Sign in with your Google Mail</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowGoogleAccounts(false)}
                    className="text-[11px] text-zinc-400 hover:text-zinc-200"
                  >
                    Cancel
                  </button>
                </div>

                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your.email@gmail.com"
                    className="h-10 w-full rounded-xl border border-white/15 bg-black/40 pl-10 pr-3 text-xs text-white placeholder:text-zinc-500 transition focus:border-indigo-400 focus:bg-black/60 focus:outline-none"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => handleGoogleLogin(email || 'user@gmail.com')}
                  disabled={authLoading}
                  className="flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-white px-4 text-xs font-bold text-black shadow-lg transition hover:bg-zinc-100 active:scale-[0.99] disabled:opacity-50"
                >
                  <GoogleIcon className="h-4 w-4" />
                  <span>Continue as {email ? email : 'Google Account'}</span>
                </button>

                <div className="pt-2 border-t border-white/10">
                  <p className="mb-2 text-[11px] font-medium uppercase tracking-wider text-zinc-400">
                    Or select sample Google profile
                  </p>
                  <div className="space-y-1.5">
                    {DEMO_GOOGLE_USERS.map((acc) => (
                      <button
                        key={acc.id}
                        type="button"
                        onClick={() => handleGoogleLogin(acc)}
                        disabled={authLoading}
                        className="flex w-full items-center gap-3 rounded-xl p-2 text-left transition hover:bg-white/10"
                      >
                        <img
                          src={acc.avatar}
                          alt={acc.name}
                          className="h-7 w-7 rounded-full border border-white/15 object-cover"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-xs font-semibold text-white">{acc.name}</p>
                          <p className="truncate text-[10px] text-zinc-400">{acc.email}</p>
                        </div>
                        <ShieldCheck className="h-4 w-4 text-emerald-400" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="relative my-6 flex items-center justify-center">
            <div className="w-full border-t border-white/10" />
            <span className="absolute bg-[#111116] px-3 text-[11px] uppercase tracking-wider text-zinc-400">
              or sign in with email
            </span>
          </div>

          {/* Email Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1 block text-xs font-medium text-zinc-300">Email Address</label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="h-11 w-full rounded-xl border border-white/10 bg-white/5 pl-10 pr-3 text-xs text-white placeholder:text-zinc-500 transition focus:border-indigo-400/60 focus:bg-white/10 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <div className="mb-1 flex items-center justify-between">
                <label className="text-xs font-medium text-zinc-300">Password</label>
                <span className="text-[11px] text-indigo-400 cursor-pointer hover:underline">
                  Forgot password?
                </span>
              </div>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="h-11 w-full rounded-xl border border-white/10 bg-white/5 pl-10 pr-3 text-xs text-white placeholder:text-zinc-500 transition focus:border-indigo-400/60 focus:bg-white/10 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={authLoading}
              className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 text-xs font-semibold text-white shadow-lg shadow-indigo-600/30 transition hover:bg-indigo-500 active:scale-[0.99] disabled:opacity-50"
            >
              <span>Sign In</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          {/* Quick Demo */}
          <div className="mt-4 flex items-center justify-between">
            <button
              type="button"
              onClick={handleFillDemo}
              className="flex items-center gap-1.5 text-[11px] font-medium text-zinc-300 transition hover:text-indigo-400"
            >
              <Sparkles className="h-3 w-3 text-amber-400" />
              <span>Autofill Demo Account</span>
            </button>
          </div>

          {/* Footer link */}
          <div className="mt-6 border-t border-white/10 pt-4 text-center text-xs text-zinc-400">
            Don't have an account?{' '}
            <Link to="/signup" className="font-semibold text-indigo-400 hover:text-indigo-300 hover:underline">
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
