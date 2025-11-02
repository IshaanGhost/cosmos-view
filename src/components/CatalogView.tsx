import { Card } from '@/components/ui/card';

interface SatelliteEntry {
  name: string;
  noradId: string;
  epoch: string;
  line1: string;
  line2: string;
}

const SATELLITE_CATALOG: SatelliteEntry[] = [
  {
    name: 'ISS (ZARYA)',
    noradId: '25544',
    epoch: '2024-01-01 12:00:00',
    line1: '1 25544U 98067A   24001.50000000  .00016717  00000-0  10270-3 0  9005',
    line2: '2 25544  51.6416 247.4627 0006703 130.5360 325.0288 15.72125391428615'
  },
  {
    name: 'STARLINK-1007',
    noradId: '44713',
    epoch: '2024-01-01 12:00:00',
    line1: '1 44713U 19074A   24001.50000000  .00001234  00000-0  89012-4 0  9998',
    line2: '2 44713  53.0534 123.4567 0001234  98.7654 261.3456 15.06490123456789'
  },
  {
    name: 'HUBBLE SPACE TELESCOPE',
    noradId: '20580',
    epoch: '2024-01-01 12:00:00',
    line1: '1 20580U 90037B   24001.50000000  .00000567  00000-0  23456-4 0  9991',
    line2: '2 20580  28.4700  45.6789 0002345 234.5678 125.4321 15.09234567890123'
  },
  {
    name: 'NOAA 19',
    noradId: '33591',
    epoch: '2024-01-01 12:00:00',
    line1: '1 33591U 09005A   24001.50000000  .00000234  00000-0  15678-4 0  9997',
    line2: '2 33591  99.1234 234.5678 0014567 156.7890 203.4567 14.12345678901234'
  },
  {
    name: 'TIANGONG SPACE STATION',
    noradId: '48274',
    epoch: '2024-01-01 12:00:00',
    line1: '1 48274U 21035A   24001.50000000  .00012345  00000-0  67890-4 0  9993',
    line2: '2 48274  41.4678 345.6789 0001234  45.6789 314.5678 15.60123456789012'
  },
  {
    name: 'TERRA',
    noradId: '25994',
    epoch: '2024-01-01 12:00:00',
    line1: '1 25994U 99068A   24001.50000000  .00000123  00000-0  12345-4 0  9996',
    line2: '2 25994  98.2345 178.9012 0001234 123.4567 236.7890 14.57123456789012'
  },
  {
    name: 'SENTINEL-1A',
    noradId: '39634',
    epoch: '2024-01-01 12:00:00',
    line1: '1 39634U 14016A   24001.50000000  .00000456  00000-0  34567-4 0  9994',
    line2: '2 39634  98.1823 267.8901 0001123  89.0123 271.1234 14.59876543210987'
  }
];

const CatalogView = () => {
  return (
    <div className="w-full h-full overflow-auto p-4 md:p-6">
      <Card className="p-6 bg-card border-border">
        <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Satellite Catalog
        </h2>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-primary font-semibold">Name</th>
                <th className="text-left py-3 px-4 text-primary font-semibold">NORAD ID</th>
                <th className="text-left py-3 px-4 text-primary font-semibold hidden md:table-cell">Epoch Time</th>
                <th className="text-left py-3 px-4 text-primary font-semibold hidden lg:table-cell">TLE Line 1</th>
                <th className="text-left py-3 px-4 text-primary font-semibold hidden xl:table-cell">TLE Line 2</th>
              </tr>
            </thead>
            <tbody>
              {SATELLITE_CATALOG.map((sat, index) => (
                <tr 
                  key={sat.noradId} 
                  className="border-b border-border/50 hover:bg-muted/30 transition-colors"
                >
                  <td className="py-3 px-4 font-medium text-foreground">{sat.name}</td>
                  <td className="py-3 px-4 font-mono text-muted-foreground">{sat.noradId}</td>
                  <td className="py-3 px-4 text-muted-foreground hidden md:table-cell text-xs">{sat.epoch}</td>
                  <td className="py-3 px-4 font-mono text-xs text-muted-foreground hidden lg:table-cell max-w-xs truncate" title={sat.line1}>
                    {sat.line1}
                  </td>
                  <td className="py-3 px-4 font-mono text-xs text-muted-foreground hidden xl:table-cell max-w-xs truncate" title={sat.line2}>
                    {sat.line2}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 text-xs text-muted-foreground">
          <p>Showing {SATELLITE_CATALOG.length} satellites. TLE data updated: 2024-01-01</p>
        </div>
      </Card>
    </div>
  );
};

export default CatalogView;