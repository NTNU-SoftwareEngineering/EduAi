# 項目名稱：Moodle Docker 開發環境

## 簡介
此專案使用 Docker 來搭建WSL上 Moodle 的開發環境。通過 Docker，開發人員可以輕鬆構建並運行所需的服務，包括前端、後端和資料庫，確保每個成員的開發環境一致，減少因環境差異引起的問題。

## 先決條件
在開始之前，請確保你的本地環境已經滿足以下條件：
- 安裝 Docker 和 Docker Compose 在WSL裡面
```bash
docker --version #測試docker版本
docker-compose --version #測試docker compose版本
```

## 開發環境結構
此專案使用 Docker Compose 來管理多個容器：
- **moodle-frontend**：Moodle 前端服務
- **moodle-backend**：Moodle 後端服務 (PHP + Apache)
- **moodle-db-backup**：MySQL 資料庫服務

## 快速開始

### 1. 克隆專案倉庫
```bash
git clone https://github.com/NTNU-SoftwareEngineering/backend.git
```
### 2. 環境變數
一些環境變數和資料庫帳密在
moodle-backend/config.php

### 3. 構建 Docker 容器
使用以下指令來構建前端、後端和資料庫的 Docker 容器：
```bash
docker-compose build
```

### 4. 啟動開發環境
構建完成後，使用以下指令來啟動容器：
```bash
docker-compose up -d
```

這個指令會啟動前端、後端和資料庫服務，並在本地運行你的 Moodle 開發環境。
你可以在瀏覽器中訪問 [http://localhost:8080/moodle/login/index.php](http://localhost:8080/moodle/login/index.php) 查看你的 Moodle 後端。
訪問 [http://localhost:3000](http://localhost:3000) 查看你的 Moodle 前端。

### 5. 關閉環境
當你不再需要使用時，可以通過以下命令停止並移除所有正在運行的容器：
```bash
docker-compose down
```

### 6. 帳號密碼
管理者帳號為：admin
密碼為：Ab921218@

### 7. 如何備份 MySQL 資料庫

你可以使用以下步驟來備份 MySQL 資料庫：

1. **進入資料庫容器**：
   你可以通過 `docker exec` 命令進入資料庫容器。

   ```bash
   docker exec -it backend-db-1 /bin/bash
   ```

2. **備份資料庫**：
   在容器內使用 `mysqldump` 命令來備份你的 Moodle 資料庫。你的資料庫名稱是 `moodle_db`，資料庫用戶是 `moodleuser`，密碼是 `yourpassword`。

   ```bash
   mysqldump -u moodleuser -p moodle_db > /docker-entrypoint-initdb.d/moodle_db_backup.sql
   ```

   系統會提示你輸入 `yourpassword`，輸入後會將資料庫備份到你指定的資料夾。

3. **將備份文件拷貝到本地機器**：
   備份完成後，你可以使用 `docker cp` 命令將備份文件拷貝到本地檔案夾中。

   ```bash
   docker cp backend-db-1:/docker-entrypoint-initdb.d/moodle_db_backup.sql ./moodle-db-backup/moodle_db_backup.sql
   ```

   這會將資料庫備份文件拷貝到本地的 `moodle-db-backup` 資料夾中。

### 目前的bug

- moodle後端會傳遞無效參數
- 網頁運行緩慢

---
