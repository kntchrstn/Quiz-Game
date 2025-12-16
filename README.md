# Quiz Game - Multi Category Games

A single-page web game application featuring 4 different game categories built with React, Vite, and TailwindCSS.

## Features

### Game Categories

1. **Quiz Game** - Multiple choice questions with 10 questions per session
2. **Word Search Puzzle** - Find hidden words in a grid (drag to select)
3. **4 Pics 1 Word** - Guess the word from four picture placeholders
4. **True or False Blitz** - Rapid fire true/false questions with 30-second timer

### Core Features

- Global score tracking and per-category scores
- LocalStorage for saving progress
- Sound effects toggle
- Difficulty levels: Easy, Medium, Hard
- Responsive design (mobile + desktop)
- Clean component architecture

## Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **TailwindCSS** - Styling
- **React Router** - Navigation

## Setup & Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to the URL shown in the terminal (usually `http://localhost:5173`)

## Project Structure

```
src/
├── components/       # Reusable UI components
│   ├── Button.jsx
│   ├── CategoryCard.jsx
│   ├── DifficultySelector.jsx
│   ├── GameHeader.jsx
│   ├── Modal.jsx
│   ├── ProgressBar.jsx
│   └── SoundToggle.jsx
├── pages/           # Game pages
│   ├── Home.jsx
│   ├── Quiz.jsx
│   ├── WordSearch.jsx
│   ├── FourPics.jsx
│   └── TrueFalse.jsx
├── data/            # JSON data files
│   ├── quizData.json
│   ├── wordSearchData.json
│   ├── fourPicsData.json
│   └── trueFalseData.json
├── utils/           # Utility functions
│   ├── storage.js
│   ├── helpers.js
│   ├── sounds.js
│   └── useTimer.js
├── App.jsx          # Main app with routing
└── main.jsx         # Entry point
```

## Game Rules

### Quiz Game
- Answer 10 multiple choice questions
- Points: Easy (10), Medium (20), Hard (30)
- Questions and options are shuffled

### Word Search Puzzle
- Find all words in the grid
- Click and drag to select letters
- Words can be horizontal, vertical, or diagonal
- Points: Easy (10), Medium (20), Hard (30) per word

### 4 Pics 1 Word
- 5 rounds per session
- Guess the common word from 4 pictures
- Use hints (costs 10 points)
- Points: Easy (20), Medium (30), Hard (40) per correct answer

### True or False Blitz
- 30-second timer
- Answer as many questions as possible
- +10 points for correct, -5 for wrong
- Track your streak!

## Data Storage

All game data is stored in localStorage:
- Global score
- Per-category scores
- Game settings (sound on/off)

## Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## License

MIT

