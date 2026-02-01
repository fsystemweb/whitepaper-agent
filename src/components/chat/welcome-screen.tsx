'use client';

/**
 * WelcomeScreen - Personalized greeting shown when no messages
 * 
 * Displays "Hi there, [Name]" with highlighted name and subtitle.
 * Based on reference design with mixed typography styling.
 */

import { PromptCards } from './prompt-cards';
import { useTranslation } from 'react-i18next';

interface WelcomeScreenProps {
    userName?: string;
    onSelectPrompt: (prompt: string) => void;
}

export function WelcomeScreen({ userName, onSelectPrompt }: WelcomeScreenProps) {
    const { t } = useTranslation('WelcomeScreen');
    const displayUserName = userName || t('defaultName');

    return (
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 max-w-3xl mx-auto w-full">
            {/* Greeting */}
            <div className="text-center mb-8">
                <h1 className="text-3xl md:text-4xl font-medium text-foreground mb-1">
                    {t('greeting')}{' '}
                    <span className="text-primary">
                        {displayUserName}
                    </span>
                    {t('greetingSuffix')}
                </h1>
                <h2 className="text-3xl md:text-4xl font-medium text-foreground">
                    {t('titlePart1')}{' '}
                    <span className="font-semibold">{t('titlePart2')}</span>
                </h2>
                <p className="mt-4 text-sm text-muted-foreground">
                    {t('subtitle')}
                </p>
            </div>

            {/* Prompt cards */}
            <PromptCards onSelectPrompt={onSelectPrompt} />
        </div>
    );
}
