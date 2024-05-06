# Commands
# docker build -f Dockerfile -t mealbase-lite .

# Stage 1
# Install dependencies
FROM node:20-alpine AS deps
WORKDIR /app
COPY ./package.json .
RUN npm i

# Stage 2
# Build from source
FROM deps AS builder
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY . .
ENV NEXT_TELEMETRY_DISABLED 1
RUN npm run build

# Stage 3
# Run application
FROM oven/bun:alpine
WORKDIR /app
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
# COPY --from=builder /app/public ./public
RUN mkdir .next
RUN chown nextjs:nodejs .next
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
USER nextjs
EXPOSE 3000
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"
CMD ["bun","server.js"]