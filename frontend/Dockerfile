# 使用 Node.js 作為基礎鏡像
FROM node:23-alpine

# 設定工作目錄
WORKDIR /usr/src/app

# 复制 package.json 和 package-lock.json
COPY package*.json ./

# 安裝前端依賴
RUN npm install

# 复制剩余的前端代码
COPY . .

EXPOSE 3000

CMD node index.js
