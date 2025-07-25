import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

// Set Mapbox access token
mapboxgl.accessToken = 'pk.eyJ1IjoiamFjb2ItbWF0dGhld3MiLCJhIjoiY21kZ3FkbjJwMHB4bjJsbzhxN2N6cGpiNCJ9.5TBF1McUmSJcFRAs62qAVw';

interface SeabedDataPoint {
  id: string;
  name: string;
  coordinates: [number, number];
  type: 'video_mapping' | 'bathymetry' | 'ecosystem_survey';
  tier: 'public' | 'premium' | 'developer';
  description: string;
  depth: number;
}

const sampleSeabedData: SeabedDataPoint[] = [
  {
    id: '1',
    name: 'Mariana Trench - Challenger Deep',
    coordinates: [142.2, 11.373],
    type: 'video_mapping',
    tier: 'premium',
    description: 'Deep-sea video mapping of the world\'s deepest ocean trench',
    depth: -10994
  },
  {
    id: '2',
    name: 'Great Barrier Reef Survey Zone',
    coordinates: [145.7781, -16.2839],
    type: 'ecosystem_survey',
    tier: 'public',
    description: 'Coral reef ecosystem monitoring and biodiversity mapping',
    depth: -25
  },
  {
    id: '3',
    name: 'Mid-Atlantic Ridge',
    coordinates: [-29.0, 45.0],
    type: 'bathymetry',
    tier: 'developer',
    description: 'High-resolution bathymetric mapping of tectonic features',
    depth: -2500
  },
  {
    id: '4',
    name: 'Monterey Canyon',
    coordinates: [-121.9, 36.7],
    type: 'video_mapping',
    tier: 'public',
    description: 'Submarine canyon ecosystem documentation',
    depth: -1200
  }
];

const SeabedMap: React.FC = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [selectedPoint, setSelectedPoint] = useState<SeabedDataPoint | null>(null);

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    // Initialize map with ocean-focused style
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/satellite-v9',
      zoom: 2,
      center: [0, 0],
      pitch: 45,
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Add data points
    map.current.on('load', () => {
      if (!map.current) return;

      // Add data source
      map.current.addSource('seabed-data', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: sampleSeabedData.map(point => ({
            type: 'Feature',
            properties: {
              id: point.id,
              name: point.name,
              type: point.type,
              tier: point.tier,
              description: point.description,
              depth: point.depth
            },
            geometry: {
              type: 'Point',
              coordinates: point.coordinates
            }
          }))
        }
      });

      // Add circles for data points
      map.current.addLayer({
        id: 'seabed-data-circles',
        type: 'circle',
        source: 'seabed-data',
        paint: {
          'circle-radius': [
            'interpolate',
            ['linear'],
            ['abs', ['get', 'depth']],
            0, 6,
            1000, 8,
            5000, 10,
            10000, 12
          ],
          'circle-color': [
            'case',
            ['==', ['get', 'tier'], 'public'], '#0ea5e9',
            ['==', ['get', 'tier'], 'premium'], '#8b5cf6',
            '#06b6d4' // developer
          ],
          'circle-stroke-width': 2,
          'circle-stroke-color': '#ffffff',
          'circle-opacity': 0.8
        }
      });

      // Add click handler
      map.current.on('click', 'seabed-data-circles', (e) => {
        if (e.features && e.features[0]) {
          const feature = e.features[0];
          const point = sampleSeabedData.find(p => p.id === feature.properties?.id);
          if (point) {
            setSelectedPoint(point);
          }
        }
      });

      // Change cursor on hover
      map.current.on('mouseenter', 'seabed-data-circles', () => {
        if (map.current) {
          map.current.getCanvas().style.cursor = 'pointer';
        }
      });

      map.current.on('mouseleave', 'seabed-data-circles', () => {
        if (map.current) {
          map.current.getCanvas().style.cursor = '';
        }
      });
    });

    return () => {
      map.current?.remove();
    };
  }, []);

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'public': return 'bg-sky-500';
      case 'premium': return 'bg-violet-500';
      case 'developer': return 'bg-cyan-500';
      default: return 'bg-gray-500';
    }
  };

  const formatDepth = (depth: number) => {
    return `${Math.abs(depth).toLocaleString()}m below surface`;
  };

  return (
    <div className="relative w-full h-screen">
      <div ref={mapContainer} className="absolute inset-0" />
      
      {/* Data Point Details Panel */}
      {selectedPoint && (
        <Card className="absolute top-4 left-4 w-80 z-10">
          <CardHeader>
            <div className="flex justify-between items-start">
              <CardTitle className="text-lg">{selectedPoint.name}</CardTitle>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setSelectedPoint(null)}
              >
                ×
              </Button>
            </div>
            <div className="flex gap-2 flex-wrap">
              <Badge className={`${getTierColor(selectedPoint.tier)} text-white`}>
                {selectedPoint.tier.toUpperCase()}
              </Badge>
              <Badge variant="outline">
                {selectedPoint.type.replace('_', ' ').toUpperCase()}
              </Badge>
              <Badge variant="secondary">
                {formatDepth(selectedPoint.depth)}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              {selectedPoint.description}
            </p>
            <Button className="w-full">
              {selectedPoint.tier === 'public' ? 'View Data' : 
               selectedPoint.tier === 'premium' ? 'Upgrade to Access' : 
               'Developer API Access'}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Legend */}
      <Card className="absolute bottom-4 right-4 z-10">
        <CardHeader>
          <CardTitle className="text-sm">Ocean Data Access</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-sky-500"></div>
            <span className="text-sm">Public - Open Ocean</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-violet-500"></div>
            <span className="text-sm">Premium - Deep Sea</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-cyan-500"></div>
            <span className="text-sm">Developer - Research</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SeabedMap;