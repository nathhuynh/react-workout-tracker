import React from 'react';

const Hero: React.FC = () => {
  return (
    <div className="p-4 max-w-[800px] w-full mx-auto min-h-screen flex flex-col gap-10 justify-center items-center">
      <h1 className="uppercase text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold">
        Lift<span className="text-violet-400">Log</span>
      </h1>
      <p>
        Track Your Gains, Achieve Your Goals: Your{' '}
        <span className="uppercase font-medium text-violet-400">Ultimate</span> Workout Gym Tracker
      </p>
      <button className="rounded-md border-[2px] border-solid border-violet-400 bg-slate-950 px-7 py-5 buttonShadow duration-150">
        PUSH
      </button>
    </div>
  );
};

export default Hero;
