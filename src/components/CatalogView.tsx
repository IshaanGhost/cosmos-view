import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useSatelliteCatalog } from '@/hooks/useSatelliteCatalog';
import { isApiKeyConfigured } from '@/lib/satellite-api';
import { RefreshCw } from 'lucide-react';
import { useEffect } from 'react';
import { checkEnvironment } from '@/lib/env-check';

const CatalogView = () => {
  const { satellites, loading, refresh } = useSatelliteCatalog();
  const apiKeyConfigured = isApiKeyConfigured();

  // Debug: Check environment on mount
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      checkEnvironment();
    }
  }, []);

  return (
    <div className="w-full h-full overflow-auto p-4 md:p-6">
      <Card className="p-6 bg-card border-border">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Satellite Catalog
          </h2>
          <div className="flex items-center gap-3">
            {loading && (
              <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            )}
            <Button
              onClick={refresh}
              variant="outline"
              size="sm"
              disabled={loading}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>

        {!apiKeyConfigured && (
          <Alert className="mb-6 bg-yellow-500/10 border-yellow-500/50">
            <AlertDescription className="text-sm text-yellow-200">
              <strong>API key not configured.</strong> Catalog shows cached data. 
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
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-primary font-semibold">Name</th>
                <th className="text-left py-3 px-4 text-primary font-semibold">NORAD ID</th>
                <th className="text-left py-3 px-4 text-primary font-semibold hidden md:table-cell">Epoch Time</th>
                <th className="text-left py-3 px-4 text-primary font-semibold hidden lg:table-cell">TLE Line 1</th>
                <th className="text-left py-3 px-4 text-primary font-semibold hidden xl:table-cell">TLE Line 2</th>
                <th className="text-left py-3 px-4 text-primary font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {satellites.map((sat) => (
                <tr 
                  key={sat.noradId} 
                  className="border-b border-border/50 hover:bg-muted/30 transition-colors"
                >
                  <td className="py-3 px-4 font-medium text-foreground">{sat.name}</td>
                  <td className="py-3 px-4 font-mono text-muted-foreground">{sat.noradId}</td>
                  <td className="py-3 px-4 text-muted-foreground hidden md:table-cell text-xs">
                    {sat.epoch || 'N/A'}
                  </td>
                  <td className="py-3 px-4 font-mono text-xs text-muted-foreground hidden lg:table-cell max-w-xs truncate" title={sat.line1 || 'Not available'}>
                    {sat.line1 || (
                      <span className="text-yellow-500 italic">Not loaded</span>
                    )}
                  </td>
                  <td className="py-3 px-4 font-mono text-xs text-muted-foreground hidden xl:table-cell max-w-xs truncate" title={sat.line2 || 'Not available'}>
                    {sat.line2 || (
                      <span className="text-yellow-500 italic">Not loaded</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    {sat.loading ? (
                      <div className="w-3 h-3 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    ) : sat.error ? (
                      <span className="text-xs text-red-400" title={sat.error}>Error</span>
                    ) : sat.line1 && sat.line2 ? (
                      <span className="text-xs text-primary">✓ Live</span>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 text-xs text-muted-foreground flex items-center justify-between">
          <p>
            Showing {satellites.length} satellites. 
            {satellites.filter(s => s.line1 && s.line2).length > 0 && (
              <span className="text-primary ml-1">
                {satellites.filter(s => s.line1 && s.line2).length} with live TLE data
              </span>
            )}
          </p>
          <p>
            Updated: {new Date().toLocaleDateString()}
          </p>
        </div>
      </Card>
    </div>
  );
};

export default CatalogView;
