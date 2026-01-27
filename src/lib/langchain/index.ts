/**
 * LangChain Module - Unified exports
 */

export { getChatModel, createChatModel } from './client';
export { streamChatResponse, generateChatResponse } from './chat-service';
export type { ChatMessage, ChatRequest, ChatResponse, StreamingChatOptions } from './types';
