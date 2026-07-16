# --- build stage ---
FROM node:22-alpine AS build
WORKDIR /app

COPY package.json ./
COPY package-lock.json* ./

RUN npm install --legacy-peer-deps

COPY . .
RUN npm run build

# --- runtime stage ---
FROM node:22-alpine AS runtime
WORKDIR /app

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=8080

COPY --from=build /app/.output ./.output

EXPOSE 8080
CMD ["node", ".output/server/index.mjs"]
