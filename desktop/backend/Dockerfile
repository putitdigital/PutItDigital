FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci

FROM node:18-alpine

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY package*.json ./
COPY src ./src

EXPOSE 5000

CMD ["npm", "start"]
