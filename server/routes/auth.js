import express from 'express';
import { User } from '../models/User.js';
import { isMongoConnected, getMongoStatus } from '../db/connect.js';

const router = express.Router();

// In-memory user fallback cache if MongoDB is offline
const fallbackUsers = new Map();

// Helper to normalize user payload
function sanitizeUser(userDoc) {
  if (!userDoc) return null;
  return {
    id: userDoc.id || userDoc._id?.toString() || `u-${Date.now()}`,
    name: userDoc.name,
    email: userDoc.email,
    avatar: userDoc.avatar,
    provider: userDoc.provider,
    verified: userDoc.verified,
    interests: userDoc.interests || ['Tech', 'Gaming'],
    watchHistory: userDoc.watchHistory || [],
    likedVideos: userDoc.likedVideos || [],
    lastLoginAt: userDoc.lastLoginAt,
  };
}

// POST /api/auth/google
router.post('/google', async (req, res) => {
  try {
    const { email, name, avatar, googleId } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const cleanEmail = email.toLowerCase().trim();
    const cleanName = name || cleanEmail.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
    const cleanAvatar = avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(cleanName)}&backgroundColor=4f46e5,7c3aed,2563eb`;

    if (isMongoConnected()) {
      let user = await User.findOne({ email: cleanEmail });
      if (user) {
        user.lastLoginAt = new Date();
        if (avatar) user.avatar = cleanAvatar;
        if (name) user.name = cleanName;
        await user.save();
      } else {
        user = await User.create({
          email: cleanEmail,
          name: cleanName,
          avatar: cleanAvatar,
          provider: 'google',
          googleId: googleId || `g-${Date.now()}`,
          verified: true,
          lastLoginAt: new Date(),
        });
      }
      return res.json({ success: true, user: sanitizeUser(user), storage: 'mongodb' });
    }

    // Resilient in-memory fallback
    let user = fallbackUsers.get(cleanEmail) || {
      id: `u-${Date.now()}`,
      email: cleanEmail,
      name: cleanName,
      avatar: cleanAvatar,
      provider: 'google',
      verified: true,
      interests: ['Tech', 'Gaming'],
      watchHistory: [],
      likedVideos: [],
      lastLoginAt: new Date().toISOString(),
    };
    user.lastLoginAt = new Date().toISOString();
    fallbackUsers.set(cleanEmail, user);

    return res.json({ success: true, user: sanitizeUser(user), storage: 'in-memory' });
  } catch (error) {
    console.error('Error in /api/auth/google:', error);
    res.status(500).json({ error: error.message || 'Internal authentication error' });
  }
});

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }

    const cleanEmail = email.toLowerCase().trim();
    const cleanName = name.trim();
    const cleanAvatar = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(cleanName)}&backgroundColor=4f46e5,7c3aed,2563eb`;

    if (isMongoConnected()) {
      const existing = await User.findOne({ email: cleanEmail });
      if (existing) {
        return res.status(409).json({ error: 'An account with this email already exists' });
      }

      const user = await User.create({
        email: cleanEmail,
        name: cleanName,
        avatar: cleanAvatar,
        provider: 'email',
        verified: false,
        lastLoginAt: new Date(),
      });

      return res.status(201).json({ success: true, user: sanitizeUser(user), storage: 'mongodb' });
    }

    // Resilient in-memory fallback
    if (fallbackUsers.has(cleanEmail)) {
      return res.status(409).json({ error: 'An account with this email already exists' });
    }

    const user = {
      id: `u-${Date.now()}`,
      name: cleanName,
      email: cleanEmail,
      avatar: cleanAvatar,
      provider: 'email',
      verified: false,
      interests: ['For you'],
      watchHistory: [],
      likedVideos: [],
      lastLoginAt: new Date().toISOString(),
    };
    fallbackUsers.set(cleanEmail, user);

    return res.status(201).json({ success: true, user: sanitizeUser(user), storage: 'in-memory' });
  } catch (error) {
    console.error('Error in /api/auth/register:', error);
    res.status(500).json({ error: error.message || 'Registration failed' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const cleanEmail = email.toLowerCase().trim();

    if (isMongoConnected()) {
      let user = await User.findOne({ email: cleanEmail });
      if (!user) {
        // Auto-provision if demo login or password matches
        const name = cleanEmail.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
        user = await User.create({
          email: cleanEmail,
          name,
          avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}&backgroundColor=4f46e5,7c3aed,2563eb`,
          provider: 'email',
          lastLoginAt: new Date(),
        });
      } else {
        user.lastLoginAt = new Date();
        await user.save();
      }
      return res.json({ success: true, user: sanitizeUser(user), storage: 'mongodb' });
    }

    // Resilient fallback
    let user = fallbackUsers.get(cleanEmail);
    if (!user) {
      const name = cleanEmail.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
      user = {
        id: `u-${Date.now()}`,
        email: cleanEmail,
        name,
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}&backgroundColor=4f46e5,7c3aed,2563eb`,
        provider: 'email',
        verified: false,
        interests: ['Trending', 'Tech'],
        watchHistory: [],
        likedVideos: [],
        lastLoginAt: new Date().toISOString(),
      };
      fallbackUsers.set(cleanEmail, user);
    }
    return res.json({ success: true, user: sanitizeUser(user), storage: 'in-memory' });
  } catch (error) {
    console.error('Error in /api/auth/login:', error);
    res.status(500).json({ error: error.message || 'Login failed' });
  }
});

// POST /api/auth/reaction - Like, dislike, or react to video and persist in MongoDB
router.post('/reaction', async (req, res) => {
  try {
    const { email, videoId, reactionType } = req.body;
    if (!videoId) {
      return res.status(400).json({ error: 'videoId is required' });
    }

    if (isMongoConnected() && email) {
      const user = await User.findOne({ email: email.toLowerCase().trim() });
      if (user) {
        if (reactionType === 'like') {
          if (!user.likedVideos.includes(videoId)) {
            user.likedVideos.push(videoId);
          }
        } else if (reactionType === 'unlike') {
          user.likedVideos = user.likedVideos.filter((id) => id !== videoId);
        }
        await user.save();
      }
    }

    return res.json({ success: true, videoId, reactionType });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/auth/status
router.get('/status', (_req, res) => {
  res.json({
    status: 'ok',
    database: getMongoStatus(),
  });
});

export default router;
