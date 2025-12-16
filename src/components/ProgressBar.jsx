/**
 * Progress Bar component with enhanced styling
 */
const ProgressBar = ({ progress, max = 100, label = '', className = '' }) => {
  const percentage = Math.min((progress / max) * 100, 100);
  
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <div className="flex justify-between mb-3">
          <span className="text-base font-bold text-gray-700">{label}</span>
          <span className="text-base font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {progress}/{max}
          </span>
        </div>
      )}
      <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden shadow-inner">
        <div
          className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 h-full transition-all duration-500 rounded-full shadow-lg relative shimmer"
          style={{ width: `${percentage}%` }}
        >
          <div className="absolute inset-0 bg-white/20 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;

