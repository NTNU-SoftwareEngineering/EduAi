import express from 'express';
import Groq from 'groq-sdk';
import fs from "fs";

import { ChatGroq } from '@langchain/groq';
import { END, MemorySaver, MessagesAnnotation, START, StateGraph } from '@langchain/langgraph';
import { v4 as uuidv4 } from 'uuid';
import { AIMessage, HumanMessage } from '@langchain/core/messages';

let app = express();
const port = 3000;

let aiApp = await initChat();
let conversation_memory = [];

// Init Groq chat with Langchain
async function initChat() {
    const llm = new ChatGroq({
        model: 'llama-3.3-70b-versatile',
        response_format: {
            "type": "json_object",
        },
    });

    const callModel = async (state) => {
        const response = await llm.invoke(state.messages);
        return {
            messages: response
        };
    };

    const workflow = new StateGraph(MessagesAnnotation)
    .addNode("model", callModel)
    .addEdge(START, "model")
    .addEdge("model", END);

    const memory = new MemorySaver();
    const aiApp = workflow.compile({
        checkpointer: memory,
    });

    return aiApp;
}

app.use(express.static('public'));
app.use(express.json());

app.post('/student_conversation/init', async function (req, res) {
    const token = req.body.token;
    const course_id = req.body.course_id;
    const course_name = req.body.course_name;

    if (token === undefined || course_id === undefined || course_name === undefined) {
        res.status(400).send('Bad request');
        return;
    }

    // Get thread id if token and course id match
    let memory = conversation_memory.find((thread) => thread.token === token && thread.course_id === course_id);
    let config = {};
    let messages_content = [];

    if (memory === undefined) {
        const thread_id = uuidv4();

        conversation_memory.push({
            token, thread_id, course_id
        });

        config = {
            configurable: {
                thread_id,
            }
        };

        const input = [
            {
                role: 'system',
                content: `你是一位就職於${ course_name }的助教，你的任務是協助學生學習課程內容。你總是使用繁體中文與使用者溝通。`,
            }
        ];

        const output  = await aiApp.invoke({messages: input}, config);

        const message = output.messages[output.messages.length - 1].content;

        messages_content.push({
            role: 'ai',
            content: message,
        });
    }
    else {
        config = {
            configurable: {
                thread_id: memory.thread_id,
            }
        }

        const state = await aiApp.getState(config);
        const messages = state.values.messages;

        for (let i = 0; i < messages.length; i++) {
            let role;

            if (messages[i] instanceof AIMessage) {
                role = 'ai';
            }
            else if (messages[i] instanceof HumanMessage) {
                role = 'user';
            }
            else {
                continue;
            }

            messages_content.push({
                role: role,
                content: messages[i].content,
            });
        }
    }

    console.log("messages_content");
    console.log(messages_content);

    res.status(200).send({
        messages: messages_content
    });
});

app.post('/student_conversation', async function (req, res) {
    // Get token, course id, and user message from request
    const token        = req.body.token;
    const course_id    = req.body.course_id;
    const user_message = req.body.user_message;

    if (token === undefined || course_id === undefined || user_message === undefined) {
        res.status(400).send('Bad request');
        return;
    }

    // Get thread id if token and course id match
    const memory = conversation_memory.find((thread) => thread.token === token && thread.course_id === course_id);

    if (memory === undefined) {
        res.status(400).send('Bad request');
        return;
    }

    try {
        const config = {
            configurable: {
                thread_id: memory.thread_id,
            }
        }

        const input = [
            {
                role: 'user',
                content: user_message,
            }
        ];

        const output = await aiApp.invoke({messages: input}, config);
        console.log("User message: " + user_message);
        console.log("AI response : " + output.messages[output.messages.length - 1].content);

        res.status(200).send({
            message: output.messages[output.messages.length - 1].content
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
});


app.post('/llm', async function(req, res){

    var input = "";
    try {
        input = req.body.message;
        const prompt = 'prompt.txt';

        if (input === undefined) {
            res.status(400).send('Bad request');
            return;
        }

        if (fs.existsSync(prompt)) {
            input += "\n" + fs.readFileSync(prompt, 'utf-8') + '\n';
        }
        //console.log(input)
        

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

    console.log(response.choices[0]?.message?.content || 'No response');

    res.send(response);

});



app.listen(port, function () {
    console.log(`App listening on port ${port}`);
});
