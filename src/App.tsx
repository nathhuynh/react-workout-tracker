import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Hero from './components/Hero';
import Workout from './components/CurrentWorkout';
// import Navbar from './components/Navbar';
import AddExercise from './components/AddExercise';
import Layout from './components/Layout';

interface Exercise {
  name: string;
  weightProgression: number[];
}

const App: React.FC = () => {
  const [exercises, setExercises] = useState<Exercise[]>([]);

  const addExercise = (exercise: Exercise) => {
    setExercises([...exercises, exercise]);
  };

  return (
    <Router>
      {/* <Navbar /> */}
      <Layout>
        <main className="min-h-screen flex flex-col text-white text-sm sm:text-base bg-gradient-to-r from-indigo-950 to-slate-950">
          <Routes>
            <Route path="/" element={<Hero />} />
            <Route path="/workout" element={<Workout />} />
            <Route path="/addexercise" element={<AddExercise addExercise={addExercise} />} />
          </Routes>
        </main>
      </Layout>
    </Router>
  );
};

export default App;