'use client';

/**
 * ChatInput - Message input with send button
 * 
 * Uses shadcn/ui Input and Button components.
 * Follows loading-buttons UX pattern.
 */

import { useState, useCallback, type KeyboardEvent, type FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatInputProps {
    onSend: (message: string) => Promise<void>;
    isLoading: boolean;
    disabled?: boolean;
}

export function ChatInput({ onSend, isLoading, disabled }: ChatInputProps) {
    const [input, setInput] = useState('');

    const handleSubmit = useCallback(async (e?: FormEvent) => {
        e?.preventDefault();

        if (!input.trim() || isLoading || disabled) return;

        const message = input;
        setInput(''); // Clear immediately for better UX

        await onSend(message);
    }, [input, isLoading, disabled, onSend]);

    const handleKeyDown = useCallback((e: KeyboardEvent<HTMLInputElement>) => {
        // Submit on Enter (without Shift for newline in future textarea)
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    }, [handleSubmit]);

    const isDisabled = isLoading || disabled;

    return (
        <form
            onSubmit={handleSubmit}
            className="flex items-center gap-2 p-4 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
        >
            <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={isLoading ? 'AI is responding...' : 'Type your message...'}
                disabled={isDisabled}
                className={cn(
                    'flex-1 h-11',
                    isDisabled && 'opacity-50'
                )}
                autoComplete="off"
                aria-label="Chat message input"
            />

            <Button
                type="submit"
                size="icon"
                disabled={isDisabled || !input.trim()}
                className="h-11 w-11 shrink-0"
                aria-label="Send message"
            >
                {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                    <Send className="h-5 w-5" />
                )}
            </Button>
        </form>
    );
}
