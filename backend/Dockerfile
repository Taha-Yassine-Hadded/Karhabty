FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

# Install curl for health checks
RUN apk add --no-cache curl

FROM node:18-alpine

WORKDIR /app

COPY --from=builder /app .

EXPOSE 5000

CMD ["node", "server.js"]