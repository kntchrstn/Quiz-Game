/**
 * Difficulty Selector component with enhanced styling
 */
const DifficultySelector = ({ selected, onChange, className = '' }) => {
  const difficulties = [
    { value: 'easy', label: 'Easy', emoji: '🟢' },
    { value: 'medium', label: 'Medium', emoji: '🟡' },
    { value: 'hard', label: 'Hard', emoji: '🔴' },
  ];
  
  const getButtonClass = (value) => {
    const base = 'px-6 py-3 rounded-xl font-bold transition-all duration-300 text-lg hover:scale-105 active:scale-95';
    if (selected === value) {
      if (value === 'easy') return `${base} bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg scale-105`;
      if (value === 'medium') return `${base} bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg scale-105`;
      if (value === 'hard') return `${base} bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-lg scale-105`;
    }
    return `${base} bg-gray-200 text-gray-700 hover:bg-gray-300 shadow-md`;
  };
  
  return (
    <div className={`flex gap-3 ${className}`}>
      {difficulties.map((diff) => (
        <button
          key={diff.value}
          onClick={() => onChange(diff.value)}
          className={getButtonClass(diff.value)}
        >
          <span className="flex items-center gap-2">
            <span>{diff.emoji}</span>
            <span>{diff.label}</span>
          </span>
        </button>
      ))}
    </div>
  );
};

export default DifficultySelector;

