'use client';

/**
 * PromptCards - Quick action suggestion cards
 * 
 * Displays suggestion prompts for users to quickly start conversations.
 * Based on reference design with 4 cards and refresh button.
 */

import { useTranslation } from 'react-i18next';
import { HeartPulse, Dumbbell, BotMessageSquare, Scale } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PromptCard {
    id: string;
    title: string;
    subtitle: string;
    icon: React.ReactNode;
    prompt: string;
}

interface PromptCardsProps {
    onSelectPrompt: (prompt: string) => void;
}

export function PromptCards({ onSelectPrompt }: PromptCardsProps) {
    const { t } = useTranslation('PromptCards');

    const defaultPrompts: PromptCard[] = [
        {
            id: 'sentiment-analysis',
            title: t('card1.title'),
            subtitle: t('card1.subtitle'),
            prompt: t('card1.prompt'),
            icon: <BotMessageSquare className="h-5 w-5 text-primary" />,
        },
        {
            id: 'ai-ethics',
            title: t('card2.title'),
            subtitle: t('card2.subtitle'),
            prompt: t('card2.prompt'),
            icon: <Scale className="h-5 w-5 text-primary" />,
        },
        {
            id: 'healthcare-ai',
            title: t('card3.title'),
            subtitle: t('card3.subtitle'),
            prompt: t('card3.prompt'),
            icon: <HeartPulse className="h-5 w-5 text-primary" />,
        },
        {
            id: 'sports',
            title: t('card4.title'),
            subtitle: t('card4.subtitle'),
            prompt: t('card4.prompt'),
            icon: <Dumbbell className="h-5 w-5 text-primary" />,
        },
    ];

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
