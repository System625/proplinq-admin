'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';

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

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserData | null;
}

export function ProfileModal({ isOpen, onClose, user }: ProfileModalProps) {
  if (!isOpen || !user) {
    return null;
  }

  const getInitials = (name?: string) => {
    if (!name) return 'U';
    const names = name.split(' ');
    if (names.length > 1) {
      return `${names[0].charAt(0)}${names[1].charAt(0)}`;
    }
    return name.charAt(0);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Admin Profile</DialogTitle>
          <DialogDescription>
            Details of the currently logged-in administrator.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="flex-1 pr-2">
          <div className="flex flex-col items-center space-y-4 pt-4">
            <Avatar className="h-24 w-24">
              <AvatarImage src={user.avatar} alt={user.full_name || 'User'} />
              <AvatarFallback className="text-3xl">
                {getInitials(user.full_name)}
              </AvatarFallback>
            </Avatar>
            <div className="text-center">
              <h2 className="text-2xl font-semibold">{user.full_name}</h2>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>
          <div className="grid gap-4 py-4">
            <ProfileDetail label="Role" value={user.role} />
            <ProfileDetail label="Phone Number" value={user.phone_number} />
            <ProfileDetail label="WhatsApp Number" value={user.whatsapp_number} />
            <ProfileDetail label="Location" value={user.location} />
            <ProfileDetail label="Agency Name" value={user.agency_name} />
            <ProfileDetail label="Agent Type" value={user.agent_type} />
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

function ProfileDetail({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <div className="grid grid-cols-3 items-center gap-4">
      <span className="text-right font-medium text-muted-foreground">{label}</span>
      <span className="col-span-2 capitalize">{value.replace(/_/g, ' ')}</span>
    </div>
  );
}
