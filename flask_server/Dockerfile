# 使用官方 Python 映像檔
FROM python:3.9-slim

# 設定工作目錄
WORKDIR /app

# 複製程式碼到容器內
COPY . /app

# 安裝必要的系統套件和 Python 套件
RUN apt-get update && apt-get install -y \
    ffmpeg \
    libasound2-dev && \
    pip install --no-cache-dir -r requirements.txt

# 暴露 Flask 預設埠
EXPOSE 5000

# 啟動 Flask 應用程式
CMD ["python", "app.py"]

