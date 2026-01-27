'use client';

/**
 * ChatHistory - History panel component
 * 
 * Displays past chat sessions in a slide-out panel.
 * Shows session title (truncated first message) and date.
 */

import { X, Trash2, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ChatSession } from '@/hooks/use-chat-history';

interface ChatHistoryProps {
    isOpen: boolean;
    onClose: () => void;
    sessions: ChatSession[];
    activeSessionId: string | null;
    onSelectSession: (sessionId: string) => void;
    onDeleteSession: (sessionId: string) => void;
}

export function ChatHistory({
    isOpen,
    onClose,
    sessions,
    activeSessionId,
    onSelectSession,
    onDeleteSession,
}: ChatHistoryProps) {
    const formatDate = (date: Date) => {
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));

        if (days === 0) return 'Today';
        if (days === 1) return 'Yesterday';
        if (days < 7) return `${days} days ago`;
        return date.toLocaleDateString();
    };

    return (
        <>
            {/* Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={onClose}
                />
            )}

            {/* Panel */}
            <div
                className={cn(
                    'fixed top-0 bottom-0 w-72 bg-background border-r border-border z-40',
                    'transition-all duration-300 ease-in-out',
                    'flex flex-col',
                    // Mobile: starts at left-0, slides to -100% when closed
                    // Desktop: starts at left-14 (56px), needs to slide left by full width + 14
                    isOpen
                        ? 'left-0 md:left-14'
                        : '-left-72'
                )}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-border">
                    <h2 className="font-semibold text-foreground">Chat History</h2>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                        aria-label="Close history"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Sessions list */}
                <div className="flex-1 overflow-y-auto p-2">
                    {sessions.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
                            <MessageSquare className="h-8 w-8 mb-2 opacity-50" />
                            <p className="text-sm">No conversations yet</p>
                        </div>
                    ) : (
                        <div className="space-y-1">
                            {sessions.map((session) => (
                                <div
                                    key={session.id}
                                    role="button"
                                    tabIndex={0}
                                    onClick={() => onSelectSession(session.id)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' || e.key === ' ') {
                                            e.preventDefault();
                                            onSelectSession(session.id);
                                        }
                                    }}
                                    className={cn(
                                        'w-full text-left p-3 rounded-lg transition-colors group cursor-pointer',
                                        'hover:bg-muted',
                                        activeSessionId === session.id && 'bg-primary/10 border border-primary/20'
                                    )}
                                >
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-foreground truncate">
                                                {session.title}
                                            </p>
                                            <p className="text-xs text-muted-foreground mt-0.5">
                                                {formatDate(session.updatedAt)}
                                            </p>
                                        </div>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onDeleteSession(session.id);
                                            }}
                                            className={cn(
                                                'p-1.5 rounded-md opacity-0 group-hover:opacity-100',
                                                'text-muted-foreground hover:text-destructive hover:bg-destructive/10',
                                                'transition-all'
                                            )}
                                            aria-label="Delete session"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
