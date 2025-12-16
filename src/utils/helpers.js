/**
 * Utility helper functions
 */

// Shuffle array using Fisher-Yates algorithm
export const shuffle = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Format time in MM:SS format
export const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

// Generate word search grid
export const generateWordSearchGrid = (words, size) => {
  const grid = Array(size).fill(null).map(() => Array(size).fill(''));
  const placedWords = [];
  
  // Helper to check if position is valid
  const isValidPosition = (row, col) => {
    return row >= 0 && row < size && col >= 0 && col < size;
  };
  
  // Helper to check if word can be placed
  const canPlaceWord = (word, row, col, direction) => {
    const directions = {
      horizontal: [0, 1],
      vertical: [1, 0],
      diagonal: [1, 1],
    };
    
    const [dr, dc] = directions[direction];
    
    for (let i = 0; i < word.length; i++) {
      const newRow = row + dr * i;
      const newCol = col + dc * i;
      
      if (!isValidPosition(newRow, newCol)) return false;
      if (grid[newRow][newCol] !== '' && grid[newRow][newCol] !== word[i]) {
        return false;
      }
    }
    
    return true;
  };
  
  // Place a word in the grid
  const placeWord = (word, row, col, direction) => {
    const directions = {
      horizontal: [0, 1],
      vertical: [1, 0],
      diagonal: [1, 1],
    };
    
    const [dr, dc] = directions[direction];
    const positions = [];
    
    for (let i = 0; i < word.length; i++) {
      const newRow = row + dr * i;
      const newCol = col + dc * i;
      grid[newRow][newCol] = word[i].toUpperCase();
      positions.push({ row: newRow, col: newCol });
    }
    
    placedWords.push({
      word: word.toUpperCase(),
      positions,
      found: false,
    });
  };
  
  // Try to place all words
  const shuffledWords = shuffle(words);
  const directions = ['horizontal', 'vertical', 'diagonal'];
  
  for (const word of shuffledWords) {
    let placed = false;
    const shuffledDirections = shuffle(directions);
    
    for (let attempt = 0; attempt < 100 && !placed; attempt++) {
      const direction = shuffledDirections[attempt % shuffledDirections.length];
      const row = Math.floor(Math.random() * size);
      const col = Math.floor(Math.random() * size);
      
      if (canPlaceWord(word, row, col, direction)) {
        placeWord(word, row, col, direction);
        placed = true;
      }
    }
  }
  
  // Fill empty cells with random letters
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      if (grid[row][col] === '') {
        grid[row][col] = alphabet[Math.floor(Math.random() * alphabet.length)];
      }
    }
  }
  
  return { grid, placedWords };
};

