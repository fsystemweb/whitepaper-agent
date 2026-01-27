/**
 * LangChain Client - ChatOpenAI singleton
 * 
 * Follows server-cache-lru pattern for connection reuse.
 */

import { ChatOpenAI } from '@langchain/openai';
import { config, validateConfig } from '@/lib/config';

let chatModelInstance: ChatOpenAI | null = null;

/**
 * Get the ChatOpenAI client instance (singleton pattern)
 * Reuses the same instance across requests for efficiency
 */
export function getChatModel(): ChatOpenAI {
    if (!chatModelInstance) {
        validateConfig();

        chatModelInstance = new ChatOpenAI({
            openAIApiKey: config.openai.apiKey,
            modelName: config.openai.model,
            temperature: config.openai.temperature,
            maxTokens: config.openai.maxTokens,
            streaming: true,
        });
    }

    return chatModelInstance;
}

/**
 * Create a new ChatOpenAI instance with custom configuration
 * Use this when you need different settings than the default
 */
export function createChatModel(options: {
    model?: string;
    temperature?: number;
    maxTokens?: number;
}): ChatOpenAI {
    validateConfig();

    return new ChatOpenAI({
        openAIApiKey: config.openai.apiKey,
        modelName: options.model || config.openai.model,
        temperature: options.temperature ?? config.openai.temperature,
        maxTokens: options.maxTokens || config.openai.maxTokens,
        streaming: true,
    });
}
