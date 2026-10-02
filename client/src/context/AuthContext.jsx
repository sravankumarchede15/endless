import { createContext, useContext, useEffect, useState, useCallback } from 'react';

const AuthContext = createContext(null);
const USER_KEY = 'endless_auth_user';

export const DEMO_GOOGLE_USERS = [
  {
    id: 'g-alex-8821',
    name: 'Alex Rivera',
    email: 'alex.rivera@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=160&q=80',
    provider: 'google',
    verified: true,
    interests: ['Tech', 'Gaming', 'Science'],
  },
  {
    id: 'g-sophia-3914',
    name: 'Sophia Chen',
    email: 'sophia.chen@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=160&q=80',
    provider: 'google',
    verified: true,
    interests: ['Music', 'Travel', 'Cooking'],
  },
  {
    id: 'g-marcus-7729',
    name: 'Marcus Vance',
    email: 'marcus.vance@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=160&q=80',
    provider: 'google',
    verified: true,
    interests: ['Fitness', 'Tech', 'Comedy'],
  },
];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem(USER_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalView, setModalView] = useState('signin'); // 'signin' | 'signup' | 'google-picker'
  const [authLoading, setAuthLoading] = useState(false);
  const [authToast, setAuthToast] = useState(null);

  useEffect(() => {
    if (authToast) {
      const t = setTimeout(() => setAuthToast(null), 4000);
      return () => clearTimeout(t);
    }
  }, [authToast]);

  const showToast = useCallback((msg, type = 'success') => {
    setAuthToast({ message: msg, type, id: Date.now() });
  }, []);

  const openAuthModal = useCallback((view = 'signin') => {
    setModalView(view);
    setIsModalOpen(true);
  }, []);

  const closeAuthModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const saveUser = useCallback((userData) => {
    setUser(userData);
    try {
      localStorage.setItem(USER_KEY, JSON.stringify(userData));
    } catch (e) {
      console.warn('Could not save user to localStorage', e);
    }
  }, []);

  const loginWithGoogle = useCallback(async (accountOrEmail = {}) => {
    setAuthLoading(true);
    let email = typeof accountOrEmail === 'string' ? accountOrEmail : accountOrEmail.email;
    if (!email || !email.trim()) email = 'user@gmail.com';
    email = email.trim();

    let name = typeof accountOrEmail === 'object' && accountOrEmail.name ? accountOrEmail.name : '';
    if (!name) name = email.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

    const avatar = typeof accountOrEmail === 'object' && accountOrEmail.avatar
      ? accountOrEmail.avatar
      : `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}&backgroundColor=4f46e5,7c3aed,2563eb`;

    let googleUser = {
      id: (typeof accountOrEmail === 'object' && accountOrEmail.id) || `g-${Date.now()}`,
      name,
      email,
      avatar,
      provider: 'google',
      verified: true,
      joinedAt: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      interests: (typeof accountOrEmail === 'object' && accountOrEmail.interests) || ['Tech', 'Gaming'],
    };

    try {
      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name, avatar }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.user) googleUser = { ...googleUser, ...data.user };
      }
    } catch {
      // Offline / fallback mode
    }

    saveUser(googleUser);
    setAuthLoading(false);
    setIsModalOpen(false);
    showToast(`Signed in as ${googleUser.email} with Google`);
    return googleUser;
  }, [saveUser, showToast]);

  const loginWithEmail = useCallback(async ({ email, password }) => {
    setAuthLoading(true);
    if (!email || !password) {
      setAuthLoading(false);
      throw new Error('Please provide both email and password');
    }

    const name = email.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
    let emailUser = {
      id: `u-${Date.now()}`,
      name,
      email,
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`,
      provider: 'email',
      verified: false,
      joinedAt: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      interests: ['Trending', 'Tech'],
    };

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.user) emailUser = { ...emailUser, ...data.user };
      }
    } catch {
      // Offline / fallback mode
    }

    saveUser(emailUser);
    setAuthLoading(false);
    setIsModalOpen(false);
    showToast(`Welcome back, ${emailUser.name}!`);
    return emailUser;
  }, [saveUser, showToast]);

  const registerWithEmail = useCallback(async ({ name, email, password }) => {
    setAuthLoading(true);
    if (!name || !email || !password) {
      setAuthLoading(false);
      throw new Error('Please fill in all required fields');
    }

    let newUser = {
      id: `u-${Date.now()}`,
      name,
      email,
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`,
      provider: 'email',
      verified: false,
      joinedAt: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      interests: ['For you'],
    };

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.user) newUser = { ...newUser, ...data.user };
      }
    } catch {
      // Offline / fallback mode
    }

    saveUser(newUser);
    setAuthLoading(false);
    setIsModalOpen(false);
    showToast(`Account created! Welcome, ${newUser.name}`);
    return newUser;
  }, [saveUser, showToast]);

  const logout = useCallback(() => {

    setUser(null);
    try {
      localStorage.removeItem(USER_KEY);
    } catch {
      /* ignore */
    }
    showToast('Signed out of Endless', 'info');
  }, [showToast]);

  const value = {
    user,
    isAuthenticated: !!user,
    isModalOpen,
    modalView,
    setModalView,
    openAuthModal,
    closeAuthModal,
    loginWithGoogle,
    loginWithEmail,
    registerWithEmail,
    logout,
    authLoading,
    authToast,
    showToast,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
