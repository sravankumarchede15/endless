import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, User, ArrowRight, ShieldCheck, Sparkles, ExternalLink, ChevronRight } from 'lucide-react';
import GoogleIcon from './GoogleIcon.jsx';
import { useAuth, DEMO_GOOGLE_USERS } from '../../context/AuthContext.jsx';
import Logo from '../layout/Logo.jsx';

export default function AuthModal() {
  const {
    isModalOpen,
    closeAuthModal,
    modalView,
    setModalView,
    loginWithGoogle,
    loginWithEmail,
    registerWithEmail,
    authLoading,
  } = useAuth();

  const navigate = useNavigate();

  const [googleCustomEmail, setGoogleCustomEmail] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [showGoogleInput, setShowGoogleInput] = useState(false);
  const [showDemoPickers, setShowDemoPickers] = useState(false);

  useEffect(() => {
    if (isModalOpen) {
      setError('');
      setShowGoogleInput(false);
      setShowDemoPickers(false);
    }
  }, [isModalOpen, modalView]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isModalOpen) {
        closeAuthModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen, closeAuthModal]);

  if (!isModalOpen) return null;

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (modalView === 'signup') {
        await registerWithEmail({ name, email, password });
      } else {
        await loginWithEmail({ email, password });
      }
    } catch (err) {
      setError(err.message || 'Authentication failed. Please check your credentials.');
    }
  };

  const handleCustomGoogleSubmit = async (e) => {
    e.preventDefault();
    if (!googleCustomEmail.trim()) {
      setError('Please enter your Google email address');
      return;
    }
    setError('');
    try {
      await loginWithGoogle(googleCustomEmail.trim());
    } catch (err) {
      setError(err.message || 'Google sign-in failed.');
    }
  };

  const handleGoogleSelect = async (account) => {
    try {
      await loginWithGoogle(account);
    } catch (err) {
      setError(err.message || 'Google sign-in failed.');
    }
  };

  const handleQuickDemo = async () => {
    setEmail('developer@endless.io');
    setPassword('demo-password123');
    try {
      await loginWithEmail({ email: 'developer@endless.io', password: 'demo-password123' });
    } catch (err) {
      setError(err.message);
    }
  };

  const openFullPage = (path) => {
    closeAuthModal();
    navigate(path);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={closeAuthModal}
          className="fixed inset-0 bg-black/75 backdrop-blur-md"
          aria-hidden="true"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-[#121216] p-6 sm:p-8 shadow-2xl shadow-indigo-950/40 text-fg"
          role="dialog"
          aria-modal="true"
          aria-labelledby="auth-modal-title"
        >
          {/* Ambient Glows */}
          <div className="pointer-events-none absolute -left-20 -top-20 h-48 w-48 rounded-full bg-indigo-500/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -right-20 h-48 w-48 rounded-full bg-violet-500/20 blur-3xl" />

          {/* Close Button */}
          <button
            onClick={closeAuthModal}
            aria-label="Close modal"
            className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-zinc-400 transition hover:border-white/20 hover:bg-white/10 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>

          {/* Header */}
          <div className="relative mb-6 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-500/20 to-violet-500/20 ring-1 ring-white/10">
              <Logo />
            </div>
            <h2 id="auth-modal-title" className="text-2xl font-bold tracking-tight text-white">
              {modalView === 'signup' ? 'Join Endless' : 'Welcome to Endless'}
            </h2>
            <p className="mt-1 text-xs text-zinc-400">
              {modalView === 'signup'
                ? 'Unlock personalized recommendations & session streaming'
                : 'Sign in to access your continuous personalized feed'}
            </p>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mb-4 rounded-xl border border-rose-500/20 bg-rose-500/10 p-3 text-xs text-rose-300">
              {error}
            </div>
          )}

          {/* Google Sign-In Primary Section */}
          <div className="space-y-2.5">
            {!showGoogleInput ? (
              <button
                type="button"
                id="btn-continue-google"
                disabled={authLoading}
                onClick={() => setShowGoogleInput(true)}
                className="group relative flex w-full items-center justify-center gap-3 rounded-2xl border border-white/15 bg-white/10 px-4 py-3.5 text-sm font-semibold text-white shadow-lg transition-all hover:border-indigo-400/50 hover:bg-white/[0.14] hover:shadow-indigo-500/10 active:scale-[0.99] disabled:opacity-50"
              >
                <GoogleIcon className="h-5 w-5 shrink-0 transition-transform group-hover:scale-110" />
                <span>Continue with Google</span>
                <ChevronRight className="h-4 w-4 text-zinc-400 transition-transform group-hover:translate-x-0.5" />
              </button>
            ) : (
              <form onSubmit={handleCustomGoogleSubmit} className="space-y-3 rounded-2xl border border-indigo-500/30 bg-indigo-950/20 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <GoogleIcon className="h-4 w-4" />
                    <span className="text-xs font-semibold text-white">Sign in with your Google Mail</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowGoogleInput(false)}
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
                    autoFocus
                    value={googleCustomEmail}
                    onChange={(e) => setGoogleCustomEmail(e.target.value)}
                    placeholder="your.email@gmail.com"
                    className="h-10 w-full rounded-xl border border-white/15 bg-black/40 pl-10 pr-3 text-xs text-white placeholder:text-zinc-500 transition focus:border-indigo-400 focus:bg-black/60 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={authLoading || !googleCustomEmail.trim()}
                  className="flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-white px-4 text-xs font-bold text-black shadow-lg transition hover:bg-zinc-100 active:scale-[0.99] disabled:opacity-50"
                >
                  <GoogleIcon className="h-4 w-4" />
                  <span>Continue with {googleCustomEmail.trim() ? googleCustomEmail.trim() : 'Google'}</span>
                  {authLoading && <span className="h-3 w-3 animate-spin rounded-full border-2 border-black border-t-transparent" />}
                </button>
              </form>
            )}

            {/* Quick Demo Google Accounts Accordion */}
            <div className="flex items-center justify-between px-1 text-[11px]">
              <button
                type="button"
                onClick={() => setShowDemoPickers(!showDemoPickers)}
                className="text-indigo-400 transition hover:text-indigo-300 hover:underline"
              >
                {showDemoPickers ? 'Hide sample accounts' : 'Or choose sample Google account'}
              </button>
              <span className="flex items-center gap-1 text-zinc-400">
                <ShieldCheck className="h-3 w-3 text-emerald-400" /> Instant Auth
              </span>
            </div>

            {showDemoPickers && (
              <div className="space-y-1.5 rounded-2xl border border-white/10 bg-white/[0.03] p-2.5">
                {DEMO_GOOGLE_USERS.map((acc) => (
                  <button
                    key={acc.id}
                    type="button"
                    onClick={() => handleGoogleSelect(acc)}
                    disabled={authLoading}
                    className="flex w-full items-center gap-2.5 rounded-xl p-2 text-left transition hover:bg-white/10"
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
                    <span className="text-[10px] text-indigo-400">Select</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="relative my-5 flex items-center justify-center">
            <div className="w-full border-t border-white/10" />
            <span className="absolute bg-[#121216] px-3 text-[11px] uppercase tracking-wider text-zinc-400">
              or sign in with password
            </span>
          </div>

          {/* Form */}
          <form onSubmit={handleEmailSubmit} className="space-y-3">
            {modalView === 'signup' && (
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-300">Full Name</label>
                <div className="relative">
                  <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Jordan Lee"
                    className="h-10 w-full rounded-xl border border-white/10 bg-white/5 pl-10 pr-3 text-xs text-white placeholder:text-zinc-500 transition focus:border-indigo-400/60 focus:bg-white/10 focus:outline-none"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="mb-1 block text-xs font-medium text-zinc-300">Your Email Address</label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@yourdomain.com"
                  className="h-10 w-full rounded-xl border border-white/10 bg-white/5 pl-10 pr-3 text-xs text-white placeholder:text-zinc-500 transition focus:border-indigo-400/60 focus:bg-white/10 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <div className="mb-1 flex items-center justify-between">
                <label className="text-xs font-medium text-zinc-300">Password</label>
                {modalView === 'signin' && (
                  <span className="text-[11px] text-indigo-400 cursor-pointer hover:underline">
                    Forgot password?
                  </span>
                )}
              </div>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="h-10 w-full rounded-xl border border-white/10 bg-white/5 pl-10 pr-3 text-xs text-white placeholder:text-zinc-500 transition focus:border-indigo-400/60 focus:bg-white/10 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={authLoading}
              className="mt-2 flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 text-xs font-semibold text-white shadow-lg shadow-indigo-600/30 transition hover:bg-indigo-500 active:scale-[0.99] disabled:opacity-50"
            >
              <span>{modalView === 'signup' ? 'Create Account' : 'Sign In with Email'}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </form>

          {/* Quick Demo Shortcut */}
          <div className="mt-3 flex items-center justify-between pt-1">
            <button
              type="button"
              onClick={handleQuickDemo}
              className="flex items-center gap-1.5 text-[11px] font-medium text-zinc-300 transition hover:text-indigo-400"
            >
              <Sparkles className="h-3 w-3 text-amber-400" />
              <span>Fill Quick Demo Account</span>
            </button>

            <button
              type="button"
              onClick={() => openFullPage(modalView === 'signup' ? '/signup' : '/login')}
              className="flex items-center gap-1 text-[11px] text-zinc-400 transition hover:text-white"
            >
              <span>Open full page</span>
              <ExternalLink className="h-3 w-3" />
            </button>
          </div>

          {/* Footer View Switcher */}
          <div className="mt-5 border-t border-white/10 pt-4 text-center text-xs text-zinc-400">
            {modalView === 'signup' ? (
              <p>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => setModalView('signin')}
                  className="font-semibold text-indigo-400 transition hover:text-indigo-300 hover:underline"
                >
                  Sign in
                </button>
              </p>
            ) : (
              <p>
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => setModalView('signup')}
                  className="font-semibold text-indigo-400 transition hover:text-indigo-300 hover:underline"
                >
                  Sign up
                </button>
              </p>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
