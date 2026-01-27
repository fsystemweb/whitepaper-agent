/**
 * Chat Service - Core chat processing logic
 * 
 * Handles message processing, streaming, and prompt integration.
 * Follows async-parallel pattern for concurrent operations.
 */

import { HumanMessage, AIMessage, SystemMessage, type BaseMessage } from '@langchain/core/messages';
import { getChatModel } from './client';
import { createChatPromptTemplate, type SystemPromptKey } from '@/lib/prompts';
import type { ChatMessage } from './types';

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
 * Generate a streaming chat response
 * 
 * @param messages - Conversation history
 * @param userMessage - Current user message
 * @param systemPromptKey - System prompt to use
 * @returns AsyncIterable of response chunks
 */
export async function* streamChatResponse(
    messages: ChatMessage[],
    userMessage: string,
    systemPromptKey: SystemPromptKey = 'default'
): AsyncIterable<string> {
    const chatModel = getChatModel();
    const promptTemplate = createChatPromptTemplate(systemPromptKey);

    // Convert message history to LangChain format (excluding system messages as they're in the template)
    const history = convertToLangChainMessages(
        messages.filter((m) => m.role !== 'system')
    );

    // Format the prompt with history and current input
    const formattedPrompt = await promptTemplate.formatMessages({
        history,
        input: userMessage,
    });

    // Stream the response
    const stream = await chatModel.stream(formattedPrompt);

    for await (const chunk of stream) {
        if (typeof chunk.content === 'string') {
            yield chunk.content;
        }
    }
}

/**
 * Generate a complete chat response (non-streaming)
 * 
 * @param messages - Conversation history
 * @param userMessage - Current user message
 * @param systemPromptKey - System prompt to use
 * @returns Complete response string
 */
export async function generateChatResponse(
    messages: ChatMessage[],
    userMessage: string,
    systemPromptKey: SystemPromptKey = 'default'
): Promise<string> {
    const chatModel = getChatModel();
    const promptTemplate = createChatPromptTemplate(systemPromptKey);

    const history = convertToLangChainMessages(
        messages.filter((m) => m.role !== 'system')
    );

    const formattedPrompt = await promptTemplate.formatMessages({
        history,
        input: userMessage,
    });

    const response = await chatModel.invoke(formattedPrompt);

    return typeof response.content === 'string'
        ? response.content
        : JSON.stringify(response.content);
}
