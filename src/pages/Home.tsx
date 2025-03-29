
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-famacle-blue-light/30">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl font-bold tracking-tight text-famacle-blue sm:text-5xl md:text-6xl">
            Welcome to Famacle
          </h1>
          <p className="mt-6 text-xl text-gray-600">
            Manage your family finances with ease
          </p>
          <div className="mt-10 flex justify-center gap-4">
            <Button
              onClick={() => navigate('/signin')}
              className="px-6 py-3"
            >
              Sign In
            </Button>
            <Button
              onClick={() => navigate('/signup')}
              variant="outline"
              className="px-6 py-3"
            >
              Sign Up
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
