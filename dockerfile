FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
COPY node_modules ./node_modules

COPY . .

RUN npx prisma generate

EXPOSE 3000

CMD ["node", "server.js"]