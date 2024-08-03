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
      return date.toDateString();
    };
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center" onClick={onClose}>
        <div className="bg-white p-6 rounded-lg max-w-md w-full" onClick={(e) => e.stopPropagation()}>
          <h2 className="text-xl font-bold mb-4">{exerciseName}</h2>
          {lastStats ? (
            <>
              <p className="mb-2 pb-4">Last Session: {formatDate(lastStats.date)}</p>
              <div className="grid grid-cols-3 gap-2 font-semibold mb-2 pb-2 border-b text-center">
                <div>Set</div>
                <div>Weight (kg)</div>
                <div>Reps</div>
              </div>
              {lastStats.sets.map((set, index) => (
                <div key={index} className={`grid grid-cols-3 gap-2 py-2 ${index !== 0 ? 'border-t' : ''} text-center`}>
                  <div>{set.type === 'dropset' ? 'DS' : index + 1}</div>
                  <div>{set.weight}</div>
                  <div>{set.reps}</div>
                </div>
              ))}
            </>
          ) : (
            <p>No previous session found.</p>
          )}
          <div className="flex justify-end mt-4 pt-4">
            <button 
              className="text-black px-4 py-2 rounded font-bold"
              onClick={onClose}
            >
              CLOSE
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  export default LastStatsModal;