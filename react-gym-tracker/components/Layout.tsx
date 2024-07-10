import React from 'react';
import Link from 'next/link';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className={inter.className}>
      <header>
        <nav>
          <ul>
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>
              <Link href="/workout">Workout</Link>
            </li>
            <li>
              <Link href="/addcustomexercise">Add Custom Exercise</Link>
            </li>
            <li>
              <Link href="/new-mesocycle">New Mesocycle</Link>
            </li>
            <li>
              <Link href="/mesocycles">Mesocycles</Link>
            </li>
          </ul>
        </nav>
      </header>
      <main>{children}</main>
      <footer>
        <p>Footer content here</p>
      </footer>
    </div>
  );
};

export default Layout;