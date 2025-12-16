import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import wordSearchData from '../data/wordSearchData.json';
import GameHeader from '../components/GameHeader';
import Button from '../components/Button';
import DifficultySelector from '../components/DifficultySelector';
import Modal from '../components/Modal';
import { generateWordSearchGrid } from '../utils/helpers';
import { getGlobalScore, saveGlobalScore, getCategoryScores, saveCategoryScore } from '../utils/storage';
import { getSettings } from '../utils/storage';
import { playCorrectSound, playWinSound, initAudio } from '../utils/sounds';

/**
 * Word Search Puzzle page
 */
const WordSearch = () => {
  const navigate = useNavigate();
  const [difficulty, setDifficulty] = useState('medium');
  const [gameStarted, setGameStarted] = useState(false);
  const [grid, setGrid] = useState([]);
  const [words, setWords] = useState([]);
  const [selectedCells, setSelectedCells] = useState([]);
  const [foundWords, setFoundWords] = useState(new Set());
  const [isSelecting, setIsSelecting] = useState(false);
  const gridRef = useRef(null);
  const settings = getSettings();
  
  const gridSizes = {
    easy: 10,
    medium: 12,
    hard: 14,
  };
  
  useEffect(() => {
    if (gameStarted) {
      const wordList = wordSearchData[difficulty];
      const size = gridSizes[difficulty];
      const { grid: newGrid, placedWords } = generateWordSearchGrid(wordList, size);
      setGrid(newGrid);
      setWords(placedWords);
      setFoundWords(new Set());
      setSelectedCells([]);
    }
  }, [gameStarted, difficulty]);
  
  const handleStart = () => {
    initAudio(); // Initialize audio on user interaction
    setGameStarted(true);
  };
  
  const getCellKey = (row, col) => `${row}-${col}`;
  
  const isCellSelected = (row, col) => {
    return selectedCells.some(cell => cell.row === row && cell.col === col);
  };
  
  const isCellInFoundWord = (row, col) => {
    return words.some(word => 
      word.found && word.positions.some(pos => pos.row === row && pos.col === col)
    );
  };
  
  const handleCellMouseDown = (row, col) => {
    setIsSelecting(true);
    setSelectedCells([{ row, col }]);
  };
  
  const handleCellMouseEnter = (row, col) => {
    if (isSelecting) {
      setSelectedCells(prev => {
        if (prev.length === 0) return [{ row, col }];
        
        const firstCell = prev[0];
        const lastCell = prev[prev.length - 1];
        
        // Check if the new cell is adjacent to the last cell
        const rowDiff = Math.abs(row - lastCell.row);
        const colDiff = Math.abs(col - lastCell.col);
        const isAdjacent = (rowDiff === 0 && colDiff === 1) || (rowDiff === 1 && colDiff === 0) || (rowDiff === 1 && colDiff === 1);
        
        if (!isAdjacent) {
          // If not adjacent, check if we're continuing in the same direction
          if (prev.length > 1) {
            const secondLast = prev[prev.length - 2];
            const direction = {
              row: lastCell.row - secondLast.row,
              col: lastCell.col - secondLast.col
            };
            
            // Check if new cell continues in same direction
            const expectedRow = lastCell.row + direction.row;
            const expectedCol = lastCell.col + direction.col;
            
            if (expectedRow === row && expectedCol === col) {
              return [...prev, { row, col }];
            }
          }
          return prev;
        }
        
        // Determine direction from first cell
        if (prev.length === 1) {
          // First extension - determine direction
          return [...prev, { row, col }];
        } else {
          // Check if continuing in same direction
          const direction = {
            row: lastCell.row - prev[prev.length - 2].row,
            col: lastCell.col - prev[prev.length - 2].col
          };
          
          const expectedRow = lastCell.row + direction.row;
          const expectedCol = lastCell.col + direction.col;
          
          if (expectedRow === row && expectedCol === col) {
            // Continuing in same direction
            return [...prev, { row, col }];
          } else {
            // Different direction - restart from first cell
            return [firstCell, { row, col }];
          }
        }
      });
    }
  };
  
  const handleCellMouseUp = () => {
    if (selectedCells.length > 0) {
      checkWord();
    }
    setIsSelecting(false);
    setSelectedCells([]);
  };
  
  const checkWord = () => {
    if (selectedCells.length < 3) {
      setSelectedCells([]);
      return;
    }
    
    const selectedWord = selectedCells
      .map(cell => grid[cell.row][cell.col])
      .join('');
    
    const reversedWord = selectedWord.split('').reverse().join('');
    
    for (const word of words) {
      if (!word.found && (word.word === selectedWord || word.word === reversedWord)) {
        // Check if positions match (allow for either direction)
        const selectedPositions = new Set(selectedCells.map(c => getCellKey(c.row, c.col)));
        const wordPositions = new Set(word.positions.map(p => getCellKey(p.row, p.col)));
        
        // Check if all selected positions match word positions
        const allMatch = selectedPositions.size === wordPositions.size && 
            [...selectedPositions].every(pos => wordPositions.has(pos));
        
        if (allMatch) {
          word.found = true;
          setFoundWords(prev => new Set([...prev, word.word]));
          playCorrectSound(settings.soundEnabled);
          
          // Update score
          const points = difficulty === 'easy' ? 10 : difficulty === 'medium' ? 20 : 30;
          const globalScore = getGlobalScore();
          const categoryScores = getCategoryScores();
          saveGlobalScore(globalScore + points);
          saveCategoryScore('wordSearch', (categoryScores.wordSearch || 0) + points);
          
          // Check if all words found
          if (words.every(w => w.found)) {
            playWinSound(settings.soundEnabled);
          }
          
          // Clear selection after finding word
          setSelectedCells([]);
          return;
        }
      }
    }
    
    // Word not found - clear selection
    setSelectedCells([]);
  };
  
  const handleRestart = () => {
    setGameStarted(false);
    setFoundWords(new Set());
    setSelectedCells([]);
  };
  
  const allWordsFound = words.length > 0 && words.every(w => w.found);
  
  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <GameHeader category="wordSearch" />
        <div className="container mx-auto px-4 py-12 min-h-[calc(100vh-80px)] flex items-center justify-center relative">
          <Button 
            onClick={() => navigate('/')} 
            variant="secondary" 
            size="md"
            className="absolute top-4 left-4 sm:top-6 sm:left-6 z-10"
          >
            ← Back
          </Button>
          
          <div className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl p-8 sm:p-10 border border-gray-100">
            <div className="text-center mb-8">
              <div className="text-6xl mb-4 animate-float">🔍</div>
              <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-gradient">Egypt Word Search Puzzle!</h1>
              <p className="text-lg sm:text-xl text-gray-600 leading-relaxed">
                Find Egypt-related words hidden in the grid! Discover words about Egyptian history, landmarks, and culture. Click and drag to select letters!
              </p>
            </div>
            
            <div className="mb-8 sm:mb-10">
              <label className="block text-lg sm:text-xl font-bold mb-6 text-center text-gray-700">Select Difficulty:</label>
              <DifficultySelector selected={difficulty} onChange={setDifficulty} className="justify-center flex-wrap" />
            </div>
            
            <div className="text-center">
              <Button onClick={handleStart} size="lg" variant="primary" className="px-8 sm:px-12">
                🚀 Start Game
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <GameHeader category="wordSearch" />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Word Bank */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold mb-4">Word Bank</h2>
                <div className="space-y-2">
                  {words.map((word, index) => (
                    <div
                      key={index}
                      className={`p-2 rounded ${
                        word.found
                          ? 'bg-green-100 text-green-800 line-through'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {word.word}
                    </div>
                  ))}
                </div>
                <div className="mt-4 text-sm text-gray-600">
                  Found: {foundWords.size} / {words.length}
                </div>
              </div>
            </div>
            
            {/* Grid */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold">Find the Words</h2>
                  {allWordsFound && (
                    <div className="text-green-600 font-bold text-lg">
                      🎉 All Words Found!
                    </div>
                  )}
                </div>
                
                <div className="w-full flex justify-center">
                  <div
                    ref={gridRef}
                    className="grid gap-2 mx-auto"
                    style={{
                      gridTemplateColumns: `repeat(${grid.length}, minmax(0, 1fr))`,
                      width: '100%',
                      maxWidth: '720px',
                      aspectRatio: '1 / 1',
                    }}
                    onMouseUp={handleCellMouseUp}
                    onMouseLeave={handleCellMouseUp}
                    onTouchEnd={handleCellMouseUp}
                  >
                    {grid.map((row, rowIndex) =>
                      row.map((cell, colIndex) => {
                        const isSelected = isCellSelected(rowIndex, colIndex);
                        const isFound = isCellInFoundWord(rowIndex, colIndex);
                        
                        return (
                          <div
                            key={`${rowIndex}-${colIndex}`}
                            onMouseDown={(e) => {
                              e.preventDefault();
                              handleCellMouseDown(rowIndex, colIndex);
                            }}
                            onMouseEnter={() => {
                              if (isSelecting) {
                                handleCellMouseEnter(rowIndex, colIndex);
                              }
                            }}
                            onTouchStart={(e) => {
                              e.preventDefault();
                              handleCellMouseDown(rowIndex, colIndex);
                            }}
                            onTouchMove={(e) => {
                              e.preventDefault();
                              if (isSelecting) {
                                const touch = e.touches[0];
                                const element = document.elementFromPoint(touch.clientX, touch.clientY);
                                if (element) {
                                  const cellKey = element.getAttribute('data-cell-key');
                                  if (cellKey) {
                                    const [r, c] = cellKey.split('-').map(Number);
                                    handleCellMouseEnter(r, c);
                                  }
                                }
                              }
                            }}
                            data-cell-key={`${rowIndex}-${colIndex}`}
                            className={`aspect-square flex items-center justify-center font-bold text-base sm:text-lg md:text-xl cursor-pointer transition-all duration-150 select-none ${
                              isFound
                                ? 'bg-green-400 text-green-900 shadow-md'
                                : isSelected
                                ? 'bg-blue-400 text-blue-900 shadow-md scale-105'
                                : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                            }`}
                          >
                            {cell}
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
                
                <div className="mt-6 flex gap-4 justify-center">
                  <Button onClick={handleRestart} variant="secondary">
                    New Game
                  </Button>
                  <Button onClick={() => navigate('/')} variant="outline">
                    Home
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Modal isOpen={allWordsFound} onClose={handleRestart} title="Congratulations!">
        <div className="text-center">
          <p className="text-2xl mb-4">You found all the words!</p>
          <div className="flex gap-4 justify-center">
            <Button onClick={handleRestart} variant="primary">
              Play Again
            </Button>
            <Button onClick={() => navigate('/')} variant="secondary">
              Home
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default WordSearch;

