//Warning : this js is deprecated and replaced the function to index.js in fullstack/frontend
//moved the llm.js function with student_coversation, therefore, both function will use the same api key 
//in .env

const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const Groq = require('groq-sdk');

const app = express();
const port = 3001;

const apiKey = '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'; // 設置 API Key

const OUTPUT_LOG_FILE = path.join(__dirname, 'groq_output_log.txt');
const ERROR_LOG_FILE = path.join(__dirname, 'groq_error_log.txt');



// 初始化日誌文件
function initLogFiles() {
    const logFiles = [OUTPUT_LOG_FILE, ERROR_LOG_FILE];
    logFiles.forEach(file => {
        if (!fs.existsSync(file)) {
            fs.writeFileSync(file, '');
            fs.chmodSync(file, 0o666);
        }
    });
}

// 記錄錯誤信息
function logError(message, context = '') {
    const timestamp = new Date().toISOString();
    const logEntry = `${timestamp}\nError: ${message}\nContext: ${context}\n\n`;
    fs.appendFileSync(ERROR_LOG_FILE, logEntry);
    console.error(`LLM Error: ${message}`);
}

// 記錄輸出信息
function logOutput(message, context = '') {
    const timestamp = new Date().toISOString();
    const logEntry = `${timestamp}\nOutput: ${message}\nContext: ${context}\n\n`;
    fs.appendFileSync(OUTPUT_LOG_FILE, logEntry);
}

// 調用 Groq API
async function callGroqApi(input) {
    const groq = new Groq({ apiKey: apiKey });

    try {
        const chatCompletion = await groq.chat.completions.create({
            messages: [
                {
                    role: 'user',
                    content: input,
                },
            ],
            model: 'llama-3.2-90b-vision-preview',
            // model: 'llama-3.1-70b-versatile',
        });

        const response = {
            choices: [{
                message: {
                    content: chatCompletion.choices[0].message.content
                }
            }]
        };

        logOutput(JSON.stringify(response), `User input: ${input}`);
        return response.choices[0].message.content;
    } catch (error) {
        logError(error.message, error.stack);
        return `Error: ${error.message}`;
    }
}

app.get('/', async (req, res) => {
    let input = '';

    try {
        const file1Path = 'fullstack/frontend/assets/data/fast_result.txt';
        const file2Path = 'fullstack/frontend/assets/data/prompt.txt';

        if (fs.existsSync(file1Path)) {
            input += fs.readFileSync(file1Path, 'utf-8') + '\n';
        } else {
            logError(`File not found: file1.txt`);
        }

        if (fs.existsSync(file2Path)) {
            input += fs.readFileSync(file2Path, 'utf-8') + '\n';
        } else {
            logError(`File not found: file2.txt`);
        }

    } catch (error) {
        logError('Failed to read input files', error.stack);
        res.status(500).send('伺服器錯誤，無法讀取輸入文件。');
        return;
    }

    // 呼叫 Groq API
    const response = await callGroqApi(input);

    // 處理回應格式問題
    let cleanedResponse = response;
    try {
        cleanedResponse = response
            .replace(/\r\n/g, '\n') // 將 CRLF 換行轉為 LF
            .replace(/[^\S\r\n]+/g, ' ') // 移除多餘空白
            .replace(/\n{2,}/g, '\n\n') // 合併多餘的空行為一行
            .trim(); // 移除前後多餘空白
    } catch (error) {
        logError('Failed to clean response format', error.stack);
    }

    // 將回應存為 response.txt
    try {
        const outputFilePath = path.join('fullstack/frontend/assets/data', 'response.txt');

        // 確保目錄存在
        if (!fs.existsSync('fullstack/frontend/assets/data')) {
            fs.mkdirSync('fullstack/frontend/assets/data', { recursive: true });
        }

        fs.writeFileSync(outputFilePath, cleanedResponse);
        console.log(`Response saved to ${outputFilePath}`);
    } catch (error) {
        logError('Failed to save response file', error.stack);
        res.status(500).send('伺服器錯誤，無法儲存回應文件。');
        return;
    }

});


initLogFiles();

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});