import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Quiz from './pages/Quiz';
import WordSearch from './pages/WordSearch';
import FourPics from './pages/FourPics';
import TrueFalse from './pages/TrueFalse';

/**
 * Main App component with routing
 */
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/word-search" element={<WordSearch />} />
        <Route path="/four-pics" element={<FourPics />} />
        <Route path="/true-false" element={<TrueFalse />} />
      </Routes>
    </Router>
  );
}

export default App;

