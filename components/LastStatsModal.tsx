import React from 'react';

interface Set {
    weight: number;
    reps: number;
    logged: boolean;
    type?: 'regular' | 'dropset';
}

interface LastStatsModalProps {
    isOpen: boolean;
    onClose: () => void;
    exerciseName: string;
    lastStats: { date: string, sets: Set[] } | null;
}

const LastStatsModal: React.FC<LastStatsModalProps> = ({ isOpen, onClose, exerciseName, lastStats }) => {
    if (!isOpen) return null;
  
    const formatDate = (dateString: string) => {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    };
  
    return (
      <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center p-4 overflow-y-auto" onClick={onClose}>
        <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-auto" onClick={(e) => e.stopPropagation()}>
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-xl font-bold text-gray-800">{exerciseName}</h4>
            </div>

            {lastStats ? (
              <>
                <p className="text-sm text-gray-600 mb-4">Last Session: {formatDate(lastStats.date)}</p>
                <div className="bg-gray-100 rounded-lg p-4">
                  <div className="grid grid-cols-3 gap-2 font-semibold mb-2 pb-2 border-b border-gray-300 text-center text-sm uppercase text-gray-700">
                    <div>Set</div>
                    <div>Weight (kg)</div>
                    <div>Reps</div>
                  </div>
                  {lastStats.sets.map((set, index) => (
                    <div key={index} className={`grid grid-cols-3 gap-2 py-2 ${index !== 0 ? 'border-t border-gray-300' : ''} text-center`}>
                      <div>{set.type === 'dropset' ? 'DS' : index + 1}</div>
                      <div>{set.weight}</div>
                      <div>{set.reps}</div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <p className="text-sm text-gray-600">No previous session found.</p>
            )}

            <div className="mt-6 flex justify-start">
              <button 
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                onClick={onClose}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default LastStatsModal;