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
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useAuthStore } from '@/stores/auth-store';
import { cn } from '@/lib/utils';

const navigation = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    name: 'Users',
    href: '/users',
    icon: Users,
  },
  {
    name: 'Bookings',
    href: '/bookings',
    icon: Calendar,
  },
  {
    name: 'Transactions',
    href: '/transactions',
    icon: CreditCard,
  },
  {
    name: 'KYC Verification',
    href: '/kyc',
    icon: FileText,
  },
  {
    name: 'Data Management',
    href: '/data-management',
    icon: Database,
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

      {/* Navigation */}
      <nav className="flex-1 px-2 py-6">
        <ul className="space-y-2">
          {navigation.map((item) => {
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
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
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