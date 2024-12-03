import express from 'express';
import Groq from 'groq-sdk';

let app = express();
const port = 8081;

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

app.listen(port, function () {
    console.log(`App listening on port ${port}`);
});
