'use client';

/**
 * PromptCards - Quick action suggestion cards
 * 
 * Displays suggestion prompts for users to quickly start conversations.
 * Based on reference design with 4 cards and refresh button.
 */

import { RefreshCw, FileText, Mail, FileSearch, Cpu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface PromptCard {
    id: string;
    title: string;
    subtitle: string;
    icon: React.ReactNode;
    prompt: string;
}

const defaultPrompts: PromptCard[] = [
    {
        id: 'todo',
        title: 'Write a to-do list for a',
        subtitle: 'personal project or task',
        icon: <FileText className="h-5 w-5 text-primary" />,
        prompt: 'Write a to-do list for a personal project I want to complete this week',
    },
    {
        id: 'email',
        title: 'Generate an email reply',
        subtitle: 'to a job offer',
        icon: <Mail className="h-5 w-5 text-primary" />,
        prompt: 'Help me write a professional email reply to accept a job offer',
    },
    {
        id: 'summarize',
        title: 'Summarize this article or',
        subtitle: 'text for me in one paragraph',
        icon: <FileSearch className="h-5 w-5 text-primary" />,
        prompt: 'Summarize the following text for me in one clear paragraph:',
    },
    {
        id: 'technical',
        title: 'How does AI work in a',
        subtitle: 'technical capacity',
        icon: <Cpu className="h-5 w-5 text-primary" />,
        prompt: 'Explain how AI works from a technical perspective, including neural networks and machine learning',
    },
];

interface PromptCardsProps {
    onSelectPrompt: (prompt: string) => void;
}

export function PromptCards({ onSelectPrompt }: PromptCardsProps) {
    return (
        <div className="space-y-4">
            {/* Prompt cards grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {defaultPrompts.map((card) => (
                    <button
                        key={card.id}
                        onClick={() => onSelectPrompt(card.prompt)}
                        className={cn(
                            'group flex flex-col items-start gap-3 p-4 rounded-xl',
                            'bg-card border border-border',
                            'hover:border-primary/30 hover:shadow-md',
                            'transition-all duration-200 cursor-pointer',
                            'text-left'
                        )}
                    >
                        <div className="p-2 rounded-lg bg-muted/50 group-hover:bg-primary/10 transition-colors">
                            {card.icon}
                        </div>
                        <div className="space-y-0.5">
                            <p className="text-sm font-medium text-foreground leading-snug">
                                {card.title}
                            </p>
                            <p className="text-xs text-muted-foreground leading-snug">
                                {card.subtitle}
                            </p>
                        </div>
                    </button>
                ))}
            </div>

            {/* Refresh button */}
            <button
                className={cn(
                    'flex items-center gap-2 mx-auto px-3 py-1.5',
                    'text-sm text-muted-foreground',
                    'hover:text-foreground transition-colors',
                    'cursor-pointer'
                )}
            >
                <RefreshCw className="h-4 w-4" />
                Refresh Prompts
            </button>
        </div>
    );
}
