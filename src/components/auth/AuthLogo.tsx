
import { Link } from "react-router-dom";

const AuthLogo = () => {
  return (
    <div className="text-center mb-8">
      <Link to="/" className="inline-flex items-center justify-center">
        <div className="bg-famacle-blue rounded-xl w-10 h-10 flex items-center justify-center mr-2">
          <span className="text-white font-bold text-xl">F</span>
        </div>
        <h2 className="text-2xl font-bold text-famacle-slate">Famacle</h2>
      </Link>
    </div>
  );
};

export default AuthLogo;
