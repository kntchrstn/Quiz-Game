/**
 * Sound effects utility
 * Uses Web Audio API to generate simple sounds
 */

// Create a single AudioContext instance
let audioContext = null;

// Initialize audio context (must be called after user interaction)
const getAudioContext = () => {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
  
  // Resume audio context if suspended (required by browser autoplay policy)
  if (audioContext.state === 'suspended') {
    audioContext.resume().catch(err => {
      console.warn('Failed to resume audio context:', err);
    });
  }
  
  return audioContext;
};

// Initialize audio on first user interaction
export const initAudio = () => {
  if (typeof window !== 'undefined' && (window.AudioContext || window.webkitAudioContext)) {
    getAudioContext();
  }
};

// Generate a simple beep sound
const playBeep = (frequency, duration, type = 'sine') => {
  try {
    const ctx = getAudioContext();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    oscillator.frequency.value = frequency;
    oscillator.type = type;
    
    gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
    
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + duration);
  } catch (error) {
    console.warn('Sound playback failed:', error);
  }
};

// Play correct answer sound
export const playCorrectSound = (enabled = true) => {
  if (!enabled) return;
  playBeep(800, 0.2, 'sine');
  setTimeout(() => playBeep(1000, 0.2, 'sine'), 100);
};

// Play wrong answer sound
export const playWrongSound = (enabled = true) => {
  if (!enabled) return;
  playBeep(300, 0.3, 'sawtooth');
};

// Play win sound
export const playWinSound = (enabled = true) => {
  if (!enabled) return;
  const notes = [523, 659, 784, 1047]; // C, E, G, C
  notes.forEach((freq, i) => {
    setTimeout(() => playBeep(freq, 0.3, 'sine'), i * 150);
  });
};

// Play lose sound
export const playLoseSound = (enabled = true) => {
  if (!enabled) return;
  const notes = [400, 300, 200];
  notes.forEach((freq, i) => {
    setTimeout(() => playBeep(freq, 0.4, 'sawtooth'), i * 200);
  });
};

// Play click sound
export const playClickSound = (enabled = true) => {
  if (!enabled) return;
  playBeep(600, 0.1, 'sine');
};

