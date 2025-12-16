import { useNavigate } from 'react-router-dom';
import Button from './Button';

/**
 * Category Card component for the home screen with enhanced design
 */
const CategoryCard = ({ title, description, icon, route, color, isTall = false }) => {
  const navigate = useNavigate();
  
  const colorGradients = {
    blue: 'from-blue-500 via-blue-600 to-indigo-600',
    green: 'from-green-500 via-emerald-600 to-teal-600',
    purple: 'from-purple-500 via-purple-600 to-pink-600',
    orange: 'from-orange-500 via-orange-600 to-red-500',
  };
  
  const hoverEffects = {
    blue: 'hover:shadow-blue-500/50',
    green: 'hover:shadow-green-500/50',
    purple: 'hover:shadow-purple-500/50',
    orange: 'hover:shadow-orange-500/50',
  };
  
  return (
    <div className={`group bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-300 hover:scale-105 hover:-translate-y-2 hover:shadow-2xl flex flex-col ${isTall ? 'lg:h-[450px]' : 'lg:h-[390px]'}`}>
      <div className={`bg-gradient-to-br ${colorGradients[color] || colorGradients.blue} ${isTall ? 'p-10' : 'p-8'} text-white relative overflow-hidden flex-1 flex flex-col`}>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -mr-16 -mt-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full -ml-12 -mb-12"></div>
        </div>
        <div className="relative z-10 flex flex-col flex-1">
          <div className={`${isTall ? 'text-7xl mb-6' : 'text-6xl mb-4'} animate-float`}>{icon}</div>
          <h2 className={`${isTall ? 'text-4xl mb-4' : 'text-3xl mb-3'} font-bold leading-tight`}>{title}</h2>
          <p className={`text-white/90 ${isTall ? 'text-xl' : 'text-lg'} leading-relaxed flex-1`}>{description}</p>
        </div>
      </div>
      <div className="p-6 bg-gradient-to-b from-gray-50 to-white">
        <Button
          onClick={() => navigate(route)}
          variant="primary"
          size="lg"
          className="w-full group-hover:scale-105 transition-transform"
        >
          <span className="flex items-center justify-center gap-2">
            <span>Play Now</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </span>
        </Button>
      </div>
    </div>
  );
};

export default CategoryCard;

