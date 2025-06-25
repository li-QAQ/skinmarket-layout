# 建置階段：使用官方 Node.js 22 (Alpine) 作為基底映像
FROM node:22-alpine AS builder

# 建立應用目錄並設定權限
WORKDIR /app
RUN mkdir -p /app && chown -R node:node /app

# 切換為非特權用戶進行構建
USER node

# 複製相依說明檔並安裝（只安裝 production 相依）
COPY --chown=node:node package.json package-lock.json ./
RUN npm ci --omit=dev --ignore-scripts

# 複製專案原始碼並進行編譯
COPY --chown=node:node . .

# 傳入建置用的環境變數，這裡只用 ARG 就足夠了
ARG NODE_ENV=production

ARG NEXT_PUBLIC_API_BASE_URL
ARG NEXT_PUBLIC_IMG_URL

RUN npm run build

# 最終執行階段：使用 Distroless 極簡 Node.js 映像
FROM gcr.io/distroless/nodejs22-debian12 AS production

# 設定工作目錄
WORKDIR /app

# 從 builder 複製必要的檔案到最終映像
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
# 如有 Next.js 設定檔，將其複製
COPY --from=builder /app/next.config.mjs ./next.config.mjs

# 設定運行時環境變數（僅限 Node.js server-side 部分，如 SSR 或 API routes）
ENV NODE_ENV=production 
ENV PORT=3000

# 開放應用埠
EXPOSE 3000

# 啟動應用（直接使用 Next.js 啟動腳本）
CMD ["./node_modules/next/dist/bin/next", "start"]
