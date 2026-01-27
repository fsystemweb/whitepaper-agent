'use client';

/**
 * useChatHistory Hook - Chat session persistence
 * 
 * Manages chat sessions in localStorage.
 * Only saves sessions that have at least one message.
 */

import { useState, useEffect, useCallback } from 'react';
import type { Message } from './use-chat';

export interface ChatSession {
    id: string;
    title: string;
    messages: Message[];
    createdAt: Date;
    updatedAt: Date;
}

interface SerializedChatSession {
    id: string;
    title: string;
    messages: Array<{
        id: string;
        role: 'user' | 'assistant' | 'system';
        content: string;
        createdAt: string;
    }>;
    createdAt: string;
    updatedAt: string;
}

const STORAGE_KEY = 'whitepaper-chat-history';

function generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

function getStoredSessions(): ChatSession[] {
    if (typeof window === 'undefined') return [];

    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) return [];

        const parsed: SerializedChatSession[] = JSON.parse(stored);
        return parsed.map((session) => ({
            ...session,
            createdAt: new Date(session.createdAt),
            updatedAt: new Date(session.updatedAt),
            messages: session.messages.map((msg) => ({
                ...msg,
                createdAt: new Date(msg.createdAt),
            })),
        }));
    } catch (error) {
        console.error('Failed to parse chat history:', error);
        return [];
    }
}

function saveToStorage(sessions: ChatSession[]): void {
    if (typeof window === 'undefined') return;

    try {
        const serialized: SerializedChatSession[] = sessions.map((session) => ({
            ...session,
            createdAt: session.createdAt.toISOString(),
            updatedAt: session.updatedAt.toISOString(),
            messages: session.messages.map((msg) => ({
                ...msg,
                createdAt: msg.createdAt.toISOString(),
            })),
        }));
        localStorage.setItem(STORAGE_KEY, JSON.stringify(serialized));
    } catch (error) {
        console.error('Failed to save chat history:', error);
    }
}

function extractTitle(messages: Message[]): string {
    const firstUserMessage = messages.find((m) => m.role === 'user');
    if (!firstUserMessage) return 'New conversation';

    const title = firstUserMessage.content.slice(0, 50);
    return title.length < firstUserMessage.content.length ? `${title}...` : title;
}

interface UseChatHistoryReturn {
    sessions: ChatSession[];
    activeSessionId: string | null;
    saveSession: (messages: Message[]) => void;
    loadSession: (sessionId: string) => Message[] | null;
    deleteSession: (sessionId: string) => void;
    createNewSession: () => void;
    setActiveSessionId: (sessionId: string | null) => void;
}

export function useChatHistory(): UseChatHistoryReturn {
    const [sessions, setSessions] = useState<ChatSession[]>([]);
    const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
    const [isInitialized, setIsInitialized] = useState(false);

    // Load sessions from localStorage on mount
    useEffect(() => {
        const stored = getStoredSessions();
        setSessions(stored);
        setIsInitialized(true);
    }, []);

    const saveSession = useCallback((messages: Message[]) => {
        // Only save if there's at least one message
        if (messages.length === 0) return;

        setSessions((prev) => {
            let updated: ChatSession[];
            const now = new Date();

            if (activeSessionId) {
                // Update existing session
                const existingIndex = prev.findIndex((s) => s.id === activeSessionId);
                if (existingIndex >= 0) {
                    updated = [...prev];
                    updated[existingIndex] = {
                        ...updated[existingIndex],
                        messages,
                        title: extractTitle(messages),
                        updatedAt: now,
                    };
                } else {
                    // Session ID exists but not found, create new
                    const newSession: ChatSession = {
                        id: activeSessionId,
                        title: extractTitle(messages),
                        messages,
                        createdAt: now,
                        updatedAt: now,
                    };
                    updated = [newSession, ...prev];
                }
            } else {
                // Create new session
                const newId = generateSessionId();
                const newSession: ChatSession = {
                    id: newId,
                    title: extractTitle(messages),
                    messages,
                    createdAt: now,
                    updatedAt: now,
                };
                updated = [newSession, ...prev];
                // Set active session ID (done outside this callback)
                setTimeout(() => setActiveSessionId(newId), 0);
            }

            saveToStorage(updated);
            return updated;
        });
    }, [activeSessionId]);

    const loadSession = useCallback((sessionId: string): Message[] | null => {
        const session = sessions.find((s) => s.id === sessionId);
        if (session) {
            setActiveSessionId(sessionId);
            return session.messages;
        }
        return null;
    }, [sessions]);

    const deleteSession = useCallback((sessionId: string) => {
        setSessions((prev) => {
            const updated = prev.filter((s) => s.id !== sessionId);
            saveToStorage(updated);
            return updated;
        });

        if (activeSessionId === sessionId) {
            setActiveSessionId(null);
        }
    }, [activeSessionId]);

    const createNewSession = useCallback(() => {
        setActiveSessionId(null);
    }, []);

    return {
        sessions,
        activeSessionId,
        saveSession,
        loadSession,
        deleteSession,
        createNewSession,
        setActiveSessionId,
    };
}
