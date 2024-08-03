import Workout from '../components/CurrentWorkout';

export default function WorkoutPage() {
  return (
    <main className="min-h-screen flex flex-col text-sm sm:text-base bg-gradient-to-r from-indigo-950 to-slate-950">
      <Workout />
    </main>
  );
}