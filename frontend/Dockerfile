# 使用 nginx 作為基礎鏡像
FROM nginx:latest

# 設定工作目錄
WORKDIR /usr/share/nginx/html

# 刪除預設的 nginx 靜態文件
RUN rm -rf ./*

# 複製前端的所有文件到 nginx 的靜態服務目錄
COPY . .

# 開放 nginx 的預設端口
EXPOSE 80

# 啟動 nginx
CMD ["nginx", "-g", "daemon off;"]
