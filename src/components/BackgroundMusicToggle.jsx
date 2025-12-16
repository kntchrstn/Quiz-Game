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
      className="px-4 py-2 glass rounded-xl hover:bg-white/30 transition-all duration-300 flex items-center gap-2 font-medium backdrop-blur-sm hover:scale-105 active:scale-95"
      title={musicEnabled ? 'Disable background music' : 'Enable background music'}
    >
      <span className="text-xl">{musicEnabled ? '🎵' : '🔇'}</span>
      <span className="hidden sm:inline">{musicEnabled ? 'Music On' : 'Music Off'}</span>
    </button>
  );
};

export default BackgroundMusicToggle;

