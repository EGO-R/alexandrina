FROM node:20-alpine AS base

# Увеличиваем размер доступной памяти для Node.js
ENV NODE_OPTIONS="--max-old-space-size=4096"

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./
# Устанавливаем зависимости с пропуском проверок целостности для избежания проблем в Docker
RUN npm ci --no-audit --no-fund --ignore-scripts

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Environment variables must be present at build time
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_GOOGLE_CLIENT_ID
ARG NEXT_PUBLIC_S3_BASE_URL
ARG NEXT_PUBLIC_S3_BUCKET

ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
ENV NEXT_PUBLIC_GOOGLE_CLIENT_ID=${NEXT_PUBLIC_GOOGLE_CLIENT_ID}
ENV NEXT_PUBLIC_S3_BASE_URL=${NEXT_PUBLIC_S3_BASE_URL}
ENV NEXT_PUBLIC_S3_BUCKET=${NEXT_PUBLIC_S3_BUCKET}

# Build Next.js application
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

# Create a non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

# Copy necessary files from builder
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Expose the listening port
EXPOSE 3000

# Run the application
CMD ["node", "server.js"] 