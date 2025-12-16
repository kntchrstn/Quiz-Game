import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CategoryCard from '../components/CategoryCard';
import GameHeader from '../components/GameHeader';

/**
 * Home page with category selection
 */
const Home = () => {
  const navigate = useNavigate();
  
  const categories = [
    {
      title: 'Quiz Game',
      description: 'Test your knowledge about Egypt with multiple choice questions',
      icon: '❓',
      route: '/quiz',
      color: 'blue',
    },
    {
      title: 'Word Search Puzzle',
      description: 'Find Egypt-related words hidden in the grid',
      icon: '🔍',
      route: '/word-search',
      color: 'green',
    },
    {
      title: 'True or False Blitz',
      description: 'Rapid fire true or false questions about Egypt',
      icon: '⚡',
      route: '/true-false',
      color: 'orange',
    },
    {
      title: '4 Pics 1 Word',
      description: 'Guess Egypt-related words from four pictures',
      icon: '🖼️',
      route: '/four-pics',
      color: 'purple',
    },
  ];
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse-slow"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
      </div>
      
      <GameHeader />
      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="text-center mb-12">
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold mb-6 text-gradient animate-float leading-tight pb-3 overflow-visible">
            Welcome to Egypt Quiz Game!
          </h1>
          <p className="text-xl sm:text-2xl text-gray-700 mb-8 max-w-2xl mx-auto leading-relaxed px-4">
            Explore the wonders of Egypt! Test your knowledge about Egyptian history, culture, geography, and more through fun and engaging games!
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto items-start">
          {categories.map((category, index) => (
            <div 
              key={category.route}
              className="animate-float"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CategoryCard {...category} isTall={index === 0 || index === 2} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;

