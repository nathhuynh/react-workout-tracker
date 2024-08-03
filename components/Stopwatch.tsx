import React, { useState, useEffect } from 'react';

const Stopwatch: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState(0);

  useEffect(() => {
    const savedTime = localStorage.getItem('stopwatchTime');
    const savedIsRunning = localStorage.getItem('stopwatchIsRunning');

    if (savedTime) {
      setTime(parseInt(savedTime, 10));
    }
    if (savedIsRunning) {
      setIsRunning(savedIsRunning === 'true');
    }
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isRunning) {
      timer = setInterval(() => {
        setTime(prevTime => {
          const newTime = prevTime + 1;
          localStorage.setItem('stopwatchTime', newTime.toString());
          return newTime;
        });
      }, 1000);
    } else if (!isRunning && time !== 0) {
      clearInterval(timer!);
    }
    return () => clearInterval(timer!);
  }, [isRunning, time]);

  useEffect(() => {
    localStorage.setItem('stopwatchIsRunning', isRunning.toString());
  }, [isRunning]);

  const handleStartStop = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTime(0);
    localStorage.removeItem('stopwatchTime');
    localStorage.removeItem('stopwatchIsRunning');
  };

  const formatTime = (seconds: number) => {
    const getSeconds = `0${seconds % 60}`.slice(-2);
    const minutes = Math.floor(seconds / 60);
    const getMinutes = `0${minutes % 60}`.slice(-2);
    const getHours = `0${Math.floor(seconds / 3600)}`.slice(-2);
    return `${getHours}:${getMinutes}:${getSeconds}`;
  };

  return (
    <div className="stopwatch bg-white p-4 rounded shadow-md">
      <div className="time text-2xl font-bold">{formatTime(time)}</div>
      <div className="controls mt-2">
        <button onClick={handleStartStop} className="bg-violet-950 text-white px-4 py-2 rounded mr-2">
          {isRunning ? 'Stop' : 'Start'}
        </button>
        <button onClick={handleReset} className="bg-gray-700 text-white px-4 py-2 rounded">
          Reset
        </button>
      </div>
    </div>
  );
};

export default Stopwatch;