
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { NavItems } from './NavItems';
import { UserProfile } from '@/hooks/useAuth';
import { 
  Home, 
  Calendar, 
  DollarSign, 
  MessageCircle, 
  Bell, 
  Settings, 
  LogOut 
} from 'lucide-react';

interface MobileMenuProps {
  isOpen: boolean;
  user: any;
  signOut: () => Promise<void>;
  onClose: () => void;
}

export const MobileMenu = ({ isOpen, user, signOut, onClose }: MobileMenuProps) => {
  if (!isOpen) return null;

  return (
    <div className="animate-fade-in">
      <div className="space-y-1">
        <NavItems isMobile onItemClick={onClose} />
        
        {user && (
          <div className="mt-6 border-t pt-4">
            <div className="px-3 py-2 text-sm font-medium text-muted-foreground">
              User Settings
            </div>
            
            <Link
              to="/settings"
              className="flex items-center gap-3 py-3 px-4 text-gray-600 hover:text-famacle-blue transition-colors duration-200"
              onClick={onClose}
            >
              <Settings className="w-5 h-5" />
              <span>Settings</span>
            </Link>
            
            <button
              onClick={() => {
                signOut();
                onClose();
              }}
              className="flex w-full items-center gap-3 py-3 px-4 text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors duration-200"
            >
              <LogOut className="w-5 h-5" />
              <span>Sign Out</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
