import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Hero from './components/Hero';
import Workout from './components/CurrentWorkout';
// import Navbar from './components/Navbar';
import Layout from './components/Layout';
import AddCustomExercise from './components/AddCustomExercise';
import NewMesocycle from './components/NewMesocycle';
import Mesocycles from './components/Mesocycles'

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
        <main className="min-h-screen flex flex-col text-sm sm:text-base bg-gradient-to-r from-indigo-950 to-slate-950">
          <Routes>
            <Route path="/" element={<Hero />} />
            <Route path="/workout" element={<Workout />} />
            <Route path="/addcustomexercise" element={<AddCustomExercise />} />
            <Route path="/new-mesocycle" element={<NewMesocycle />} />
            <Route path="/mesocycles" element={<Mesocycles />} />
          </Routes>
        </main>
      </Layout>
    </Router>
  );
};

export default App;