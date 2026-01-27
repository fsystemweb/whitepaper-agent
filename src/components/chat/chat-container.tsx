'use client';

/**
 * ChatContainer - Main chat interface
 * 
 * Integrates useChat hook with UI components.
 * Uses shadcn/ui Card component.
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageList } from './message-list';
import { ChatInput } from './chat-input';
import { useChat } from '@/hooks/use-chat';
import { Trash2, AlertCircle, Bot } from 'lucide-react';

interface ChatContainerProps {
    systemPromptKey?: 'default' | 'technical' | 'creative';
}

export function ChatContainer({ systemPromptKey = 'default' }: ChatContainerProps) {
    const { messages, isLoading, error, sendMessage, clearMessages } = useChat({
        systemPromptKey,
    });

    return (
        <Card className="w-full max-w-3xl mx-auto h-[calc(100vh-4rem)] flex flex-col shadow-xl">
            {/* Header */}
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b shrink-0">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Bot className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                        <CardTitle className="text-lg">AI Assistant</CardTitle>
                        <p className="text-sm text-muted-foreground">
                            {systemPromptKey === 'technical' && 'Technical Expert'}
                            {systemPromptKey === 'creative' && 'Creative Writer'}
                            {systemPromptKey === 'default' && 'General Assistant'}
                        </p>
                    </div>
                </div>

                {messages.length > 0 && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearMessages}
                        className="text-muted-foreground hover:text-destructive"
                    >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Clear
                    </Button>
                )}
            </CardHeader>

            {/* Messages */}
            <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
                {/* Error message */}
                {error && (
                    <div className="mx-4 mt-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 shrink-0" />
                        <span>{error}</span>
                    </div>
                )}

                {/* Message list */}
                <MessageList messages={messages} isLoading={isLoading} />

                {/* Input */}
                <ChatInput
                    onSend={sendMessage}
                    isLoading={isLoading}
                />
            </CardContent>
        </Card>
    );
}
