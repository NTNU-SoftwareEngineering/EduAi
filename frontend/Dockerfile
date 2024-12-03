# 使用 Node.js 作為基礎鏡像
FROM node:23-alpine

# 設定工作目錄
WORKDIR /usr/src/app

# 复制 package.json 和 package-lock.json
COPY package*.json ./

# 安装前端依赖
RUN npm install

# 复制剩余的前端代码
COPY . .

EXPOSE 8081

CMD node index.js
