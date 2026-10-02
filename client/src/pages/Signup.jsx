import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import GoogleIcon from '../components/auth/GoogleIcon.jsx';
import { useAuth, DEMO_GOOGLE_USERS } from '../context/AuthContext.jsx';
import Logo from '../components/layout/Logo.jsx';

export default function Signup() {
  const { loginWithGoogle, registerWithEmail, authLoading } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await registerWithEmail({ name, email, password });
      navigate('/');
    } catch (err) {
      setError(err.message || 'Signup failed');
    }
  };

  const handleGoogleLogin = async (acc) => {
    try {
      await loginWithGoogle(acc);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Google signup failed');
    }
  };

  return (
    <div className="mx-auto flex min-h-[calc(100vh-12rem)] max-w-5xl items-center justify-center py-8">
      <div className="grid w-full max-w-4xl grid-cols-1 overflow-hidden rounded-3xl border border-white/10 bg-[#111116] shadow-2xl lg:grid-cols-2">
        {/* Left Brand Showcase */}
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
                <Sparkles className="h-3.5 w-3.5" /> Infinite Discovery
              </span>
              <h1 className="text-3xl font-extrabold tracking-tight text-white">
                Join the future of<br />
                <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
                  frictionless streaming.
                </span>
              </h1>
              <p className="text-sm leading-relaxed text-zinc-400">
                Create an account to keep your preferences saved, explore high-throughput recommendations, and benchmark feed latency in real-time.
              </p>
            </div>
          </div>

          <div className="relative space-y-3 border-t border-white/10 pt-6">
            <div className="flex items-center gap-3 text-xs text-zinc-300">
              <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>Instant 1-click Google integration</span>
            </div>
          </div>
        </div>

        {/* Right Signup Form */}
        <div className="p-8 sm:p-10">
          <div className="mb-6">
            <h2 className="text-2xl font-bold tracking-tight text-white">Create your account</h2>
            <p className="mt-1 text-xs text-zinc-400">Get started in seconds with Google or email</p>
          </div>

          {error && (
            <div className="mb-4 rounded-xl border border-rose-500/20 bg-rose-500/10 p-3 text-xs text-rose-300">
              {error}
            </div>
          )}

          {/* Google Sign In */}
          <button
            type="button"
            id="page-signup-google"
            disabled={authLoading}
            onClick={() => handleGoogleLogin(DEMO_GOOGLE_USERS[0])}
            className="group flex w-full items-center justify-center gap-3 rounded-2xl border border-white/15 bg-white/10 px-4 py-3.5 text-sm font-semibold text-white shadow-lg transition-all hover:border-indigo-400/50 hover:bg-white/[0.14] active:scale-[0.99] disabled:opacity-50"
          >
            <GoogleIcon className="h-5 w-5 shrink-0 transition-transform group-hover:scale-110" />
            <span>Continue with Google</span>
          </button>

          {/* Divider */}
          <div className="relative my-6 flex items-center justify-center">
            <div className="w-full border-t border-white/10" />
            <span className="absolute bg-[#111116] px-3 text-[11px] uppercase tracking-wider text-zinc-400">
              or sign up with email
            </span>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1 block text-xs font-medium text-zinc-300">Full Name</label>
              <div className="relative">
                <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Alex Rivera"
                  className="h-11 w-full rounded-xl border border-white/10 bg-white/5 pl-10 pr-3 text-xs text-white placeholder:text-zinc-500 transition focus:border-indigo-400/60 focus:bg-white/10 focus:outline-none"
                />
              </div>
            </div>

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
              <label className="mb-1 block text-xs font-medium text-zinc-300">Password</label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a password"
                  className="h-11 w-full rounded-xl border border-white/10 bg-white/5 pl-10 pr-3 text-xs text-white placeholder:text-zinc-500 transition focus:border-indigo-400/60 focus:bg-white/10 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={authLoading}
              className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 text-xs font-semibold text-white shadow-lg shadow-indigo-600/30 transition hover:bg-indigo-500 active:scale-[0.99] disabled:opacity-50"
            >
              <span>Create Account</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          {/* Footer link */}
          <div className="mt-6 border-t border-white/10 pt-4 text-center text-xs text-zinc-400">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-indigo-400 hover:text-indigo-300 hover:underline">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
