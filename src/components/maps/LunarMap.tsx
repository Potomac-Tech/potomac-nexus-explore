import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

// Set Mapbox access token
mapboxgl.accessToken = 'pk.eyJ1IjoiamFjb2ItbWF0dGhld3MiLCJhIjoiY21kZ3FkbjJwMHB4bjJsbzhxN2N6cGpiNCJ9.5TBF1McUmSJcFRAs62qAVw';

interface DataPoint {
  id: string;
  name: string;
  coordinates: [number, number];
  type: 'mass_spectrometry' | 'video_mapping' | 'sample_analysis';
  tier: 'public' | 'premium' | 'developer';
  description: string;
}

const sampleLunarData: DataPoint[] = [
  {
    id: '1',
    name: 'Apollo 11 Landing Site',
    coordinates: [23.473, 0.674],
    type: 'mass_spectrometry',
    tier: 'public',
    description: 'Historical landing site with public regolith analysis data'
  },
  {
    id: '2',
    name: 'Mare Imbrium Basin',
    coordinates: [-15.0, 32.8],
    type: 'video_mapping',
    tier: 'premium',
    description: 'High-resolution video mapping of lunar maria formation'
  },
  {
    id: '3',
    name: 'South Pole-Aitken Basin',
    coordinates: [-180.0, -56.0],
    type: 'sample_analysis',
    tier: 'developer',
    description: 'Advanced compositional analysis for research partners'
  },
  {
    id: '4',
    name: 'Apollo 15 Heat Flow Experiment',
    coordinates: [3.66, 26.08],
    type: 'sample_analysis',
    tier: 'public',
    description: 'Thermal conductivity and temperature data from Apollo 15 ALSEP Heat Flow Experiment'
  }
];

const LunarMap: React.FC = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [selectedPoint, setSelectedPoint] = useState<DataPoint | null>(null);

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    // Initialize map with NASA Moon tiles
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: {
        version: 8,
        sources: {
          'moon-tiles': {
            type: 'raster',
            tiles: [
              'https://trek.nasa.gov/tiles/Moon/EQ/LRO_WAC_Mosaic_Global_303ppd/1.0.0/default/default028mm/{z}/{y}/{x}.jpg'
            ],
            tileSize: 256,
            minzoom: 0,
            maxzoom: 8
          }
        },
        layers: [
          {
            id: 'moon-background',
            type: 'background',
            paint: {
              'background-color': '#000000'
            }
          },
          {
            id: 'moon-surface',
            type: 'raster',
            source: 'moon-tiles',
            paint: {
              'raster-opacity': 1
            }
          }
        ]
      },
      projection: 'globe',
      zoom: 2,
      center: [0, 0],
      pitch: 0,
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Add data points
    map.current.on('load', () => {
      if (!map.current) return;

      // Add data source
      map.current.addSource('lunar-data', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: sampleLunarData.map(point => ({
            type: 'Feature',
            properties: {
              id: point.id,
              name: point.name,
              type: point.type,
              tier: point.tier,
              description: point.description
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
        id: 'lunar-data-circles',
        type: 'circle',
        source: 'lunar-data',
        paint: {
          'circle-radius': [
            'case',
            ['==', ['get', 'tier'], 'public'], 8,
            ['==', ['get', 'tier'], 'premium'], 10,
            12 // developer
          ],
          'circle-color': [
            'case',
            ['==', ['get', 'tier'], 'public'], '#22c55e',
            ['==', ['get', 'tier'], 'premium'], '#f59e0b',
            '#ef4444' // developer
          ],
          'circle-stroke-width': 2,
          'circle-stroke-color': '#ffffff'
        }
      });

      // Add click handler
      map.current.on('click', 'lunar-data-circles', (e) => {
        if (e.features && e.features[0]) {
          const feature = e.features[0];
          const point = sampleLunarData.find(p => p.id === feature.properties?.id);
          if (point) {
            setSelectedPoint(point);
          }
        }
      });

      // Change cursor on hover
      map.current.on('mouseenter', 'lunar-data-circles', () => {
        if (map.current) {
          map.current.getCanvas().style.cursor = 'pointer';
        }
      });

      map.current.on('mouseleave', 'lunar-data-circles', () => {
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
      case 'public': return 'bg-green-500';
      case 'premium': return 'bg-amber-500';
      case 'developer': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
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
            <div className="flex gap-2">
              <Badge className={`${getTierColor(selectedPoint.tier)} text-white`}>
                {selectedPoint.tier.toUpperCase()}
              </Badge>
              <Badge variant="outline">
                {selectedPoint.type.replace('_', ' ').toUpperCase()}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              {selectedPoint.description}
            </p>
            <Button 
              className="w-full"
              onClick={() => {
                if (selectedPoint.id === '1') {
                  window.open('https://spdf.gsfc.nasa.gov/pub/data/apollo/apollo11_cdaweb/hk_dtrem/1969/', '_blank');
                } else if (selectedPoint.id === '4') {
                  window.open('https://spdf.gsfc.nasa.gov/pub/data/apollo/apollo15_alsep/heat_flow_experiment_hfe/data/PSPG-00752_1284752997_APOLLO15_HDF_1/', '_blank');
                }
              }}
            >
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
          <CardTitle className="text-sm">Data Access Tiers</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-green-500"></div>
            <span className="text-sm">Public - Free Access</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-amber-500"></div>
            <span className="text-sm">Premium - Paid Access</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-red-500"></div>
            <span className="text-sm">Developer - API Access</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LunarMap;