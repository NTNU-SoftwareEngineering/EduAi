import assert from 'node:assert/strict';
import test from 'node:test';

import { AIMessage, HumanMessage } from '@langchain/core/messages';
import { ChatGroq } from '@langchain/groq';
import {
    END,
    MemorySaver,
    MessagesAnnotation,
    START,
    StateGraph,
} from '@langchain/langgraph';
import Groq from 'groq-sdk';
import { validate as validateUuid, v4 as uuidv4 } from 'uuid';

test('the LangGraph message workflow stores conversation state', async () => {
    const workflow = new StateGraph(MessagesAnnotation)
        .addNode('model', async (state) => {
            const latestMessage = state.messages.at(-1);

            return {
                messages: new AIMessage(`Echo: ${latestMessage.content}`),
            };
        })
        .addEdge(START, 'model')
        .addEdge('model', END);

    const graph = workflow.compile({
        checkpointer: new MemorySaver(),
    });
    const threadId = uuidv4();
    const config = {
        configurable: {
            thread_id: threadId,
        },
    };

    const result = await graph.invoke(
        { messages: [new HumanMessage('hello')] },
        config,
    );
    const savedState = await graph.getState(config);

    assert.equal(validateUuid(threadId), true);
    assert.equal(result.messages.at(-1).content, 'Echo: hello');
    assert.equal(savedState.values.messages.at(-1).content, 'Echo: hello');
});

test('the Groq clients initialize without making a network request', () => {
    const apiKey = 'dependency-smoke-test';
    const langChainClient = new ChatGroq({
        apiKey,
        model: 'llama-3.1-8b-instant',
    });
    const sdkClient = new Groq({ apiKey });

    assert.ok(langChainClient);
    assert.ok(sdkClient.chat.completions);
});
