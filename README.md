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

在 WSL（Windows Subsystem for Linux）中安裝 Docker 的方法如下：

### **步驟 2：安裝 Docker Desktop**
Docker Desktop 是最簡單的安裝方式，並且它支持與 WSL 整合。

1. 前往 [Docker 官方網站](https://www.docker.com/products/docker-desktop) 下載 **Docker Desktop** 並安裝。
2. 在安裝過程中，勾選「啟用 WSL 2 功能」和「將 Docker 與 WSL 整合」選項。

---

### **步驟 3：在 WSL 中安裝 Docker CLI**
進入你的 WSL 發行版（例如 Ubuntu），執行以下指令：

1. 更新系統軟體包：
   ```bash
   sudo apt update
   sudo apt upgrade
   ```
2. 安裝必要的依賴項：
   ```bash
   sudo apt install -y apt-transport-https ca-certificates curl software-properties-common
   ```
3. 添加 Docker 的 GPG 金鑰：
   ```bash
   curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
   ```
4. 添加 Docker 的 APT 軟體源：
   ```bash
   echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
   ```
5. 安裝 Docker CLI：
   ```bash
   sudo apt update
   sudo apt install docker-ce docker-ce-cli containerd.io
   ```
---

### **步驟 4：配置 Docker 與 WSL 整合**
1. 打開 Docker Desktop，點擊 **Settings（設定）** > **Resources（資源）** > **WSL Integration**。
2. 啟用你正在使用的 WSL 發行版（例如 Ubuntu）的整合。

---

### **步驟 5：測試 Docker 是否正常運作**
1. 回到 WSL 發行版，執行以下命令：
   ```bash
   docker --version
   docker run hello-world
   ```
2. 如果成功，應該會看到 Docker 運行容器並輸出「Hello from Docker!」。

---

### **注意**
1. Docker Desktop 需要 Windows 10 或 11 Pro 版本，並啟用了 Hyper-V 和虛擬化支持。
2. 如果遇到權限問題，可以嘗試將當前使用者添加到 Docker 群組：
   ```bash
   sudo usermod -aG docker $USER
   ```
   然後重新啟動 WSL。

完成這些步驟後，你應該可以在 WSL 中順利使用 Docker！


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
你可以在瀏覽器中訪問 [http://localhost:8080/moodle/login](http://localhost:8080/moodle/login) 查看你的 Moodle 後端。
訪問 [http://localhost:3000](http://localhost:3000) 查看你的 Moodle 前端。

### 5. 關閉環境
當你不再需要使用時，可以通過以下命令停止並移除所有正在運行的容器：
```bash
docker-compose down
```

### 6. 帳號密碼
管理者帳號為：admin@gmail.com
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
   mysqldump -u moodleuser -p --no-tablespaces moodle_db > /docker-entrypoint-initdb.d/moodle_db_backup.sql
   ```

   這會將資料庫備份文件拷貝到本地的 `moodle-db-backup` 資料夾中。

### 目前的bug

- moodle後端會傳遞無效參數
- 網頁運行緩慢

---
