import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Hero from './components/Hero';
import Workout from './components/CurrentWorkout';
import Navbar from './components/Navbar';
import AddExercise from './components/AddExercise';

function App() {
  const [count, setCount] = useState(0);

  return (
    <Router>
      <Navbar />
      <main className="min-h-screen flex flex-col text-white text-sm sm:text-base bg-gradient-to-r from-indigo-950 to-slate-950">
        <Routes>
          <Route path="/" element={<Hero />} />
          <Route path="/workout" element={<Workout />} />
          <Route path="/addexercise" element={<AddExercise />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
