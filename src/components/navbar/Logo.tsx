
import { Link } from 'react-router-dom';

export const Logo = () => {
  return (
    <Link to="/" className="flex items-center">
      <div className="flex items-center gap-2">
        <div className="bg-famacle-blue rounded-xl w-8 h-8 flex items-center justify-center">
          <span className="text-white font-bold text-lg">F</span>
        </div>
        <h1 className="font-semibold text-famacle-slate text-xl">Famacle</h1>
      </div>
    </Link>
  );
};
