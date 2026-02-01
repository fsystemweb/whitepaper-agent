'use client';

/**
 * ChatContainer - Main chat interface
 * 
 * Full-page layout with welcome screen, chat history sidebar,
 * and centered input. Persists chat sessions to localStorage.
 */

import { useState, useCallback, useEffect } from 'react';
import { MessageList } from './message-list';
import { ChatInput } from './chat-input';
import { WelcomeScreen } from './welcome-screen';
import { Sidebar } from './sidebar';
import { ChatHistory } from './chat-history';
import { useChat, type Message } from '@/hooks/use-chat';
import { useChatHistory } from '@/hooks/use-chat-history';
import { AlertCircle } from 'lucide-react';

interface ChatContainerProps {
    systemPromptKey?: 'default' | 'technical' | 'creative';
}

export function ChatContainer({ systemPromptKey = 'default' }: ChatContainerProps) {
    const { messages, isLoading, error, sendMessage, clearMessages, setMessages } = useChat({
        systemPromptKey,
    });
    const {
        sessions,
        activeSessionId,
        saveSession,
        loadSession,
        deleteSession,
        createNewSession,
    } = useChatHistory();

    const [pendingPrompt, setPendingPrompt] = useState('');
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);

    // Save session after each message exchange (when not loading)
    useEffect(() => {
        if (!isLoading && messages.length > 0) {
            saveSession(messages);
        }
    }, [messages, isLoading, saveSession]);

    const handleSelectPrompt = useCallback((prompt: string) => {
        setPendingPrompt(prompt);
    }, []);

    const handleSendMessage = useCallback(async (message: string) => {
        setPendingPrompt(''); // Clear pending prompt after sending
        await sendMessage(message);
    }, [sendMessage]);

    const handleToggleHistory = useCallback(() => {
        setIsHistoryOpen((prev) => !prev);
    }, []);

    const handleNewChat = useCallback(() => {
        clearMessages();
        createNewSession();
        setIsHistoryOpen(false);
    }, [clearMessages, createNewSession]);

    const handleSelectSession = useCallback((sessionId: string) => {
        const sessionMessages = loadSession(sessionId);
        if (sessionMessages) {
            setMessages(sessionMessages);
        }
        setIsHistoryOpen(false);
    }, [loadSession, setMessages]);

    const handleDeleteSession = useCallback((sessionId: string) => {
        deleteSession(sessionId);
        // If we deleted the active session, clear messages
        if (sessionId === activeSessionId) {
            clearMessages();
        }
    }, [deleteSession, activeSessionId, clearMessages]);

    const hasMessages = messages.length > 0;

    return (
        <div className="flex h-screen">
            {/* Sidebar */}
            <Sidebar
                isHistoryOpen={isHistoryOpen}
                onToggleHistory={handleToggleHistory}
                onNewChat={handleNewChat}
            />

            {/* History panel */}
            <ChatHistory
                isOpen={isHistoryOpen}
                onClose={() => setIsHistoryOpen(false)}
                sessions={sessions}
                activeSessionId={activeSessionId}
                onSelectSession={handleSelectSession}
                onDeleteSession={handleDeleteSession}
            />

            {/* Main content */}
            <div className="flex-1 flex flex-col md:ml-14 overflow-hidden">
                {/* Error message */}
                {error && (
                    <div className="mx-4 mt-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 shrink-0" />
                        <span>{error}</span>
                    </div>
                )}

                {/* Content area */}
                {hasMessages ? (
                    <MessageList
                        messages={messages}
                        isLoading={isLoading}
                        onClear={handleNewChat}
                    />
                ) : (
                    <WelcomeScreen
                        userName="there"
                        onSelectPrompt={handleSelectPrompt}
                    />
                )}

                {/* Input - always at bottom */}
                <div className="px-4 pb-6 pt-2">
                    <div className="max-w-3xl mx-auto">
                        <ChatInput
                            onSend={handleSendMessage}
                            isLoading={isLoading}
                            initialValue={pendingPrompt}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
