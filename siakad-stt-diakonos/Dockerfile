# ============================================
# BASE — dipakai semua stage: Chromium (puppeteer) + OpenSSL (prisma)
# ============================================
FROM node:20-slim AS base
RUN apt-get update -y && apt-get install -y --no-install-recommends \
    openssl \
    chromium \
    ca-certificates \
    fonts-liberation \
    && rm -rf /var/lib/apt/lists/*
ENV PUPPETEER_SKIP_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

# ============================================
# BUILD FRONTEND
# ============================================
FROM base AS frontend-build
WORKDIR /frontend
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci
COPY frontend/ .
ARG NEXT_PUBLIC_API_BASE_URL
ARG NEXT_PUBLIC_APP_URL
ARG NEXT_PUBLIC_RECAPTCHA_SITE_KEY
ENV NEXT_PUBLIC_API_BASE_URL=$NEXT_PUBLIC_API_BASE_URL
ENV NEXT_PUBLIC_APP_URL=$NEXT_PUBLIC_APP_URL
ENV NEXT_PUBLIC_RECAPTCHA_SITE_KEY=$NEXT_PUBLIC_RECAPTCHA_SITE_KEY
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build
# devDependencies frontend (tailwind, eslint, typescript) aman dibuang —
# gak ada satupun yang dipanggil lagi setelah build selesai
RUN npm prune --omit=dev

# ============================================
# BUILD BACKEND
# ============================================
FROM base AS backend-build
WORKDIR /backend
COPY backend/package.json backend/package-lock.json ./
RUN npm ci
COPY backend/ .
ENV DATABASE_URL="mysql://user:pass@localhost:3306/placeholder"
RUN npx prisma generate
RUN npm run build
# CATATAN: backend SENGAJA TIDAK di-prune (beda dari frontend).
# Paket `prisma` (CLI) ada di devDependencies, tapi tetep kepake tiap
# container start buat `prisma migrate deploy`. Kalau di-prune, command
# itu bakal coba download prisma CLI dari internet tiap restart —
# lambat dan bisa gagal kalau jaringan VPS lagi bermasalah pas nyala.

# ============================================
# RUNTIME — susun ulang jadi monolith: backend/ dan frontend/ sejajar,
# PERSIS strukturnya kayak lokal, soalnya server.ts kamu manggil
# path.join(__dirname, '../../frontend') buat nemuin project Next.js
# ============================================
FROM base AS runner
ENV NODE_ENV=production
WORKDIR /app

COPY --from=backend-build /backend/node_modules ./backend/node_modules
COPY --from=backend-build /backend/dist ./backend/dist
COPY --from=backend-build /backend/prisma ./backend/prisma
COPY --from=backend-build /backend/package.json ./backend/package.json

COPY --from=frontend-build /frontend/node_modules ./frontend/node_modules
COPY --from=frontend-build /frontend/.next ./frontend/.next
COPY --from=frontend-build /frontend/public ./frontend/public
COPY --from=frontend-build /frontend/package.json ./frontend/package.json
COPY --from=frontend-build /frontend/next.config.ts ./frontend/next.config.ts

WORKDIR /app/backend
EXPOSE 5000
CMD ["sh", "-c", "npx prisma migrate deploy && npm start"]