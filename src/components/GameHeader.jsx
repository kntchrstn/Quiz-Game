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
      
      <div className="container mx-auto px-4 py-5 relative z-10">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/')}
              className="text-3xl font-bold hover:text-blue-200 transition-all duration-300 hover:scale-105 flex items-center gap-2"
            >
              <span className="text-4xl">🎮</span>
              <span className="bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                Egypt Educational Game!
              </span>
            </button>
            <button
              onClick={() => navigate('/')}
              className="px-4 py-2 glass rounded-xl hover:bg-white/30 transition-all duration-300 font-medium backdrop-blur-sm"
            >
              🏠 Home
            </button>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <SoundToggle />
              <BackgroundMusicToggle />
            </div>
            <div className="flex items-center gap-6">
              {category && (
                <div className="text-right glass px-4 py-2 rounded-xl backdrop-blur-sm">
                  <div className="text-xs opacity-90 font-medium">Category Score</div>
                  <div className="text-2xl font-bold text-yellow-300">{categoryScore}</div>
                </div>
              )}
              <div className="text-right glass px-4 py-2 rounded-xl backdrop-blur-sm">
                <div className="text-xs opacity-90 font-medium">Global Score</div>
                <div className="text-2xl font-bold text-yellow-300">{globalScore}</div>
              </div>
              {showTimer && timer !== null && (
                <div className={`text-right glass px-4 py-2 rounded-xl backdrop-blur-sm ${timer <= 10 ? 'animate-pulse bg-red-500/30' : ''}`}>
                  <div className="text-xs opacity-90 font-medium">Time</div>
                  <div className={`text-2xl font-bold ${timer <= 10 ? 'text-red-300' : 'text-yellow-300'}`}>{formatTime(timer)}</div>
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

