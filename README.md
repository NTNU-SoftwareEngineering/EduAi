# Moodle-based Website

## 功能介紹

這個網站以 Moodle 為後端，提供以下功能：

1. **課程管理**
   - 老師可以查看和管理已註冊的課程。
   - 支援課程的分組功能。
   - 上傳教案，在學生端顯示題目。

2. **語音處理**
   - 支援討論時音頻文件的上傳和轉錄。
   - 提供說話人分離和標記功能。
   - 傳到後端後使用LLM進行分析。

3. **即時對話**
   - 根據老師的教案，使用LLM對學生進行回復。

4. **分析回饋**
   - 分析每位學生討論時的錄音，並使用LLM分析後給出各項指標。
   - 指標有：理解程度、互動回饋、長期趨勢。   

## 可啟動的網頁

以下是可啟動的網頁：

1. **後端頁面**
   - URL: `http://localhost:8080/moodle`

2. **前端頁面**
   - URL: `http://localhost:3000/login_edu.html`

3. **資料庫查詢**
   - URL: `http://localhost:8081`


## 啟動方式

1. **Docker**
   - 使用 Docker Compose 啟動前端服務。
   - 執行命令：`docker-compose up`

2. **資料庫備份**
   - 執行命令：`docker exec fullstack-db-1 mysqldump -u moodleuser -pyourpassword moodle_db > moodle_db_backup.sql`
   - 可以把你在moodle後端設定的東西，存到本地並push，讓其他人使用
   
## 環境變數

請確保在 `.env` 文件中設置以下環境變數：

- `GROQ_API_KEY`: Groq API 的密鑰

## 注意事項

- 請確保已安裝 Docker 和 Docker Compose。
- 確保在啟動服務前，已經配置好所有必要的環境變數和配置文件。