
import { motion } from 'framer-motion';

const LoadingSpinner = () => {
  return (
    <div className="flex justify-center items-center h-96">
      <div className="text-famacle-slate animate-spin h-8 w-8 border-4 border-famacle-blue border-t-transparent rounded-full"></div>
    </div>
  );
};

export default LoadingSpinner;
