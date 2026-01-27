/**
 * LangChain-specific types
 */

export interface ChatMessage {
    id: string;
    role: 'user' | 'assistant' | 'system';
    content: string;
    createdAt: Date;
}

export interface ChatRequest {
    messages: ChatMessage[];
    systemPromptKey?: string;
}

export interface ChatResponse {
    message: ChatMessage;
    usage?: {
        promptTokens: number;
        completionTokens: number;
        totalTokens: number;
    };
}

export interface StreamingChatOptions {
    onToken?: (token: string) => void;
    onComplete?: (fullResponse: string) => void;
    onError?: (error: Error) => void;
}
