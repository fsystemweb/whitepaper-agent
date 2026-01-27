/**
 * LangChain Prompt Templates
 * 
 * Reusable prompt templates for different use cases.
 * Supports variable interpolation.
 */

import { ChatPromptTemplate, MessagesPlaceholder } from '@langchain/core/prompts';
import { getSystemPrompt, type SystemPromptKey } from './system-prompts';

/**
 * Create a chat prompt template with system prompt and message history
 * @param systemPromptKey - Key for the system prompt to use
 * @returns ChatPromptTemplate configured for conversation
 */
export function createChatPromptTemplate(
    systemPromptKey: SystemPromptKey = 'default'
): ChatPromptTemplate {
    const systemPrompt = getSystemPrompt(systemPromptKey);

    return ChatPromptTemplate.fromMessages([
        ['system', systemPrompt],
        new MessagesPlaceholder('history'),
        ['human', '{input}'],
    ]);
}

/**
 * Simple prompt template for single-turn interactions
 * @param systemPromptKey - Key for the system prompt to use
 * @returns ChatPromptTemplate for single-turn chat
 */
export function createSimplePromptTemplate(
    systemPromptKey: SystemPromptKey = 'default'
): ChatPromptTemplate {
    const systemPrompt = getSystemPrompt(systemPromptKey);

    return ChatPromptTemplate.fromMessages([
        ['system', systemPrompt],
        ['human', '{input}'],
    ]);
}
