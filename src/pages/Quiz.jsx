import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import quizData from '../data/quizData.json';
import GameHeader from '../components/GameHeader';
import Button from '../components/Button';
import DifficultySelector from '../components/DifficultySelector';
import ProgressBar from '../components/ProgressBar';
import Modal from '../components/Modal';
import { shuffle } from '../utils/helpers';
import { getGlobalScore, saveGlobalScore, getCategoryScores, saveCategoryScore, getSettings } from '../utils/storage';
import { playCorrectSound, playWrongSound, playWinSound, initAudio } from '../utils/sounds';

/**
 * Quiz Game page - Multiple choice questions
 */
const Quiz = () => {
  const navigate = useNavigate();
  const [difficulty, setDifficulty] = useState('medium');
  const [gameStarted, setGameStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [showEndScreen, setShowEndScreen] = useState(false);
  const [settings, setSettings] = useState(getSettings());
  
  // Filter and prepare questions
  useEffect(() => {
    if (gameStarted) {
      const filtered = quizData.filter(q => q.difficulty === difficulty);
      const shuffled = shuffle(filtered).slice(0, 10);
      const shuffledWithOptions = shuffled.map(q => {
        // Store the correct answer before shuffling
        const correctAnswer = q.options[q.answerIndex];
        const shuffledOptions = shuffle(q.options);
        // Find the new index of the correct answer after shuffling
        const newAnswerIndex = shuffledOptions.indexOf(correctAnswer);
        
        return {
          ...q,
          options: shuffledOptions,
          answerIndex: newAnswerIndex,
        };
      });
      setQuestions(shuffledWithOptions);
      setCurrentQuestionIndex(0);
      setScore(0);
      setShowEndScreen(false);
    }
  }, [gameStarted, difficulty]);
  
  const handleStart = () => {
    initAudio(); // Initialize audio on user interaction
    setGameStarted(true);
  };
  
  const handleAnswerSelect = (index) => {
    if (showFeedback) return;
    setSelectedAnswer(index);
  };
  
  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return;
    
    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = selectedAnswer === currentQuestion.answerIndex;
    const points = isCorrect ? (difficulty === 'easy' ? 10 : difficulty === 'medium' ? 20 : 30) : 0;
    const newScore = score + points;
    
    setShowFeedback(true);
    
    if (isCorrect) {
      setScore(newScore);
      playCorrectSound(settings.soundEnabled);
    } else {
      playWrongSound(settings.soundEnabled);
    }
    
    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
        setSelectedAnswer(null);
        setShowFeedback(false);
      } else {
        // Game over
        const globalScore = getGlobalScore();
        const categoryScores = getCategoryScores();
        
        saveGlobalScore(globalScore + newScore);
        saveCategoryScore('quiz', (categoryScores.quiz || 0) + newScore);
        
        playWinSound(settings.soundEnabled);
        setShowEndScreen(true);
      }
    }, 2000);
  };
  
  const handleRestart = () => {
    setGameStarted(false);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowFeedback(false);
    setScore(0);
    setShowEndScreen(false);
  };
  
  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <GameHeader category="quiz" />
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
              <div className="text-6xl mb-4 animate-float">❓</div>
              <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-gradient">Egypt Quiz Game!</h1>
              <p className="text-lg sm:text-xl text-gray-600 leading-relaxed">
                Answer 10 multiple choice questions about Egypt. Test your knowledge of Egyptian history, culture, geography, and landmarks!
              </p>
            </div>
            
            <div className="mb-8 sm:mb-10">
              <label className="block text-lg sm:text-xl font-bold mb-6 text-center text-gray-700">Select Difficulty:</label>
              <DifficultySelector selected={difficulty} onChange={setDifficulty} className="justify-center flex-wrap" />
            </div>
            
            <div className="text-center">
              <Button onClick={handleStart} size="lg" variant="primary" className="px-8 sm:px-12">
                🚀 Start Quiz
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (showEndScreen) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <GameHeader category="quiz" />
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-2xl p-12 text-center border border-gray-100">
            <div className="text-7xl mb-6 animate-float">🎉</div>
            <h1 className="text-5xl font-bold mb-6 text-gradient">Quiz Complete!</h1>
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl p-8 mb-8 shadow-lg">
              <p className="text-2xl font-semibold mb-2 opacity-90">Your Score</p>
              <p className="text-6xl font-bold">{score}</p>
            </div>
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <GameHeader category="quiz" />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <ProgressBar 
            progress={currentQuestionIndex + 1} 
            max={questions.length} 
            label="Question"
            className="mb-8"
          />
          
          <div className="bg-white rounded-2xl shadow-2xl p-10 border border-gray-100">
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-semibold text-gray-500 bg-gray-100 px-4 py-2 rounded-full">
                  Question {currentQuestionIndex + 1} of {questions.length}
                </span>
                <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Score: {score}
                </div>
              </div>
              <h2 className="text-3xl font-bold text-gray-800 leading-relaxed">{currentQuestion?.question}</h2>
            </div>
            
            <div className="space-y-4 mb-8">
              {currentQuestion?.options.map((option, index) => {
                let buttonClass = 'w-full text-left p-5 rounded-xl border-2 transition-all duration-300 font-medium text-lg ';
                
                if (showFeedback) {
                  if (index === currentQuestion.answerIndex) {
                    buttonClass += 'bg-gradient-to-r from-green-100 to-emerald-100 border-green-500 text-green-800 shadow-lg scale-105';
                  } else if (index === selectedAnswer && index !== currentQuestion.answerIndex) {
                    buttonClass += 'bg-gradient-to-r from-red-100 to-rose-100 border-red-500 text-red-800';
                  } else {
                    buttonClass += 'bg-gray-50 border-gray-300 text-gray-600';
                  }
                } else {
                  buttonClass += selectedAnswer === index
                    ? 'bg-gradient-to-r from-blue-100 to-purple-100 border-blue-500 text-blue-800 shadow-md hover:shadow-lg'
                    : 'bg-white border-gray-300 hover:border-blue-400 hover:bg-blue-50 hover:shadow-md text-gray-700';
                }
                
                return (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(index)}
                    className={buttonClass}
                    disabled={showFeedback}
                  >
                    <span className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-full bg-white/50 flex items-center justify-center font-bold">
                        {String.fromCharCode(65 + index)}
                      </span>
                      <span>{option}</span>
                    </span>
                  </button>
                );
              })}
            </div>
            
            {showFeedback && (
              <div className={`text-center p-6 rounded-xl mb-6 shadow-lg ${
                selectedAnswer === currentQuestion.answerIndex
                  ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-2 border-green-500'
                  : 'bg-gradient-to-r from-red-100 to-rose-100 text-red-800 border-2 border-red-500'
              }`}>
                <div className="text-3xl mb-2">
                  {selectedAnswer === currentQuestion.answerIndex ? '✓' : '✗'}
                </div>
                <div className="text-xl font-bold">
                  {selectedAnswer === currentQuestion.answerIndex
                    ? 'Correct!'
                    : `Wrong! The correct answer is: ${currentQuestion.options[currentQuestion.answerIndex]}`}
                </div>
              </div>
            )}
            
            <div className="flex justify-end">
              <Button
                onClick={handleSubmitAnswer}
                disabled={selectedAnswer === null || showFeedback}
                variant="primary"
                size="lg"
                className="min-w-[200px]"
              >
                {showFeedback ? '➡️ Next Question' : '✅ Submit Answer'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quiz;

