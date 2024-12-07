import express from 'express';
import Groq from 'groq-sdk';
const fs = require('fs'); //import fs from "fs"; (modify to import ?)


let app = express();
const port = 3000;

app.use(express.static('public'));
app.use(express.json());

app.post('/student_conversation', async function (req, res) {
    const msg = req.body.message;
    const key = process.env.GROQ_API_KEY;

    if (msg === undefined) {
        res.status(400).send('Bad request');
        return;
    }
    else if (key === undefined) {
        res.status(500).send('Internal server error');
        return;
    }

    const groq = new Groq({ apiKey: key });
    const response = await groq.chat.completions.create({
        messages: [
            {
                role: 'system',
                content: 'You are a helpful assistant that always use chinese to communicate with the user.',
            },
            {
                role: 'user',
                content: msg,
            },
        ],
        model: "llama3-8b-8192"
    });

    console.log(response.choices[0]?.message?.content || 'No response');

    res.send(response);
});


app.get('/', async (req, res) => {

    try {
        const speech = req.body.message;
        const prompt = 'fullstack/frontend/prompt.txt';

        if (speech === undefined) {
            res.status(400).send('Bad request');
            return;
        }

        if (fs.existsSync(prompt)) {
            prompt = fs.readFileSync(prompt, 'utf-8') + '\n';
        }

    } catch (error) {
        res.status(500).send('伺服器錯誤，無法讀取輸入文件。');
        return;
    }

    const key = process.env.GROQ_API_KEY;
    const groq = new Groq({ apiKey: key });

    const response = await groq.chat.completions.create({
        messages: [
            {
                role: 'user',
                content: input,
            },
        ],
        model: "llama-3.2-90b-vision-preview"
    });  

    // 處理回應格式問題
    let cleanedResponse = response.choices[0].message.content;
    try {
        cleanedResponse = response
            .replace(/\r\n/g, '\n') // 將 CRLF 換行轉為 LF
            .replace(/[^\S\r\n]+/g, ' ') // 移除多餘空白
            .replace(/\n{2,}/g, '\n\n') // 合併多餘的空行為一行
            .trim(); // 移除前後多餘空白
    } catch (error) {
        cleanedResponse = "error"
    }

    res.send(cleanedResponse);

});



app.listen(port, function () {
    console.log(`App listening on port ${port}`);
});
