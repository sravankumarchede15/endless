import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Info, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';

export default function AuthToast() {
  const { authToast } = useAuth();

  return (
    <div className="fixed bottom-6 right-6 z-50 pointer-events-none">
      <AnimatePresence>
        {authToast && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-2.5 rounded-2xl border border-white/15 bg-zinc-900/95 px-4 py-3 text-xs font-semibold text-white shadow-2xl shadow-black/80 backdrop-blur-xl"
          >
            {authToast.type === 'info' ? (
              <Info className="h-4 w-4 text-sky-400 shrink-0" />
            ) : authToast.type === 'error' ? (
              <AlertCircle className="h-4 w-4 text-rose-400 shrink-0" />
            ) : (
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
            )}
            <span>{authToast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
