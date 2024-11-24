# 使用 nginx 作为基础镜像

FROM nginx:latest



# 设置工作目录

WORKDIR /usr/share/nginx/html



# 删除默认的 nginx 静态文件

RUN rm -rf ./*



# 复制前端的所有文件到 nginx 的静态服务目录

COPY . .



# 暴露 nginx 的默认端口

EXPOSE 80



# 启动 nginx

CMD ["nginx", "-g", "daemon off;"]
