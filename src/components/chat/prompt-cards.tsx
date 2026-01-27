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
        title: 'I’m new to this topic — recommend a whitepaper',
        subtitle: 'For personal learning or a specific task',
        icon: <FileText className="h-5 w-5 text-primary" />,
        prompt: 'I’m new to this topic — recommend a whitepaper',
    },
    {
        id: 'summarize',
        title: 'Help me find the right whitepaper',
        subtitle: 'For a professional requirement',
        icon: <Mail className="h-5 w-5 text-primary" />,
        prompt: 'Help me find the right whitepaper',
    },
    {
        id: 'search',
        title: 'Show me relevant whitepapers about ',
        subtitle: 'I’ll describe what I’m looking for in my own words',
        icon: <FileSearch className="h-5 w-5 text-primary" />,
        prompt: 'Show me relevant whitepapers about ',
    },
    {
        id: 'technical',
        title: 'Recommend something based on my role',
        subtitle: 'Tailored to my responsibilities and expertise',
        icon: <Cpu className="h-5 w-5 text-primary" />,
        prompt: 'Recommend something based on my role',
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
        </div>
    );
}
