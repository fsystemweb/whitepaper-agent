'use client';

/**
 * Sidebar - Minimal icon navigation
 * 
 * Left sidebar with icon buttons for navigation.
 * Includes history panel toggle and new chat button.
 */

import { Plus, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface SidebarProps {
    className?: string;
    isHistoryOpen?: boolean;
    onToggleHistory?: () => void;
    onNewChat?: () => void;
}

export function Sidebar({
    className,
    isHistoryOpen = false,
    onToggleHistory,
    onNewChat,
}: SidebarProps) {
    return (
        <aside className={cn(
            'fixed left-0 top-0 bottom-0 w-14 flex flex-col items-center py-4',
            'bg-background border-r border-border',
            'hidden md:flex',
            className
        )}>
            {/* Logo */}
            <div className="mb-6">
                <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                    <span className="text-primary-foreground font-bold text-sm">W</span>
                </div>
            </div>

            {/* New chat */}
            <IconButton
                icon={<Plus className="h-5 w-5" />}
                label="New chat"
                onClick={onNewChat}
            />

            {/* Divider */}
            <div className="w-6 h-px bg-border my-3" />

            {/* Navigation */}
            <nav className="flex flex-col gap-1">
                <IconButton
                    icon={<Clock className="h-5 w-5" />}
                    label="History"
                    active={isHistoryOpen}
                    onClick={onToggleHistory}
                />
            </nav>

            {/* Spacer */}
            <div className="flex-1" />

            {/* User avatar */}
            <Avatar className="h-8 w-8 cursor-pointer hover:ring-2 hover:ring-primary/50 transition-all" title="Guest">
                <AvatarImage src="" alt="Guest" />
                <AvatarFallback className="bg-gradient-to-br from-violet-500 to-purple-600 text-white text-xs">
                    G
                </AvatarFallback>
            </Avatar>
        </aside>
    );
}

interface IconButtonProps {
    icon: React.ReactNode;
    label: string;
    active?: boolean;
    onClick?: () => void;
}

function IconButton({ icon, label, active, onClick }: IconButtonProps) {
    return (
        <button
            onClick={onClick}
            className={cn(
                'p-2.5 rounded-lg transition-colors cursor-pointer',
                'text-muted-foreground hover:text-foreground hover:bg-muted',
                active && 'text-primary bg-primary/10'
            )}
            aria-label={label}
            title={label}
        >
            {icon}
        </button>
    );
}
