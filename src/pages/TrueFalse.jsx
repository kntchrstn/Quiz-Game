import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import trueFalseData from '../data/trueFalseData.json';
import GameHeader from '../components/GameHeader';
import Button from '../components/Button';
import DifficultySelector from '../components/DifficultySelector';
import Modal from '../components/Modal';
import { shuffle } from '../utils/helpers';
import { useTimer } from '../utils/useTimer';
import { getGlobalScore, saveGlobalScore, getCategoryScores, saveCategoryScore, getSettings } from '../utils/storage';
import { playCorrectSound, playWrongSound, playLoseSound, initAudio } from '../utils/sounds';

/**
 * True or False Blitz page
 */
const TrueFalse = () => {
  const navigate = useNavigate();
  const [difficulty, setDifficulty] = useState('medium');
  const [gameStarted, setGameStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [streak, setStreak] = useState(0);
  const [showEndScreen, setShowEndScreen] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isCorrect, setIsCorrect] = useState(false);
  const [settings, setSettings] = useState(getSettings());
  
  const { seconds, start, reset } = useTimer(30, () => {
    // Time's up
    endGame();
  });
  
  useEffect(() => {
    if (gameStarted) {
      const filtered = trueFalseData.filter(q => q.difficulty === difficulty);
      const shuffled = shuffle(filtered);
      setQuestions(shuffled);
      setCurrentQuestionIndex(0);
      setScore(0);
      setCorrectCount(0);
      setWrongCount(0);
      setStreak(0);
      setShowEndScreen(false);
      setShowFeedback(false);
      setSelectedAnswer(null);
      setIsCorrect(false);
      reset(30);
      start();
    }
  }, [gameStarted, difficulty]);
  
  const handleStart = () => {
    initAudio(); // Initialize audio on user interaction
    setGameStarted(true);
  };
  
  const handleAnswer = (userAnswer) => {
    if (seconds === 0 || showFeedback) return;
    
    const currentQuestion = questions[currentQuestionIndex];
    const correct = userAnswer === currentQuestion.isTrue;
    
    setSelectedAnswer(userAnswer);
    setIsCorrect(correct);
    setShowFeedback(true);
    
    if (correct) {
      setScore(prev => prev + 10);
      setCorrectCount(prev => prev + 1);
      setStreak(prev => prev + 1);
      playCorrectSound(settings.soundEnabled);
    } else {
      setScore(prev => Math.max(0, prev - 5));
      setWrongCount(prev => prev + 1);
      setStreak(0);
      playWrongSound(settings.soundEnabled);
    }
    
    // Auto-advance after 1.5 seconds
    setTimeout(() => {
      moveToNextQuestion();
    }, 1500);
  };
  
  const moveToNextQuestion = () => {
    setShowFeedback(false);
    setSelectedAnswer(null);
    
    // Move to next question
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // Out of questions, end game
      endGame();
    }
  };
  
  const endGame = () => {
    const globalScore = getGlobalScore();
    const categoryScores = getCategoryScores();
    saveGlobalScore(globalScore + score);
    saveCategoryScore('trueFalse', (categoryScores.trueFalse || 0) + score);
    
    if (seconds === 0) {
      playLoseSound(settings.soundEnabled);
    }
    
    setShowEndScreen(true);
  };
  
  const handleRestart = () => {
    setGameStarted(false);
    setCurrentQuestionIndex(0);
    setScore(0);
    setCorrectCount(0);
    setWrongCount(0);
    setStreak(0);
    setShowEndScreen(false);
    setShowFeedback(false);
    setSelectedAnswer(null);
    setIsCorrect(false);
    reset(30);
  };
  
  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <GameHeader category="trueFalse" />
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
              <div className="text-6xl mb-4 animate-float">⚡</div>
              <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-gradient">Egypt True or False Blitz!</h1>
              <p className="text-lg sm:text-xl text-gray-600 leading-relaxed">
                Answer as many Egypt-related questions as you can in 30 seconds! Test your knowledge about Egyptian history, geography, and culture. +10 for correct, -5 for wrong.
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
    const totalQuestions = correctCount + wrongCount;
    const accuracy = totalQuestions > 0 ? ((correctCount / totalQuestions) * 100).toFixed(1) : 0;
    
    return (
      <div className="h-screen overflow-hidden bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex flex-col">
        <GameHeader category="trueFalse" />
        <div className="flex-1 container mx-auto px-4 py-4 sm:py-6 flex items-center justify-center overflow-y-auto">
          <div className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl p-6 sm:p-8 text-center border border-gray-100 my-auto">
            <div className="text-6xl mb-4 animate-float">⏰</div>
            <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-gradient">Time's Up!</h1>
            
            {/* Final Score Display */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl p-6 mb-6 shadow-lg">
              <p className="text-xl font-semibold mb-1 opacity-90">Final Score</p>
              <p className="text-5xl font-bold">{score}</p>
            </div>
            
            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4 mb-6 max-w-lg mx-auto">
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border-2 border-green-200 shadow-md">
                <p className="text-xs font-semibold text-gray-600 mb-1">Correct</p>
                <p className="text-3xl font-bold text-green-600">{correctCount}</p>
              </div>
              <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-xl p-4 border-2 border-red-200 shadow-md">
                <p className="text-xs font-semibold text-gray-600 mb-1">Wrong</p>
                <p className="text-3xl font-bold text-red-600">{wrongCount}</p>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border-2 border-blue-200 shadow-md">
                <p className="text-xs font-semibold text-gray-600 mb-1">Total Questions</p>
                <p className="text-3xl font-bold text-blue-600">{totalQuestions}</p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border-2 border-purple-200 shadow-md">
                <p className="text-xs font-semibold text-gray-600 mb-1">Accuracy</p>
                <p className="text-3xl font-bold text-purple-600">{accuracy}%</p>
              </div>
            </div>
            
            {/* Streak Display */}
            {streak > 0 && (
              <div className="mb-6">
                <div className="bg-gradient-to-r from-orange-100 to-yellow-100 rounded-xl p-3 border-2 border-orange-300 inline-block">
                  <p className="text-xs font-semibold text-gray-700 mb-1">Best Streak</p>
                  <p className="text-2xl font-bold text-orange-600">🔥 {streak}</p>
                </div>
              </div>
            )}
            
            {/* Action Buttons */}
            <div className="flex gap-4 justify-center flex-wrap">
              <Button onClick={handleRestart} size="lg" variant="primary">
                🔄 Play Again
              </Button>
              <Button onClick={() => navigate('/')} size="lg" variant="secondary">
                🏠 Home
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  const currentQuestion = questions[currentQuestionIndex];
  
  return (
    <div className="h-screen overflow-hidden bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex flex-col">
      <GameHeader category="trueFalse" showTimer timer={seconds} />
      <div className="flex-1 container mx-auto px-4 py-4 sm:py-6 flex items-center justify-center overflow-y-auto">
        <div className="max-w-3xl w-full my-auto">
          {/* Stats Bar */}
          <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 mb-4 sm:mb-6">
            <div className="flex justify-between items-center flex-wrap gap-4">
              <div className="text-center">
                <div className="text-sm text-gray-600">Score</div>
                <div className="text-2xl font-bold text-blue-600">{score}</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-600">Streak</div>
                <div className="text-2xl font-bold text-orange-600">{streak}</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-600">Correct</div>
                <div className="text-2xl font-bold text-green-600">{correctCount}</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-600">Wrong</div>
                <div className="text-2xl font-bold text-red-600">{wrongCount}</div>
              </div>
            </div>
          </div>
          
          {/* Question Card */}
          <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
            <div className="text-center mb-6">
              <div className={`text-5xl sm:text-6xl font-bold mb-3 ${
                seconds <= 5 ? 'text-red-600 animate-pulse' : 'text-gray-800'
              }`}>
                {seconds}
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 leading-tight">
                {currentQuestion?.statement}
              </h2>
            </div>
            
            {/* Answer Buttons */}
            <div className="grid grid-cols-2 gap-4 sm:gap-6 mb-4">
              <Button
                onClick={() => handleAnswer(true)}
                variant={showFeedback && currentQuestion?.isTrue === true ? 'success' : showFeedback && selectedAnswer === true && !isCorrect ? 'danger' : 'success'}
                size="lg"
                className={`py-6 sm:py-8 text-xl sm:text-2xl transition-all ${
                  showFeedback && currentQuestion?.isTrue === true
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500 shadow-lg scale-105'
                    : showFeedback && selectedAnswer === true && !isCorrect
                    ? 'bg-gradient-to-r from-red-500 to-rose-500'
                    : ''
                }`}
                disabled={seconds === 0 || showFeedback}
              >
                ✓ True
              </Button>
              <Button
                onClick={() => handleAnswer(false)}
                variant={showFeedback && currentQuestion?.isTrue === false ? 'success' : showFeedback && selectedAnswer === false && !isCorrect ? 'danger' : 'danger'}
                size="lg"
                className={`py-6 sm:py-8 text-xl sm:text-2xl transition-all ${
                  showFeedback && currentQuestion?.isTrue === false
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500 shadow-lg scale-105'
                    : showFeedback && selectedAnswer === false && !isCorrect
                    ? 'bg-gradient-to-r from-red-500 to-rose-500'
                    : ''
                }`}
                disabled={seconds === 0 || showFeedback}
              >
                ✗ False
              </Button>
            </div>
            
            {/* Feedback Message */}
            {showFeedback && (
              <div className={`text-center p-4 sm:p-6 rounded-xl mb-4 shadow-lg ${
                isCorrect
                  ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-2 border-green-500'
                  : 'bg-gradient-to-r from-red-100 to-rose-100 text-red-800 border-2 border-red-500'
              }`}>
                <div className="text-3xl sm:text-4xl mb-2">
                  {isCorrect ? '✓' : '✗'}
                </div>
                <div className="text-xl sm:text-2xl font-bold">
                  {isCorrect
                    ? 'Correct!'
                    : `Wrong! The correct answer is: ${currentQuestion?.isTrue ? 'True' : 'False'}`}
                </div>
              </div>
            )}
            
            {seconds === 0 && !showFeedback && (
              <div className="mt-6 text-center">
                <p className="text-xl text-red-600 font-bold">Time's Up!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrueFalse;

