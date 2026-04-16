# Copyright © Sabarna Barik 
# 
# This code is open-source for **educational and non-commercial purposes only**.
# 
# You may:
# - Read, study, and learn from this code.
# - Modify or experiment with it for personal learning.
# 
# You may NOT:
# - Claim this code as your own.
# - Use this code in commercial projects or for profit without written permission.
# - Distribute this code as your own work.
# 
# If you use or adapt this code, you **must give credit** to the original author: Sabarna Barik
# For commercial use or special permissions, contact: sabarnabarik@gmail.com
# 
# # Copyright © 2026 Sabarna Barik
# # Non-commercial use only. Credit required if used.
# 
# License:
# This project is open-source for learning only.
# Commercial use is prohibited.
# Credit is required if you use any part of this code.

# Stage 1: Build & Dependencies
FROM node:20-slim AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev

# Stage 2: Final Runtime
FROM node:20-slim
WORKDIR /app

# Non-root security
RUN groupadd -r nodejs && useradd -r -g nodejs nodejs && \
    mkdir -p /app && chown -R nodejs:nodejs /app
USER nodejs

COPY --from=builder --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --chown=nodejs:nodejs . .

ENV NODE_ENV=production
ENV PORT=8080
EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=3s \
  CMD node -e "fetch('http://localhost:8080/health').then(r => r.ok ? process.exit(0) : process.exit(1))"

CMD ["node", "server.js"]
