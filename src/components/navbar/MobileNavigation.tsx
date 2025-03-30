
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { MobileMenu } from './MobileMenu';
import { useAuth } from '@/hooks/useAuth';
import Logo from './Logo';

const MobileNavigation = () => {
  const { user, signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  
  const handleClose = () => {
    setIsOpen(false);
  };
  
  return (
    <div className="md:hidden flex items-center justify-between w-full px-4 py-2">
      <Link to="/" className="flex items-center">
        <Logo height={36} />
      </Link>
      
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="relative">
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[80%] sm:w-[350px] pt-12">
          <MobileMenu 
            isOpen={isOpen} 
            user={user} 
            signOut={signOut} 
            onClose={handleClose} 
          />
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default MobileNavigation;
