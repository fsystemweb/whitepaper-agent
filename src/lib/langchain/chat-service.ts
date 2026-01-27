/**
 * Chat Service - Core chat processing logic
 * 
 * Handles message processing and prompt integration.
 * Uses simple async/await pattern.
 */

import { HumanMessage, AIMessage, SystemMessage, ToolMessage, type BaseMessage } from '@langchain/core/messages';
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
 * Returns the complete response as a string
 */
export async function streamChatResponse(
    messages: ChatMessage[],
    userMessage: string,
    systemPromptKey: SystemPromptKey = 'default'
): Promise<string> {
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

    // Initial pass: Check if the model wants to call a tool
    const initialResponse = await modelWithTools.invoke(formattedPrompt);

    // Check if model requested a tool
    if (initialResponse.tool_calls && initialResponse.tool_calls.length > 0) {
        const toolCall = initialResponse.tool_calls[0];

        // Execute the tool
        const toolResult = await arxivTool.invoke(toolCall.args as { query: string });

        // Create updated conversation with tool result
        const nextMessages = [
            ...(Array.isArray(formattedPrompt) ? formattedPrompt : [new HumanMessage(userMessage)]),
            initialResponse,
            new ToolMessage({
                tool_call_id: toolCall.id!,
                content: typeof toolResult === 'string' ? toolResult : JSON.stringify(toolResult),
            })
        ];

        // Get final answer with tool context
        const finalResponse = await modelWithTools.invoke(nextMessages);
        return typeof finalResponse.content === 'string'
            ? finalResponse.content
            : JSON.stringify(finalResponse.content);
    }

    // No tool needed - return initial response
    return typeof initialResponse.content === 'string'
        ? initialResponse.content
        : JSON.stringify(initialResponse.content);
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
        const toolCall = response.tool_calls[0];
        const toolResult = await arxivTool.invoke(toolCall.args as { query: string });

        const nextMessages = [
            ...(Array.isArray(formattedPrompt) ? formattedPrompt : [new HumanMessage(userMessage)]),
            response,
            new ToolMessage({
                tool_call_id: toolCall.id!,
                content: typeof toolResult === 'string' ? toolResult : JSON.stringify(toolResult),
            })
        ];

        const finalResponse = await modelWithTools.invoke(nextMessages);
        return typeof finalResponse.content === 'string' ? finalResponse.content : JSON.stringify(finalResponse.content);
    }

    return typeof response.content === 'string'
        ? response.content
        : JSON.stringify(response.content);
}