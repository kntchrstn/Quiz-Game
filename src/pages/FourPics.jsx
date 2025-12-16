import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import fourPicsData from '../data/fourPicsData.json';
import GameHeader from '../components/GameHeader';
import Button from '../components/Button';
import DifficultySelector from '../components/DifficultySelector';
import ProgressBar from '../components/ProgressBar';
import Modal from '../components/Modal';
import { shuffle } from '../utils/helpers';
import { getGlobalScore, saveGlobalScore, getCategoryScores, saveCategoryScore, getSettings } from '../utils/storage';
import { playCorrectSound, playWrongSound, playWinSound, initAudio } from '../utils/sounds';

/**
 * 4 Pics 1 Word page
 */
const FourPics = () => {
  const navigate = useNavigate();
  const [difficulty, setDifficulty] = useState('medium');
  const [gameStarted, setGameStarted] = useState(false);
  const [currentRound, setCurrentRound] = useState(0);
  const [rounds, setRounds] = useState([]);
  const [userAnswer, setUserAnswer] = useState('');
  const [selectedLetters, setSelectedLetters] = useState([]);
  const [availableLetters, setAvailableLetters] = useState([]);
  const [showHint, setShowHint] = useState(false);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [showEndScreen, setShowEndScreen] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const settings = getSettings();
  
  useEffect(() => {
    if (gameStarted) {
      const filtered = fourPicsData.filter(q => q.difficulty === difficulty);
      const shuffled = shuffle(filtered).slice(0, 5);
      setRounds(shuffled);
      setCurrentRound(0);
      setScore(0);
      setCorrectCount(0);
      setShowEndScreen(false);
      setUserAnswer('');
      setSelectedLetters([]);
      setShowHint(false);
    }
  }, [gameStarted, difficulty]);
  
  // Generate letter tiles when round changes
  useEffect(() => {
    if (gameStarted && rounds.length > 0 && currentRound < rounds.length) {
      const current = rounds[currentRound];
      const answer = current.answer.toUpperCase();
      const answerLetters = answer.split('');
      
      // Add some extra random letters (about 50% more)
      const extraCount = Math.ceil(answerLetters.length * 0.5);
      const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      const extraLetters = [];
      for (let i = 0; i < extraCount; i++) {
        extraLetters.push(alphabet[Math.floor(Math.random() * alphabet.length)]);
      }
      
      // Combine and shuffle all letters
      const allLetters = [...answerLetters, ...extraLetters];
      setAvailableLetters(shuffle(allLetters));
      setSelectedLetters([]);
      setUserAnswer('');
    }
  }, [currentRound, rounds, gameStarted]);
  
  const handleStart = () => {
    initAudio(); // Initialize audio on user interaction
    setGameStarted(true);
  };
  
  const handleLetterClick = (letter, index) => {
    if (showFeedback) return;
    
    // Don't add more letters than the answer length
    const current = rounds[currentRound];
    if (selectedLetters.length >= current.answer.length) return;
    
    // Remove letter from available and add to selected
    const newAvailable = [...availableLetters];
    newAvailable.splice(index, 1);
    setAvailableLetters(newAvailable);
    setSelectedLetters([...selectedLetters, letter]);
    setUserAnswer([...selectedLetters, letter].join(''));
  };
  
  const handleSelectedLetterClick = (index) => {
    if (showFeedback) return;
    
    // Remove letter from selected and add back to available
    const letter = selectedLetters[index];
    const newSelected = [...selectedLetters];
    newSelected.splice(index, 1);
    setSelectedLetters(newSelected);
    setAvailableLetters([...availableLetters, letter]);
    setUserAnswer(newSelected.join(''));
  };
  
  const handleSubmit = () => {
    const answerToCheck = selectedLetters.length > 0 ? selectedLetters.join('') : userAnswer.trim().toUpperCase();
    if (!answerToCheck) return;
    
    const current = rounds[currentRound];
    const isCorrect = answerToCheck === current.answer.toUpperCase();
    
    setShowFeedback(true);
    
    if (isCorrect) {
      const basePoints = difficulty === 'easy' ? 20 : difficulty === 'medium' ? 30 : 40;
      const hintPenalty = showHint ? -10 : 0;
      const points = Math.max(0, basePoints + hintPenalty);
      setScore(prev => prev + points);
      setCorrectCount(prev => prev + 1);
      playCorrectSound(settings.soundEnabled);
    } else {
      playWrongSound(settings.soundEnabled);
    }
    
    setTimeout(() => {
      if (currentRound < rounds.length - 1) {
        setCurrentRound(prev => prev + 1);
        setUserAnswer('');
        setSelectedLetters([]);
        setShowHint(false);
        setShowFeedback(false);
      } else {
        // Game over
        const globalScore = getGlobalScore();
        const categoryScores = getCategoryScores();
        saveGlobalScore(globalScore + score);
        saveCategoryScore('fourPics', (categoryScores.fourPics || 0) + score);
        playWinSound(settings.soundEnabled);
        setShowEndScreen(true);
      }
    }, 2000);
  };
  
  const handleHint = () => {
    if (!showHint) {
      setShowHint(true);
      setScore(prev => Math.max(0, prev - 10));
    }
  };
  
  const handleRestart = () => {
    setGameStarted(false);
    setCurrentRound(0);
    setUserAnswer('');
    setSelectedLetters([]);
    setAvailableLetters([]);
    setShowHint(false);
    setScore(0);
    setCorrectCount(0);
    setShowEndScreen(false);
    setShowFeedback(false);
  };
  
  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <GameHeader category="fourPics" />
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
              <div className="text-6xl mb-4 animate-float">🖼️</div>
              <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-gradient">Egypt 4 Pics 1 Word!</h1>
              <p className="text-lg sm:text-xl text-gray-600 leading-relaxed">
                Look at the four pictures and guess the Egypt-related word! Test your knowledge of Egyptian landmarks, history, and culture. Use hints wisely!
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
  
  if (showEndScreen) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
        <GameHeader category="fourPics" />
        <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-6 sm:p-8 text-center">
            <h1 className="text-3xl sm:text-4xl font-bold mb-4">Game Complete!</h1>
            <div className="space-y-3 sm:space-y-4 mb-6">
              <p className="text-xl sm:text-2xl text-blue-600 font-bold">Total Score: {score}</p>
              <p className="text-lg sm:text-xl text-gray-700">Correct Answers: {correctCount} / {rounds.length}</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <Button onClick={handleRestart} size="lg" variant="primary" className="w-full sm:w-auto">
                Play Again
              </Button>
              <Button onClick={() => navigate('/')} size="lg" variant="secondary" className="w-full sm:w-auto">
                Home
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  const current = rounds[currentRound];
  
  // Safety check - return early if current is not available
  if (!current || !current.images) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
        <GameHeader category="fourPics" />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto text-center">
            <p>Loading...</p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <GameHeader category="fourPics" />
      <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-8">
        <div className="max-w-4xl mx-auto">
          <ProgressBar 
            progress={currentRound + 1} 
            max={rounds.length} 
            label="Round"
            className="mb-4 sm:mb-6"
          />
          
          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 md:p-8">
            <div className="mb-4 sm:mb-6">
              <span className="text-xs sm:text-sm text-gray-500">
                Round {currentRound + 1} of {rounds.length}
              </span>
            </div>
            
            {/* Image Grid */}
            <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-4 sm:mb-6 max-w-[280px] sm:max-w-xs mx-auto">
              {current.images.map((imagePath, index) => (
                <div
                  key={index}
                  className="aspect-square bg-gradient-to-br from-purple-200 to-pink-200 rounded-lg flex items-center justify-center text-2xl sm:text-3xl overflow-hidden"
                >
                  {imagePath && imagePath.startsWith('/') ? (
                    <img 
                      src={imagePath} 
                      alt={`Picture ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // Fallback to emoji if image fails to load
                        e.target.style.display = 'none';
                        e.target.parentElement.innerHTML = '🖼️';
                      }}
                    />
                  ) : (
                    <span>🖼️</span>
                  )}
                </div>
              ))}
            </div>
            
            {/* Hint */}
            {showHint && (
              <div className="bg-yellow-100 border-2 border-yellow-400 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
                <p className="text-yellow-800 font-semibold text-sm sm:text-base">Hint: {current.hint}</p>
              </div>
            )}
            
            {/* Selected Letters (Answer) - Fixed number of tiles */}
            <div className="mb-4 sm:mb-6">
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">Your Answer:</label>
              <div className="p-2 sm:p-3 bg-gray-50 rounded-lg border-2 border-gray-300 flex flex-wrap gap-1.5 sm:gap-2 justify-center items-center">
                {Array.from({ length: current.answer.length }).map((_, index) => {
                  const letter = selectedLetters[index] || null;
                  return (
                    <button
                      key={index}
                      onClick={() => letter && handleSelectedLetterClick(index)}
                      disabled={showFeedback || !letter}
                      className={`min-w-[40px] sm:min-w-[50px] h-[40px] sm:h-[50px] font-bold text-base sm:text-lg rounded-lg transition-colors touch-manipulation ${
                        letter
                          ? 'bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed'
                          : 'bg-gray-200 border-2 border-dashed border-gray-400 text-gray-400 cursor-default'
                      }`}
                    >
                      {letter || ''}
                    </button>
                  );
                })}
              </div>
            </div>
            
            {/* Available Letter Tiles */}
            <div className="mb-4 sm:mb-6">
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">Available Letters:</label>
              <div className="flex flex-wrap gap-1.5 sm:gap-2 justify-center">
                {availableLetters.map((letter, index) => (
                  <button
                    key={index}
                    onClick={() => handleLetterClick(letter, index)}
                    disabled={showFeedback}
                    className="px-3 sm:px-4 py-2 sm:py-3 bg-gradient-to-br from-purple-500 to-pink-500 text-white font-bold text-base sm:text-lg rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200 shadow-md hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation active:scale-95"
                  >
                    {letter}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Feedback */}
            {showFeedback && (
              <div className={`text-center p-3 sm:p-4 rounded-lg mb-4 text-sm sm:text-base ${
                (selectedLetters.length > 0 ? selectedLetters.join('') : userAnswer.trim().toUpperCase()) === current.answer.toUpperCase()
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {(selectedLetters.length > 0 ? selectedLetters.join('') : userAnswer.trim().toUpperCase()) === current.answer.toUpperCase()
                  ? `✓ Correct! The answer is: ${current.answer}`
                  : `✗ Wrong! The correct answer is: ${current.answer}`}
              </div>
            )}
            
            {/* Actions */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4">
              <div className="text-lg sm:text-xl font-bold order-2 sm:order-1">Score: {score}</div>
              <div className="flex gap-2 sm:gap-4 w-full sm:w-auto order-1 sm:order-2">
                <Button
                  onClick={handleHint}
                  disabled={showHint || showFeedback}
                  variant="outline"
                  className="flex-1 sm:flex-none text-sm sm:text-base"
                >
                  <span className="hidden sm:inline">Hint </span>(-10)
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={(selectedLetters.length === 0 && !userAnswer.trim()) || showFeedback}
                  variant="primary"
                  className="flex-1 sm:flex-none"
                >
                  Submit
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FourPics;

