'use client';

import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function LanguageSelector() {
    const { t, i18n } = useTranslation('Common');

    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng);
    };

    return (
        <div className="absolute top-4 right-4 z-50">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full bg-background/50 backdrop-blur-sm border border-border hover:bg-muted/50">
                        <Globe className="h-4 w-4 text-muted-foreground" />
                        <span className="sr-only">{t('language')}</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => changeLanguage('es')}>
                        {t('spanish')}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => changeLanguage('en')}>
                        {t('english')}
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}
