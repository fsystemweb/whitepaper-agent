'use client';

/**
 * WelcomeScreen - Personalized greeting shown when no messages
 * 
 * Displays "Hi there, [Name]" with highlighted name and subtitle.
 * Based on reference design with mixed typography styling.
 */

import { PromptCards } from './prompt-cards';

interface WelcomeScreenProps {
    userName?: string;
    onSelectPrompt: (prompt: string) => void;
}

export function WelcomeScreen({ userName = 'there', onSelectPrompt }: WelcomeScreenProps) {
    return (
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 max-w-3xl mx-auto w-full">
            {/* Greeting */}
            <div className="text-center mb-8">
                <h1 className="text-3xl md:text-4xl font-medium text-foreground mb-1">
                    Hi{' '}
                    <span className="text-primary">
                        {userName}
                    </span>
                    ,
                </h1>
                <h2 className="text-3xl md:text-4xl font-medium text-foreground">
                    What would{' '}
                    <span className="font-semibold">you like to know?</span>
                </h2>
                <p className="mt-4 text-sm text-muted-foreground">
                    Use one of the most common prompts<br />
                    below or use your own to begin
                </p>
            </div>

            {/* Prompt cards */}
            <PromptCards onSelectPrompt={onSelectPrompt} />
        </div>
    );
}
