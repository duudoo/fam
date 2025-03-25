
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const HomeHeader = () => {
  return (
    <header className="py-4 px-6">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <div className="bg-famacle-blue rounded-xl w-8 h-8 flex items-center justify-center mr-2">
            <span className="text-white font-bold text-lg">F</span>
          </div>
          <h2 className="font-semibold text-famacle-slate text-xl">Famacle</h2>
        </div>
        
        <div className="flex items-center gap-4">
          <nav className="hidden md:flex items-center mr-4">
            <Link to="/" className="px-3 py-2 text-famacle-slate hover:text-famacle-blue transition-colors">Home</Link>
            <a href="/#features" className="px-3 py-2 text-famacle-slate hover:text-famacle-blue transition-colors">Features</a>
          </nav>
          
          <Button asChild variant="outline">
            <Link to="/landing">
              Sign In
            </Link>
          </Button>
          <Button asChild>
            <Link to="/landing">
              Sign Up
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default HomeHeader;
