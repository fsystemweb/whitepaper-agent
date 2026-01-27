'use client';

/**
 * TypingIndicator - AI typing animation
 */

import { cn } from '@/lib/utils';

interface TypingIndicatorProps {
    className?: string;
}

export function TypingIndicator({ className }: TypingIndicatorProps) {
    return (
        <div className={cn('flex items-center space-x-1', className)}>
            <div className="flex space-x-1">
                <div
                    className="h-2 w-2 rounded-full bg-muted-foreground/50 animate-bounce"
                    style={{ animationDelay: '0ms', animationDuration: '600ms' }}
                />
                <div
                    className="h-2 w-2 rounded-full bg-muted-foreground/50 animate-bounce"
                    style={{ animationDelay: '150ms', animationDuration: '600ms' }}
                />
                <div
                    className="h-2 w-2 rounded-full bg-muted-foreground/50 animate-bounce"
                    style={{ animationDelay: '300ms', animationDuration: '600ms' }}
                />
            </div>
            <span className="text-sm text-muted-foreground ml-2">AI is thinking...</span>
        </div>
    );
}
