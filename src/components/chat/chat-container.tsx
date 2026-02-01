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
import { AlertCircle, Trash2 } from 'lucide-react';
import { LanguageSelector } from './language-selector';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';

interface ChatContainerProps {
    systemPromptKey?: 'default' | 'technical' | 'creative';
}

export function ChatContainer({ systemPromptKey = 'default' }: ChatContainerProps) {
    const { t } = useTranslation('MessageList');
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

    const handleDeleteCurrentSession = useCallback(() => {
        if (activeSessionId) {
            deleteSession(activeSessionId);
            clearMessages();
            createNewSession();
        } else {
            clearMessages();
        }
        setIsHistoryOpen(false);
    }, [activeSessionId, deleteSession, clearMessages, createNewSession]);

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
            {/* Main content */}
            <div className="flex-1 flex flex-col md:ml-14 overflow-hidden relative">
                {/* Header */}
                <header className="flex justify-end items-center p-4 absolute top-0 right-0 left-0 z-50 pointer-events-none gap-2">
                    <div className="pointer-events-auto flex items-center gap-2">
                        {hasMessages && (
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={handleDeleteCurrentSession}
                                className="h-9 w-9 rounded-full bg-background/50 border border-border hover:bg-muted/50"
                                title={t('clear')}
                            >
                                <Trash2 className="h-4 w-4 text-muted-foreground" />
                                <span className="sr-only">{t('clear')}</span>
                            </Button>
                        )}
                        <LanguageSelector />
                    </div>
                </header>

                {/* Error message */}
                {error && (
                    <div className="mx-4 mt-16 p-3 rounded-lg bg-destructive/10 text-destructive text-sm flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 shrink-0" />
                        <span>{error}</span>
                    </div>
                )}

                {/* Content area */}
                {hasMessages ? (
                    <MessageList
                        messages={messages}
                        isLoading={isLoading}
                    />
                ) : (
                    <WelcomeScreen
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
