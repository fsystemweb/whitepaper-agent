'use client';

/**
 * MessageList - Displays chat messages with auto-scroll
 * 
 * Redesigned with clear button in header.
 */

import { useEffect, useRef } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { MessageBubble } from './message-bubble';
import { TypingIndicator } from './typing-indicator';
import { Trash2 } from 'lucide-react';
import type { Message } from '@/hooks/use-chat';

interface MessageListProps {
    messages: Message[];
    isLoading: boolean;
    onClear?: () => void;
}

export function MessageList({ messages, isLoading, onClear }: MessageListProps) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }
    }, [messages, isLoading]);

    return (
        <div className="flex-1 flex flex-col overflow-hidden">
            {/* Header with clear button */}
            {onClear && messages.length > 0 && (
                <div className="flex justify-end px-4 py-2 border-b border-border/50">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onClear}
                        className="text-muted-foreground hover:text-destructive cursor-pointer"
                    >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Clear
                    </Button>
                </div>
            )}

            {/* Messages */}
            <ScrollArea className="flex-1 min-h-0" ref={containerRef}>
                <div className="max-w-3xl mx-auto py-4 px-4 space-y-1">
                    {messages.map((message, index) => {
                        const isLastMessage = index === messages.length - 1;
                        const isStreamingMessage = isLastMessage && isLoading && message.role === 'assistant';

                        return (
                            <MessageBubble
                                key={message.id}
                                role={message.role}
                                content={message.content}
                                isStreaming={isStreamingMessage}
                            />
                        );
                    })}

                    {/* Show typing indicator while loading and last message is from user */}
                    {isLoading && messages.length > 0 && messages[messages.length - 1].role === 'user' && (
                        <div className="px-4 py-3">
                            <TypingIndicator />
                        </div>
                    )}

                    {/* Scroll anchor */}
                    <div ref={scrollRef} />
                </div>
            </ScrollArea>
        </div>
    );
}
