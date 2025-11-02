import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { fetchVisualPasses, isApiKeyConfigured, type VisualPassesResponse } from '@/lib/satellite-api';
import { Alert, AlertDescription } from '@/components/ui/alert';

// Popular satellites to calculate passes for
const POPULAR_SATELLITES = [
  { noradId: 25544, name: 'ISS (ZARYA)' },
  { noradId: 20580, name: 'HUBBLE SPACE TELESCOPE' },
  { noradId: 48274, name: 'TIANGONG SPACE STATION' },
  { noradId: 33591, name: 'NOAA 19' },
  { noradId: 25994, name: 'TERRA' },
  { noradId: 39634, name: 'SENTINEL-1A' },
  { noradId: 44713, name: 'STARLINK-1007' },
  { noradId: 50463, name: 'JAMES WEBB SPACE TELESCOPE' }
];

interface PassResult {
  noradId: number;
  name: string;
  passes: VisualPassesResponse | null;
  loading: boolean;
  error: string | null;
}

const CalculatorView = () => {
  const [userLat, setUserLat] = useState('');
  const [userLon, setUserLon] = useState('');
  const [results, setResults] = useState<PassResult[]>([]);
  const [isCalculating, setIsCalculating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const apiKeyConfigured = isApiKeyConfigured();

  const formatDate = (utcTimestamp: number): string => {
    return new Date(utcTimestamp * 1000).toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZoneName: 'short'
    });
  };

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins} minute${mins !== 1 ? 's' : ''} ${secs} second${secs !== 1 ? 's' : ''}`;
  };

  const handleCalculate = async () => {
    const lat = parseFloat(userLat);
    const lon = parseFloat(userLon);

    // Validation
    if (isNaN(lat) || lat < -90 || lat > 90) {
      setError('Please enter a valid latitude between -90 and 90');
      return;
    }
    if (isNaN(lon) || lon < -180 || lon > 180) {
      setError('Please enter a valid longitude between -180 and 180');
      return;
    }

    if (!apiKeyConfigured) {
      setError('API key not configured. Please set VITE_N2YO_API_KEY in your .env file.');
      return;
    }

    setError(null);
    setIsCalculating(true);

    // Initialize results with loading state
    const initialResults: PassResult[] = POPULAR_SATELLITES.map(sat => ({
      noradId: sat.noradId,
      name: sat.name,
      passes: null,
      loading: true,
      error: null
    }));
    setResults(initialResults);

    // Fetch passes for each satellite sequentially (to respect rate limits)
    for (let i = 0; i < POPULAR_SATELLITES.length; i++) {
      const sat = POPULAR_SATELLITES[i];
      
      try {
        const passesData = await fetchVisualPasses(sat.noradId, lat, lon, 0, 10, 1);
        
        if (!passesData) {
          setResults(prev => 
            prev.map(result => 
              result.noradId === sat.noradId
                ? {
                    ...result,
                    loading: false,
                    error: 'API request failed - check API key or try again later'
                  }
                : result
            )
          );
        } else if (!passesData.passes || passesData.passes.length === 0) {
          // No passes found (but API call succeeded)
          setResults(prev => 
            prev.map(result => 
              result.noradId === sat.noradId
                ? {
                    ...result,
                    passes: passesData,
                    loading: false,
                    error: null // Not an error, just no passes
                  }
                : result
            )
          );
        } else {
          // Success - passes found
          setResults(prev => 
            prev.map(result => 
              result.noradId === sat.noradId
                ? {
                    ...result,
                    passes: passesData,
                    loading: false,
                    error: null
                  }
                : result
            )
          );
        }
      } catch (error) {
        const errorMessage = error instanceof Error 
          ? error.message 
          : 'Failed to fetch passes - API may be rate limited or satellite data unavailable';
        
        setResults(prev => 
          prev.map(result => 
            result.noradId === sat.noradId
              ? {
                  ...result,
                  loading: false,
                  error: errorMessage
                }
              : result
          )
        );
      }

      // Small delay between requests to respect rate limits
      if (i < POPULAR_SATELLITES.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 200));
      }
    }

    setIsCalculating(false);
  };

  return (
    <div className="w-full h-full overflow-auto">
      <div className="min-h-full flex items-start justify-center p-4 md:p-6 py-8">
        <Card className="w-full max-w-2xl p-6 md:p-8 bg-card border-border">
        <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Pass Calculator
        </h2>
        <p className="text-muted-foreground text-sm mb-6">
          Calculate when satellites will be visible from your location
        </p>

        {!apiKeyConfigured && (
          <Alert className="mb-6 bg-yellow-500/10 border-yellow-500/50">
            <AlertDescription className="text-sm text-yellow-200">
              <strong>API key not configured.</strong> Pass calculations require a valid API key.
              <a 
                href="https://www.n2yo.com/login/" 
                target="_blank"
                rel="noopener noreferrer"
                className="underline ml-1 hover:text-yellow-100"
              >
                Get free API key
              </a>
            </AlertDescription>
          </Alert>
        )}

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
            disabled={isCalculating || !apiKeyConfigured}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            size="lg"
          >
            {isCalculating ? 'Calculating...' : 'Calculate Next Passes'}
          </Button>

          {/* Error Message */}
          {error && (
            <Alert className="mt-4 bg-red-500/10 border-red-500/50">
              <AlertDescription className="text-sm text-red-200">{error}</AlertDescription>
            </Alert>
          )}

          {/* Results Section */}
          {results.length > 0 && (
            <div className="mt-6 p-6 bg-muted/30 rounded-xl border border-border">
              <h3 className="text-lg font-semibold text-primary mb-4">
                Upcoming Passes
              </h3>
              
              <div className="space-y-4">
                {results.map((result) => (
                  <div key={result.noradId} className="p-4 bg-card rounded-lg border border-border/50">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-semibold text-foreground">{result.name}</span>
                      {result.loading && (
                        <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                          Loading...
                        </span>
                      )}
                      {result.error && (
                        <span className="text-xs text-red-500 bg-red-500/10 px-2 py-1 rounded">
                          Error
                        </span>
                      )}
                      {result.passes && result.passes.passes && result.passes.passes.length === 0 && (
                        <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                          No passes
                        </span>
                      )}
                      {result.passes && result.passes.passes && result.passes.passes.length > 0 && (
                        <span className="text-xs text-primary bg-primary/10 px-2 py-1 rounded">
                          {result.passes.passes.length} pass{result.passes.passes.length !== 1 ? 'es' : ''}
                        </span>
                      )}
                    </div>

                    {result.loading && (
                      <p className="text-sm text-muted-foreground">Calculating passes...</p>
                    )}

                    {result.error && (
                      <p className="text-sm text-red-400">{result.error}</p>
                    )}

                    {result.passes && result.passes.passes && result.passes.passes.length === 0 && (
                      <p className="text-sm text-muted-foreground">
                        No visible passes found in the next 10 days from this location.
                      </p>
                    )}

                    {result.passes && result.passes.passes && result.passes.passes.length > 0 && (
                      <div className="space-y-3 mt-3">
                        {result.passes.passes.slice(0, 3).map((pass, idx) => (
                          <div key={idx} className="pl-3 border-l-2 border-primary/30">
                            <div className="space-y-1 text-sm">
                              <p className="text-muted-foreground">
                                <span className="font-semibold text-foreground">Start:</span>{' '}
                                <span className="font-mono">{formatDate(pass.startUTC)}</span>
                                {' '}({pass.startAzCompass}, {pass.startEl.toFixed(1)}°)
                              </p>
                              <p className="text-muted-foreground">
                                <span className="font-semibold text-foreground">Max Elevation:</span>{' '}
                                <span className="text-foreground">{pass.maxEl.toFixed(1)}°</span>
                                {' '}at <span className="font-mono">{formatDate(pass.maxUTC)}</span>
                                {' '}({pass.maxAzCompass})
                              </p>
                              <p className="text-muted-foreground">
                                <span className="font-semibold text-foreground">End:</span>{' '}
                                <span className="font-mono">{formatDate(pass.endUTC)}</span>
                                {' '}({pass.endAzCompass}, {pass.endEl.toFixed(1)}°)
                              </p>
                              <p className="text-muted-foreground">
                                <span className="font-semibold text-foreground">Duration:</span>{' '}
                                <span className="text-foreground">{formatDuration(pass.duration)}</span>
                                {pass.mag > 0 && (
                                  <> • <span className="font-semibold text-foreground">Magnitude:</span> <span className="text-foreground">{pass.mag.toFixed(1)}</span></>
                                )}
                              </p>
                            </div>
                          </div>
                        ))}
                        {result.passes && result.passes.passes && result.passes.passes.length > 3 && (
                          <p className="text-xs text-muted-foreground mt-2">
                            +{result.passes.passes.length - 3} more pass{result.passes.passes.length - 3 !== 1 ? 'es' : ''}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
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
    </div>
  );
};

export default CalculatorView;