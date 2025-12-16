import { useNavigate } from 'react-router-dom';
import { getGlobalScore, getCategoryScores } from '../utils/storage';
import { formatTime } from '../utils/helpers';
import { useState, useEffect } from 'react';
import BackgroundMusicToggle from './BackgroundMusicToggle';
import SoundToggle from './SoundToggle';

/**
 * Global top bar component with app title, score, timer, and home button
 */
const GameHeader = ({ category = null, timer = null, showTimer = false }) => {
  const navigate = useNavigate();
  const [globalScore, setGlobalScore] = useState(0);
  const [categoryScore, setCategoryScore] = useState(0);
  
  useEffect(() => {
    // Load scores from localStorage
    setGlobalScore(getGlobalScore());
    if (category) {
      const scores = getCategoryScores();
      setCategoryScore(scores[category] || 0);
    }
    
    // Listen for storage changes
    const handleStorageChange = () => {
      setGlobalScore(getGlobalScore());
      if (category) {
        const scores = getCategoryScores();
        setCategoryScore(scores[category] || 0);
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Poll for changes (since storage event doesn't fire in same tab)
    const interval = setInterval(handleStorageChange, 500);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, [category]);
  
  return (
    <header className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white shadow-2xl relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full -translate-x-1/2 -translate-y-1/2 animate-pulse-slow"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/2 translate-y-1/2 animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
      </div>
      
      <div className="container mx-auto px-2 sm:px-4 py-3 sm:py-5 relative z-10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
          {/* Left Section: Title and Home Button */}
          <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto justify-between sm:justify-start">
            <button
              onClick={() => navigate('/')}
              className="text-xl sm:text-2xl md:text-3xl font-bold hover:text-blue-200 transition-all duration-300 hover:scale-105 flex items-center gap-1 sm:gap-2"
            >
              <span className="text-2xl sm:text-3xl md:text-4xl">🎮</span>
              <span className="bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent hidden sm:inline">
                Egypt Educational Game!
              </span>
              <span className="bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent sm:hidden">
                Egypt Game!
              </span>
            </button>
            <button
              onClick={() => navigate('/')}
              className="px-2 sm:px-4 py-1.5 sm:py-2 glass rounded-lg sm:rounded-xl hover:bg-white/30 transition-all duration-300 font-medium backdrop-blur-sm text-sm sm:text-base"
            >
              <span className="hidden sm:inline">🏠 Home</span>
              <span className="sm:hidden">🏠</span>
            </button>
          </div>
          
          {/* Right Section: Controls and Scores */}
          <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto justify-end">
            {/* Sound Controls */}
            <div className="flex items-center gap-1 sm:gap-2">
              <SoundToggle />
              <BackgroundMusicToggle />
            </div>
            
            {/* Scores and Timer */}
            <div className="flex items-center gap-2 sm:gap-4 md:gap-6">
              {category && (
                <div className="text-right glass px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl backdrop-blur-sm">
                  <div className="text-[10px] sm:text-xs opacity-90 font-medium">Category</div>
                  <div className="text-lg sm:text-xl md:text-2xl font-bold text-yellow-300">{categoryScore}</div>
                </div>
              )}
              <div className="text-right glass px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl backdrop-blur-sm">
                <div className="text-[10px] sm:text-xs opacity-90 font-medium">Global</div>
                <div className="text-lg sm:text-xl md:text-2xl font-bold text-yellow-300">{globalScore}</div>
              </div>
              {showTimer && timer !== null && (
                <div className={`text-right glass px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl backdrop-blur-sm ${timer <= 10 ? 'animate-pulse bg-red-500/30' : ''}`}>
                  <div className="text-[10px] sm:text-xs opacity-90 font-medium">Time</div>
                  <div className={`text-lg sm:text-xl md:text-2xl font-bold ${timer <= 10 ? 'text-red-300' : 'text-yellow-300'}`}>{formatTime(timer)}</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default GameHeader;

