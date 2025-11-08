'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import {
  LayoutDashboard,
  Users,
  Calendar,
  CreditCard,
  FileText,
  Database,
  LogOut,
  Menu,
  X,
  PenTool,
  Headphones,
  Settings,
  TrendingUp,
  UserPlus,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuthStore } from '@/stores/auth-store';
import { cn } from '@/lib/utils';
import { Feature } from '@/types/rbac';
import { useMemo } from 'react';

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  feature: Feature;
}

const navigation: NavigationItem[] = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    feature: 'dashboard',
  },
  {
    name: 'Support Dashboard',
    href: '/support-dashboard',
    icon: Headphones,
    feature: 'support-dashboard',
  },
  {
    name: 'Operations Dashboard',
    href: '/operations-dashboard',
    icon: Settings,
    feature: 'operations-dashboard',
  },
  {
    name: 'Sales Dashboard',
    href: '/sales-dashboard',
    icon: UserPlus,
    feature: 'sales-dashboard',
  },
  {
    name: 'Marketing Dashboard',
    href: '/marketing-dashboard',
    icon: TrendingUp,
    feature: 'marketing-dashboard',
  },
  {
    name: 'Users',
    href: '/users',
    icon: Users,
    feature: 'users',
  },
  {
    name: 'Blog Posts',
    href: '/blog-posts',
    icon: PenTool,
    feature: 'blog-posts',
  },
  {
    name: 'Bookings',
    href: '/bookings',
    icon: Calendar,
    feature: 'bookings',
  },
  {
    name: 'Transactions',
    href: '/transactions',
    icon: CreditCard,
    feature: 'transactions',
  },
  {
    name: 'KYC Verification',
    href: '/kyc',
    icon: FileText,
    feature: 'kyc',
  },
  {
    name: 'Data Management',
    href: '/data-management',
    icon: Database,
    feature: 'data-management',
  },
];

interface SidebarProps {
  className?: string;
  isCollapsed?: boolean;
  onToggle?: () => void;
}

export function Sidebar({ className, isCollapsed = false, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const logout = useAuthStore((state) => state.logout);
  const hasPermission = useAuthStore((state) => state.hasPermission);

  // Filter navigation items based on user permissions
  const filteredNavigation = useMemo(() => {
    return navigation.filter((item) => hasPermission(item.feature, 'view'));
  }, [hasPermission]);

  return (
    <div className={cn("flex h-full flex-col bg-background border-r transition-all duration-300", isCollapsed ? "w-16" : "w-64", className)}>
      {/* Logo */}
      <div className="flex h-16 items-center px-3">
        {onToggle && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
            className="h-8 w-8 shrink-0"
          >
            {isCollapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
          </Button>
        )}
        {!isCollapsed && (
          <Link href="/dashboard" className="flex items-center space-x-3 ml-2">
            <Image
              src="/images/logo.png"
              alt="PropLinq Logo"
              width={32}
              height={32}
              className="rounded-lg"
            />
            <span className="text-xl font-bold text-proplinq-blue">
              PropLinq
            </span>
          </Link>
        )}
        {isCollapsed && (
          <Link href="/dashboard" className="flex items-center justify-center ml-1">
            <Image
              src="/images/logo.png"
              alt="PropLinq Logo"
              width={24}
              height={24}
              className="rounded-lg"
            />
          </Link>
        )}
      </div>

      <Separator />

      {/* Navigation with ScrollArea */}
      <ScrollArea className="flex-1 px-2">
        <nav className="py-6">
          <ul className="space-y-2">
            {filteredNavigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                      isCollapsed ? "justify-center" : "space-x-3",
                      isActive
                        ? "bg-proplinq-blue text-white"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100"
                    )}
                    title={isCollapsed ? item.name : undefined}
                  >
                    <item.icon className="h-5 w-5 shrink-0" />
                    {!isCollapsed && <span>{item.name}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </ScrollArea>

      <Separator />

      {/* Logout */}
      <div className="p-2">
        <Button
          onClick={logout}
          variant="ghost"
          className={cn(
            "w-full text-gray-600 hover:bg-gray-100 hover:text-gray-900",
            isCollapsed ? "justify-center px-3" : "justify-start"
          )}
          title={isCollapsed ? "Sign Out" : undefined}
        >
          <LogOut className={cn("h-5 w-5", !isCollapsed && "mr-3")} />
          {!isCollapsed && "Sign Out"}
        </Button>
      </div>
    </div>
  );
}