'use client';

import { useState } from 'react';
import { Bell, User, Moon, Sun, Shield } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuthStore } from '@/stores/auth-store';
import { ProfileModal } from '@/components/modals/profile-modal';

interface HeaderProps {
  title?: string;
}

// This interface should be kept in sync with the user data structure
interface UserData {
  full_name?: string;
  email?: string;
  role?: string;
  phone_number?: string;
  location?: string;
  agency_name?: string;
  agent_type?: string;
  whatsapp_number?: string;
  avatar?: string;
}

export function Header({ title }: HeaderProps) {
  const { user, logout, getRoleDisplayName } = useAuthStore();
  const { theme, setTheme } = useTheme();
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const roleName = getRoleDisplayName();

  const handleLogout = () => {
    logout();
    window.location.href = '/login'; // Force page reload to ensure clean state
  };

  return (
    <>
      <header className="flex h-16 items-center justify-between border-b bg-background px-6">
        <div>
          {title && (
            <h1 className="text-2xl font-semibold text-foreground">{title}</h1>
          )}
        </div>

        <div className="flex items-center space-x-4">
          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>

          {/* Notifications */}
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={(user as UserData)?.avatar} alt={(user as UserData)?.full_name || 'User'} />
                  <AvatarFallback>
                    {(user as UserData)?.full_name?.charAt(0) || 'U'}
                    {(user as UserData)?.full_name?.split(' ')[1]?.charAt(0) || ''}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-2">
                  <p className="text-sm font-medium leading-none">
                    {(user as UserData)?.full_name || 'Admin'}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {(user as UserData)?.email || 'admin@proplinq.com'}
                  </p>
                  <Badge variant="secondary" className="w-fit">
                    <Shield className="mr-1 h-3 w-3" />
                    {roleName}
                  </Badge>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setIsProfileModalOpen(true)}>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        user={user as UserData | null}
      />
    </>
  );
}