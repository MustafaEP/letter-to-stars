FROM node:20-alpine

WORKDIR /app

# deploy.sh requirements
# - bash: script shebang
# - git: pull/reset
# - curl: health checks
# - util-linux: flock
# - docker-cli + docker-cli-compose: run docker compose / docker exec via host socket
RUN apk add --no-cache bash git curl util-linux docker-cli docker-cli-compose

# sadece gerekli dosyalar
COPY webhook/package*.json ./
RUN npm ci --omit=dev

COPY webhook/ ./

EXPOSE 9000
CMD ["node", "index.js"]
