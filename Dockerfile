# Commands
# docker build -f Dockerfile -t mealbase-lite .
# docker tag mealbase-lite:latest 945603602159.dkr.ecr.us-east-2.amazonaws.com/mealbase-lite:latest
# aws ecr get-login-password --region us-east-2 | docker login --username AWS --password-stdin 945603602159.dkr.ecr.us-east-2.amazonaws.com
# docker push 945603602159.dkr.ecr.us-east-2.amazonaws.com/mealbase-lite:latest
# docker pull 945603602159.dkr.ecr.us-east-2.amazonaws.com/mealbase-lite:latest

FROM node:22-alpine

WORKDIR /app
ENV NODE_ENV=production

# Install build dependencies for bcrypt
RUN apk add --no-cache python3 make g++ bash

# Disable Next.js telemetry
ENV NEXT_TELEMETRY_DISABLED=1

# Add system users
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy necessary application files
COPY ./public ./public
RUN mkdir .next
RUN chown nextjs:nodejs .next
COPY ./.next/standalone ./
RUN rm -rf ./node_modules

# Install bcrypt with pre-built binaries

COPY package.json ./
RUN npm install bcrypt

# Switch to non-root user
USER nextjs

# Expose port 3000
EXPOSE 3000

# Set environment variables for the app
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Start the server
CMD ["node", "server.js"]
