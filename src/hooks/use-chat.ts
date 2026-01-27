'use client';

/**
 * useChat Hook - Chat state management
 * 
 * Manages message state, streaming responses, and API communication.
 * Follows client-swr-dedup pattern concepts.
 */

import { useState, useCallback, useRef } from 'react';

export interface Message {
    id: string;
    role: 'user' | 'assistant' | 'system';
    content: string;
    createdAt: Date;
}

interface UseChatOptions {
    systemPromptKey?: 'default' | 'technical' | 'creative';
}

interface UseChatReturn {
    messages: Message[];
    isLoading: boolean;
    error: string | null;
    sendMessage: (content: string) => Promise<void>;
    clearMessages: () => void;
    setMessages: (messages: Message[]) => void;
}

/**
 * Generate a unique message ID
 */
function generateId(): string {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Custom hook for chat functionality with streaming support
 */
export function useChat(options: UseChatOptions = {}): UseChatReturn {
    const { systemPromptKey = 'default' } = options;

    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Abort controller for cancelling requests
    const abortControllerRef = useRef<AbortController | null>(null);

    const sendMessage = useCallback(async (content: string) => {
        if (!content.trim()) return;

        // Clear any previous error
        setError(null);

        // Create user message
        const userMessage: Message = {
            id: generateId(),
            role: 'user',
            content: content.trim(),
            createdAt: new Date(),
        };

        // Add user message to state
        setMessages((prev) => [...prev, userMessage]);
        setIsLoading(true);

        // Create placeholder for assistant message
        const assistantMessageId = generateId();
        const assistantMessage: Message = {
            id: assistantMessageId,
            role: 'assistant',
            content: '',
            createdAt: new Date(),
        };

        setMessages((prev) => [...prev, assistantMessage]);

        // Cancel any existing request
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
        abortControllerRef.current = new AbortController();

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    messages: messages,
                    userMessage: content.trim(),
                    systemPromptKey,
                }),
                signal: abortControllerRef.current.signal,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to send message');
            }

            // Handle streaming response
            const reader = response.body?.getReader();
            if (!reader) {
                throw new Error('No response body');
            }

            const decoder = new TextDecoder();
            let accumulatedContent = '';

            while (true) {
                const { done, value } = await reader.read();

                if (done) break;

                const chunk = decoder.decode(value, { stream: true });
                const lines = chunk.split('\n');

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        const data = line.slice(6);

                        if (data === '[DONE]') {
                            break;
                        }

                        try {
                            const parsed = JSON.parse(data);

                            if (parsed.error) {
                                throw new Error(parsed.error);
                            }

                            if (parsed.content) {
                                accumulatedContent += parsed.content;

                                // Update the assistant message with accumulated content
                                setMessages((prev) =>
                                    prev.map((msg) =>
                                        msg.id === assistantMessageId
                                            ? { ...msg, content: accumulatedContent }
                                            : msg
                                    )
                                );
                            }
                        } catch (parseError) {
                            // Ignore JSON parse errors for incomplete chunks
                            if (data !== '' && !data.includes('[DONE]')) {
                                console.warn('Failed to parse SSE data:', data);
                            }
                        }
                    }
                }
            }
        } catch (err) {
            if (err instanceof Error && err.name === 'AbortError') {
                // Request was cancelled, don't show error
                return;
            }

            const errorMessage = err instanceof Error ? err.message : 'An error occurred';
            setError(errorMessage);

            // Remove the empty assistant message on error
            setMessages((prev) =>
                prev.filter((msg) => msg.id !== assistantMessageId)
            );
        } finally {
            setIsLoading(false);
            abortControllerRef.current = null;
        }
    }, [messages, systemPromptKey]);

    const clearMessages = useCallback(() => {
        setMessages([]);
        setError(null);
    }, []);

    return {
        messages,
        isLoading,
        error,
        sendMessage,
        clearMessages,
        setMessages,
    };
}
