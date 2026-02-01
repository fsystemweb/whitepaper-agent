/**
 * Chat Service - Core chat processing logic
 * 
 * Handles message processing and prompt integration.
 * Uses simple async/await pattern.
 */

import { HumanMessage, AIMessage, SystemMessage, ToolMessage, type BaseMessage, AIMessageChunk } from '@langchain/core/messages';
import { getChatModel } from './client';
import { createChatPromptTemplate, type SystemPromptKey } from '@/lib/prompts';
import type { ChatMessage } from './types';
import { arxivTool } from './tools';

// Tools array for binding to the model
const tools = [arxivTool];

/**
 * Convert our ChatMessage format to LangChain BaseMessage format
 */
function convertToLangChainMessages(messages: ChatMessage[]): BaseMessage[] {
    return messages.map((msg) => {
        switch (msg.role) {
            case 'user':
                return new HumanMessage(msg.content);
            case 'assistant':
                return new AIMessage(msg.content);
            case 'system':
                return new SystemMessage(msg.content);
            default:
                return new HumanMessage(msg.content);
        }
    });
}

/**
 * Generate a chat response with Tool Support
 * Returns an async generator that yields response chunks
 */
export async function* streamChatResponse(
    messages: ChatMessage[],
    userMessage: string,
    systemPromptKey: SystemPromptKey = 'default'
): AsyncGenerator<string, void, unknown> {
    const chatModel = getChatModel();
    const modelWithTools = chatModel.bindTools(tools);
    const promptTemplate = createChatPromptTemplate(systemPromptKey);

    // Convert history
    const history = convertToLangChainMessages(
        messages.filter((m) => m.role !== 'system')
    );

    // Format prompt
    const formattedPrompt = await promptTemplate.formatMessages({
        history,
        input: userMessage,
    });

    // Initial pass: Stream the response to check for tool calls
    // We need to aggregate the chunks to check for tool calls, 
    // but also yield them if it's just text.
    // However, LangChain's stream events are cleaner for this.
    // For simplicity with bindTools, we can stream and check the final aggregated chunk for tool_calls,
    // OR we can just `invoke` first (non-streaming) to check for tools, then stream the final answer.
    // BUT, to be "fast", we ideally stream the first part too. 
    // If the model decides to call a tool, it usually outputs valid JSON args.
    // Let's stick to a robust approach:
    // 1. Stream the first response.
    // 2. Aggregate it to check for tool calls.
    // 3. If tool call, execute and stream the second response.

    const stream = await modelWithTools.stream(formattedPrompt);
    let gathered: AIMessageChunk | null = null;

    for await (const chunk of stream) {
        // If we have tool calls, we might not want to show the raw JSON generation to the user.
        // But if it's text, we want to yield it.
        // Usually, if there are tool calls, content is empty or "I will check...".
        if (chunk.content) {
            yield typeof chunk.content === 'string' ? chunk.content : JSON.stringify(chunk.content);
        }
        const aiChunk = chunk as AIMessageChunk;
        gathered = gathered ? (gathered.concat(aiChunk)) : aiChunk;
    }

    // Check if model requested a tool
    if (gathered && gathered.tool_calls && gathered.tool_calls.length > 0) {
        // Execute all tools in parallel
        const toolResults = await Promise.all(
            gathered.tool_calls.map(async (toolCall) => {
                const result = await arxivTool.invoke(toolCall.args as { query: string });
                return {
                    tool_call_id: toolCall.id!,
                    content: typeof result === 'string' ? result : JSON.stringify(result),
                };
            })
        );

        // Create updated conversation with tool result
        const nextMessages = [
            ...(Array.isArray(formattedPrompt) ? formattedPrompt : [new HumanMessage(userMessage)]),
            gathered,
            ...toolResults.map(
                (res) =>
                    new ToolMessage({
                        tool_call_id: res.tool_call_id,
                        content: res.content,
                    })
            ),
            new SystemMessage("Strictly use the links provided in the tool output. Do not change them.")
        ];

        // Get final answer with tool context
        const finalStream = await modelWithTools.stream(nextMessages);
        for await (const chunk of finalStream) {
            if (chunk.content) {
                yield typeof chunk.content === 'string' ? chunk.content : JSON.stringify(chunk.content);
            }
        }
    }
}

/**
 * Generate a complete chat response (non-streaming)
 * Updated to support tools as well.
 */
export async function generateChatResponse(
    messages: ChatMessage[],
    userMessage: string,
    systemPromptKey: SystemPromptKey = 'default'
): Promise<string> {
    const chatModel = getChatModel();
    const modelWithTools = chatModel.bindTools(tools);
    const promptTemplate = createChatPromptTemplate(systemPromptKey);

    const history = convertToLangChainMessages(
        messages.filter((m) => m.role !== 'system')
    );

    const formattedPrompt = await promptTemplate.formatMessages({
        history,
        input: userMessage,
    });

    const response = await modelWithTools.invoke(formattedPrompt);

    // Handle Tool Call Logic
    if (response.tool_calls && response.tool_calls.length > 0) {
        // Execute all tools in parallel
        const toolResults = await Promise.all(
            response.tool_calls.map(async (toolCall) => {
                const result = await arxivTool.invoke(toolCall.args as { query: string });
                return {
                    tool_call_id: toolCall.id!,
                    content: typeof result === 'string' ? result : JSON.stringify(result),
                };
            })
        );

        const nextMessages = [
            ...(Array.isArray(formattedPrompt) ? formattedPrompt : [new HumanMessage(userMessage)]),
            response,
            ...toolResults.map(
                (res) =>
                    new ToolMessage({
                        tool_call_id: res.tool_call_id,
                        content: res.content,
                    })
            )
        ];

        const finalResponse = await modelWithTools.invoke(nextMessages);
        return typeof finalResponse.content === 'string' ? finalResponse.content : JSON.stringify(finalResponse.content);
    }

    return typeof response.content === 'string'
        ? response.content
        : JSON.stringify(response.content);
}