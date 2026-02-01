'use client';

/**
 * MessageBubble - Individual message styling
 * 
 * User vs AI message differentiation with avatar integration.
 */

import { memo } from 'react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { User, Bot } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface MessageBubbleProps {
    role: 'user' | 'assistant' | 'system';
    content: string;
    isStreaming?: boolean;
}



function MessageBubbleComponent({ role, content, isStreaming }: MessageBubbleProps) {
    const isUser = role === 'user';

    return (
        <div
            className={cn(
                'flex gap-3 px-4 py-3',
                isUser ? 'flex-row-reverse' : 'flex-row'
            )}
        >
            {/* Avatar */}
            <Avatar className="h-8 w-8 shrink-0">
                <AvatarFallback
                    className={cn(
                        isUser
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted text-muted-foreground'
                    )}
                >
                    {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                </AvatarFallback>
            </Avatar>

            {/* Message bubble */}
            <div
                className={cn(
                    'max-w-[80%] rounded-2xl px-4 py-3',
                    isUser
                        ? 'bg-primary text-primary-foreground rounded-br-md'
                        : 'bg-muted rounded-bl-md',
                    isStreaming && !content && 'min-w-[60px]'
                )}
            >
                <div className="text-sm leading-normal break-words">
                    <div className="markdown-content">
                        <ReactMarkdown
                            components={{
                                a: ({ ...props }) => (
                                    <a
                                        {...props}
                                        className="text-blue-500 hover:underline"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    />
                                ),
                                p: ({ ...props }) => <p {...props} className="mb-2 last:mb-0" />,
                                ul: ({ ...props }) => <ul {...props} className="list-disc pl-4 mb-2" />,
                                ol: ({ ...props }) => <ol {...props} className="list-decimal pl-4 mb-2" />,
                                li: ({ ...props }) => <li {...props} className="mb-1" />,
                                code: ({ className, children, ...props }) => {
                                    const match = /language-(\w+)/.exec(className || '');
                                    const isInline = !match && !className;
                                    return isInline ? (
                                        <code
                                            {...props}
                                            className="px-1.5 py-0.5 rounded bg-muted text-sm font-mono"
                                        >
                                            {children}
                                        </code>
                                    ) : (
                                        <code {...props} className={className}>
                                            {children}
                                        </code>
                                    );
                                },
                                pre: ({ ...props }) => (
                                    <pre
                                        {...props}
                                        className="mt-2 mb-2 p-3 rounded-lg bg-muted/50 overflow-x-auto text-sm font-mono"
                                    />
                                ),
                            }}
                        >
                            {content}
                        </ReactMarkdown>
                    </div>
                    {isStreaming && !content && (
                        <span className="inline-block w-2 h-4 bg-current animate-pulse" />
                    )}
                </div>
            </div>
        </div>
    );
}

// Memoize to prevent unnecessary re-renders (rerender-memo pattern)
export const MessageBubble = memo(MessageBubbleComponent);
MessageBubble.displayName = 'MessageBubble';
