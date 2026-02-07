FROM node:20-alpine

WORKDIR /app

# sadece gerekli dosyalar
COPY webhook/package*.json ./
RUN npm ci --omit=dev

COPY webhook/ ./

EXPOSE 9000
CMD ["node", "index.js"]
