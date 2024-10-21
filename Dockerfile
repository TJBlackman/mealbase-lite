# Commands
# docker build -f Dockerfile -t mealbase-lite .
# docker tag mealbase-lite:latest 945603602159.dkr.ecr.us-east-2.amazonaws.com/mealbase-lite:latest
# aws ecr get-login-password --region us-east-2 | docker login --username AWS --password-stdin 945603602159.dkr.ecr.us-east-2.amazonaws.com
# docker push 945603602159.dkr.ecr.us-east-2.amazonaws.com/mealbase-lite:latest

# Stage 3
# Run application
FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
COPY ./public ./public
RUN mkdir .next
RUN chown nextjs:nodejs .next
COPY ./.next/standalone ./
COPY ./.next/static ./.next/static
USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
CMD ["node","server.js"]