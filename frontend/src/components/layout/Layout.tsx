import type { ReactNode } from 'react';
import Navbar from './Navbar';
import StarField from '../ui/Starfield';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen relative">
      {/* Starfield background */}
      <StarField count={150} showShootingStars={true} />
      
      {/* Content */}
      <div className="relative z-10">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
      </div>
    </div>
  );
}