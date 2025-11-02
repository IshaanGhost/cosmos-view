import { useState } from 'react';
import TrackerView from '@/components/TrackerView';
import CatalogView from '@/components/CatalogView';
import CalculatorView from '@/components/CalculatorView';
import { Button } from '@/components/ui/button';

type ViewType = 'tracker' | 'catalog' | 'calculator';

const Index = () => {
  const [activeView, setActiveView] = useState<ViewType>('tracker');

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header with Navigation */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Title */}
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              🛰️ Satellite Tracker
            </h1>

            {/* Navigation Tabs */}
            <nav className="flex gap-2">
              <Button
                onClick={() => setActiveView('tracker')}
                variant={activeView === 'tracker' ? 'default' : 'outline'}
                className={activeView === 'tracker' 
                  ? 'bg-primary text-primary-foreground shadow-[0_0_20px_rgba(6,182,212,0.3)]' 
                  : 'border-border text-muted-foreground hover:text-foreground hover:border-primary/50'}
              >
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
                Tracker
              </Button>

              <Button
                onClick={() => setActiveView('catalog')}
                variant={activeView === 'catalog' ? 'default' : 'outline'}
                className={activeView === 'catalog' 
                  ? 'bg-primary text-primary-foreground shadow-[0_0_20px_rgba(6,182,212,0.3)]' 
                  : 'border-border text-muted-foreground hover:text-foreground hover:border-primary/50'}
              >
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
                </svg>
                Catalog
              </Button>

              <Button
                onClick={() => setActiveView('calculator')}
                variant={activeView === 'calculator' ? 'default' : 'outline'}
                className={activeView === 'calculator' 
                  ? 'bg-primary text-primary-foreground shadow-[0_0_20px_rgba(6,182,212,0.3)]' 
                  : 'border-border text-muted-foreground hover:text-foreground hover:border-primary/50'}
              >
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm-2 14l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/>
                </svg>
                Calculator
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-hidden">
        {activeView === 'tracker' && <TrackerView />}
        {activeView === 'catalog' && <CatalogView />}
        {activeView === 'calculator' && <CalculatorView />}
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card/30 backdrop-blur-sm py-3 px-4">
        <div className="container mx-auto">
          <p className="text-xs text-muted-foreground text-center">
            Real-Time Satellite Tracker • Phase 1 • Data: ISS & Selected Satellites • 
            <span className="text-primary ml-1">TLE Updated: 2024-01-01</span>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;