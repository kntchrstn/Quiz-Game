/**
 * Background music utility
 * Uses Web Audio API to generate ambient background music
 */

let audioContext = null;
let oscillators = [];
let gainNodes = [];
let isPlaying = false;
let melodyInterval = null;

// Get or create audio context
const getAudioContext = () => {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
  
  if (audioContext.state === 'suspended') {
    audioContext.resume().catch(err => {
      console.warn('Failed to resume audio context:', err);
    });
  }
  
  return audioContext;
};

// Clean up all oscillators
const cleanup = () => {
  oscillators.forEach(osc => {
    try {
      osc.stop();
      osc.disconnect();
    } catch (e) {
      // Ignore errors
    }
  });
  gainNodes.forEach(gain => {
    try {
      gain.disconnect();
    } catch (e) {
      // Ignore errors
    }
  });
  oscillators = [];
  gainNodes = [];
  
  if (melodyInterval) {
    clearInterval(melodyInterval);
    melodyInterval = null;
  }
};

// Play background music - simple looping melody
export const playBackgroundMusic = (enabled = true) => {
  if (!enabled || isPlaying) return;
  
  try {
    const ctx = getAudioContext();
    
    // Simple C major scale melody for background
    const melody = [261.63, 293.66, 329.63, 349.23, 392, 440, 493.88, 523.25]; // C4 to C5
    let noteIndex = 0;
    
    const playNextNote = () => {
      if (!isPlaying) return;
      
      // Clean up previous oscillators
      cleanup();
      
      // Create new oscillator for current note
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.value = melody[noteIndex % melody.length];
      
      // Very low volume for background
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.06, ctx.currentTime + 0.1);
      gain.gain.linearRampToValueAtTime(0.06, ctx.currentTime + 1.4);
      gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 1.5);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 1.5);
      
      oscillators.push(osc);
      gainNodes.push(gain);
      
      noteIndex++;
    };
    
    // Play first note immediately
    playNextNote();
    
    // Continue playing notes every 1.5 seconds
    melodyInterval = setInterval(() => {
      if (isPlaying) {
        playNextNote();
      }
    }, 1500);
    
    isPlaying = true;
    
  } catch (error) {
    console.warn('Background music failed:', error);
  }
};

// Stop background music
export const stopBackgroundMusic = () => {
  if (!isPlaying) return;
  
  isPlaying = false;
  cleanup();
};

// Toggle background music
export const toggleBackgroundMusic = (enabled) => {
  if (enabled) {
    playBackgroundMusic(true);
  } else {
    stopBackgroundMusic();
  }
};

// Initialize audio context
export const initBackgroundMusic = () => {
  getAudioContext();
};

