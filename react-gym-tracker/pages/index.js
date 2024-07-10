import Hero from '../components/Hero';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col text-sm sm:text-base bg-gradient-to-r from-indigo-950 to-slate-950">
      <Hero />
    </main>
  );
}