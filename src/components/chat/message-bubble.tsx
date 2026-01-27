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

interface MessageBubbleProps {
    role: 'user' | 'assistant' | 'system';
    content: string;
    isStreaming?: boolean;
}

/**
 * Simple markdown-like text rendering
 * Handles code blocks and basic formatting
 */
function renderContent(content: string): React.ReactNode {
    if (!content) {
        return null;
    }

    // Split by code blocks
    const parts = content.split(/(```[\s\S]*?```)/g);

    return parts.map((part, index) => {
        // Code block
        if (part.startsWith('```') && part.endsWith('```')) {
            const codeContent = part.slice(3, -3);
            const firstNewline = codeContent.indexOf('\n');
            const language = firstNewline > 0 ? codeContent.slice(0, firstNewline).trim() : '';
            const code = firstNewline > 0 ? codeContent.slice(firstNewline + 1) : codeContent;

            return (
                <pre
                    key={index}
                    className="mt-2 mb-2 p-3 rounded-lg bg-muted/50 overflow-x-auto text-sm font-mono"
                >
                    {language && (
                        <div className="text-xs text-muted-foreground mb-2">{language}</div>
                    )}
                    <code>{code}</code>
                </pre>
            );
        }

        // Regular text - handle inline code and bold
        const segments = part.split(/(`[^`]+`|\*\*[^*]+\*\*)/g);
        return (
            <span key={index}>
                {segments.map((segment, segIndex) => {
                    // Inline code
                    if (segment.startsWith('`') && segment.endsWith('`')) {
                        return (
                            <code
                                key={segIndex}
                                className="px-1.5 py-0.5 rounded bg-muted text-sm font-mono"
                            >
                                {segment.slice(1, -1)}
                            </code>
                        );
                    }
                    // Bold text
                    if (segment.startsWith('**') && segment.endsWith('**')) {
                        return <strong key={segIndex}>{segment.slice(2, -2)}</strong>;
                    }
                    return segment;
                })}
            </span>
        );
    });
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
                <div className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                    {renderContent(content)}
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
