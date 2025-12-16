import { useState, useEffect } from 'react';
import { getSettings, saveSettings } from '../utils/storage';
import { playClickSound, initAudio } from '../utils/sounds';

/**
 * Sound Toggle component
 */
const SoundToggle = () => {
  const [soundEnabled, setSoundEnabled] = useState(true);
  
  useEffect(() => {
    const settings = getSettings();
    setSoundEnabled(settings.soundEnabled);
  }, []);
  
  const toggleSound = () => {
    // Initialize audio context on first user interaction
    initAudio();
    
    const newValue = !soundEnabled;
    setSoundEnabled(newValue);
    const settings = getSettings();
    settings.soundEnabled = newValue;
    saveSettings(settings);
    
    // Play click sound
    playClickSound(newValue);
  };
  
  return (
    <button
      onClick={toggleSound}
      className="px-2 sm:px-4 py-1.5 sm:py-2 glass rounded-lg sm:rounded-xl hover:bg-white/30 transition-all duration-300 flex items-center gap-1 sm:gap-2 font-medium backdrop-blur-sm hover:scale-105 active:scale-95"
      title={soundEnabled ? 'Disable sounds' : 'Enable sounds'}
    >
      <span className="text-lg sm:text-xl">{soundEnabled ? '🔊' : '🔇'}</span>
      <span className="hidden sm:inline text-sm sm:text-base">{soundEnabled ? 'Sound On' : 'Sound Off'}</span>
    </button>
  );
};

export default SoundToggle;

