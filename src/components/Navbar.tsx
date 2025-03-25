
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Bell, Calendar, DollarSign, Home, Menu, MessageCircle, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const Navbar = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: <Home className="w-5 h-5" /> },
    { path: '/expenses', label: 'Expenses', icon: <DollarSign className="w-5 h-5" /> },
    { path: '/calendar', label: 'Calendar', icon: <Calendar className="w-5 h-5" /> },
    { path: '/communications', label: 'Communications', icon: <MessageCircle className="w-5 h-5" /> },
    { path: '/notifications', label: 'Notifications', icon: <Bell className="w-5 h-5" /> }
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-morphism border-b border-gray-100">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center">
            <div className="flex items-center gap-2">
              <div className="bg-famacle-blue rounded-xl w-8 h-8 flex items-center justify-center">
                <span className="text-white font-bold text-lg">F</span>
              </div>
              <h1 className="font-semibold text-famacle-slate text-xl">Famacle</h1>
            </div>
          </Link>
          
          {/* Desktop menu */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link 
                key={item.path}
                to={item.path} 
                className={cn(
                  "px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200",
                  isActive(item.path) 
                    ? "bg-famacle-blue-light text-famacle-blue" 
                    : "text-gray-600 hover:text-famacle-blue hover:bg-famacle-blue-light/50"
                )}
              >
                <div className="flex items-center gap-2">
                  {item.icon}
                  <span>{item.label}</span>
                </div>
              </Link>
            ))}
          </nav>

          {/* Mobile menu button */}
          <button 
            className="md:hidden p-2 text-gray-600 focus:outline-none" 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden animate-fade-in">
          <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-b border-gray-100">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "block px-3 py-2 rounded-md text-base font-medium",
                  isActive(item.path)
                    ? "bg-famacle-blue-light text-famacle-blue"
                    : "text-gray-600 hover:text-famacle-blue hover:bg-famacle-blue-light/50"
                )}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <div className="flex items-center gap-2">
                  {item.icon}
                  <span>{item.label}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
