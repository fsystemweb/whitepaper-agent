'use client';

/**
 * ChatContainer - Main chat interface
 * 
 * Redesigned to match modern minimalist reference.
 * Full-page layout with welcome screen and centered input.
 */

import { useState, useCallback } from 'react';
import { MessageList } from './message-list';
import { ChatInput } from './chat-input';
import { WelcomeScreen } from './welcome-screen';
import { Sidebar } from './sidebar';
import { useChat } from '@/hooks/use-chat';
import { AlertCircle } from 'lucide-react';

interface ChatContainerProps {
    systemPromptKey?: 'default' | 'technical' | 'creative';
}

export function ChatContainer({ systemPromptKey = 'default' }: ChatContainerProps) {
    const { messages, isLoading, error, sendMessage, clearMessages } = useChat({
        systemPromptKey,
    });
    const [pendingPrompt, setPendingPrompt] = useState('');

    const handleSelectPrompt = useCallback((prompt: string) => {
        setPendingPrompt(prompt);
    }, []);

    const handleSendMessage = useCallback(async (message: string) => {
        setPendingPrompt(''); // Clear pending prompt after sending
        await sendMessage(message);
    }, [sendMessage]);

    const hasMessages = messages.length > 0;

    return (
        <div className="flex h-screen">
            {/* Sidebar */}
            <Sidebar />

            {/* Main content */}
            <div className="flex-1 flex flex-col md:ml-14">
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
                        onClear={clearMessages}
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
