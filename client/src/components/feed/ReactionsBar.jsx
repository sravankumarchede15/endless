import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ThumbsUp, ThumbsDown, Flame, Heart, Sparkles, Smile, Share2, Bookmark } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';

const DEFAULT_REACTIONS = [
  { id: 'fire', emoji: '🔥', label: 'Fire', count: 142 },
  { id: 'heart', emoji: '❤️', label: 'Love', count: 89 },
  { id: 'mindblown', emoji: '🚀', label: 'Hype', count: 64 },
  { id: 'clap', emoji: '👏', label: 'Clap', count: 53 },
  { id: 'smart', emoji: '💡', label: 'Smart', count: 37 },
];

export default function ReactionsBar({ videoId, initialLikes = 450 }) {
  const { user } = useAuth();
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [reactions, setReactions] = useState(DEFAULT_REACTIONS);
  const [floatingEmojis, setFloatingEmojis] = useState([]);
  const [copied, setCopied] = useState(false);

  const triggerReaction = async (reactionId, emoji) => {
    // Add floating emoji animation
    const newId = Date.now() + Math.random();
    setFloatingEmojis((prev) => [
      ...prev,
      { id: newId, emoji, x: (Math.random() - 0.5) * 60 },
    ]);

    setTimeout(() => {
      setFloatingEmojis((prev) => prev.filter((item) => item.id !== newId));
    }, 1200);

    // Update count
    setReactions((prev) =>
      prev.map((r) => (r.id === reactionId ? { ...r, count: r.count + 1, active: true } : r))
    );

    // Send to backend API
    try {
      await fetch('/api/auth/reaction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user?.email,
          videoId,
          reactionType: reactionId,
        }),
      });
    } catch {
      // offline fallback
    }
  };

  const toggleLike = async () => {
    const nextState = !liked;
    setLiked(nextState);
    if (disliked) setDisliked(false);

    if (nextState) {
      triggerReaction('fire', '🔥');
    }

    try {
      await fetch('/api/auth/reaction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user?.email,
          videoId,
          reactionType: nextState ? 'like' : 'unlike',
        }),
      });
    } catch {
      /* offline */
    }
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative mt-4 space-y-3">
      {/* Floating Burst Container */}
      <div className="pointer-events-none absolute -top-12 left-1/2 -translate-x-1/2 z-30 h-16 w-32 overflow-visible">
        <AnimatePresence>
          {floatingEmojis.map((item) => (
            <motion.span
              key={item.id}
              initial={{ opacity: 1, y: 0, scale: 0.8, x: item.x }}
              animate={{ opacity: 0, y: -65, scale: 1.4 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="absolute text-2xl"
            >
              {item.emoji}
            </motion.span>
          ))}
        </AnimatePresence>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Like / Dislike Pill */}
        <div className="flex items-center rounded-full border border-white/10 bg-white/5 p-1">
          <button
            onClick={toggleLike}
            aria-label="Like video"
            className={`flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
              liked
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-zinc-300 hover:bg-white/10 hover:text-white'
            }`}
          >
            <ThumbsUp className={`h-4 w-4 ${liked ? 'fill-current' : ''}`} />
            <span>{(initialLikes + (liked ? 1 : 0)).toLocaleString()}</span>
          </button>
          <div className="h-4 w-[1px] bg-white/10 mx-1" />
          <button
            onClick={() => {
              setDisliked(!disliked);
              if (liked) setLiked(false);
            }}
            aria-label="Dislike video"
            className={`rounded-full p-1.5 text-xs transition ${
              disliked ? 'text-rose-400 bg-rose-500/10' : 'text-zinc-400 hover:bg-white/10 hover:text-white'
            }`}
          >
            <ThumbsDown className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Live Reaction Emojis with Counter */}
        <div className="flex items-center gap-1.5 overflow-x-auto rounded-full border border-white/10 bg-white/[0.03] p-1">
          {reactions.map((r) => (
            <button
              key={r.id}
              onClick={() => triggerReaction(r.id, r.emoji)}
              className="group flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium text-zinc-300 transition hover:bg-white/10 active:scale-125"
              title={`React with ${r.label}`}
            >
              <span className="transition-transform group-hover:scale-125">{r.emoji}</span>
              <span className="text-[11px] text-zinc-400 group-hover:text-zinc-200">{r.count}</span>
            </button>
          ))}
        </div>

        {/* Action buttons (Share & Bookmark) */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setBookmarked(!bookmarked)}
            className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition ${
              bookmarked
                ? 'border-indigo-400/50 bg-indigo-500/20 text-indigo-300'
                : 'border-white/10 bg-white/5 text-zinc-300 hover:bg-white/10 hover:text-white'
            }`}
          >
            <Bookmark className={`h-3.5 w-3.5 ${bookmarked ? 'fill-current' : ''}`} />
            <span>{bookmarked ? 'Saved' : 'Save'}</span>
          </button>

          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-zinc-300 transition hover:bg-white/10 hover:text-white"
          >
            <Share2 className="h-3.5 w-3.5" />
            <span>{copied ? 'Link Copied!' : 'Share'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
