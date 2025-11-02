import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

const CalculatorView = () => {
  const [userLat, setUserLat] = useState('');
  const [userLon, setUserLon] = useState('');
  const [showResult, setShowResult] = useState(false);

  const handleCalculate = () => {
    setShowResult(true);
  };

  return (
    <div className="w-full h-full overflow-auto p-4 md:p-6 flex items-center justify-center">
      <Card className="w-full max-w-2xl p-6 md:p-8 bg-card border-border">
        <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Pass Calculator
        </h2>
        <p className="text-muted-foreground text-sm mb-6">
          Calculate when satellites will be visible from your location (Phase 2 feature)
        </p>

        <div className="space-y-6">
          {/* User Location Input */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="latitude" className="text-foreground">
                Your Latitude
              </Label>
              <Input
                id="latitude"
                type="number"
                placeholder="e.g., 40.7128"
                value={userLat}
                onChange={(e) => setUserLat(e.target.value)}
                className="bg-background border-border text-foreground placeholder:text-muted-foreground"
                step="0.0001"
                min="-90"
                max="90"
              />
              <p className="text-xs text-muted-foreground">Range: -90 to 90</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="longitude" className="text-foreground">
                Your Longitude
              </Label>
              <Input
                id="longitude"
                type="number"
                placeholder="e.g., -74.0060"
                value={userLon}
                onChange={(e) => setUserLon(e.target.value)}
                className="bg-background border-border text-foreground placeholder:text-muted-foreground"
                step="0.0001"
                min="-180"
                max="180"
              />
              <p className="text-xs text-muted-foreground">Range: -180 to 180</p>
            </div>
          </div>

          {/* Calculate Button */}
          <Button
            onClick={handleCalculate}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] transition-all"
            size="lg"
          >
            Calculate Next Pass
          </Button>

          {/* Results Section */}
          {showResult && (
            <div className="mt-6 p-6 bg-muted/30 rounded-xl border border-border">
              <h3 className="text-lg font-semibold text-primary mb-4">
                Upcoming Passes (Mock Data)
              </h3>
              
              <div className="space-y-4">
                <div className="p-4 bg-card rounded-lg border border-border/50">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-semibold text-foreground">ISS (ZARYA)</span>
                    <span className="text-xs text-primary bg-primary/10 px-2 py-1 rounded">Visible</span>
                  </div>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <p>Next Pass: <span className="text-foreground font-mono">2024-11-02 18:45:32 UTC</span></p>
                    <p>Duration: <span className="text-foreground">6 minutes 23 seconds</span></p>
                    <p>Max Elevation: <span className="text-foreground">45.3°</span></p>
                    <p>Direction: <span className="text-foreground">SW to NE</span></p>
                  </div>
                </div>

                <div className="p-4 bg-card rounded-lg border border-border/50 opacity-70">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-semibold text-foreground">HUBBLE SPACE TELESCOPE</span>
                    <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">Low Visibility</span>
                  </div>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <p>Next Pass: <span className="text-foreground font-mono">2024-11-02 22:15:10 UTC</span></p>
                    <p>Duration: <span className="text-foreground">3 minutes 12 seconds</span></p>
                    <p>Max Elevation: <span className="text-foreground">15.7°</span></p>
                    <p>Direction: <span className="text-foreground">S to E</span></p>
                  </div>
                </div>

                <div className="p-4 bg-card rounded-lg border border-border/50">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-semibold text-foreground">TIANGONG SPACE STATION</span>
                    <span className="text-xs text-primary bg-primary/10 px-2 py-1 rounded">Visible</span>
                  </div>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <p>Next Pass: <span className="text-foreground font-mono">2024-11-03 06:32:45 UTC</span></p>
                    <p>Duration: <span className="text-foreground">4 minutes 58 seconds</span></p>
                    <p>Max Elevation: <span className="text-foreground">32.1°</span></p>
                    <p>Direction: <span className="text-foreground">W to SE</span></p>
                  </div>
                </div>
              </div>

              <p className="mt-4 text-xs text-muted-foreground text-center">
                ⚠️ This is placeholder data. Full pass calculation will be implemented in Phase 2.
              </p>
            </div>
          )}
        </div>

        {/* Info Section */}
        <div className="mt-6 p-4 bg-muted/20 rounded-lg border border-border/50">
          <h4 className="text-sm font-semibold text-foreground mb-2">How it works</h4>
          <p className="text-xs text-muted-foreground leading-relaxed">
            The pass calculator determines when satellites will be visible from your location by calculating 
            their orbital paths and comparing them to your horizon. Factors include satellite altitude, 
            your geographical position, time of day, and sun angle for visibility.
          </p>
        </div>
      </Card>
    </div>
  );
};

export default CalculatorView;