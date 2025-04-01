import React from 'react';
import { Crown } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-900/10 to-amber-800/10">
      <header className="bg-amber-900/80 text-amber-100 p-4 shadow-lg">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Crown className="h-6 w-6" />
            <h1 className="text-2xl font-bold">Dawnia</h1>
          </div>
        </div>
      </header>
      <main className="container mx-auto p-4">
        {children}
      </main>
    </div>
  );
}