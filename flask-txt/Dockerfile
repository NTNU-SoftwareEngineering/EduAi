# Dockerfile 範例
FROM python:3.9-slim

# 設定工作目錄
WORKDIR /app

# 複製需求檔案
COPY requirements.txt /app/

# 安裝依賴
RUN pip install --no-cache-dir -r requirements.txt

# 複製應用程式檔案
COPY . /app/

# 啟動 Flask 應用
CMD ["python", "app.py"]