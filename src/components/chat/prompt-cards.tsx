'use client';

/**
 * PromptCards - Quick action suggestion cards
 * 
 * Displays suggestion prompts for users to quickly start conversations.
 * Based on reference design with 4 cards and refresh button.
 */

import { HeartPulse, Dumbbell, BotMessageSquare, Scale } from 'lucide-react';
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
        id: 'sentiment-analysis',
        title: 'AI Sentiment Classification studies',
        subtitle: 'Support a business or research initiative',
        prompt: 'Help me find the right whitepaper on AI Sentiment Classification analysis examples last 5 years',
        icon: <BotMessageSquare className="h-5 w-5 text-primary" />,
    },
    {
        id: 'ai-ethics',
        title: 'Understand AI ethics fundamentals',
        subtitle: 'Learn the key ethical challenges in AI',
        prompt: 'I’m new to this topic, recommend a whitepaper about ethical issues in AI',

        icon: <Scale className="h-5 w-5 text-primary" />,

    },
    {
        id: 'healthcare-ai',
        title: 'Healthcare AI strategies',
        subtitle: 'Find practical and evidence-based guidance',
        prompt: 'Help me find the right whitepaper on AI-driven healthcare optimization',
        icon: <HeartPulse className="h-5 w-5 text-primary" />,

    },
    {
        id: 'sports-concussions',
        title: 'Explore Rugby and NFL concussion studies',
        subtitle: 'Review scientific and medical findings',
        prompt: 'Show me relevant whitepapers about sports-related concussions in the NFL and Rugby',
        icon: <Dumbbell className="h-5 w-5 text-primary" />,
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
