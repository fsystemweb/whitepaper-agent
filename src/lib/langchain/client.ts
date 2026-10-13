/**
 * LangChain Client - ChatOpenAI singleton
 * 
 * Follows server-cache-lru pattern for connection reuse.
 */

import { ChatOpenAI } from '@langchain/openai';
import { config, validateConfig } from '@/lib/config';

let chatModelInstance: ChatOpenAI | null = null;

/**
 * Newer OpenAI models reject `max_tokens` and require `max_completion_tokens`.
 * LangChain only switches automatically for models it knows about (o*, gpt-5),
 * so we always send `max_completion_tokens` ourselves via modelKwargs.
 */
function tokenLimitKwargs(maxTokens: number) {
    return { modelKwargs: { max_completion_tokens: maxTokens } };
}

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
            ...tokenLimitKwargs(config.openai.maxTokens),
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
        ...tokenLimitKwargs(options.maxTokens || config.openai.maxTokens),
        streaming: true,
    });
}
