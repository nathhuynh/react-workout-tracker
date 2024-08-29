import React from 'react';
import Link from 'next/link';

const Hero: React.FC = () => {
  return (
    <div className="p-4 max-w-[800px] w-full mx-auto min-h-screen flex flex-col gap-10 justify-center items-center">
      <h1 className="uppercase text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold">
        Lift<span className="text-indigo-400">Log</span>
      </h1>
      <p className="text-center">
        Track Your Gains, Achieve Your Goals: Your{' '}
        <span className="uppercase font-medium text-indigo-400">Ultimate</span> Workout Gym Tracker
      </p>
      <Link href="/signup">
        <button className="rounded-md border-[2px] font-bold uppercase border-solid border-indigo-400 px-5 py-3 text-indigo-400 hover:bg-indigo-400 hover:text-slate-950 transition-colors duration-300">
          Get Started
        </button>
      </Link>
    </div>
  );
};

export default Hero;
