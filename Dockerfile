# Use official Node.js LTS image
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

# Build frontend
RUN npm run build

# Production runtime stage
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=4000

COPY package*.json ./
RUN npm ci --omit=dev

# Copy built frontend and server code
COPY --from=builder /app/client/dist ./client/dist
COPY --from=builder /app/server ./server

EXPOSE 4000

CMD ["npm", "start"]
