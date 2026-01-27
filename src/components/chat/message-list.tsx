'use client';

/**
 * MessageList - Displays chat messages with auto-scroll
 * 
 * Uses shadcn/ui ScrollArea with optimized rendering.
 * Follows rendering-hoist-jsx and content-visibility patterns.
 */

import { useEffect, useRef } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageBubble } from './message-bubble';
import { TypingIndicator } from './typing-indicator';
import type { Message } from '@/hooks/use-chat';

interface MessageListProps {
    messages: Message[];
    isLoading: boolean;
}

// Hoisted static content (rendering-hoist-jsx pattern)
const EmptyState = (
    <div className="flex-1 flex items-center justify-center text-muted-foreground">
        <div className="text-center space-y-2">
            <div className="text-4xl">💬</div>
            <p className="text-lg font-medium">Start a conversation</p>
            <p className="text-sm">Send a message to begin chatting with the AI assistant.</p>
        </div>
    </div>
);

export function MessageList({ messages, isLoading }: MessageListProps) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }
    }, [messages, isLoading]);

    if (messages.length === 0) {
        return EmptyState;
    }

    return (
        <ScrollArea className="flex-1 px-2" ref={containerRef}>
            <div className="py-4 space-y-1">
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
    );
}
