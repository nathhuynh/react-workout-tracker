import React from 'react';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
  return (
    <nav className="flex justify-around p-4 bg-indigo-900">
      <Link to="/">Home</Link>
      <Link to="/workout">Current Workout</Link>
      <Link to="/addexercise">Add Exercise</Link>
    </nav>
  );
};

export default Navbar;