import { useState, useEffect } from 'react';
import { getSettings, saveSettings } from '../utils/storage';
import { toggleBackgroundMusic, initBackgroundMusic } from '../utils/backgroundMusic';

/**
 * Background Music Toggle component
 */
const BackgroundMusicToggle = () => {
  const [musicEnabled, setMusicEnabled] = useState(false);
  
  useEffect(() => {
    const settings = getSettings();
    setMusicEnabled(settings.backgroundMusicEnabled || false);
    
    // Initialize and start music if enabled
    if (settings.backgroundMusicEnabled) {
      initBackgroundMusic();
      // Small delay to ensure audio context is ready
      setTimeout(() => {
        toggleBackgroundMusic(true);
      }, 100);
    }
  }, []);
  
  const toggleMusic = () => {
    // Initialize audio context on first user interaction
    initBackgroundMusic();
    
    const newValue = !musicEnabled;
    setMusicEnabled(newValue);
    const settings = getSettings();
    settings.backgroundMusicEnabled = newValue;
    saveSettings(settings);
    
    // Toggle background music
    toggleBackgroundMusic(newValue);
  };
  
  return (
    <button
      onClick={toggleMusic}
      className="px-2 sm:px-4 py-1.5 sm:py-2 glass rounded-lg sm:rounded-xl hover:bg-white/30 transition-all duration-300 flex items-center gap-1 sm:gap-2 font-medium backdrop-blur-sm hover:scale-105 active:scale-95"
      title={musicEnabled ? 'Disable background music' : 'Enable background music'}
    >
      <span className="text-lg sm:text-xl">{musicEnabled ? '🎵' : '🔇'}</span>
      <span className="hidden sm:inline text-sm sm:text-base">{musicEnabled ? 'Music On' : 'Music Off'}</span>
    </button>
  );
};

export default BackgroundMusicToggle;

