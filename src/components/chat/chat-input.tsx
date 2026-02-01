'use client';

/**
 * ChatInput - Modern message input with attachments
 * 
 * Redesigned to match reference with floating card,
 * attachment buttons, and character counter.
 */

import { useState, useCallback, useEffect, type KeyboardEvent, type FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Send, Loader2, Paperclip, Image, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatInputProps {
    onSend: (message: string) => Promise<void>;
    isLoading: boolean;
    disabled?: boolean;
    initialValue?: string;
}

const MAX_CHARS = 1000;

export function ChatInput({ onSend, isLoading, disabled, initialValue = '' }: ChatInputProps) {
    const [input, setInput] = useState(initialValue);

    // Sync with initialValue (for prompt card selection)
    useEffect(() => {
        if (initialValue) {
            setInput(initialValue);
        }
    }, [initialValue]);

    const handleSubmit = useCallback(async (e?: FormEvent) => {
        e?.preventDefault();

        if (!input.trim() || isLoading || disabled) return;

        const message = input;
        setInput(''); // Clear immediately for better UX

        await onSend(message);
    }, [input, isLoading, disabled, onSend]);

    const handleKeyDown = useCallback((e: KeyboardEvent<HTMLTextAreaElement>) => {
        // Submit on Enter (without Shift for newline)
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    }, [handleSubmit]);

    const isDisabled = isLoading || disabled;
    const charCount = input.length;

    return (
        <form
            onSubmit={handleSubmit}
            className={cn(
                'relative rounded-2xl border border-border bg-card shadow-lg',
                'transition-shadow hover:shadow-xl focus-within:shadow-xl',
                'focus-within:border-primary/30'
            )}
        >
            {/* Text input */}
            <textarea
                value={input}
                onChange={(e) => setInput(e.target.value.slice(0, MAX_CHARS))}
                onKeyDown={handleKeyDown}
                placeholder={isLoading ? 'AI is responding...' : 'Ask whatever you want...'}
                disabled={isDisabled}
                rows={1}
                className={cn(
                    'w-full resize-none bg-transparent px-4 pt-4 pb-12',
                    'text-sm placeholder:text-muted-foreground',
                    'focus:outline-none',
                    'min-h-[52px] max-h-[200px]',
                    isDisabled && 'opacity-50 cursor-not-allowed'
                )}
                style={{
                    height: 'auto',
                    minHeight: '52px',
                }}
                aria-label="Chat message input"
            />

            {/* Bottom bar */}
            <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-3 pb-3">
                {/* Left: Placeholder for future buttons */}
                <div className="flex items-center gap-1">
                </div>

                {/* Right: Model selector, counter, send */}
                <div className="flex items-center gap-2">
                    {/* AI Model selector */}
                    <button
                        type="button"
                        className={cn(
                            'hidden sm:flex items-center gap-1 px-2 py-1 rounded-lg',
                            'text-xs text-muted-foreground',
                            'hover:text-foreground hover:bg-muted',
                            'transition-colors cursor-pointer'
                        )}
                    >
                        <img src="/arXiv.png" alt="arXiv logo" width={20} height={20} />
                        arXiv
                    </button>

                    {/* Character counter */}
                    <span className={cn(
                        'text-xs tabular-nums',
                        charCount >= MAX_CHARS ? 'text-destructive' : 'text-muted-foreground'
                    )}>
                        {charCount}/{MAX_CHARS}
                    </span>

                    {/* Send button */}
                    <Button
                        type="submit"
                        size="icon"
                        disabled={isDisabled || !input.trim()}
                        className={cn(
                            'h-8 w-8 rounded-full shrink-0',
                            'bg-primary hover:bg-primary/90',
                            'disabled:opacity-50'
                        )}
                        aria-label="Send message"
                    >
                        {isLoading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <Send className="h-4 w-4" />
                        )}
                    </Button>
                </div>
            </div>
        </form>
    );
}
