
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Logo } from './navbar/Logo';
import { NavItems } from './navbar/NavItems';
import { ProfileMenu } from './navbar/ProfileMenu';
import { MobileMenu } from './navbar/MobileMenu';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, profile, signOut } = useAuth();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-morphism border-b border-gray-100">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Logo />
          
          {/* Desktop menu */}
          <nav className="hidden md:flex items-center space-x-1">
            <NavItems />
          </nav>

          {/* User Profile Menu */}
          {user && (
            <div className="ml-auto mr-4">
              <ProfileMenu user={user} profile={profile} signOut={signOut} />
            </div>
          )}

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
      <MobileMenu 
        isOpen={isMobileMenuOpen} 
        user={user} 
        signOut={signOut} 
        onClose={() => setIsMobileMenuOpen(false)} 
      />
    </header>
  );
};

export default Navbar;
