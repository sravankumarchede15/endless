import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    avatar: {
      type: String,
      default: '',
    },
    provider: {
      type: String,
      enum: ['google', 'email'],
      default: 'email',
    },
    googleId: {
      type: String,
      sparse: true,
    },
    passwordHash: {
      type: String,
      select: false,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    interests: {
      type: [String],
      default: ['Tech', 'Gaming', 'Science'],
    },
    watchHistory: [
      {
        videoId: { type: String, required: true },
        title: String,
        category: String,
        watchedAt: { type: Date, default: Date.now },
        durationSeconds: Number,
      },
    ],
    likedVideos: {
      type: [String],
      default: [],
    },
    lastLoginAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret) {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        delete ret.passwordHash;
        return ret;
      },
    },
  }
);

export const User = mongoose.models.User || mongoose.model('User', userSchema);
