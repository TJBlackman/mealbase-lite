FROM node:16
WORKDIR /usr/app
COPY . .
RUN npm install
RUN npm run build
WORKDIR /usr/app/dist
ENV NODE_ENV=production
EXPOSE 3050
CMD node index.js