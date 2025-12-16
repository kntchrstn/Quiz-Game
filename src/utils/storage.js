/**
 * LocalStorage utility functions for saving and loading game data
 */

// Save data to localStorage
export const saveToStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

// Load data from localStorage
export const loadFromStorage = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error('Error loading from localStorage:', error);
    return defaultValue;
  }
};

// Game state keys
export const STORAGE_KEYS = {
  GLOBAL_SCORE: 'quiz_game_global_score',
  CATEGORY_SCORES: 'quiz_game_category_scores',
  COMPLETED_LEVELS: 'quiz_game_completed_levels',
  SETTINGS: 'quiz_game_settings',
};

// Initialize default settings
export const getDefaultSettings = () => ({
  soundEnabled: true,
  backgroundMusicEnabled: false, // Off by default
  difficulty: 'medium',
});

// Get or initialize settings
export const getSettings = () => {
  return loadFromStorage(STORAGE_KEYS.SETTINGS, getDefaultSettings());
};

// Save settings
export const saveSettings = (settings) => {
  saveToStorage(STORAGE_KEYS.SETTINGS, settings);
};

// Get global score
export const getGlobalScore = () => {
  return loadFromStorage(STORAGE_KEYS.GLOBAL_SCORE, 0);
};

// Save global score
export const saveGlobalScore = (score) => {
  saveToStorage(STORAGE_KEYS.GLOBAL_SCORE, score);
};

// Get category scores
export const getCategoryScores = () => {
  return loadFromStorage(STORAGE_KEYS.CATEGORY_SCORES, {});
};

// Save category score
export const saveCategoryScore = (category, score) => {
  const scores = getCategoryScores();
  scores[category] = score;
  saveToStorage(STORAGE_KEYS.CATEGORY_SCORES, scores);
};

