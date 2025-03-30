
import { Link, useLocation } from 'react-router-dom';
import { Bell, Calendar, DollarSign, Home, MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

type NavItemProps = {
  path: string;
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick?: () => void;
};

export const NavItem = ({ path, label, icon, isActive, onClick }: NavItemProps) => {
  return (
    <Link 
      to={path} 
      className={cn(
        "px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200",
        isActive 
          ? "bg-famacle-blue-light text-famacle-blue" 
          : "text-gray-600 hover:text-famacle-blue hover:bg-famacle-blue-light/50"
      )}
      onClick={onClick}
    >
      <div className="flex items-center gap-2">
        {icon}
        <span>{label}</span>
      </div>
    </Link>
  );
};

export const getNavItems = () => [
  { path: '/dashboard', label: 'Dashboard', icon: <Home className="w-5 h-5" /> },
  { path: '/expenses', label: 'Expenses', icon: <DollarSign className="w-5 h-5" /> },
  { path: '/calendar', label: 'Calendar', icon: <Calendar className="w-5 h-5" /> },
  { path: '/communications', label: 'Communications', icon: <MessageCircle className="w-5 h-5" /> },
  { path: '/notifications', label: 'Notifications', icon: <Bell className="w-5 h-5" /> }
];

export const NavItems = ({ isMobile, onItemClick }: { isMobile?: boolean; onItemClick?: () => void }) => {
  const location = useLocation();
  const navItems = getNavItems();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <>
      {navItems.map((item) => (
        <NavItem
          key={item.path}
          path={item.path}
          label={item.label}
          icon={item.icon}
          isActive={isActive(item.path)}
          onClick={onItemClick}
        />
      ))}
    </>
  );
};
