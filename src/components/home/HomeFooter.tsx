
import { Link } from 'react-router-dom';

const HomeFooter = () => {
  return (
    <footer className="py-12 bg-gray-50 text-gray-600">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-6 md:mb-0">
            <div className="bg-famacle-blue rounded-xl w-8 h-8 flex items-center justify-center mr-2">
              <span className="text-white font-bold text-lg">F</span>
            </div>
            <h2 className="font-semibold text-famacle-slate text-xl">Famacle</h2>
          </div>
          
          <div className="flex flex-wrap justify-center gap-6">
            <Link to="/dashboard" className="text-gray-600 hover:text-famacle-blue">Dashboard</Link>
            <Link to="/expenses" className="text-gray-600 hover:text-famacle-blue">Expenses</Link>
            <Link to="/calendar" className="text-gray-600 hover:text-famacle-blue">Calendar</Link>
            <Link to="/notifications" className="text-gray-600 hover:text-famacle-blue">Notifications</Link>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-200 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} Famacle. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default HomeFooter;
