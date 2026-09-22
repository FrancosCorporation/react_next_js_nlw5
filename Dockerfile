FROM node:16-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci 2>/dev/null || npm install --legacy-peer-deps
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app ./
EXPOSE 3000
CMD ["npx", "next", "start", "-p", "3000"]
